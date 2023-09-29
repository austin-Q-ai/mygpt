import React from "react";

import { trpc } from "@calcom/trpc/react";
import { Check } from "@calcom/ui/components/icon";

import Header from "../header";

interface TimeTokenPageProps {
  userId: number;
}

export const TimeTokenPage = React.forwardRef<HTMLDivElement, TimeTokenPageProps>(
  (props: TimeTokenPageProps, ref) => {
    // you need to replace userId with props.id
    const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: props.userId });

    return (
      <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
        {user && !isLoading && (
          <>
            <Header title="Timetoken" description={user.username} />
            <div className="h-[75vh] px-5 py-8">
              <div className="bg-pink/10 flex h-full flex-col gap-10 rounded-[25.9px] px-8 pb-9 pt-12">
                <div className="flex flex-col gap-4">
                  <div className="text-center text-xl font-bold">Timetoken</div>
                  {user.timeTokenAdvantage.map((item, key) => (
                    <div className="flex" key={key}>
                      <Check className="bg-pink rounded-full p-1 text-white" />
                      <p className="pl-2 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="text-pink pt-4 text-center text-xl">1 Timetoken = 5min</div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

TimeTokenPage.displayName = "TimeTokenPage";
