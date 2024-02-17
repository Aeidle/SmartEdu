"use client";
import {
  InformationCircleIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/outline";
import { PresentationChartBarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { RedirectType, redirect, useRouter } from "next/navigation";

export default function Page() {
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  const getVideos = async () => {
    const reponse = await axios.get("/api/videoData").then((res) => res.data);
    setVideos(reponse);
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div className="flex justify-center items-center pt-2 flex-col ">
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
          <span className="text-3xl font-bold " onClick={getVideos}>
            Good evening !
          </span>
          <span className="text-sm font-light text-gray-700">
            Here&apos;s an Overview of your uploads
          </span>
        </div>
      </div>
      {/* body  */}
      <span className="pt-8 pl-4 w-full font-medium "> My Videos </span>
      <div className="flex justify-between gap-4 w-full p-4">
        {[
          { name: "this week", value: videos.length },
          { name: "this month", value: videos.length * 2 },
          { name: "all week", value: videos.length * 4 },
        ].map((e, i) => {
          return (
            <div
              key={e.name}
              className="flex-1 p-6 shadow-md rounded-md flex flex-col gap-3 "
            >
              <span className="capitalize font-medium">{e.name}</span>
              <div className="flex gap-3">
                <div className="p-3 bg-green-100 rounded-md">
                  <PresentationChartBarIcon className="w-6 text-green-500" />
                </div>
                <div className="flex-col flex capitalize">
                  <span className="text-xl font-medium ">
                    {/* {(i + 1) * Math.round(Math.random() * 23)} */}
                    {e.value}
                  </span>
                  <span className="text-sm font-light ">video uploaded</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mx-6 w-[calc(100%-1.5rem)] shadow-2xl p-4 ">
        <div className="w-full flex flex-col gap-3">
          <span className="capitalize font-medium">All Time</span>
          {/* videos */}
          <div
            className={
              videos.length
                ? "grid grid-cols-3 gap-2"
                : "flex justify-center items-center"
            }
          >
            {videos.length > 0 ? (
              videos.map((video) => {
                return (
                  <div
                    key={video.hash}
                    className="flex-1 relative rounded-lg overflow-clip hover:scale-[.975] hover:border hover:border-white transition-all duration-200"
                  >
                    <video
                      className="w-full rounded-lg"
                      loop
                      muted
                      autoPlay={true}
                    >
                      <source
                        src={`/api/video-stream?hash=${video.hash}`}
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute p-2 inset-0 flex flex-col justify-between bg-gradient-to-t from-stone-900 via-stone-900/60 to-stone-900/0">
                      <div className="flex justify-end">
                        <InformationCircleIcon
                          onClick={() => {
                            router.push(`/dashboard/analytics/${video.hash}`);
                          }}
                          className="w-8 text-stone-900 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          Class : 3/3
                        </span>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-medium">
                            {new Date(video.metadata.uploaded)
                              .toDateString()
                              .slice(0, 10)}
                          </span>
                          <span className="text-stone-300 font-medium">
                            {(video?.metadata?.duration / 50 / 100)
                              .toFixed(2)
                              .toString()
                              .split(".")
                              .join(":")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="bg-green-100 w-[30vw] aspect-video rounded-lg flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                  router.push(`/dashboard/upload`);
                }}
              >
                <VideoCameraSlashIcon className="w-16 text-green-500" />
                <span className="text-center text-green-600">
                  No Video has been uploaded yet
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
