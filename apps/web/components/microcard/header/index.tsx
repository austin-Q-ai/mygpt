import Image from "next/image";

import { classNames } from "@calcom/lib";
import { Avatar } from "@calcom/ui";
import { CalendarDays } from "@calcom/ui/components/icon";

interface headerProps {
  title: string;
  description: string;
  hasCalendar?: boolean;
  isAI?: boolean;
}

const Header = (props: headerProps) => {
  const { title, description, hasCalendar, isAI } = props;
  return (
    <div className="bg-pink/50 flex min-h-[25vh] flex-col gap-3 py-4">
      <div className={classNames("flex items-center justify-center", hasCalendar && "relative")}>
        <div className="relative flex rounded-full border-2 border-dashed border-white p-2">
          <Avatar
            alt="Avatar Image"
            imageSrc=""
            gravatarFallbackMd5="fallback"
            size="xl"
            className="border-pink border-2 border-solid bg-white"
          />
          {isAI ? (
            <Image
              className="absolute -bottom-[4px] -left-[18px]"
              src="apps/AI-chip.png"
              width={52}
              height={52}
              alt="AI Chip image"
            />
          ) : (
            <></>
          )}
        </div>
        {hasCalendar ? (
          <div className="absolute right-5 flex flex-col items-center justify-center gap-1 text-white">
            <CalendarDays />
            <p className="text-[8px]">Get appointment</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col text-center text-white">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Header;
