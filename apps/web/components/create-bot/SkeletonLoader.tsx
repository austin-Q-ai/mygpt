import React from "react";

import { SkeletonContainer, SkeletonText } from "@calcom/ui";
import { Avatar } from "@calcom/ui";

function SkeletonLoader() {
  return (
    <SkeletonContainer>
      <div className="mb-8 flex w-full items-center justify-center">
        <Avatar alt="SkeletonAvatar" size="xl" imageSrc="" />
      </div>
      <div className="mb-8 flex w-full flex-col items-center justify-center">
        <div className="flex w-full justify-center">
          <SkeletonText className="mb-8 h-80 w-[80%]" />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <SkeletonText className="w-[40%]" />
          <SkeletonText className="w-[40%]" />
          <SkeletonText className="w-[40%]" />
          <SkeletonText className="mt-4 w-[10%]" />
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default SkeletonLoader;
