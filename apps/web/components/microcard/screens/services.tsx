import Image from "next/image";

import { Badge } from "@calcom/ui";
import { CalendarPlus, Clock } from "@calcom/ui/components/icon";

import { default as Header } from "../header";

export const ServicesPage = () => {
  return (
    <div className="flex w-full flex-col bg-white">
      <Header title="Events" description="hugo.myGPT.fi" />
      <div className="h-[75vh] px-5 py-5">
        <p className="pb-4 text-center text-lg font-bold">Book Meeting</p>
        <div className="bg-pink/10 rounded-md">
          {[1, 2, 3].map((_, key) => (
            <div key={key}>
              <div className="flex justify-between p-4">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold ">Videoconference</p>
                  <p className="text-xs text-gray-500">lun.29 aug, 9:00 AM - 5:00 PM</p>
                  <p className="text-[10px] text-gray-500">Link: hugo.myGPT.fi/hugo/videoconference</p>
                  <Badge className="w-fit" variant="gray" startIcon={Clock}>
                    15m
                  </Badge>
                  <span className="bg-pink w-fit rounded px-3 py-1 text-white">
                    <CalendarPlus className="h-4" />
                  </span>
                </div>
                <Image alt="image" src="https://picsum.photos/536/354" width={90} height={110} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <button className="bg-pink/50 mx-auto mt-4 rounded px-2 py-1 text-center text-lg text-white">
            All events
          </button>
        </div>
      </div>
    </div>
  );
};
