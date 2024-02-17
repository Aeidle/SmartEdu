"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface pageProps {}

const data = {
  options: {
    chart: {
      id: "basic-bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 15, // Set the border radius for rounded corners
      },
      dataLabels: {
        enabled: true, // Show data labels on bars
        position: "top", // Display data labels on top of bars
      },
    },
    grid: {
      show: false, // Hide gridlines
    },
    xaxis: {
      categories: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false, // Hide x-axis border
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};

export default function Page() {
  const [videos, setVideos] = useState([]);
  const [emotionCounts, setEmotionCounts] = useState<{
    [emotion: string]: number[];
  }>({});

  useEffect(() => {
    axios.get("/api/videoData").then((response) => {
      setVideos(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    const getEmotionsList = (): { [emotion: string]: number[] } => {
      const emotionsList: { [emotion: string]: number[] } = {};

      videos
        ?.filter((v) => v.processingInfo)
        .forEach((video) => {
          video?.processingInfo?.emotions.forEach((emotion) => {
            if (!emotionsList[emotion.name]) {
              emotionsList[emotion.name] = [];
            }
            emotionsList[emotion.name].push(emotion.count);
          });
        });

      return emotionsList;
    };
    setEmotionCounts(getEmotionsList);
  }, [videos]);

  return (
    <div className="flex justify-center items-center pt-16 flex-col">
      {/* band upper */}
      <div className="flex justify-start items-center w-full p-6 gap-3 bg-slate-100">
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
      <div className="grid grid-cols-1">
        <span className="py-8 pl-4 w-full text-xl font-semibold">Emotions</span>
        <div
          className={`
          relative p-4 w-full 
          flex justify-start items-center h-full
          gap-3
          overflow-x-scroll
          overflow-y-clip
          `}
          // gap-3 grid grid-cols-3
        >
          <div className="absolute top-0 -left-4 aspect-square w-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 aspect-square w-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 aspect-square w-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          {/* comp */}
          {Object.entries(emotionCounts).map((Emotion) => {
            return (
              <div
                key={Emotion[0]}
                className="bg-stone-100 rounded-md p-2 flex flex-col gap-2"
              >
                <div className="flex justify-between">
                  <span className="text-stone-900  capitalize">
                    Total {Emotion[0]} Emotion Detected
                    {/* {JSON.stringify(emotionCounts)} */}
                  </span>
                  <InformationCircleIcon className="w-6 text-stone-900 cursor-pointer" />
                </div>
                <span className="text-stone-900 font-medium text-2xl">
                  {Emotion[1].reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )}
                </span>
                <Chart
                  options={data.options}
                  series={[
                    {
                      name: Emotion[0],
                      data: Emotion[1],
                    },
                  ]}
                  type="bar"
                  height={200}
                  width={400}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
