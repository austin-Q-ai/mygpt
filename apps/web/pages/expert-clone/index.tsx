import classNames from "classnames";
import { BotIcon, InfoIcon, LogOut, Menu, Mic, SendIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, HeadSeo, TextField, useCalcomTheme } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import Footer from "@components/auth/Footer";
import { footerLinks } from "@components/ui/AuthContainer";

import AuthModal from "./components/AuthModal";

export function DialogContentDiv(props: JSX.IntrinsicElements["div"]) {
  <span>{props.children}</span>;
}

export default function ExpertClone() {
  const { t } = useLocale();
  const brandTheme = useGetBrandingColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  interface socialLinksType {
    image: string;
    url: string;
  }
  const socialLinks: socialLinksType[] = [
    {
      image: "telegram",
      url: "/",
    },
    {
      image: "facebook",
      url: "/",
    },
    {
      image: "discord",
      url: "/",
    },
    {
      image: "instagram",
      url: "/",
    },
    {
      image: "linkedin-in",
      url: "/",
    },
  ];
  useCalcomTheme(brandTheme);
  const session = useSession();
  const { status } = session;
  const [authModalFlag, setAuthModalFlag] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResultFlag, setSearchResultFlag] = useState(false);
  const [toggleSideMenuFlag, setToggleSideMenu] = useState(false);
  const sideMenuRef = useRef<HTMLInputElement>(null);
  const toggleAuthMadal = (flag: boolean, sign: string) => {
    console.log("open Modal");
    setAuthModalFlag(flag);
    setSelectedTab(sign);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchResultFlag(true);
  };

  const changeSearchValue = (e: any) => {
    setSearchResultFlag(false);
    setSearchText(e.target.value);
  };

  const toggleSideMenu = (flag: boolean) => {
    console.log("open side menu");
    setToggleSideMenu(flag);
  };

  useEffect(() => {
    const handleSideMenu = (e: any) => {
      if (e.target === sideMenuRef.current) {
        return;
      }
      toggleSideMenu(false);
    };
    window.addEventListener("click", handleSideMenu, true);
    return () => {
      window.removeEventListener("click", handleSideMenu, true);
    };
  });
  return (
    <div className="h-[100vh] flex-1">
      <div
        ref={sideMenuRef}
        className={classNames(
          "transition-2 absolute z-50 !h-[100vh] w-[50%] bg-white md:w-[20%]",
          toggleSideMenuFlag ? "" : "hidden"
        )}>
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between gap-4 p-4">
            <div className="flex-col">
              <Image src="/my-gpt-logo.svg" alt="" width={140} height={40} />
            </div>
            <div className="flex-col">
              <Button
                onClick={() => toggleSideMenu(false)}
                StartIcon={X}
                variant="icon"
                size="lg"
                color="minimal"
                className="!p-none text-secondary border-0"
              />
            </div>
          </div>

          <div className="text-secondary flex flex-row justify-center p-4 text-xl font-medium">HISTORY</div>

          <div className="absolute bottom-0 flex w-full flex-row justify-center py-4">
            <div className="m-4 flex w-full flex-col md:mx-8">
              <div className="text-secondary mb-6 flex flex-row justify-center">
                <div
                  className="text-secondary flex cursor-pointer flex-row gap-1 "
                  onClick={() => toggleAuthMadal(true, "sign_in")}>
                  <LogOut className="h-12 w-8 flex-col" />
                  <div className="flex flex-col">
                    <div className="text-md flex-row">{t("sign_in")}</div>
                    <div className="text-md flex-row">{t("sign_up")}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                {socialLinks.map((item, index) => {
                  return (
                    <div className="" key={index}>
                      <Link
                        className="fill-pink flex flex-col justify-items-center"
                        href={item.url}
                        target="_blank">
                        <Image
                          alt={item.image}
                          src={"/app-social/" + item.image + ".svg"}
                          className="text-secondary border-pink round !fill-pink  rounded-full border p-2 hover:bg-gray-100"
                          width={35}
                          height={35}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <HeadSeo title="Experts Clone" description="Experts Clone." />
      <div className="text-secondary flex flex-row justify-between px-6 py-4">
        <div className="flex flex-col">
          <Menu
            width={30}
            height={30}
            className="cursor-pointer hover:bg-white"
            onClick={() => toggleSideMenu(true)}
          />
        </div>
        <div className="flex flex-col">
          <div
            className="flex cursor-pointer flex-row gap-1"
            onClick={() => toggleAuthMadal(true, "sign_in")}>
            <LogOut className="h-8 w-6 flex-col" />
            <div className="flex flex-col">
              <div className="flex-row text-xs">{t("sign_in")}</div>
              <div className="flex-row text-xs">{t("sign_up")}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-16 grid flex-row flex-wrap justify-items-center md:grid-cols-2 md:justify-items-start">
        <div className="col-span-1 mx-16 flex flex-col justify-center gap-6">
          <div className="flex-row">
            <Image src="/expert-clone-side.svg" width={415} height={71} alt="expert-clone-side" />
          </div>
          <form onSubmit={(e) => handleSearch(e)} className="relative flex flex-row">
            <TextField
              onChange={(e) => changeSearchValue(e)}
              autoComplete="off"
              // addOnLeading={<Search color="#6D278E" />}
              addOnSuffix={
                <div className="text-secondary flex justify-items-center gap-4 border-l-0">
                  <Mic /> <SendIcon fill="#6D278E" className="rotate-45" />
                </div>
              }
              placeholder="Ask me anything ..."
              inputwidth="lg"
              addOnClassname=" !border-secondary !text-secondary !h-[50px] !bg-transparent"
              inputMode="search"
              className="!border-secondary text-secondary selection:border-secondary placeholder:text-secondary/60 !w-full !bg-transparent py-2 text-2xl"
            />

            {authModalFlag && (
              <AuthModal
                selectedTab={selectedTab}
                isOpen={authModalFlag}
                onExit={() => {
                  setAuthModalFlag(false);
                }}
              />
            )}

            <InfoIcon
              color="#6D278E"
              width={20}
              height={20}
              className="absolute"
              style={{ top: "-18", right: "-18" }}
            />
          </form>
          <div className="flex flex-row">
            {searchResultFlag && (
              <>
                <BotIcon
                  color="white"
                  width={50}
                  height={50}
                  className="border-subtle bg-brand-default rounded-md border p-2"
                />
                <span className="text-subtle mx-6 my-auto font-medium">{searchText}</span>
              </>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <Image src="/expert-clone-banner.svg" width={362} height={672} alt="expert-clone-banner" />
        </div>
      </div>
      <div className="flex flex-row">
        <Footer items={footerLinks} />
      </div>
    </div>
  );
}

ExpertClone.PageWrapper = PageWrapper;
