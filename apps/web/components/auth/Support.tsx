import {
  HomeIcon,
  X,
  MessageSquare,
  ChevronLeft,
  Clock,
  ImagePlus,
  Smile,
  Paperclip,
  Mic,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import useOnclickOutside from "@calcom/lib/hooks/useOnclickOutside";
import { Button, InputField, ScrollableArea } from "@calcom/ui";

interface ISupport {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username?: string;
  className?: string;
}

interface IMessage {
  isMine: boolean;
  content: string;
}

const GPT_ICON = (
  <div className="flex h-8 w-8 flex-col items-center justify-center rounded-full bg-gradient-to-r from-[#FEDF17] to-[#F83719] text-center text-[8px] font-bold leading-[10px] text-white">
    My GPT
  </div>
);

const Support = ({ isOpen, setIsOpen, username, className }: ISupport) => {
  const [isHome, setIsHome] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState("");

  const [messages, setMessages] = useState<IMessage[]>([
    {
      isMine: false,
      content: "Hello! How can I assist you today?",
    },
  ]);
  const [gptResponse, setGPTResponse] = useState("");

  const getResponseFromGPT = (msg: string) => {
    // reply from gpt, this is a just static example
    setTimeout(() => {
      setGPTResponse(`Hi, ${username} 👋.This is reply to "${msg}" from MyGPT.`);
    }, 2000);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    setMessages([...messages, { isMine: true, content: typing }]);
    getResponseFromGPT(typing);
    setTyping("");
  };

  useEffect(() => {
    if (gptResponse) setMessages([...messages, { isMine: false, content: gptResponse }]);
  }, [gptResponse]);

  useEffect(() => {
    if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useOnclickOutside(ref, () => {
    setIsOpen(false);
  });

  return (
    <div
      ref={ref}
      className={`${className} ${
        isOpen ? "" : "hidden"
      } h-[591.2px] w-[400px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_5px_40px_0_rgba(0,0,0,0.16)]`}>
      {isHome ? (
        <>
          <div className="flex h-[314px] w-full shrink-0 flex-col items-start gap-[50px] bg-[#AF8AC2] px-9 py-8">
            <div className="flex items-center justify-between h-8 shrink-0">
              <div className="flex flex-col items-start pt-1 pr-8">
                <p
                  className="leading-7.5 bg-gradient-to-r from-[#FEDF17] to-[#F83719] bg-clip-text text-[33px] font-bold "
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  MyGPT
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch text-[32px] font-bold leading-[38px] text-white">
              <h1 className="flex flex-col items-start pr-0">Hi {username} 👋</h1>
              <h1 className="flex flex-col items-start pr-0">How can we help?</h1>
            </div>
          </div>
          <div className="inline-flex flex-col items-start w-full px-4 -translate-y-1/2">
            <Button
              className="flex h-fit flex-col items-start self-stretch rounded-[10px] bg-white p-0 text-left text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shadow-[0_2px_8px_0px_rgba(0,0,0,0.06)] hover:bg-slate-200"
              onClick={() => setIsHome(false)}>
              <div className="flex items-center px-5 py-4">
                <div className="flex flex-col items-start">
                  <p className="flex flex-col items-start self-stretch pr-0 text-[14px] font-bold leading-[21px] text-[#333]">
                    Send us a message
                  </p>
                  <p className="flex flex-col items-start self-stretch pr-0 text-[12px] leading-[21px] text-[#737373]">
                    Mygpt support is an AI bot, please ask your question
                  </p>
                </div>
                <div className="flex flex-col items-start pl-0">
                  <div className="flex items-center min-w-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="17"
                      viewBox="0 0 18 17"
                      fill="none">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.06299 14.705L14.419 9.30301C15.419 8.72601 15.419 7.28301 14.419 6.70501L5.06299 1.30301C4.83489 1.17132 4.57613 1.10201 4.31275 1.10205C4.04936 1.10209 3.79063 1.17149 3.56257 1.30325C3.33451 1.43502 3.14517 1.62451 3.01359 1.85268C2.88201 2.08084 2.81282 2.33963 2.81299 2.60301V13.406C2.81282 13.6694 2.88201 13.9282 3.01359 14.1564C3.14517 14.3845 3.33451 14.574 3.56257 14.7058C3.79063 14.8375 4.04936 14.9069 4.31275 14.907C4.57613 14.907 4.83489 14.8377 5.06299 14.706V14.705ZM7.00999 8.48701L2.81299 9.61201V6.39701L7.00999 7.52001C7.50399 7.65301 7.50399 8.35401 7.00999 8.48601V8.48701Z"
                        fill="#B705A5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Button>
          </div>
          <div className="border-[rgba(0, 0, 0, 0.05)] absolute bottom-0 flex h-[80px] w-full shrink-0 items-start justify-between border-t-[0.8px] border-solid text-center text-[14px] font-bold leading-[14px] shadow-[0_0_25px_0_rgba(0,0,0,0.05)]">
            <div
              className=" flex w-1/3 shrink-0 cursor-pointer flex-col items-center justify-between self-stretch px-[3px] pb-[16px] pt-[18px]"
              onClick={() => setIsHome(true)}>
              <HomeIcon width="24px" height="24px" />
              <p>Home</p>
            </div>
            <div
              className="flex w-1/3 shrink-0 cursor-pointer flex-col items-center justify-between self-stretch px-[3px] pb-[16px] pt-[18px]"
              onClick={() => setIsHome(false)}>
              <MessageSquare width="24px" height="24px" />
              <p>Messages</p>
            </div>
            <div
              className="flex w-1/3 shrink-0 cursor-pointer flex-col items-center justify-between self-stretch px-[3px] pb-[16px] pt-[18px]"
              onClick={() => setIsOpen(false)}>
              <X width="24px" height="24px" />
              <p>Close</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-12 self-strech flex w-full items-center justify-between bg-[#AF8AC2] p-2">
            <Button variant="icon" className="bg-transparent" onClick={() => setIsHome(true)}>
              <ChevronLeft />
            </Button>
            <div className="flex flex-shrink-0 flex-grow items-center gap-3 px-[6px] py-[6.5px]">
              {GPT_ICON}
              <div className="flex flex-shrink-0 flex-grow flex-col items-start justify-center gap-[3px] pr-0 text-white">
                <p className="text-[16px] font-bold leading-4">My GPT</p>
                <p className="flex gap-1 text-[14px] leading-[14px] text-white/70">
                  <Clock width="16px" height="16px" />
                  <span>Within 2H</span>
                </p>
              </div>
            </div>
          </div>
          <ScrollableArea className="mt-2 inline-flex h-[420px] w-full flex-col gap-4 overflow-x-hidden  px-2 pt-6 text-[14px] leading-5">
            {messages.map((message, key) =>
              message.isMine ? (
                <div className="flex justify-end" key={key}>
                  <p className="max-w-[80%] rounded-[10px] bg-[rgba(109,39,142,0.05)] px-5 py-4 text-[#6D278E]">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="flex justify-start" key={key}>
                  <div className="flex max-w-[80%] gap-[10px]">
                    <div className="flex flex-col justify-end">{GPT_ICON}</div>
                    <p className="flex-1 rounded-[10px] bg-[rgba(109,39,142,0.05)] px-5 py-4 text-black">
                      {message.content}
                    </p>
                  </div>
                </div>
              )
            )}
            <div ref={messageEndRef} />
          </ScrollableArea>
          <div className="border-[rgba(0, 0, 0, 0.05)] absolute bottom-0 flex h-[56.8px] w-full shrink-0 items-center border-t-[0.8px] border-solid">
            <InputField
              placeholder="Write a reply..."
              className="border-transparent hover:border-transparent focus:border-transparent focus:ring-0"
              value={typing}
              onChange={(ev) => setTyping(ev.target.value)}
              onKeyUp={handleEnter}
            />
            <div className="inline-flex items-start shrink-0">
              <Button variant="icon" className="bg-transparent hover:bg-slate-300">
                <ImagePlus width="17px" height="17px" color="#757575" />
              </Button>
              <Button variant="icon" className="bg-transparent hover:bg-slate-300">
                <Smile width="17px" height="17px" color="#757575" />
              </Button>
              <Button variant="icon" className="bg-transparent hover:bg-slate-300">
                <Paperclip width="17px" height="17px" color="#757575" />
              </Button>
              <Button variant="icon" className="bg-transparent hover:bg-slate-300">
                <Mic width="17px" height="17px" color="#757575" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Support;
