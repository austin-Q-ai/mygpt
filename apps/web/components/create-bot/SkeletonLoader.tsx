import React from "react";

import { SkeletonContainer, SkeletonText } from "@calcom/ui";
import { Avatar } from "@calcom/ui";

function SkeletonLoader() {
  return (
    <SkeletonContainer>
      <div className="mb-8 flex w-full items-center justify-between px-1 sm:mb-12 sm:px-4 lg:w-2/3">
        <SkeletonText className="w-[60%]" />
        <SkeletonText className="w-[20%]" />
      </div>
      <div className="mb-8 flex w-full flex-col items-center gap-4 px-1 sm:mb-12 sm:px-4 lg:w-2/3">
        <div className="flex w-full justify-between">
          <SkeletonText className="w-[10%]" />
          <SkeletonText className="w-[70%]" />
          <SkeletonText className="w-[15%]" />
        </div>
        <div className="flex w-full justify-between">
          <Avatar alt="SkeletonAvatar" size="sm" imageSrc="" />
          <SkeletonText className="w-[70%]" />
          <SkeletonText className="w-[20%]" />
        </div>
        <div className="flex w-full justify-between">
          <Avatar alt="SkeletonAvatar" size="sm" imageSrc="" />
          <SkeletonText className="w-[70%]" />
          <SkeletonText className="w-[20%]" />
        </div>
        <div className="flex w-full justify-between">
          <Avatar alt="SkeletonAvatar" size="sm" imageSrc="" />
          <SkeletonText className="w-[70%]" />
          <SkeletonText className="w-[20%]" />
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default SkeletonLoader;
