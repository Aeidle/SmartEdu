"use client";

import VideoStats from "@/components/video-stats";
import { useParams, useSearchParams } from "next/navigation";

interface pageProps {}

export default function Page() {
  const { id: hash } = useParams();

  return (
    <div className="flex justify-center items-center pt-16 px-6">
      {/* <video width="750" height="500" controls>
        <source src="./Videos/video1.mp4" type="video/mp4" />
      </video> */}
      <VideoStats hash={hash as string} />
    </div>
  );
}
