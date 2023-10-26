// Please replace ${user?.apiKey} with ${user?.apiKey}
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
import SecondsCounter from "pages/expert-clone/components/SecondsCounter";
import VoiceUploader from "pages/expert-clone/components/VoiceUploader";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Typist from "react-typist";
import { v4 } from "uuid";
import { z } from "zod";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useTypedQuery } from "@calcom/lib/hooks/useTypedQuery";
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

import AudioPlayer from "./components/AudioPlayer";
import AuthModal from "./components/AuthModal";

export function DialogContentDiv(props: JSX.IntrinsicElements["div"]) {
  <span>{props.children}</span>;
}
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useSize = (target: any) => {
  const [size, setSize] = useState();

  useIsomorphicLayoutEffect(() => {
    target && setSize(target.getBoundingClientRect().height);
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry: any) => setSize(entry.contentRect));
  return size;
};
const querySchema = z.object({
  expert: z.string().optional(),
});

const DurationShow = ({ counter }: { counter: number }) => {
  const timer = counter * 100;
  const seconds = Math.floor(timer / 100);
  const milliseconds = Math.floor(timer % 100);
  return (
    <div className="items-center w-8 mt-3 font-bold text-md text-secondary">
      {seconds < 10 ? "0" + seconds : seconds}:{milliseconds < 10 ? "0" + milliseconds : milliseconds}
    </div>
  );
};

export default function ExpertClone() {
  const {
    data: { expert },
  } = useTypedQuery(querySchema);
  const val = expert !== undefined ? expert : "";
  const { data: user } = trpc.viewer.expert.user.useQuery({ username: val });
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
    user_message: string;
    chat_id?: string;
    assistant: string;
    brain_id?: string;
    loading?: boolean;
    message_id?: string;
    message_time?: string;
    type?: string;
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
  const [noLoadingEdit, setNoLoadingEdit] = useState("");
  const [voice, setVoice] = useState<string>("");
  const [voiceDuration, setVoiceDuration] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const size = useSize(target);

  useEffect(() => {
    console.log("voice has been recorded", voice);
    const audio = new Audio();
    audio.src = voice;
    audio.addEventListener("loadedmetadata", function () {
      setVoiceDuration(audio.duration);
    });
    audio.load();
    return () => {
      audio.removeEventListener("loadedmetadata", function () {
        console.log("Duration:", audio.duration); // seconds
      });
    };
  }, [voice]);

  useEffect(() => {
    endOfScrollArea?.current?.scrollIntoView({ behavior: "smooth" });
  }, [size]);
  const toggleAuthMadal = (flag: boolean, sign: string) => {
    setAuthModalFlag(flag);
    setSelectedTab(sign);
  };

  const formatText = (yourText: string) => {
    return yourText
      .split("**")
      .map((segment, index) => (index % 2 === 0 ? segment : <strong key={index}>{segment}</strong>));
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

  const handleChat = (chatId: string) => {
    setNoLoadingEdit("");
    setQaList([
      ...qaList,
      {
        user_message: searchText,
        chat_id: currentChatId,
        assistant: "",
        loading: true,
        brain_id: "",
        message_id: "",
        message_time: "",
      },
    ]);

    if (searchInput.current) {
      searchInput.current.value = "";
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/chat/${chatId}/question`,
        {
          question: searchText,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.apiKey}`,
            "Content-Type": "application/json",
          },
          // actually expertId is array of brains
          params: { brain_id: user?.expertId },
        }
      )
      .then((data) => {
        setSearchText("");
        if (searchInput.current) {
          searchInput.current.value = "";
        }
        setNoLoadingEdit(data.data.message_id);

        data.data.chat_id
          ? setQaList([
              ...qaList,
              {
                user_message: data.data.user_message,
                chat_id: data.data.chat_id,
                assistant: data.data.assistant,
                loading: false,
                brain_id: data.data.brain_id,
                message_id: data.data.message_id,
                message_time: data.data.message_time,
              },
            ])
          : null;
        setHistoryEdit("");
      });
  };

  const handleChatHistory = (chatId: string) => {
    if (searchInput.current) {
      searchInput.current.value = "";
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/chat/${chatId}/history`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`, // ${user?.apiKey}`,

          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        setSearchText("");
        if (searchInput.current) {
          searchInput.current.value = "";
        }
        const response = [...data.data].map((item) => {
          item.loading = false;
          return item;
        });
        console.log(response);
        setQaList(response);
        setHistoryEdit("");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchWithVoice = () => {
    console.log("handleSearchWithVoice", voice);
    setNoLoadingEdit("");
    setQaList([
      ...qaList,
      {
        user_message: voice,
        chat_id: currentChatId,
        assistant: "",
        loading: true,
        brain_id: "",
        message_id: "",
        message_time: "",
        type: "voice",
      },
    ]);
    const response = {
      user_message: voice,
      chat_id: "1",
      assistant: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
      brain_id: "20",
      message_id: v4(),
      message_time: "",
    };
    setVoice("");
    setIsLoading(true);
    setSearchResultFlag(true);
    setTimeout(() => {
      setQaList([
        ...qaList,
        {
          user_message: response.user_message,
          chat_id: response.chat_id,
          assistant: response.assistant,
          loading: false,
          brain_id: response.brain_id,
          message_id: response.message_id,
          message_time: response.message_time,
          type: "voice",
        },
      ]);
      setIsLoading(false);
      setSearchResultFlag(false);
    }, 2000);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (voice) {
      handleSearchWithVoice();
    } else {
      if (searchText && searchText.length > 0) {
        setSearchResultFlag(true);
        setIsLoading(true);
      } else {
        return;
      }
      if (currentChatId === "") {
        // if not started new chat, create new chat
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/chat`,
            {
              name: searchText.split(" ").slice(0, 3).join(" "),
            },
            {
              headers: {
                Authorization: `Bearer ${user?.apiKey}`,
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
    }
  };

  // get chat history

  const getChatHistory = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/chat`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
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
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // delete chat history using chat_id
  const deleteChatHistory = (chatId: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
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
    console.log(answersRef.current);
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
    setNoLoadingEdit("none");
    setHistoryEdit(item.chat_id);
    setCurrentChatId(item.chat_id);
    setLoading(true);
    setToggleSideMenu(false);
    setQaList([]);
    // handleChat(item.chat_id, true);
    handleChatHistory(item.chat_id);
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
    <div className="to-darkemphasis bg-gradient-to-b from-gray-100">
      <div className="h-fit flex-1 bg-[url('/imgpsh_fullsize_anim.png')] bg-cover bg-no-repeat lg:h-[100vh]">
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

            <div className="flex flex-row justify-center mb-8">
              <Image src="/expert-clone-side.svg" alt="" width={270} height={60} />
            </div>

            <div
              className={classNames(
                "text-secondary flex flex-row p-4 text-xl font-medium",
                status !== "authenticated" && "hidden"
              )}>
              <div className="flex flex-col w-full ">
                <div className="flex flex-row justify-start ms-3">HISTORY</div>
                <ScrollableArea className="mt-6 flex h-[450px] w-full flex-row">
                  <div className="flex flex-col w-full">
                    {qaHistory.length > 0 ? (
                      qaHistory.map((qa, index) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-row justify-between px-3 py-2 mb-2 rounded-md bg-emphasis ms-3">
                            <div className="flex flex-col my-auto">
                              <div className="flex flex-row">
                                <div className="flex-col my-auto">
                                  <MessageCircle />
                                </div>
                                <div className="flex-col w-fit">
                                  <span className="text-sm truncate ms-2 h-fit">
                                    {qa.chat_name.substring(0, windowWidth >= 800 ? 30 : 20)}{" "}
                                    {qa.chat_name.length > (windowWidth >= 800 ? 30 : 20) ? "..." : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex flex-row justify-center gap-2 my-auto">
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
                      <div className="flex flex-row justify-between px-3 py-2 my-4 rounded-md text-muted ms-3">
                        No History
                      </div>
                    )}
                  </div>
                </ScrollableArea>
              </div>
            </div>

            <div className="absolute bottom-0 flex flex-row justify-center w-full py-4">
              <div className="flex flex-col w-full m-4 md:mx-8">
                <div
                  className={classNames(
                    "text-secondary mb-6 flex flex-row justify-center",
                    status === "authenticated" && "hidden"
                  )}>
                  <div
                    className="flex flex-row gap-1 cursor-pointer text-secondary "
                    onClick={() => toggleAuthMadal(true, "sign_in")}>
                    <LogOut className="flex-col w-8 h-12" />
                    <div className="flex flex-col">
                      <div className="flex-row text-md">{t("sign_in")}</div>
                      <div className="flex-row text-md">{t("sign_up")}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-around md:mx-8">
                  {socialLinks.map((item, index) => {
                    return (
                      <div className="" key={index}>
                        <Link
                          className="flex flex-col fill-pink justify-items-center"
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
                    className="flex flex-row gap-1 cursor-pointer text-secondary "
                    onClick={() => signOut({ callbackUrl: "/auth/logout" })}>
                    <LogOut className="flex-col w-8 h-12" />
                    <div className="flex flex-col justify-center text-md">{t("sign_out")}</div>
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
              className="flex flex-row gap-1 cursor-pointer"
              onClick={() => toggleAuthMadal(true, "sign_in")}>
              <LogOut className="flex-col w-6 h-8" />
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
                <DropdownMenuLabel className="p-2 font-medium text-center">
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
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full h-full">
                {qaList.length > 0 && (
                  <>
                    <ScrollableArea className="bg-pink/5 scrollbar-track-emphasis !scrollbar-thin scrollbar-thumb-pink h-[450px] w-full scroll-auto rounded-sm py-4">
                      {qaList.map((qa, index) => {
                        return (
                          <div
                            className="py-2 mb-6"
                            key={qa.message_id}
                            ref={index === qaList.length - 1 ? answersRef : null}>
                            <div className="text-secondary mx-3 my-auto flex w-[90%] flex-row font-bold md:mx-6">
                              <div>
                                <UserIcon
                                  color="white"
                                  width={45}
                                  height={45}
                                  className="p-2 border rounded-md border-subtle bg-brand-default"
                                />
                              </div>
                              <div className="w-full my-auto ms-6">
                                {qa.type === "voice" ? (
                                  <div className="w-full">
                                    <AudioPlayer blobUrl={qa.user_message} />
                                  </div>
                                ) : (
                                  qa.user_message
                                )}
                              </div>
                            </div>
                            <div className="flex flex-row mx-3 my-auto mt-4 font-medium text-secondary md:mx-6">
                              <Image
                                src="/app-members/1.svg"
                                alt="expert"
                                color="white"
                                width={70}
                                height={70}
                                className="w-12 h-12 border-2 border-white rounded-full"
                              />

                              <div
                                className="my-auto text-sm ms-6 md:text-base"
                                ref={index === qaList.length - 1 ? setTarget : undefined}>
                                {qa.loading ? (
                                  <MessageLoader />
                                ) : noLoadingEdit !== qa.message_id ? (
                                  <span
                                    style={{
                                      fontSize: "",
                                      display: "inline-block",
                                      whiteSpace: "pre-wrap",
                                    }}>
                                    {qa.type === "voice" ? (
                                      <ReactPlayer url={qa.assistant} />
                                    ) : (
                                      formatText(qa.assistant)
                                    )}
                                  </span>
                                ) : (
                                  <Typist
                                    onTypingDone={() => {
                                      setLoading(false);
                                    }}
                                    stdTypingDelay={25}
                                    cursor={{
                                      show: false,
                                      blink: true,
                                      hideWhenDone: true,
                                      hideWhenDoneDelay: 0,
                                    }}>
                                    <span
                                      style={{
                                        fontSize: "",
                                        display: "inline-block",
                                        whiteSpace: "pre-wrap",
                                      }}>
                                      {formatText(qa.assistant)}
                                    </span>
                                  </Typist>
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
              <div className="flex-row my-6">
                <Image src="/expert-clone-side.svg" width={415} height={71} alt="expert-clone-side" />
              </div>
            )}
            <form onSubmit={(e) => handleSearch(e)} className="relative flex flex-row w-full">
              <TextField
                onClick={() => checkIfAuthenticated()}
                onChange={(e) => changeSearchValue(e)}
                ref={searchInput}
                disabled={isLoading && searchResultFlag}
                autoComplete="off"
                addOnLeading={
                  isRecording ? <SecondsCounter /> : voice ? <DurationShow counter={voiceDuration} /> : ""
                }
                addOnSuffix={
                  <>
                    <Button
                      variant="icon"
                      disabled={(isLoading && searchResultFlag) || status !== "authenticated"}
                      loading={isLoading && searchResultFlag}
                      type="sumbit"
                      color="minimal"
                      className="flex gap-4 bg-transparent border-l-0 cursor-pointer text-secondary justify-items-center hover:bg-transparent">
                      {isLoading && searchResultFlag ? null : (
                        <SendIcon fill="#6D278E" className="rotate-45" />
                      )}
                    </Button>
                  </>
                }
                placeholder={isRecording || voice ? "" : "Ask me anything ..."}
                inputwidth="lg"
                addOnClassname=" !border-darkemphasis !text-secondary !h-[50px] !bg-transparent"
                inputMode="search"
                containerClassName="w-full"
                className="!border-darkemphasis text-secondary selection:border-secondary placeholder:text-darkemphasis !w-full !bg-transparent py-2 text-2xl"
              />
              {voice ? (
                <div className="absolute left-20 top-0 my-auto flex h-[93%] w-[80%] items-center">
                  <div className="w-full">
                    <AudioPlayer blobUrl={voice} />
                  </div>
                </div>
              ) : null}

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
              <VoiceUploader setVoice={setVoice} setIsRecordingFlag={setIsRecording} />
            </form>
          </div>
          <div
            className={classNames(
              "col-span-1 mb-4 h-full w-full overflow-hidden md:mb-0 md:h-[95%] lg:col-span-2"
            )}>
            {/* <Image src="/expert-clone-banner.svg" width={362} height={672} alt="expert-clone-banner" /> */}
            <div className="flex-row h-full mx-auto">
              <div className="w-full h-full">
                <MicroCards userId={user?.id} />
              </div>
            </div>
          </div>
        </div>
        {windowWidth >= 1024 ? (
          <div className="flex flex-row mt-auto">
            <Footer items={footerLinks} className={classNames("md:absolute md:bottom-0")} />
          </div>
        ) : (
          !toggleSideMenuFlag && (
            <div className="flex flex-row mt-auto">
              <Footer items={footerLinks} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

ExpertClone.PageWrapper = PageWrapper;
