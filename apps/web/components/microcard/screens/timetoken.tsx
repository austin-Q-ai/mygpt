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
export const TimeTokenPage = () => {
  return (
    <div className="flex w-full flex-col bg-white">
      <Header title="Timetoken" description="hugo.myGPT.fi" />
      <div className="h-[75vh] px-5 py-8">
        <div className="bg-pink/10 flex h-full flex-col gap-10 rounded-[25.9px] px-8 pb-9 pt-12">
          <div className="flex flex-col gap-4">
            <div className="text-center text-xl font-bold">Timetoken</div>
            {myList.map((item, key) => (
              <div className="flex" key={key}>
                <Check className="bg-pink rounded-full p-1 text-white" />
                <p className="pl-2 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <div className="text-pink pt-4 text-center text-xl">15 Timetokens = 5min</div>
        </div>
      </div>
    </div>
  );
};
