import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import Hero from "@/components/Hero";
import { getWorkspaces } from "@/features/workspaces/queries";
import { Navbar } from "@/components/mainNavbar";

export default async function Home() {
  const current = await getCurrent();

  if (!current) {
    return (
      <div className="container mx-auto w-full">
        <Navbar />
        <Hero />
      </div>
    );
  }

  const workspaces = await getWorkspaces();
  if (workspaces?.total === 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${workspaces?.documents[0]?.$id}`);
  }
}
