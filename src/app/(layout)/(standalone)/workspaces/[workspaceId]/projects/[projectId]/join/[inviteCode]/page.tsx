import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ProjectIdJoinClient } from "./client";

const ProjectIdJoinPage = async () => {
  const current = await getCurrent();
  if (!current) redirect("/sign-in");
  return <ProjectIdJoinClient />;
};

export default ProjectIdJoinPage;
