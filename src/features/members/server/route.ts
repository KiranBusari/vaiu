import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { getMember, getProjectMember } from "../utilts";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1, "Workspace ID is required"),
      }),
    ),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const databases = c.get("databases");
        const user = c.get("user");
        const { workspaceId } = c.req.valid("query");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }
        const members = await databases.listDocuments<Member>(
          DATABASE_ID,
          MEMBERS_ID,
          [Query.equal("workspaceId", workspaceId)],
        );
        const populatedMembers = await Promise.all(
          members.documents.map(async (member) => {
            const user = await users.get(member.userId);

            return {
              ...member,
              name: user.name || user.email,
              email: user.email,
            };
          }),
        );
        return c.json({
          data: {
            ...members,
            documents: populatedMembers,
          },
        });
      } catch (error) {
        console.error("Error fetching members:", error);
        return c.json({ error: "Failed to fetch members" }, 500);
      }
    },
  )
  .get(
    "/projectMembers",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1, "Workspace ID is required"),
        projectId: z.string(),
      }),
    ),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const databases = c.get("databases");
        const user = c.get("user");
        const { workspaceId, projectId } = c.req.valid("query");

        const member = await getProjectMember({
          databases,
          workspaceId,
          projectId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const members = await databases.listDocuments<Member>(
          DATABASE_ID,
          MEMBERS_ID,
          [
            Query.equal("workspaceId", workspaceId),
            Query.equal("projectId", projectId),
          ],
        );
        const populatedMembers = await Promise.all(
          members.documents.map(async (member) => {
            const user = await users.get(member.userId);

            return {
              ...member,
              name: user.name || user.email,
              email: user.email,
            };
          }),
        );
        return c.json({
          data: {
            ...members,
            documents: populatedMembers,
          },
        });
      } catch (error) {
        console.error("Error fetching members:", error);
        return c.json({ error: "Failed to fetch members" }, 500);
      }
    },
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    try {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToDelete = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
      );

      const requestingMember = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id,
      });

      if (!requestingMember) {
        return c.json({ error: "Unauthorized access to workspace" }, 401);
      }

      // Only allow deletion if:
      // 1. User is deleting themselves, OR
      // 2. User is an admin
      const canDelete =
        requestingMember.$id === memberToDelete.$id ||
        requestingMember.role === MemberRole.ADMIN;

      if (!canDelete) {
        return c.json(
          { error: "Insufficient permissions to delete member" },
          403,
        );
      }

      const queryFilters = [
        Query.equal("workspaceId", memberToDelete.workspaceId),
      ];
      if (memberToDelete.projectId) {
        queryFilters.push(Query.equal("projectId", memberToDelete.projectId));
      }

      const allMembersInScope = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        queryFilters,
      );

      if (allMembersInScope.total === 1) {
        const scopeType = memberToDelete.projectId ? "project" : "workspace";
        return c.json(
          { error: `Cannot delete the only member of the ${scopeType}` },
          400,
        );
      }

      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

      return c.json({
        data: {
          $id: memberToDelete.$id,
          message: "Member deleted successfully",
        },
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      return c.json({ error: "Failed to delete member" }, 500);
    }
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole, {
          errorMap: () => ({
            message: "Invalid role. Must be ADMIN or MEMBER",
          }),
        }),
      }),
    ),
    async (c) => {
      try {
        const { memberId } = c.req.param();
        const { role } = c.req.valid("json");
        const user = c.get("user");
        const databases = c.get("databases");

        const memberToUpdate = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          memberId,
        );

        // Check if the requesting user has admin permissions
        const requestingMember = await getMember({
          databases,
          workspaceId: memberToUpdate.workspaceId,
          userId: user.$id,
        });

        if (!requestingMember) {
          return c.json({ error: "Unauthorized access to workspace" }, 401);
        }

        if (requestingMember.role !== MemberRole.ADMIN) {
          return c.json({ error: "Only admins can update member roles" }, 403);
        }

        // Prevent demoting the only admin
        if (
          memberToUpdate.role === MemberRole.ADMIN &&
          role === MemberRole.MEMBER
        ) {
          const queryFilters = [
            Query.equal("workspaceId", memberToUpdate.workspaceId),
            Query.equal("role", MemberRole.ADMIN),
          ];
          if (memberToUpdate.projectId) {
            queryFilters.push(
              Query.equal("projectId", memberToUpdate.projectId),
            );
          }

          const adminMembers = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            queryFilters,
          );

          if (adminMembers.total === 1) {
            const scopeType = memberToUpdate.projectId
              ? "project"
              : "workspace";
            return c.json(
              {
                error: `Cannot demote the only admin of the ${scopeType}`,
              },
              400,
            );
          }
        }

        // Update the member role
        const updatedMember = await databases.updateDocument(
          DATABASE_ID,
          MEMBERS_ID,
          memberId,
          { role },
        );

        return c.json({
          data: {
            ...updatedMember,
            message: "Member role updated successfully",
          },
        });
      } catch (error) {
        console.error("Error updating member:", error);
        return c.json({ error: "Failed to update member role" }, 500);
      }
    },
  );
export default app;
