import Image from "next/image";
import React from "react";

import { Clock2, CalendarDays } from "@calcom/ui/components/icon";

import { default as Header } from "../header";

export const ServicesPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div className="flex w-full flex-col bg-white" ref={ref}>
      <Header title="Events" description="hugo.myGPT.fi" />
      <p className="m-4 text-center text-lg font-bold">Book Meeting</p>
      <div className="bg-pink/20 mx-4 rounded">
        {[1, 2, 3].map((_, key) => (
          <div key={key}>
            <div className="flex justify-between p-4">
              <div className="flex flex-col gap-2 ">
                <p className="text-lg font-bold">Videoconference</p>
                <p className="text-gray-500">lun.29 aug, 9:00 AM - 5:00 PM</p>
                <p className="text-sm text-gray-500">Link: hugo.myGPT.fi/hugo/videoconference</p>
                <span className="flex w-fit flex-row gap-[4px] rounded-md bg-white/25 px-[6px] py-[4px] font-bold text-black">
                  <Clock2 />
                  15m
                </span>
                <button className="bg-pink w-fit rounded px-[20px] py-[4px] text-white">
                  <CalendarDays />
                </button>
              </div>
              <Image alt="image" src="https://picsum.photos/536/354" width={90} height={110} />
            </div>
          </div>
        ))}
      </div>
      <button className="bg-pink/30 mx-auto mb-[40px] mt-[12px] rounded-lg px-[24px] py-[6px] text-lg text-white">
        All events
      </button>
    </div>
  );
});

ServicesPage.displayName = "ServicesPage";
