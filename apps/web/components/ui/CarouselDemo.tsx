import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CarouselDemo() {
  return (
    <Carousel
      autoPlay
      dynamicHeight
      showIndicators={false}
      showArrows={false}
      showStatus={false}
      transitionTime={2500}
      infiniteLoop
      renderArrowPrev={(clickHandler, hasPrev) => {
        return (
          <div
            className={`${
              hasPrev ? "absolute" : "hidden"
            } bottom-0 left-0 top-0 z-20 flex cursor-pointer items-center justify-center p-3 opacity-30 hover:opacity-100`}
            onClick={clickHandler}>
            <ArrowLeft className="text-emphasis h-9 w-9" />
          </div>
        );
      }}
      renderArrowNext={(clickHandler, hasNext) => {
        return (
          <div
            className={`${
              hasNext ? "absolute" : "hidden"
            } bottom-0 right-0 top-0 z-20 flex cursor-pointer items-center justify-center p-3 opacity-30 hover:opacity-100`}
            onClick={clickHandler}>
            <ArrowRight className="text-emphasis h-9 w-9" />
          </div>
        );
      }}>
      <div className="relative w-full pt-[36%]">
        <Image
          src="/standing-auth-1.svg"
          alt="standing-auth-1"
          width={423}
          height={175}
          className="left-0 top-0 h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-full pt-[36%]">
        <Image
          src="/standing-auth-2.svg"
          alt="standing-auth-2"
          width={423}
          height={175}
          className="left-0 top-0 h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-full pt-[36%]">
        <Image
          src="/standing-auth-3.svg"
          alt="standing-auth-3"
          width={423}
          height={175}
          className="left-0 top-0 h-full w-full rounded-2xl object-cover"
        />
      </div>
    </Carousel>
  );
}
