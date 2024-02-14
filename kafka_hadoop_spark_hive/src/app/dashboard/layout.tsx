import { Toaster } from "@/components/ui/sonner";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import {
  RedirectType,
  redirect,
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import SideBar from "@/components/SideBar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //@ts-ignore
  const session = await getServerSession(authOptions);
  //   if (!session) redirect(`/?callbackUrl=/dashboard`, RedirectType.push);

  return (
    <div className="flex ">
      <SideBar />
      <main className="flex flex-1 flex-col justify-start items-center  h-screen ">
        <main className="flex-1 w-full h-screen overflow-scroll scrollbar-hide">
          {children}
        </main>
        <Toaster richColors closeButton position="top-right" expand />
      </main>
    </div>
  );
}
