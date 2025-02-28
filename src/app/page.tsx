import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { getWorkspaces } from "@/features/workspaces/queries";
import { Navbar } from "@/components/mainNavbar";
// import { CrossCircledIcon } from "@radix-ui/react-icons";
// import { CircleCheck } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { whatWeProvideData } from "@/data/what-we-provide-data";

export default async function Home() {
  const current = await getCurrent();

  if (!current) {
    return (
      <div className="container mx-auto w-full">
        <Navbar />
        <Hero />
        <Features/>
        {/* <section id='what-do-we-provide' className='h-[60vh] mt-12'>
          <div className=''>
            <h1 className='text-3xl font-bold tracking-wide text-center mb-12'>Powerful Features</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
              {whatWeProvideData.map((item, index) => (
                <Card key={index} className='border-2 hover:border-primary transition-colors duration-300'>
                  <CardContent className='pt-6 text-center flex flex-col items-center'>
                    <CardHeader className='text-xl font-bold mb-2'>{item.title}</CardHeader>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}
        {/* <section className="container h-[40vh]">
          <div className='grid grid-cols-2 mx-auto gap-4'>
            <div className='bg-destructive/15 rounded-lg py-8 px-10 mx-4 space-y-4'>
              <h1 className='text-xl flex items-center gap-2 text-red-500'><CrossCircledIcon className=''/> Without Vaiu</h1>
              <ul className='space-y-2 text-base'>
                <li>Integrates the Git Internally</li>
                <li>Collaborate with each other easily</li>
                <li>3</li>
              </ul>
            </div>
            <div className='bg-green-300/15 rounded-lg py-8 px-10 mx-4 space-y-4'>
              <h1 className='text-xl flex items-center gap-2'><CircleCheck className=''/> With Vaiu</h1>
              <ul className='space-y-4 text-base'>
                <li>Can&apos;t Collaborate with each other</li>
                <li>2</li>
                <li>3</li>
              </ul>
            </div>
          </div>
        </section> */}
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
