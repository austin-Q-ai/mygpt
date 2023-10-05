import Image from "next/image";
import { useEffect, useState } from "react";
import { useSpringCarousel } from "react-spring-carousel";

import { ChevronLeft, ChevronRight } from "@calcom/ui/components/icon";

export default function CarouselAvatarComponentN() {
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

  const { carouselFragment, slideToPrevItem, slideToNextItem } = useSpringCarousel({
    itemsPerSlide: 5,
    withLoop: true,
    items: images.map((img, index) => ({
      id: `item-${index}`,
      renderItem: (
        <Image
          key={index}
          src={img.url}
          alt={img.url}
          width={windowWidth >= 1030 ? 70 : windowWidth >= 768 ? 60 : 50}
          height={windowWidth >= 1030 ? 70 : windowWidth >= 768 ? 60 : 50}
          className="object-cover transition-all duration-500 ease-in rounded-full cursor-pointer"
          draggable={false}
        />
      ),
    })),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      slideToNextItem();
    }, 3000);
    return () => {
      window.clearInterval(timer);
    };
    // You MUST add the slide methods to the dependency list useEffect!
  }, [slideToNextItem]);

  return (
    <div className="relative mx-auto flex w-full !select-none flex-row justify-center gap-2 md:mt-5	lg:mt-2 lg:gap-4">
      <div className="flex my-auto">
        <ChevronLeft
          className="cursor-pointer text-emphasis h-7 w-7 opacity-60 hover:opacity-100 lg:h-10 lg:w-10"
          onClick={slideToPrevItem}
        />
      </div>

      <div className="overflow-hidden">{carouselFragment}</div>
      <div className="flex my-auto">
        <ChevronRight
          className="cursor-pointer text-emphasis h-7 w-7 opacity-60 hover:opacity-100 lg:h-10 lg:w-10"
          onClick={slideToNextItem}
        />
      </div>
    </div>
  );
}
