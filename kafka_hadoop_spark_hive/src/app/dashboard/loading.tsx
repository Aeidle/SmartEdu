import React from "react";

export default function Loading() {
  return (
    <div className="flex h-full flex-1 justify-center items-center px-24 py-16">
      <div className="w-full aspect-video flex flex-col justify-center items-center rounded-3xl shadow-inner bg-gradient-to-br from-violet-600 to-violet-700 animate-pulse gap-[10%]">
        <div className="w-1/5 animate-spin bg-violet-300 aspect-square rounded-xl " />
        <span className="text-xl uppercase text-white font-thin ">
          Loading . . .
        </span>
      </div>
    </div>
  );
}
