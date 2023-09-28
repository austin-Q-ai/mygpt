import { InfoIcon, LogOut, Menu, Mic, SendIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Dialog, DialogContent, DialogTrigger, HeadSeo, TextField, useCalcomTheme } from "@calcom/ui";

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
  useCalcomTheme(brandTheme);
  const session = useSession();
  const { status } = session;
  const [authModalFlag, setAuthModalFlag] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");

  const toggleAuthMadal = (flag: boolean, sign: string) => {
    console.log("open Modal");
    setAuthModalFlag(flag);
    setSelectedTab(sign);
  };
  return (
    <div className="  h-[100vh] flex-1">
      <HeadSeo title="Experts Clone" description="Experts Clone." />
      <div className="text-secondary flex flex-row justify-between px-6 py-4">
        <div className="flex flex-col">
          <Menu width={30} height={30} />
        </div>
        <div className="flex flex-col">
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
      </div>
      <div className="mb-16 grid flex-row flex-wrap justify-items-center md:grid-cols-2 md:justify-items-start">
        <div className="col-span-1 mx-16 flex flex-col justify-center gap-6">
          <div className="flex-row">
            <Image src="/expert-clone-side.svg" width={415} height={71} alt="expert-clone-side" />
          </div>
          <div className="relative flex flex-row">
            <TextField
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
            {status === "authenticated" && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="absolute h-full w-full">{null}</div>
                </DialogTrigger>
                <DialogContent
                  className="to-emphasis bg-gradient-to-b from-gray-100"
                  size="md"
                  Icon={X}
                  title={t("")}>
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-row justify-center">
                      <Image src="/robotics.webp" alt="robotics" width={200} height={200} />
                    </div>
                    <div className="my-4 flex flex-row justify-center">
                      <p className="text-secondary mx-14 text-center">
                        {t("sorry_you_cannot_engage_in_discussions")}. Please{" "}
                        <Link
                          href="#"
                          onClick={() => toggleAuthMadal(true, "sign_up")}
                          className="flex-row font-medium hover:underline">
                          {t("sign_up")}
                        </Link>{" "}
                        or{" "}
                        <Link
                          href="#"
                          onClick={() => toggleAuthMadal(true, "sign_in")}
                          className="flex-row font-medium hover:underline">
                          {t("sign_in")}
                        </Link>{" "}
                        to continue.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

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
