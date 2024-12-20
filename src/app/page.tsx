import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import Hero from "@/components/Hero";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
  const current = await getCurrent();

  if (!current) {
    return <Hero />;
  }

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
