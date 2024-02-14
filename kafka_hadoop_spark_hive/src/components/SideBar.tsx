"use client";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowUpOnSquareIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  ChartBarIcon,
  ChartPieIcon,
  HomeIcon,
  PresentationChartBarIcon,
  ServerIcon,
  ServerStackIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sideLinks = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <HomeIcon className="w-6" />,
  },
  {
    name: "Upload",
    link: "/dashboard/upload",
    icon: <ArrowUpOnSquareIcon className="w-6" />,
  },
  {
    name: "Analytics",
    link: "/dashboard/analytics",
    icon: <ChartBarIcon className="w-6" />,
  },
  {
    name: "Statistics",
    link: "/dashboard/statistics",
    icon: <ChartPieIcon className="w-6" />,
  },
];

export default function SideBar() {
  const pathname = usePathname();
  const session = useSession();
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      <aside className={`relative flex h-full shadow-lg transition-all `}>
        <div
          className="absolute z-50 top-2 right-0 translate-x-[150%]  cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Bars3Icon className="w-10 " />
        </div>
        {/* left part */}
        <motion.div
          className={`z-40 flex flex-1 flex-col ${
            open ? "pl-4 pr-12" : "p-4"
          } items-center  h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700`}
        >
          {session.data?.user && (
            <Link
              href="/"
              className="flex justify-center items-center gap-3 text-gray-700"
            >
              <Image
                className="w-auto h-12 aspect-square rounded-full"
                src={session.data?.user?.image ?? ""}
                width={100}
                height={100}
                alt=""
              />
              <div className="flex flex-col justify-center items-start">
                <span className="font-semibold text-xl">
                  {session.data?.user?.name}
                </span>
                <span className="font-light text-sm opacity-75">
                  {session.data?.user?.email}
                </span>
              </div>
            </Link>
          )}

          <motion.div className="w-full flex flex-1 flex-col justify-start space-y-4">
            {open && (
              <span className="font-light text-gray-500 text-left w-full text-sm">
                Overview
              </span>
            )}
            {sideLinks.map((l) => (
              <Link
                key={l.name + "sidelink-item"}
                href={l.link}
                className={`flex w-full ${
                  open ? "justify-start" : "justify-center"
                } items-center gap-3 p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 ${
                  pathname.includes(l.link) && "text-blue-500"
                }`}
              >
                {l.icon}
                {open && <span>{l.name}</span>}
              </Link>
            ))}
          </motion.div>

          <motion.button
            className={`border rounded-full flex  justify-center items-center gap-3 text-red-500   transition-all ${
              open
                ? "px-8 h-12 border-red-300 hover:scale-95 hover:bg-red-500 hover:border-red-300 hover:text-white "
                : "border-none "
            }`}
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            <ArrowLeftStartOnRectangleIcon className="w-6" />
            {open && "Sign Out"}
          </motion.button>
        </motion.div>
      </aside>
    </AnimatePresence>
  );
}
