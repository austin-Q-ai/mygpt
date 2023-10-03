import Image from "next/image";
import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "@calcom/ui/components/icon";

export default function CarouselAvatarComponent() {
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(5);
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
  const nextSlide = () => {
    if (lastIndex === images.length) {
      setFirstIndex(0);
      setLastIndex(5);
    } else {
      setFirstIndex(firstIndex + 1);
      setLastIndex(lastIndex + 1);
    }
  };
  const prevSlide = () => {
    if (firstIndex === 0) {
      setFirstIndex(images.length - 5);
      setLastIndex(images.length);
    } else {
      setFirstIndex(firstIndex - 1);
      setLastIndex(lastIndex - 1);
    }
  };
  const images = [
    {
      url: "/app-members/1.svg",
    },
    {
      url: "/app-members/2.svg",
    },
    {
      url: "/app-members/3.svg",
    },
    {
      url: "/app-members/4.svg",
    },
    {
      url: "/app-members/5.svg",
    },
    {
      url: "/app-members/6.svg",
    },
    {
      url: "/app-members/8.jpeg",
    },
    {
      url: "/app-members/9.jpeg",
    },
    {
      url: "/app-members/10.jpeg",
    },
    {
      url: "/app-members/11.jpeg",
    },
    {
      url: "/app-members/12.png",
    },
    {
      url: "/app-members/13.jpeg",
    },
    {
      url: "/app-members/14.jpeg",
    },
    {
      url: "/app-members/15.jpeg",
    },
    {
      url: "/app-members/16.jpeg",
    },
  ];
  return (
    <div className="relative mx-auto flex w-full !select-none flex-row justify-center gap-2 md:mt-5	lg:mt-2 lg:gap-4">
      <div className="my-auto flex">
        <ChevronLeft
          className="text-emphasis h-7 w-7 cursor-pointer opacity-60 hover:opacity-100 lg:h-10 lg:w-10"
          onClick={prevSlide}
        />
      </div>

      {images.slice(firstIndex, lastIndex).map((img, index) => {
        return (
          <Image
            key={index}
            src={img.url}
            alt={img.url}
            width={windowWidth >= 1030 ? 70 : windowWidth >= 768 ? 60 : 50}
            height={windowWidth >= 1030 ? 70 : windowWidth >= 768 ? 60 : 50}
            className="left-0 top-0 rounded-full object-cover transition-all duration-500 ease-in"
          />
        );
      })}
      <div className="my-auto flex">
        <ChevronRight
          className="text-emphasis h-7 w-7 cursor-pointer opacity-60 hover:opacity-100 lg:h-10 lg:w-10"
          onClick={nextSlide}
        />
      </div>
    </div>
  );
}
