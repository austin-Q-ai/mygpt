import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, HeadSeo, DialogContent, DialogTrigger, ScrollableArea } from "@calcom/ui";
import { LogOut, Menu, MessageSquare, Share2, X } from "@calcom/ui/components/icon";

import Loader from "@components/Loader";
import Footer from "@components/auth/Footer";
import type { LinkProps } from "@components/auth/Footer";
import MicroCards from "@components/microcard";
import PriceListItem from "@components/prices/PriceListItem";
// import CarouselAvatars from "@components/ui/CarouselAvatars";\
import CarouselAvatarsComponent from "@components/ui/CarouselAvatarsComponent";
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

const pricesList = [
  {
    name: "freemium",
    features: [
      "access_to_basic_features",
      "limit_of_500_messages/month",
      "email_support_with_a_response_within_48_hours",
      "data_storage_limited_to_1_gb",
      "one_active_user_online",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: "$34/month",
    features: [
      "access_to_advanced_features",
      "limit_of_5,000_messages/month",
      "email_support_with_a_response_within_24_hours",
      "data_storage_up_to_10_gb",
      "two_active_users_online",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: "$70/month",
    features: [
      "access_to_all_premium_features",
      "limit_of_20,000_messages/month",
      "priority_support_by_email_and_chat",
      "data_storage_up_to_50_gb",
      "ten_active_users_online",
      "access_to_detailed_analyses_and_reports",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: "$117/month",
    features: [
      "unlimited_access_to_all_features",
      "limit_of_100,000_messages/month",
      "24/7_priority_support",
      "unlimited_data_storage",
      "twenty_five_active_users_online",
    ],
    ipDevice: "",
    password: "",
  },
  {
    name: "contact_us",
    features: [
      "customizable_message_volume",
      "customizable_data_storage",
      "customizable_number_of_active_bots",
      "specific_integrations_or_custom_developments",
      "access_to_customizable_detailed_analyses_and_reports",
    ],
    ipDevice: "",
    password: "",
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
    <div className="to-emphasis bg-gradient-to-b from-gray-100">
      {toggleFlag ? (
        <div className="z-50 !h-screen !w-full bg-white p-5 transition delay-150 ease-in-out">
          <div className=" mb-auto flex justify-between">
            <div className="flex-col">
              {props.showLogo && (
                <Image src="/my-gpt-logo.svg" width={130} height={20} className="left-0" alt="logo" />
              )}
            </div>
            <div className="text-secondary flex-col">
              <div className="flex flex-row gap-8">
                <div className="  flex-col">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="icon"
                      size="lg"
                      color="secondary"
                      className="p-none text-secondary mr-1  h-10 w-12 self-center border-0 bg-transparent text-xl">
                      Prices
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="to-emphasis flex flex-row bg-gradient-to-b from-gray-100"
                    size="xl"
                    Icon={X}
                    title={t("")}>
                    <div className=" mt-5   flex-row ">
                      <ScrollableArea className="grid h-[600px] gap-5  sm:grid-cols-1 md:h-full md:grid-cols-5">
                        {pricesList.map((priceItem, index) => {
                          return <PriceListItem key={index} priceItem={priceItem} />;
                        })}
                      </ScrollableArea>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className=" flex flex-row">
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
        <div className="bg-[url('/imgpsh_fullsize_anim.png')] bg-cover bg-no-repeat md:grid lg:!max-h-screen lg:grid-rows-6">
          <div className="flex flex-row md:row-span-1">
            <div className="mx-6 flex flex-1 flex-col justify-center pt-4 sm:px-6 lg:px-4">
              <HeadSeo title={props.title} description={props.description} />
              <div className=" mb-auto flex justify-between">
                <div className="flex-col">
                  {props.showLogo && (
                    <Image src="/my-gpt-logo.svg" width={178} height={30} className="left-0" alt="logo" />
                  )}
                </div>
                <div className="text-secondary flex-col">
                  <div className="flex flex-row gap-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="icon"
                          size="lg"
                          color="secondary"
                          aria-label={t("delete")}
                          className="p-none text-secondary mr-1 hidden border-0 bg-transparent sm:inline">
                          Prices
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="to-emphasis bg-gradient-to-b from-gray-100"
                        size="xl"
                        Icon={X}
                        title={t("")}>
                        <div className=" mt-5   flex-row ">
                          <ScrollableArea className="grid h-[600px] gap-5  sm:grid-cols-1 md:h-full md:grid-cols-5">
                            {pricesList.map((priceItem, index) => {
                              return <PriceListItem key={index} priceItem={priceItem} />;
                            })}
                          </ScrollableArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className=" hidden flex-col md:contents">
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
          <div className="grid lg:row-span-4 lg:grid-cols-[minmax(500px,_1fr)_1fr] lg:grid-rows-3 ">
            <div className="row-start-1 mx-auto lg:col-span-1 lg:row-span-1 lg:mx-4">
              <div
                className={classNames(
                  props.showLogo ? "" : "",
                  "flex-row sm:mx-2 sm:w-full sm:max-w-[100%] md:flex-col"
                )}>
                {props.heading && (
                  <h2 className="text-emphasis line-height-2 mx-6 mt-6 text-center font-sans text-3xl font-medium leading-normal sm:max-w-md md:text-4xl lg:mx-4 lg:mt-0 lg:text-left">
                    {t("empower_with_ai_reveal")}
                  </h2>
                )}
                {props.loading && (
                  <div className=" absolute z-50 flex h-screen w-full items-center">
                    <Loader />
                  </div>
                )}
                <div className="mb-auto mt-8 sm:mx-1  sm:w-[100%] sm:max-w-lg  md:flex-col xl:w-[95%]">
                  <div className="mx-2 px-2 pt-5 sm:px-4 md:py-10">{props.children}</div>
                </div>
              </div>
            </div>
            <div className="order-last row-end-5 mx-auto my-4 lg:col-start-1 lg:row-start-3 lg:mx-10 lg:mb-0">
              <CarouselDemo />
              <div className="flex flex-row sm:justify-center lg:justify-normal">
                <p className="text-muted mx-3 my-8 break-words text-center sm:w-full sm:max-w-md  md:mt-5 lg:w-[70%] lg:max-w-[70%] lg:text-left">
                  {t("your_artifitial_footer")}
                </p>
              </div>
            </div>
            <div className=" mx-2 flex h-fit flex-1 flex-col justify-center sm:px-6 lg:row-span-3 lg:mx-0 lg:w-[90%] lg:justify-start">
              <div className="mx-auto my-6 h-[60vh] flex-row md:my-0">
                <div className="h-full w-full">
                  <MicroCards />
                </div>
              </div>
              <div className="mt-4 md:mx-auto  md:my-4 lg:mt-2 ">
                <div className="mx-auto ">
                  {/* <CarouselAvatars /> */}
                  <CarouselAvatarsComponent />
                </div>
              </div>
              <div className="flew-row text-muted mx-auto my-4 justify-center font-sans font-medium md:my-4 ">
                {t("more_than_25k_experts_use_myqpt")}
              </div>
            </div>
          </div>
          {!props.hideFooter ? (
            <div className="order-last flex  flex-row md:my-auto">
              <Footer items={footerLinks} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
