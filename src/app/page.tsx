import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import Landing from "@/components/Landing/Landing";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
  const current = await getCurrent();

  if (!current) {
    return <Landing />;
  }

  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
