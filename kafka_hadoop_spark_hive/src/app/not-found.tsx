"use client";
import Image from "next/image";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function NotFound() {
  const [, startTransition] = useTransition();

  useEffect(() => {
    // setTimeout(
    //   () => startTransition(() => redirect(`/`, RedirectType.push)),
    //   2500
    // );
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src="https://i.gifer.com/yH.gif"
        alt="lostpng"
        className="w-96"
        width={100}
        height={100}
      />
      <span className="text-xl font-semibold my-4 capitalize">
        well the page is just not found 😔
      </span>
      <Link href="/"> GO BACK HOME </Link>
    </main>
  );
}
