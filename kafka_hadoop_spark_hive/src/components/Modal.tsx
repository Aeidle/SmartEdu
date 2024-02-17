import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Modal({
  selected,
  setSelected,
}: {
  selected: [string, unknown];
  setSelected: Dispatch<SetStateAction<[string, unknown]>>;
}) {
  if (!selected) {
    return <>s</>;
  }

  return (
    <div
      onClick={() => setSelected(null)}
      className="fixed inset-0 bg-black/50 z-50 cursor-pointer overflow-y-scroll"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[75vw] mx-auto my-8 px-8 cursor-default rounded-lg overflow-clip "
      >
        <div className="absolute w-full p-2  bg-gradient-to-b from-stone-700  via-stone-700/75 to-stone-700/0 rounded-lg">
          <span className="font-semibold text-lg text-stone-50">
            {selected[0]}
          </span>
        </div>
        <motion.div layoutId={`filter-${selected[0]}`} className="">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              "data:image/jpeg;base64," +
              String(selected[1]).substring(2).slice(0, -1)
            }
            className="w-full rounded-lg"
            alt="filter image"
          />
        </motion.div>
      </div>
    </div>
  );
}
