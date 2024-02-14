"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
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

export default function page() {
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
      <span className="pt-8 pl-4 w-full "> Stats </span>
      <div className="relative p-4 w-full gap-3 grid grid-cols-3">
        <div className="absolute top-0 -left-4 aspect-square w-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 aspect-square w-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 aspect-square w-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        {/* comp */}
        {[1, 2, 4].map((e) => {
          return (
            <div
              key={e}
              className="bg-stone-100 rounded-md p-2 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <span className="text-stone-900 text-xl">
                  Total Hand Raised
                </span>
                <InformationCircleIcon className="w-6 text-stone-900 cursor-pointer" />
              </div>
              <span className="text-stone-900 font-medium text-2xl">230</span>
              <Chart
                options={data.options}
                series={data.series}
                type="bar"
                width="100%"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
