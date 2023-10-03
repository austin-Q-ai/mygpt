import React from "react";

import { trpc } from "@calcom/trpc/react";
import { Check } from "@calcom/ui/components/icon";

// Import the useRef and Ref types from React
import Header from "../header";

interface AIPageProps {
  userId: number;
}

export const AIPage = React.forwardRef<HTMLDivElement, AIPageProps>((props: AIPageProps, ref) => {
  const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: props.userId });
  const title =
    (user?.username?.charAt(0).toUpperCase() || "MyGPT") + (user?.username?.slice(1) || "MyGPT") + " AI";

  return (
    <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
      {user && !isLoading && (
        <>
          <Header title={title} description={user.username} isAI />
          <div className="h-[75%] px-5 py-8">
            <div className="bg-pink/10 flex h-full flex-col gap-4 rounded-[25.9px] px-8 pb-16 pt-20">
              <div className="text-center text-xl font-bold">{title}</div>
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
