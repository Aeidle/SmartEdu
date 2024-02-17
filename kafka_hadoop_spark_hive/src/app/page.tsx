"use client";
import React, { useEffect, useState } from "react";
import logo from "@/assets/logoFpt.png";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "";

  const session = useSession();

  useEffect(() => {
    callbackUrl && setLoginOpen(true);
  }, [callbackUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
      {/* background */}
      <div
        className={`relative flex-1 rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800  shadow-inner overflow-clip`}
      >
        {/* hider top right */}
        {/* top right */}
        {/* background */}
        <div className="gradient-bg">
          <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
            <div className="interactive"></div>
          </div>
        </div>
        {/* header */}
        <header className="relative  ">
          <div className="h-16  flex items-center px-10 gap-4">
            <Image
              src={logo}
              alt="websitelogo"
              className="w-10 border-2 border-white rounded-full"
            />
            <span className="text-white text-2xl font-semibold uppercase">
              Smart Edu
            </span>
          </div>
          <div
            className={`absolute flex justify-end items-center px-10 rounded-bl-3xl  top-0 right-0 w-1/2 h-16 bg-gray-100 
          after:absolute after:top-0 after:-left-12 after:h-12 after:bg-transparent after:aspect-square after:rounded-3xl after:shadow-[1.5rem_-1.5rem_rgb(243_244_246)]
          before:absolute before:top-full before:-right-0 before:h-12 before:bg-transparent before:aspect-square before:rounded-3xl before:shadow-[1.5rem_-1.5rem_rgb(243_244_246)]
          shadow-[-0.5rem_0.5rem_2rem_1px_rgb(0_0_0_/0.56)]
          `}
          >
            {/* <ul className="flex w-3/5 h-full justify-evenly items-center">
              <Link href="/">
                <li className="border rounded-full px-8 py-2 text-violet-900 border-violet-500 hover:scale-95 hover:bg-violet-500 hover:text-white transition-all cursor-pointer">
                  Home
                </li>
              </Link>
              <Link href="/about">
                <li className="border rounded-full px-8 py-2 text-violet-900 border-violet-500 hover:scale-95 hover:bg-violet-500 hover:text-white transition-all cursor-pointer">
                  About us
                </li>
              </Link>
              <Link href="/contact">
                <li className="border rounded-full px-8 py-2 text-violet-900 border-violet-500 hover:scale-95 hover:bg-violet-500 hover:text-white transition-all cursor-pointer">
                  Contact
                </li>
              </Link>
            </ul> */}
            {session ? (
              <Link href="/dashboard">
                <span className="border rounded-full px-8 py-3 h-12  border-white text-white bg-violet-500 hover:scale-95 hover:bg-white hover:border-violet-500 hover:text-violet-500  transition-all ">
                  Get Started
                </span>
              </Link>
            ) : (
              <button
                className="border rounded-full px-8 h-12  border-white text-white bg-violet-500 hover:scale-95 hover:bg-white hover:border-violet-500 hover:text-violet-500  transition-all "
                onClick={() => {
                  setLoginOpen(true);
                }}
              >
                Get Started
              </button>
            )}
          </div>
        </header>
        <AnimatePresence>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto">
            <motion.div
              initial={{ y: "50%" }}
              animate={{ y: 0 }}
              className="flex flex-col gap-8"
            >
              <motion.span
                initial={{ y: "100%", opacity: 0, rotate: 25 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.5 }} // Add a delay of 0.5 seconds
                className="text-sm text-white font-semibold capitalize flex md:text-8xl"
              >
                Analyse
                {/* spacer */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "10rem" }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-center items-center"
                  >
                    <ArrowRightIcon className="w-44 h-24 opacity-70" />
                  </motion.div>
                </motion.div>
                your
              </motion.span>
              <motion.span
                initial={{ y: "100%", opacity: 0, rotate: -40 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 1 }}
                className="flex text-8xl text-white font-semibold capitalize ml-auto "
              >
                Courses
                {/* spacer */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 100, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                />
                with
              </motion.span>
              <motion.span
                initial={{ y: "100%", opacity: 0, rotate: 30 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.25 }}
                className="text-8xl text-white font-semibold capitalize flex"
              >
                Artificial
                {/* spacer */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 75, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                />
                Intelligence
              </motion.span>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* bottom left */}
        <footer
          className={`absolute flex justify-center p-4 rounded-tr-3xl  bottom-0 left-0 w-1/2 h-16 bg-gray-100 
          after:absolute after:bottom-full after:-left-0 after:h-12 after:bg-transparent after:aspect-square after:rounded-3xl after:shadow-[-1.5rem_1.5rem_rgb(243_244_246)]
          before:absolute before:bottom-0 before:-right-12 before:h-12 before:bg-transparent before:aspect-square before:rounded-3xl before:shadow-[-1.5rem_1.5rem_rgb(243_244_246)]
          shadow-[0.5rem_-0.5rem_2rem_1px_rgb(0_0_0_/0.56)]

          `}
        >
          <span className="text-gray-500 text-lg font-medium ">
            Made By M1 Big Data & AI Students | FP-Taroudant
          </span>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
