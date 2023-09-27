import React from "react";

import { Check } from "@calcom/ui/components/icon";

import Header from "../header";

const myList: string[] = [
  "Efficient Time Management",
  "Transparency and Traceability",
  "Flexibility and Liquidity",
  "Global Accessibility",
  "Customization",
  "Reduced Transaction Fees",
  "Task Automation",
  "Transferability and Interoperability",
  "User Engagement and Loyalty",
];

export const TimeTokenPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div className="flex w-full flex-col bg-white" ref={ref}>
      <Header title="Timetoken" description="hugo.myGPT.fi" />
      <div className=" px-5 pb-28 pt-7">
        <div className="bg-pink/10 flex h-full flex-col gap-5 rounded-[25.9px] px-6 pb-9 pt-12 ">
          <div className="text-center text-xl">Timetoken</div>
          {myList.map((item, key) => (
            <div className="flex" key={key}>
              <Check className="bg-pink rounded-full p-1 text-white" />
              <p className="pl-2 text-sm">{item}</p>
            </div>
          ))}
          <div className="text-pink pt-4 text-center text-xl">15 Timetokens = 5min</div>
        </div>
      </div>
    </div>
  );
});

TimeTokenPage.displayName = "TimeTokenPage";
