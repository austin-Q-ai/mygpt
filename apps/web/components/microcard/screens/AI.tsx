import { Check } from "@calcom/ui/components/icon";

import Header from "../header";

const myList: string[] = [
  "Increased Efficiency",
  "24/7 Availability",
  "Rapid Data Processing",
  "Data-Driven Decision Making",
  "Reduction of Human Errors",
  "Task Flexibility",
  "Personalized Services",
  "Reduced Operational Costs",
  "Improved Quality of Products or Services",
];
export const AIPage = () => {
  return (
    <div className="flex w-full flex-col bg-white ">
      <Header title="Hugo AI" description="hugo.myGPT.fi" isAI />
      <div className="h-[75vh] px-5 py-8">
        <div className="bg-pink/10 flex h-full flex-col gap-4 rounded-[25.9px] px-8 pb-16 pt-20">
          <div className="text-center text-xl font-bold">Hugo AI</div>
          {myList.map((item, key) => (
            <div className="flex" key={key}>
              <Check className="bg-pink rounded-full p-1 text-white" />
              <p className="pl-2 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
