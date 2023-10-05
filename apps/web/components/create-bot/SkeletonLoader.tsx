import React from "react";

import { SkeletonContainer, SkeletonText } from "@calcom/ui";
import { Avatar } from "@calcom/ui";

function SkeletonLoader() {
  return (
    <SkeletonContainer>
      <div className="mx-auto flex w-full flex-col md:w-[80%]">
        <div className="border-emphasis mb-8 flex w-full flex-row rounded-md border border-dotted p-4">
          <div className="flex w-full flex-col">
            <div className="mb-8 flex w-full items-center justify-center">
              <Avatar alt="SkeletonAvatar" size="xl" imageSrc="" />
            </div>
            <div className="mb-8 flex w-full items-center justify-center">
              <SkeletonText className="w-full md:w-[20%]" />
            </div>
            <div className=" flex w-full flex-col items-center justify-center">
              <div className="flex w-full justify-center">
                <SkeletonText className="mb-8 h-48 w-[100%]" />
              </div>
            </div>
            <div className="mb-8 flex w-full items-center justify-center">
              <SkeletonText className="w-full md:w-[30%]" />
            </div>
            <div className="mb-8 flex w-full items-center justify-center">
              <SkeletonText className="h-10 w-[18%] md:w-[10%]" />
            </div>
          </div>
        </div>
        <div className="mb-8 flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-row">
            <div className="flex w-[50%] flex-col items-start justify-start gap-2 md:w-[30%]">
              <SkeletonText className="h-32 w-[80%]" />
            </div>

            <div className="flex w-[50%] flex-col items-start justify-between gap-2 md:w-[70%] ">
              <SkeletonText className="w-full md:w-[40%]" />
              <SkeletonText className="w-full md:w-[40%]" />
              <SkeletonText className="w-full md:w-[40%]" />
            </div>
          </div>
          <div className="mt-6 flex w-full flex-row">
            <SkeletonText className="h-10 w-[18%] md:w-[10%]" />
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}

export default SkeletonLoader;
