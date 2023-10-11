import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import useResizeObserver from "@react-hook/resize-observer";
import axios from "axios";
import classNames from "classnames";
import {
  InfoIcon,
  LogOut,
  Menu,
  SendIcon,
  UserIcon,
  X,
  MessageCircle,
  TrashIcon,
  Edit2Icon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MessageLoader from "pages/expert-clone/components/MessageLoader";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

import { BRAIN_SERVICE, BRAIN_API_KEY, BRAIN_ID } from "@calcom/lib/constants";
import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
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
  showToast,
} from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import Footer from "@components/auth/Footer";
import MicroCards from "@components/microcard";
import { footerLinks } from "@components/ui/AuthContainer";

import AuthModal from "./components/AuthModal";

const CREATE_BRAIN_STRING = "CREATE_BRAIN_STRING"; // not necessary actually, you can use first chat string as create brain string

export function DialogContentDiv(props: JSX.IntrinsicElements["div"]) {
  <span>{props.children}</span>;
}

const useSize = (target: any) => {
  const [size, setSize] = useState();

  useLayoutEffect(() => {
    target && setSize(target.getBoundingClientRect().height);
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry: any) => setSize(entry.contentRect));
  return size;
};

export default function ExpertClone() {
  const { data: user } = trpc.viewer.me.useQuery();
  // const { BRAIN_API_KEY, BRAIN_ID } = user;
  // console.log(user);
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
    chat_id?: string;
    answer: string;
    loading?: boolean;
  };

  type historyType = {
    chat_id: string;
    chat_name: string;
    creation_time: Date;
    user_id: string;
  };

  useCalcomTheme(brandTheme);
  const session = useSession();
  const { status } = session;
  const [authModalFlag, setAuthModalFlag] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResultFlag, setSearchResultFlag] = useState(false);
  const [toggleSideMenuFlag, setToggleSideMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qaList, setQaList] = useState<qaType[]>([]);
  const [qaHistory, setQaHistory] = useState<historyType[]>([]);
  const [historyItemDelete, setHistoryItemDelete] = useState<string[]>([]);
  const [historyEdit, setHistoryEdit] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const answersRef = useRef<HTMLDivElement>(null);
  const endOfScrollArea = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const size = useSize(target);
  useEffect(() => {
    endOfScrollArea?.current?.scrollIntoView({ behavior: "smooth" });
  }, [size]);
  const toggleAuthMadal = (flag: boolean, sign: string) => {
    setAuthModalFlag(flag);
    setSelectedTab(sign);
  };

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

  // current chat id
  const [currentChatId, setCurrentChatId] = useState("");

  const handleChat = (chatId: string, edit?: boolean) => {
    if (!edit) {
      if (qaList.length > 0) {
        setQaList([
          ...qaList,
          {
            question: searchText,
            chat_id: currentChatId,
            answer: "",
            loading: true,
          },
        ]);
      } else {
        setQaList([
          ...qaList,
          {
            question: searchText,
            chat_id: "",
            answer: "",
            loading: true,
          },
        ]);
      }
    }
    if (searchInput.current) {
      searchInput.current.value = "";
    }
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
        setSearchText("");
        if (searchInput.current) {
          searchInput.current.value = "";
        }
        data.data.chat_id
          ? edit
            ? setQaList([
                {
                  question: data.data.user_message,
                  chat_id: data.data.chat_id,
                  answer: data.data.assistant,
                  loading: false,
                },
              ])
            : setQaList([
                ...qaList,
                {
                  question: searchText,
                  chat_id: data.data.chat_id,
                  answer: data.data.assistant,
                  loading: false,
                },
              ])
          : null;
        setHistoryEdit("");
      });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchText && searchText.length > 0) {
      setLoading(true);
    }
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
          if (searchInput.current) {
            if (searchInput.current.value) {
              handleChat(data.data.chat_id);
            }
          }
        });
    } else {
      // if chat id exist, it chats with experts
      if (searchInput.current) {
        if (searchInput.current.value) {
          handleChat(currentChatId);
        }
      }
    }
  };

  // get chat history

  const getChatHistory = () => {
    axios
      .get(`${BRAIN_SERVICE}/chat`, {
        headers: {
          Authorization: `Bearer ${BRAIN_API_KEY}`,
        },
      })
      .then((data) => {
        if (data.data.chats) {
          setQaHistory(data.data.chats);
        }
        // you can use data.data.chats
        // (data.data.chats is array of objects, each object schema is as follows)
        // {
        //   chat_id: string
        //   chat_name: string
        //   creation_time: date
        //   user_id: string
        // }
      });
  };

  // delete chat history using chat_id
  const deleteChatHistory = (chatId: string) => {
    axios
      .delete(`${BRAIN_SERVICE}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${BRAIN_API_KEY}`,
        },
      })
      .then((data) => {
        showToast(data.data.message, "success");
        setCurrentChatId("");
        // you can use data.data.message
        // data.data.message type is string and it is as follows
        // `${chat_id} has been deleted.`
      });
  };
  useEffect(() => {
    answersRef?.current?.scrollIntoView({ behavior: "smooth" });
    getChatHistory();
  }, [qaList]);

  const setLoading = (flag: boolean) => {
    endOfScrollArea?.current?.scrollIntoView({ behavior: "smooth" });
    setIsLoading(flag);
    setSearchResultFlag(flag);
  };
  const changeSearchValue = (e: any) => {
    setSearchText(e.target.value);
  };

  const toggleSideMenu = (flag: boolean) => {
    setToggleSideMenu(flag);
  };

  const deleteHistoryItem = (item: historyType) => {
    setHistoryItemDelete([...historyItemDelete, item.chat_id]);
    const updatedQas = qaList.filter((qa) => qa.chat_id !== item.chat_id);
    setQaList([...updatedQas]);
    getChatHistory();

    deleteChatHistory(item.chat_id);
  };
  const editHistoryItem = (item: historyType) => {
    setHistoryEdit(item.chat_id);
    setCurrentChatId(item.chat_id);
    setLoading(true);
    setToggleSideMenu(false);
    setQaList([]);
    handleChat(item.chat_id, true);
  };
  const checkIfAuthenticated = () => {
    if (status !== "authenticated") {
      toggleAuthMadal(true, "sign_in");
    }
  };
  useEffect(() => {
    const handleSideMenu = (e: any) => {
      if (sideMenuRef.current?.contains(e.target)) {
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
    <div className="">
      <div className="h-[100vh] flex-1 bg-[url('/imgpsh_fullsize_anim.png')] bg-cover bg-no-repeat lg:!max-h-screen">
        <div
          ref={sideMenuRef}
          className={classNames(
            "absolute z-50 !h-[100vh] w-[100%] bg-white transition-all duration-300 ease-in md:w-[450px]",
            toggleSideMenuFlag ? "transition-transform duration-700" : "hidden"
          )}>
          <div className="flex flex-col ">
            <div className="flex flex-row justify-between gap-4 p-4">
              <div className="flex-col" />
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

            <div className="mb-8 flex flex-row justify-center">
              <Image src="/expert-clone-side.svg" alt="" width={270} height={60} />
            </div>

            <div
              className={classNames(
                "text-secondary flex flex-row p-4 text-xl font-medium",
                status !== "authenticated" && "hidden"
              )}>
              <div className="flex w-full flex-col ">
                <div className="ms-3 flex flex-row justify-start">HISTORY</div>
                <ScrollableArea className="mt-6 flex h-[450px] w-full flex-row">
                  <div className="flex w-full flex-col">
                    {qaHistory.length > 0 ? (
                      qaHistory.map((qa, index) => {
                        return (
                          <div
                            key={index}
                            className="bg-emphasis mb-2 ms-3 flex flex-row justify-between rounded-md  px-3 py-2">
                            <div className="my-auto flex flex-col">
                              <div className="flex flex-row">
                                <div className="my-auto flex-col">
                                  <MessageCircle />
                                </div>
                                <div className="w-fit flex-col">
                                  <span className="ms-2 h-fit truncate text-sm">
                                    {qa.chat_name.substring(0, windowWidth >= 800 ? 30 : 20)}{" "}
                                    {qa.chat_name.length > (windowWidth >= 800 ? 30 : 20) ? "..." : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="my-auto flex flex-row justify-center gap-2">
                                <Button
                                  color="minimal"
                                  variant="icon"
                                  disabled={
                                    historyItemDelete.includes(qa.chat_id) || historyEdit === qa.chat_id
                                  }
                                  loading={historyEdit === qa.chat_id}
                                  onClick={() => editHistoryItem(qa)}
                                  className="bg-transparent hover:bg-transparent">
                                  <Edit2Icon
                                    width={18}
                                    height={18}
                                    className={classNames(
                                      historyItemDelete.includes(qa.chat_id)
                                        ? "disabled text-muted cursor-not-allowed"
                                        : "text-secondary cursor-pointer",
                                      historyEdit === qa.chat_id && "hidden"
                                    )}
                                  />
                                </Button>
                                <Button
                                  color="minimal"
                                  variant="icon"
                                  loading={historyItemDelete.includes(qa.chat_id)}
                                  disabled={
                                    historyItemDelete.includes(qa.chat_id) || historyEdit === qa.chat_id
                                  }
                                  onClick={() => deleteHistoryItem(qa)}
                                  className="bg-transparent hover:bg-transparent">
                                  <TrashIcon
                                    width={18}
                                    height={18}
                                    className={classNames(
                                      historyItemDelete.includes(qa.chat_id)
                                        ? "hidden"
                                        : historyEdit === qa.chat_id
                                        ? "disabled text-muted cursor-not-allowed"
                                        : "text-secondary cursor-pointer"
                                    )}
                                  />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-muted my-4 ms-3 flex flex-row justify-between rounded-md  px-3 py-2">
                        No History
                      </div>
                    )}
                  </div>
                </ScrollableArea>
              </div>
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
                <div className="flex flex-row justify-around md:mx-8">
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
                <div
                  className={classNames(
                    "text-secondary mt-6 flex flex-row justify-center",
                    status !== "authenticated" && "hidden"
                  )}>
                  <div
                    className="text-secondary flex cursor-pointer flex-row gap-1 "
                    onClick={() => signOut({ callbackUrl: "/auth/logout" })}>
                    <LogOut className="h-12 w-8 flex-col" />
                    <div className="text-md flex flex-col justify-center">{t("sign_out")}</div>
                  </div>
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
            " md:justify-items-start lg:h-[90%] lg:grid-cols-5",
            " grid flex-row flex-wrap justify-items-center"
          )}>
          <div className="col-span-1 mx-6 flex flex-col justify-center gap-6 pb-6 md:mx-auto md:w-[90%] lg:col-span-3">
            <div className="flex w-full flex-row">
              <div className="flex h-full w-full flex-col">
                {qaList.length > 0 && (
                  <>
                    <ScrollableArea className="bg-pink/5 scrollbar-track-emphasis !scrollbar-thin scrollbar-thumb-pink h-[450px] w-full scroll-auto rounded-sm py-4">
                      {qaList.map((qa, index) => {
                        return (
                          <div
                            className="mb-6 py-2"
                            key={index}
                            ref={index === qaList.length - 1 ? answersRef : null}>
                            <div className="text-secondary mx-3 my-auto flex flex-row font-bold md:mx-6">
                              <div>
                                <UserIcon
                                  color="white"
                                  width={45}
                                  height={45}
                                  className="border-subtle bg-brand-default rounded-md border p-2"
                                />
                              </div>
                              <div className="my-auto ms-6">{qa.question}</div>
                            </div>
                            <div className="text-secondary mx-3 my-auto mt-4 flex flex-row font-medium md:mx-6">
                              <Image
                                src="/app-members/1.svg"
                                alt="expert"
                                color="white"
                                width={70}
                                height={70}
                                className="h-12 w-12 rounded-full border-2 border-white"
                              />

                              <div
                                className="my-auto ms-6 text-sm md:text-base"
                                ref={index === qaList.length - 1 ? setTarget : undefined}>
                                {qa.loading ? (
                                  <MessageLoader />
                                ) : (
                                  <span className="">
                                    <TypeAnimation
                                      sequence={[
                                        qa.answer,
                                        1000,
                                        () => {
                                          setLoading(false);
                                        },
                                      ]}
                                      wrapper="div"
                                      speed={70}
                                      cursor={false}
                                      style={{
                                        fontSize: "",
                                        display: "inline-block",
                                        whiteSpace: "pre-wrap",
                                      }}
                                      repeat={0}
                                    />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={endOfScrollArea} />
                    </ScrollableArea>
                  </>
                )}
              </div>
            </div>
            {qaList.length > 0 ? null : (
              <div className="my-6 flex-row">
                <Image src="/expert-clone-side.svg" width={415} height={71} alt="expert-clone-side" />
              </div>
            )}
            <form onSubmit={(e) => handleSearch(e)} className="relative flex w-full flex-row">
              <TextField
                onClick={() => checkIfAuthenticated()}
                onChange={(e) => changeSearchValue(e)}
                ref={searchInput}
                disabled={isLoading && searchResultFlag}
                autoComplete="off"
                // addOnLeading={<Search color="#6D278E" />}
                addOnSuffix={
                  <>
                    <Button
                      variant="icon"
                      disabled={(isLoading && searchResultFlag) || status !== "authenticated"}
                      loading={isLoading && searchResultFlag}
                      type="sumbit"
                      color="minimal"
                      className="text-secondary flex cursor-pointer justify-items-center gap-4 border-l-0 bg-transparent hover:bg-transparent">
                      {isLoading && searchResultFlag ? null : (
                        <SendIcon fill="#6D278E" className="rotate-45" />
                      )}
                    </Button>
                  </>
                }
                placeholder="Ask me anything ..."
                inputwidth="lg"
                addOnClassname=" !border-darkemphasis !text-secondary !h-[50px] !bg-transparent"
                inputMode="search"
                containerClassName="w-full"
                className="!border-darkemphasis text-secondary selection:border-secondary placeholder:text-darkemphasis !w-full !bg-transparent py-2 text-2xl"
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
              {qaList.length > 0 ? null : (
                <InfoIcon
                  color="#6D278E"
                  width={20}
                  height={20}
                  className="absolute"
                  style={{ top: "-18", right: "-18" }}
                />
              )}
            </form>
          </div>
          <div
            className={classNames(
              "col-span-1 mb-4 h-full w-full overflow-hidden md:mb-0 md:h-[95%] lg:col-span-2"
            )}>
            {/* <Image src="/expert-clone-banner.svg" width={362} height={672} alt="expert-clone-banner" /> */}
            <div className="mx-auto h-full flex-row">
              <div className="h-full w-full">
                <MicroCards />
              </div>
            </div>
          </div>
        </div>
        {windowWidth >= 1024 ? (
          <div className="mt-auto flex flex-row">
            <Footer items={footerLinks} className={classNames("md:absolute md:bottom-0")} />
          </div>
        ) : (
          !toggleSideMenuFlag && (
            <div className="mt-auto flex flex-row">
              <Footer items={footerLinks} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

ExpertClone.PageWrapper = PageWrapper;
