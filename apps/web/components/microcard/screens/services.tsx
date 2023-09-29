import Image from "next/image";
import Link from "next/link";
import React from "react";

import { trpc } from "@calcom/trpc/react";
import { Badge } from "@calcom/ui";
import { CalendarPlus, Clock } from "@calcom/ui/components/icon";

import { default as Header } from "../header";

export const ServicesPage = React.forwardRef<HTMLDivElement>((props, ref) => {
  // you need to replace userId with props.id
  const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: 10 });
  console.log(user);

  return (
    <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
      {user && !isLoading && (
        <>
          <Header title="Events" description={user.username} hasCalendar />
          <div className="h-[75vh] px-5 py-5">
            <p className="pb-4 text-center text-lg font-bold">Book Meeting</p>
            <div className="bg-pink/10 rounded-md">
              {user.eventTypes
                .filter((event) => !event.hidden)
                .filter((event) => !event.teamId)
                .map((event, key) => (
                  <div key={key}>
                    <div className="flex justify-between p-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold ">{event.title}</p>
                        <p className="text-xs text-gray-500">lun.29 aug, 9:00 AM - 5:00 PM</p>
                        <p className="text-[10px] text-gray-500">Link: hugo.myGPT.fi/hugo/videoconference</p>
                        <Badge className="w-fit" variant="gray" startIcon={Clock}>
                          {event.slug}
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
              <Link
                href={{
                  pathname: `/${user.username}`,
                }}>
                <button className="bg-pink/50 mx-auto mt-4 rounded px-2 py-1 text-center text-lg text-white">
                  All events
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ServicesPage.displayName = "ServicesPage";
