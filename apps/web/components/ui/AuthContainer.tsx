import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, HeadSeo, DialogContent, DialogTrigger, ScrollableArea } from "@calcom/ui";
import { ArrowLeft, ArrowRight, LogOut, Menu, MessageSquare, Share2, X } from "@calcom/ui/components/icon";

import Loader from "@components/Loader";
import Footer from "@components/auth/Footer";
import type { LinkProps } from "@components/auth/Footer";
import PriceListItem from "@components/prices/PriceListItem";
import CarouselDemo from "@components/ui/CarouselDemo";

interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export const footerLinks: LinkProps[] = [
  {
    name: "Benifits",
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
    <>
      {toggleFlag ? (
        <div className="z-50 !h-screen !w-full bg-white p-5 transition delay-150 ease-in-out">
          <div className=" mb-auto flex justify-between">
            <div className="flex-col">
              {props.showLogo && (
                <Image src="/my-gpt-logo.svg" width={130} height={20} className="left-0" alt="logo" />
              )}
            </div>
            <div className="text-pink flex-col">
              <div className="flex flex-row gap-8">
                <div className="  flex-col">
                  <div className="flex flex-row gap-1">
                    <Button
                      onClick={() => handleToggleNav()}
                      StartIcon={X}
                      variant="icon"
                      size="lg"
                      color="minimal"
                      className="!p-none text-pink  border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="align-center flex h-full flex-row justify-center ">
            <div className="flex flex-col self-center">
              <div className="text-pink flex flex-col gap-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="icon"
                      size="lg"
                      color="secondary"
                      className="p-none text-pink mr-1  h-10 w-12 self-center border-0 bg-transparent text-xl">
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
        <>
          <div className="flex flex-row">
            <div className="mx-6 flex flex-1 flex-col justify-center bg-[#f3f4f6] py-4 sm:px-6 lg:px-4">
              <HeadSeo title={props.title} description={props.description} />
              <div className=" mb-auto flex justify-between">
                <div className="flex-col">
                  {props.showLogo && (
                    <Image src="/my-gpt-logo.svg" width={178} height={30} className="left-0" alt="logo" />
                  )}
                </div>
                <div className="text-pink flex-col">
                  <div className="flex flex-row gap-8">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="icon"
                          size="lg"
                          color="secondary"
                          aria-label={t("delete")}
                          className="p-none text-pink mr-1 hidden border-0 bg-transparent sm:inline">
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
                        className="!p-none text-pink  border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row  flex-wrap ">
            <div className=" mt-12 flex flex-col justify-center  bg-[#f3f4f8] py-1 pt-4 sm:mx-2  md:mx-4 lg:mx-8 lg:flex-1 lg:px-4">
              <div className="">
                <div
                  className={classNames(props.showLogo ? "" : "", "flex-row sm:mx-2 sm:w-full sm:max-w-md")}>
                  {props.heading && (
                    <h2 className="text-emphasis line-height-2  text-center font-sans text-3xl font-medium leading-normal md:text-left md:text-4xl">
                      {t("empower_with_ai_reveal")}
                    </h2>
                  )}
                </div>
                {props.loading && (
                  <div className=" absolute z-50 flex h-screen w-full items-center">
                    <Loader />
                  </div>
                )}
                <div className="mb-auto mt-8  sm:mx-1 sm:w-[100%] sm:max-w-lg md:max-w-[75%] xl:w-[95%]">
                  <div className="mx-2 px-2 py-10 sm:px-2">{props.children}</div>
                  {/* <div className="text-default mt-8 text-center text-sm">{props.footerText}</div> */}
                </div>
                <div className="mt-5">
                  {/* <Image src="/standing-auth.svg" width={423} height={175} alt="standing_auth" /> */}
                  <div className="h-[175px] sm:w-[375px] md:w-[423px]">
                    <CarouselDemo />
                  </div>
                  <p className="text-muted mx-3 mt-8 break-words sm:w-full sm:max-w-md md:mt-5 lg:w-[80%] lg:max-w-[80%]">
                    {t("your_artifitial_footer")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col  justify-start sm:px-6 lg:px-8">
              <div className="mx-auto flex-row">
                <Image src="/qube-side-pic.svg" width={320} height={575} alt="standing_auth" />
              </div>
              <div className="mx-auto mt-5 flex flex-row gap-4">
                <div className="my-auto cursor-pointer flex-col">
                  <ArrowLeft />
                </div>
                {members.map((member) => {
                  return (
                    <div
                      key={member.id}
                      data-testid={`app-store-member-${member.id}`}
                      className="relative flex-col content-center rounded-md">
                      <Image
                        src={"/app-members/" + member.id + ".svg"}
                        width={100}
                        height={100}
                        alt={member.alt}
                        className="h-fit w-fit rounded-full"
                      />
                    </div>
                  );
                })}
                <div className="my-auto cursor-pointer flex-col">
                  <ArrowRight />
                </div>
              </div>
              <div className="flew-row text-muted mt-2 text-center font-sans font-medium">
                {t("more_than_25k_experts_use_myqpt")}
              </div>
            </div>
          </div>
          <div className="bottom-0 flex flex-row">
            <Footer items={footerLinks} />
          </div>
        </>
      )}
    </>
  );
}
