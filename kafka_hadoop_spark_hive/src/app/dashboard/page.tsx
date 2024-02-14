import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PresentationChartBarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface pageProps {}

export default function page() {
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
          <span className="text-3xl font-bold ">Good evening !</span>
          <span className="text-sm font-light text-gray-700">
            Here&apos;s an Overview of your uploads
          </span>
        </div>
      </div>
      {/* body  */}
      <span className="pt-8 pl-4 w-full font-medium "> My Videos </span>
      <div className="flex justify-between gap-4 w-full p-4">
        {["this week", "this month", "all time"].map((e, i) => {
          return (
            <div
              key={e}
              className="flex-1 p-6 shadow-md rounded-md flex flex-col gap-3 "
            >
              <span className="capitalize font-medium">{e}</span>
              <div className="flex gap-3">
                <div className="p-3 bg-green-100 rounded-md">
                  <PresentationChartBarIcon className="w-6 text-green-500" />
                </div>
                <div className="flex-col flex capitalize">
                  <span className="text-xl font-medium ">
                    {(i + 1) * Math.round(Math.random() * 23)}
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
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5].map((e) => {
              return (
                <div
                  key={e}
                  className="flex-1 relative rounded-lg overflow-clip hover:scale-[.975] hover:border hover:border-white transition-all duration-200"
                >
                  <Image
                    src={
                      "https://images.pexels.com/photos/5212648/pexels-photo-5212648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    }
                    alt="video_tumbnail"
                    width={200}
                    height={100}
                    className="w-full "
                  />
                  <div className="absolute p-2 inset-0 flex flex-col justify-between bg-gradient-to-t from-stone-900 via-stone-900/60 to-stone-900/0">
                    <div className="flex justify-end">
                      <InformationCircleIcon className="w-8 text-stone-900 cursor-pointer" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        Class : 3/3
                      </span>
                      <div className="flex justify-between">
                        <span className="text-stone-400 font-medium">
                          {new Date(
                            new Date().getTime() -
                              Math.random() * 2 * 24 * 60 * 60 * 1000
                          )
                            .toDateString()
                            .slice(0, 10)}
                        </span>
                        <span className="text-stone-300 font-medium">3:40</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
