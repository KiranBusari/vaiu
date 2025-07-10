import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}
export const getMember = async ({
  databases,
  userId,
  workspaceId,
}: GetMemberProps) => {
  try {
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ]);
    return members.documents[0];
  } catch (error: unknown) {
    console.error("Error fetching member:", error);
    return null;
  }
};

interface GetProjectMemberProps {
  databases: Databases;
  workspaceId: string;
  projectId: string;
  userId: string;
}

export const getProjectMember = async ({
  databases,
  userId,
  workspaceId,
  projectId,
}: GetProjectMemberProps) => {
  try {
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("projectId", projectId),
      Query.equal("userId", userId),
    ]);
    return members.documents[0];
  } catch (error: unknown) {
    console.error("Error fetching project member:", error);
    return null;
  }
};
