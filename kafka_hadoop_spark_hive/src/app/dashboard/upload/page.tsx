"use client";
import Dropzone, { DropZoneRef } from "@/components/DropZone";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";

interface pageProps {}

export default function Page() {
  const dropZoneRef = useRef<DropZoneRef>(null);

  const handleUpload = async () => {
    const files = dropZoneRef.current?.getFiles() ?? [];

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`video`, file);
      });

      const response = await fetch("/api/uploadVideo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Videos uploaded successfully!");
        toast.success("Videos uploaded successfully!");
        // dropZoneRef.current?.deleteFiles();
      } else {
        console.error("Failed to upload videos.");
        toast.error("Failed to upload videos.");
      }
    } catch (error) {
      console.error("Error uploading videos:", error);
    }
  };

  return (
    <div className="flex justify-center items-center pt-2 flex-col  h-full">
      {/* band upper */}
      <div className="flex justify-start items-center w-full p-6 gap-3 bg-slate-100 mt-12">
        <div className="rounded-full bg-violet-500 overflow-clip flex justify-start items-center">
          <Image
            src={`https://robohash.org/${Math.random() * 103820}`}
            width={100}
            height={100}
            alt="avatar"
          />
        </div>
        <div className="flex flex-col justify-evenly h-[100px]  ">
          <span className="text-3xl font-bold ">Good evening !</span>
          <span className="text-sm font-light text-gray-700">
            Here&apos;s an Overview of your uploads
          </span>
        </div>
      </div>
      {/* body  */}
      <span className="pt-8 pl-4 w-full font-medium "> Upload </span>
      <div className="h-full flex justify-center items-start flex-1 w-full">
        <div className="relative w-full max-w-[70vw] flex justify-center items-center ">
          <div className="absolute top-0 -left-4 aspect-square w-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 aspect-square w-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 aspect-square w-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="m-8 relative space-y-4 w-full flex justify-center">
            <div className="p-4 bg-white/80 rounded-lg flex flex-col w-full items-center justify-center">
              <Dropzone
                ref={dropZoneRef}
                action={handleUpload}
                className="w-full mx-auto rounded-xl p-4 py-8 text-stone-800 bg-gradient-to-br  border border-dashed flex flex-col cursor-pointer hover:scale-[.99] transition-all bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
