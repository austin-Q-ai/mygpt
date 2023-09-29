import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { ChevronLeft, ChevronRight } from "@calcom/ui/components/icon";

export default function CarouselDemo() {
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Carousel
      autoPlay
      dynamicHeight
      showIndicators={false}
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      interval={5000}
      centerMode
      centerSlidePercentage={windowWidth > 375 ? 20 : 12}
      transitionTime={900}
      infiniteLoop
      renderArrowPrev={(clickHandler, hasPrev) => {
        return (
          <div
            className={`${
              hasPrev ? "absolute" : "hidden"
            } bottom-0 left-0 top-0 z-20 flex cursor-pointer items-center justify-center opacity-30 hover:opacity-100`}
            onClick={clickHandler}>
            <ChevronLeft className="text-emphasis h-7 w-7" />
          </div>
        );
      }}
      renderArrowNext={(clickHandler, hasNext) => {
        return (
          <div
            className={`${
              hasNext ? "absolute" : "hidden"
            } bottom-0 right-0 top-0 z-20 flex cursor-pointer items-center justify-center opacity-30 hover:opacity-100`}
            onClick={clickHandler}>
            <ChevronRight className="text-emphasis h-7 w-7" />
          </div>
        );
      }}>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/1.svg"
          alt="avatar1"
          width={20}
          height={20}
          className="left-0 top-0 w-20 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/2.svg"
          alt="avatar2"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/3.svg"
          alt="avatar3"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/4.svg"
          alt="avatar4"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/5.svg"
          alt="avatar5"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/6.svg"
          alt="avatar6"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/8.jpeg"
          alt="avatar8"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/9.jpeg"
          alt="avatar9"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/10.jpeg"
          alt="avatar10"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/11.jpeg"
          alt="avatar11"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/12.png"
          alt="avatar12"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/13.jpeg"
          alt="avatar13"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/14.jpeg"
          alt="avatar14"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
      <div className="relative w-20 pt-[75%]">
        <Image
          src="/app-members/15.jpeg"
          alt="avatar15"
          width={20}
          height={20}
          className="left-0 top-0 rounded-2xl object-cover"
        />
      </div>
    </Carousel>
  );
}
