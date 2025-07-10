import { getCurrent } from "@/features/auth/queries";
import { ProjectMembersList } from "@/features/members/components/project-members-list";
import { redirect } from "next/navigation";

const MembersPage = async () => {
  const current = await getCurrent();
  if (!current) redirect("/sign-in");
  return (
    <div className="mx-auto w-full lg:max-w-xl">
      <ProjectMembersList />
    </div>
  );
};

export default MembersPage;
