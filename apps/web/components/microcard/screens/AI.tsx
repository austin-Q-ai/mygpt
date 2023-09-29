import React from "react";

import { trpc } from "@calcom/trpc/react";
import { Check } from "@calcom/ui/components/icon";

// Import the useRef and Ref types from React
import Header from "../header";

export const AIPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  // you need to replace userId with props.id
  const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: 10 });

  return (
    <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
      {user && !isLoading && (
        <>
          <Header
            title={user.username.charAt(0).toUpperCase() + user.username.slice(1) + " AI"}
            description={user.username}
            isAI
          />
          <div className="h-[75%] px-5 py-8">
            <div className="bg-pink/10 flex h-full flex-col gap-4 rounded-[25.9px] px-8 pb-16 pt-20">
              <div className="text-center text-xl font-bold">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1) + " AI"}
              </div>
              {user.aiAdvantage.map((item, key) => (
                <div className="flex" key={key}>
                  <Check className="bg-pink rounded-full p-1 text-white" />
                  <p className="pl-2 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AIPage.displayName = "AIPage";
