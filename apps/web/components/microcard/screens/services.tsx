import classNames from "classnames";
import Link from "next/link";
import React from "react";

import { CAL_URL } from "@calcom/lib/constants";
import { trpc } from "@calcom/trpc/react";
import { Badge, ScrollableArea } from "@calcom/ui";
import { CalendarPlus, Clock } from "@calcom/ui/components/icon";

import { default as Header } from "../header";

interface ServicesPageProps {
  userId: number;
}

export const ServicesPage = React.forwardRef<HTMLDivElement, ServicesPageProps>(
  (props: ServicesPageProps, ref) => {
    // you need to replace userId with props.id
    const { data: user, isLoading } = trpc.viewer.microcard.user.useQuery({ userId: props.userId });
    console.log(user?.eventTypes);

    return (
      <div className="flex h-[900px] w-[500px] flex-col bg-white" ref={ref}>
        {user && !isLoading && (
          <>
            <Header title="Events" description={user.username} />
            <div className="h-[75%] px-5 py-5">
              <p className="pb-4 text-center text-lg font-bold">Book Meeting</p>
              <ScrollableArea
                className={classNames(user.eventTypes.length > 4 && "h-[85%]", "bg-pink/10 rounded-md")}>
                {user.eventTypes
                  .filter((event) => !event.hidden)
                  .filter((event) => !event.teamId)
                  .map((event, key) => (
                    <div key={key}>
                      <div className="flex justify-between p-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-bold ">{event.title}</p>
                          <p className="text-[10px] text-gray-500">
                            Link: {CAL_URL?.replace(/^(https?:|)\/\//, "")}/{user.username}/{event.slug}
                          </p>
                          <div className="flex gap-2">
                            {event.metadata?.multipleDuration ? (
                              event.metadata.multipleDuration.map((duration) => (
                                <Badge className="w-fit" key={duration} variant="gray" startIcon={Clock}>
                                  {duration}m
                                </Badge>
                              ))
                            ) : (
                              <Badge className="w-fit" variant="gray" startIcon={Clock}>
                                {event.length}m
                              </Badge>
                            )}
                          </div>
                          <span className="bg-pink w-fit rounded px-3 py-1 text-white">
                            <Link href={`/${user.username}/${event.slug}`}>
                              <CalendarPlus className="h-4" />
                            </Link>
                          </span>
                        </div>
                        {event.logo && <img alt={event.title} src={event.logo} width={90} height={110} />}
                      </div>
                    </div>
                  ))}
              </ScrollableArea>
              <div className="flex items-center">
                <Link href={`/${user.username}`}>
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
  }
);

ServicesPage.displayName = "ServicesPage";
