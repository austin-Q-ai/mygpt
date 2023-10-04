import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import classNames from "classnames";
import { InfoIcon, LogOut, Menu, Mic, SendIcon, UserIcon, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import {
  Button,
  HeadSeo,
  ScrollableArea,
  TextField,
  useCalcomTheme,
  Dropdown,
  DropdownItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import Footer from "@components/auth/Footer";
import MicroCards from "@components/microcard";
import { footerLinks } from "@components/ui/AuthContainer";

import AuthModal from "./components/AuthModal";

const BRAIN_API_KEY = "4cf4d75f4b17c08b0966843d88c8aa9b";
const BRAIN_ID = "9355e20b-d41d-44af-860b-7cb8505c8af8";
const CREATE_BRAIN_STRING = "CREATE_BRAIN_STRING";
const BRAIN_SERVICE = "http://104.248.16.57:5050";

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
  type qaType = {
    question: string;
    answer: string;
  };

  useCalcomTheme(brandTheme);
  const session = useSession();
  const { status } = session;
  const [authModalFlag, setAuthModalFlag] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResultFlag, setSearchResultFlag] = useState(false);
  const [toggleSideMenuFlag, setToggleSideMenu] = useState(false);
  const [qaList, setQaList] = useState<qaType[]>([]);
  const searchInput = useRef<HTMLInputElement>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);
  const toggleAuthMadal = (flag: boolean, sign: string) => {
    setAuthModalFlag(flag);
    setSelectedTab(sign);
  };

  // current chat id
  const [currentChatId, setCurrentChatId] = useState("");

  const handleChat = (chatId: string) => {
    axios
      .post(
        `${BRAIN_SERVICE}/chat/${chatId}/question`,
        {
          question: searchText,
        },
        {
          headers: {
            Authorization: `Bearer ${BRAIN_API_KEY}`,
            "Content-Type": "application/json",
          },
          params: { brain_id: BRAIN_ID },
        }
      )
      .then((data) => {
        if (searchInput.current) {
          setSearchText("");
          searchInput.current.value = "";
          searchText
            ? setQaList([
                ...qaList,
                {
                  question: searchText,
                  answer: data.data.assistant,
                },
              ])
            : null;
        }
      });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchResultFlag(true);
    if (currentChatId === "") {
      // if not started new chat, create new chat
      axios
        .post(
          `${BRAIN_SERVICE}/chat`,
          {
            name: CREATE_BRAIN_STRING,
          },
          {
            headers: {
              Authorization: `Bearer ${BRAIN_API_KEY}`,
            },
          }
        )
        .then((data) => {
          setCurrentChatId(data.data.chat_id);
          handleChat(data.data.chat_id);
        });
    } else {
      // if chat id exist, it chats with experts
      handleChat(currentChatId);
    }
  };

  useEffect(() => {
    answersRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaList]);

  const changeSearchValue = (e: any) => {
    setSearchText(e.target.value);
  };

  const toggleSideMenu = (flag: boolean) => {
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
          "transition-2 absolute z-50 !h-[100vh] w-[100%] bg-white md:w-[20%]",
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

          <div
            className={classNames(
              "text-secondary flex flex-row justify-center p-4 text-xl font-medium",
              status !== "authenticated" && "hidden"
            )}>
            HISTORY
          </div>

          <div className="absolute bottom-0 flex w-full flex-row justify-center py-4">
            <div className="m-4 flex w-full flex-col md:mx-8">
              <div
                className={classNames(
                  "text-secondary mb-6 flex flex-row justify-center",
                  status === "authenticated" && "hidden"
                )}>
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
      <div className={classNames("text-secondary flex flex-row justify-between px-6 py-4")}>
        <div className="flex flex-col">
          <Menu
            width={30}
            height={30}
            className="cursor-pointer hover:bg-white"
            onClick={() => toggleSideMenu(true)}
          />
        </div>
        <div className={classNames("flex flex-col", status === "authenticated" && "hidden")}>
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
        <div className={classNames("flex flex-col", status !== "authenticated" && "hidden")}>
          <Dropdown>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="icon" color="primary" StartIcon={UserIcon} rounded />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="p-2 text-center font-medium">
                {session && session?.data?.user?.username}
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <DropdownItem
                  type="button"
                  StartIcon={(props) => <LogOut aria-hidden="true" {...props} />}
                  onClick={() => signOut({ callbackUrl: "/auth/logout" })}>
                  {t("sign_out")}
                </DropdownItem>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </Dropdown>
        </div>
      </div>
      <div
        className={classNames(
          qaList.length > 0
            ? " md:grid-cols-1  md:justify-items-center"
            : " md:grid-cols-2  md:justify-items-start",
          "mb-16 grid flex-row flex-wrap justify-items-center"
        )}>
        <div className="col-span-1 m-6 flex flex-col justify-center gap-6 md:mx-16">
          <div className="flex-row">
            <Image src="/expert-clone-side.svg" width={415} height={71} alt="expert-clone-side" />
          </div>
          <form onSubmit={(e) => handleSearch(e)} className="relative flex flex-row">
            <TextField
              onChange={(e) => changeSearchValue(e)}
              ref={searchInput}
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
          <div className="flex w-full flex-row">
            <div className="flex w-full flex-col">
              {searchResultFlag && (
                <>
                  {/* <BotIcon
                  color="white"
                  width={50}
                  height={50}
                  className="border-subtle bg-brand-default rounded-md border p-2"
                /> */}
                  <ScrollableArea className="h-[550px] w-full">
                    {qaList.map((qa, index) => {
                      return (
                        <div
                          className="py-2"
                          key={index}
                          ref={index === qaList.length - 1 ? answersRef : null}>
                          <div className="text-subtle mx-6 my-auto flex flex-row font-bold">
                            Q- {qa.question}
                          </div>
                          <div className="text-subtle mx-6 my-auto flex flex-row font-medium">
                            A- {qa.answer}
                          </div>
                        </div>
                      );
                    })}
                  </ScrollableArea>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={classNames(qaList.length > 0 ? "hidden" : "col-span-1")}>
          {/* <Image src="/expert-clone-banner.svg" width={362} height={672} alt="expert-clone-banner" /> */}
          <div className="mx-auto h-[70vh] flex-row">
            <div className="h-full w-full">
              <MicroCards />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        {!toggleSideMenuFlag && <Footer items={footerLinks} className="md:absolute md:bottom-0" />}
      </div>
    </div>
  );
}

ExpertClone.PageWrapper = PageWrapper;
