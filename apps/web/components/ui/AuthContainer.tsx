import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, HeadSeo } from "@calcom/ui";
import { LogOut, Menu, MessageSquare, Share2, X } from "@calcom/ui/components/icon";

import Loader from "@components/Loader";
import Footer from "@components/auth/Footer";
import type { LinkProps } from "@components/auth/Footer";
import MicroCards from "@components/microcard";
import CarouselAvatarComponentN from "@components/ui/CarouselAvatarsComponentN";
// import CarouselAvatars from "@components/ui/CarouselAvatars";
// import CarouselAvatarsComponent from "@components/ui/CarouselAvatarsComponent";
import CarouselDemo from "@components/ui/CarouselDemo";

interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  hideFooter?: boolean;
  loading?: boolean;
}

export const footerLinks: LinkProps[] = [
  {
    name: "Benefits",
    url: "/",
    type: "modal",
    col: 3,
  },
  {
    name: "Features",
    url: "/",
    type: "modal",
    col: 3,
  },
  {
    name: "How does it work",
    url: "/",
    col: 6,
  },
  {
    name: "Use Cases",
    url: "/",
    type: "modal",
    col: 6,
  },
  {
    name: "Terms and conditions",
    url: "/",
    col: 6,
  },
  {
    name: "France AI",
    url: "/",
    picture: "/france-ai.svg",
    col: 12,
  },
  {
    name: "Share",
    url: "/",
    Icon: Share2,
    col: 6,
  },
  {
    name: "Comments",
    url: "/",
    Icon: MessageSquare,
    sideLabel: "9 comments",
    col: 6,
  },
];

const members = [
  {
    alt: "member1",
    id: 1,
  },
  {
    alt: "member2",
    id: 2,
  },
  {
    alt: "member3",
    id: 3,
  },
  {
    alt: "member4",
    id: 4,
  },
  {
    alt: "member5",
    id: 5,
  },
];

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  const { t } = useLocale();
  const [toggleFlag, setToggleFlag] = useState(false);
  const handleToggleNav = () => {
    setToggleFlag(!toggleFlag);
  };
  useEffect(() => {
    const handleResize = () => {
      setToggleFlag(false);
    };
    setToggleFlag(false);

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="to-darkemphasis bg-gradient-to-b from-gray-100">
      {toggleFlag ? (
        <div className="z-50 !h-screen !w-full bg-white py-4 transition delay-150 ease-in-out">
          <div className="mb-auto flex justify-between ">
            <div className="ms-6 flex-col">
              {props.showLogo && (
                <Image src="/my-gpt-logo.svg" width={130} height={20} className="left-0" alt="logo" />
              )}
            </div>
            <div className="text-secondary flex-col">
              <div className="flex flex-row gap-8">
                <div className="flex-col ">
                  <div className="flex flex-row gap-1">
                    <Button
                      onClick={() => handleToggleNav()}
                      StartIcon={X}
                      variant="icon"
                      size="lg"
                      color="minimal"
                      className="!p-none text-secondary  border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="align-center flex h-full flex-row justify-center ">
            <div className="flex flex-col self-center">
              <div className="text-secondary flex flex-col gap-8">
                <div className="flex flex-row ">
                  <div className="flex flex-row gap-1">
                    <LogOut className="h-12 w-10 flex-col" />
                    <div className="flex flex-col">
                      <Link onClick={() => handleToggleNav()} href="/auth/login" className="text-md flex-row">
                        {t("sign_in")}
                      </Link>
                      <Link onClick={() => handleToggleNav()} href="/signup" className="text-md flex-row">
                        {t("sign_up")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[880px] bg-[url('/imgpsh_fullsize_anim.png')] bg-cover bg-no-repeat md:grid lg:!max-h-screen lg:grid-rows-[_80px_1fr_1fr_1fr_1fr_1fr_0px]">
          <div className="flex flex-row md:row-span-1">
            <div className="ms-6 flex flex-1 flex-col justify-center pt-4 sm:px-6 md:mx-6 lg:px-4">
              <HeadSeo title={props.title} description={props.description} />
              <div className="mb-auto flex justify-between ">
                <div className="flex-col">
                  {props.showLogo && (
                    <Image src="/my-gpt-logo.svg" width={178} height={30} className="left-0" alt="logo" />
                  )}
                </div>
                <div className="text-secondary flex-col">
                  <div className="flex flex-row gap-8">
                    <div className="hidden flex-col md:contents">
                      <div className="flex flex-row gap-1">
                        <LogOut className="h-8 w-6 flex-col" />
                        <div className="flex flex-col">
                          <Link href="/auth/login" className="flex-row text-xs">
                            {t("sign_in")}
                          </Link>
                          <Link href="/signup" className="flex-row text-xs">
                            {t("sign_up")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="contents flex-col md:hidden">
                      <Button
                        onClick={() => handleToggleNav()}
                        StartIcon={Menu}
                        variant="icon"
                        size="lg"
                        color="minimal"
                        className="!p-none text-secondary  border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2">
            <div className="row-start-1 row-end-1 mx-auto h-fit lg:col-span-1 lg:row-span-1 lg:mx-4">
              <div
                className={classNames(
                  props.showLogo ? "" : "",
                  "flex-row sm:mx-2 sm:w-full sm:max-w-[100%] md:mt-14 md:flex-col"
                )}>
                {props.heading && (
                  <h2 className="text-emphasis line-height-2 mx-6 mt-6 text-center font-sans text-3xl font-medium leading-normal sm:max-w-md md:text-4xl lg:mx-4 lg:mt-0 lg:text-left">
                    {t("empower_with_ai_reveal")}
                  </h2>
                )}
                {props.loading && (
                  <div className="absolute z-50 flex h-screen w-full items-center ">
                    <Loader />
                  </div>
                )}
                <div className="mb-auto mt-8 sm:mx-1  sm:w-[100%] sm:max-w-lg  md:flex-col xl:w-[95%]">
                  <div className="mx-2 px-2 pt-5 sm:px-4 ">{props.children}</div>
                </div>
              </div>
            </div>
            <div className="order-last mx-auto my-4 hidden lg:col-start-1 lg:row-start-3 lg:mx-10 lg:mb-0 lg:block">
              <CarouselDemo />
              <div className="flex flex-row sm:justify-center lg:justify-normal">
                <p className="mx-3 my-8 break-words text-center text-gray-500 sm:w-full sm:max-w-md  md:mt-5 lg:w-[70%] lg:max-w-[70%] lg:text-left">
                  {t("your_artifitial_footer")}
                </p>
              </div>
            </div>
            <div className="mx-2 flex h-fit flex-1 flex-col justify-center sm:px-6 lg:row-span-3 lg:mx-0 lg:w-[90%] lg:justify-start">
              <div className="mx-auto my-6 h-[60vh] flex-row md:my-0">
                <div className="h-full w-full">
                  <MicroCards />
                </div>
              </div>
              <div className="mt-4 md:mx-auto md:my-4 lg:mt-2 ">
                <div className="mx-auto ">
                  {/* <CarouselAvatars /> */}
                  <CarouselAvatarComponentN />
                </div>
              </div>
              <div className="flew-row mx-auto my-4 justify-center font-sans font-medium text-gray-500 md:my-4 ">
                {t("more_than_25k_experts_use_myqpt")}
              </div>
            </div>
            <div className="order-last mx-auto my-4 block md:hidden lg:col-start-1 lg:row-start-3 lg:mx-10 lg:mb-0">
              <CarouselDemo />
              <div className="flex flex-row sm:justify-center lg:justify-normal">
                <p className="mx-3 my-8 break-words text-center text-gray-500 sm:w-full sm:max-w-md  md:mt-5 lg:w-[70%] lg:max-w-[70%] lg:text-left">
                  {t("your_artifitial_footer")}
                </p>
              </div>
            </div>
          </div>
          {!props.hideFooter ? (
            <div className="order-last mt-auto flex flex-row ">
              <Footer items={footerLinks} authPage />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
