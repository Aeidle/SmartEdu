"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  ArrowsPointingOutIcon,
  BeakerIcon,
  ChartPieIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import {
  Dispatch,
  SVGProps,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Placeholder from "@/assets/placeholder.jpeg";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { RedirectType, redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Modal from "./Modal";

const ImageMotion = motion(Image);

export default function VideoStats({ hash }: { hash: string }) {
  const router = useRouter();
  const [videoData, setVideoData] = useState({});
  const [emotions, setEmotions] = useState([]);
  const [imagesLinks, setImagesLinks] = useState({});
  const [selected, setSelected] = useState<[string, unknown]>(null);

  useEffect(() => {
    const getVideoData = async () => {
      const response = await axios
        .get(`/api/videoData?hash=${hash}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Video Hash is Found");
            if (response.data?.processingInfo) {
              toast.success("Video is Processed");
            } else {
              toast.success("Video is still under processing");
            }
            console.log(response.data);
            return response.data;
          }
          if (response.status === 400) {
            toast.success("No Video Found");
            return {};
          }
        })
        .catch((e) => {
          toast.error("Error in the server while getting video");
        });
      setVideoData(response);
      setEmotions(response?.processingInfo?.emotions ?? []);
      setImagesLinks(response?.processingInfo?.images ?? {});
    };
    hash && getVideoData();
  }, [hash, router]);

  useEffect(() => {
    const total = emotions.reduce((accumulator, object) => {
      return accumulator + object?.count;
    }, 0);
    console.log(total);
  }, [emotions]);

  const emotionChartOptions = {
    labels: emotions.map((emotion) => emotion.name),
    dataLabels: {
      enabled: false, // Disable data labels
    },
    legend: {
      show: true, // Hide legend
    },
    plotOptions: {
      pie: {
        customScale: 0.8, // Adjust size of the chart
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total", // Show 'Total' label
            },
          },
        },
      },
    },
  };

  const chartOptions = {
    emotions: {
      name: "Emotions",
      options: emotionChartOptions,
      type: "donut" as const,
      series: emotions.map((emotion) => emotion.count),
    },
  };
  const fetchVideoUrl = async () => {
    await axios
      .get(`/api/videoData?hash=${hash}`)
      .then((response) => response.data);
  };
  if (Object.entries(emotions).length == 0)
    return (
      <div className="flex justify-center items-center pt-16 px-6  flex-1 h-full">
        <Card className="w-full max-w-sm animate-pulse">
          <CardHeader className="flex flex-col items-center space-y-1 ">
            <BeakerIcon className="h-24 aspect-square rotate-12 animate-bounce" />
            <CardTitle className="text-sm">Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm">Video is being processed</p>
          </CardContent>
        </Card>
      </div>
    );
  return (
    <AnimatePresence>
      <div className="flex flex-col w-full space-y-4 h-full">
        <Card>
          <CardHeader>
            <CardTitle onClick={fetchVideoUrl}>Processed Video</CardTitle>
            <CardDescription>
              The result obtained and objects detected after processing the
              video
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex justify-center items-center">
            <video className="w-4/5 rounded-lg" loop controls autoPlay={true}>
              <source
                src={`/api/video-stream?hash=${hash}&edit=1`}
                type="video/mp4"
              />
            </video>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Processed Frames</CardTitle>
              <CardDescription>
                Thumbnails of processed frames from the video.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-0.5 p-0.5">
                {Object.entries(imagesLinks).map((e) => {
                  return (
                    <FilterShower
                      key={e[0]}
                      image={e}
                      setSelected={setSelected}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Video Stats</CardTitle>
              <CardDescription>
                Statistics about the video content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-1 text-sm ">
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Total Frames</dt>
                  <dd className="ml-auto">{videoData?.metadata?.duration}</dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Resolution</dt>
                  <dd className="ml-auto">
                    {`${videoData?.metadata?.dimentions?.width}x${videoData?.metadata?.dimentions?.height}`}
                  </dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Frame Rate</dt>
                  <dd className="ml-auto">30 fps</dd>
                </div>
                <div className="flex items-center py-1">
                  <dt className="min-w-[100px]">Codec</dt>
                  <dd className="ml-auto">{videoData?.metadata?.codec}</dd>
                </div>
              </dl>
              <div className="flex flex-col  min-h-lg w-full my-4">
                {Object.entries(chartOptions).map((e) => {
                  return (
                    <div key={e[0]} className="flex flex-col my-4">
                      <span className="font-medium text-gra text-xl">
                        {e[1].name}
                      </span>
                      <ReactApexChart
                        options={e[1].options}
                        series={e[1].series}
                        type={e[1].type}
                      />
                    </div>
                  );
                })}
                <div className="flex flex-col my-4">
                  <span className="font-medium  text-xl">Dominating Mood</span>
                  <span className="font-semibold text-center  text-3xl my-16 capitalize">
                    {
                      emotions.sort((p1, p2) =>
                        p1.count < p2.count ? 1 : p1.count > p2.count ? -1 : 0
                      )[0]?.name
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal selected={selected} setSelected={setSelected} />
    </AnimatePresence>
  );
}

function FilterShower({
  image,
  setSelected,
}: {
  image: [string, unknown];
  setSelected: Dispatch<SetStateAction<[string, unknown]>>;
}) {
  return (
    <motion.div
      layoutId={`filter-${image[0]}`}
      onClick={() => {
        setSelected(image);
      }}
      // onClick={() => {
      //   if (isImageExpanded) {
      //     const backdropToRemove = document.getElementById("backdrop");
      //     if (!!backdropToRemove) {
      //       backdropToRemove.parentNode?.removeChild(backdropToRemove);
      //     }
      //   } else {
      //     const backdrop = document.createElement("div");
      //     // Set backdrop styles
      //     backdrop.style.position = "fixed";
      //     backdrop.style.top = "0";
      //     backdrop.style.left = "0";
      //     backdrop.style.width = "100%";
      //     backdrop.style.height = "100%";
      //     backdrop.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // Semi-transparent white for glassy effect
      //     backdrop.style.zIndex = "50";
      //     backdrop.style.backdropFilter = "blur(5px)"; // Add glassy effect
      //     // Set backdrop ID
      //     backdrop.id = "backdrop";
      //     // Append the backdrop to the body
      //     document.body.appendChild(backdrop);
      //   }
      //   setIsImageExpanded(!isImageExpanded);
      // }}
      className={`relative group  cursor-pointer overflow-clip rounded-md`}
    >
      <Image
        alt="Frame 1"
        className="object-cover w-full h-full "
        height="150"
        src={
          "data:image/jpeg;base64," + String(image[1]).substring(2).slice(0, -1)
        }
        style={{
          objectFit: "cover",
        }}
        width="150"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-brightness-90 group-hover:opacity-100 transition-opacity">
        <ArrowsPointingOutIcon className="w-10 h-10 text-white" />
      </div>
    </motion.div>
  );
}
