import { InfoIcon, LogOut, Menu, Mic, SendIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { HeadSeo, TextField } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import Footer from "@components/auth/Footer";
import { footerLinks } from "@components/ui/AuthContainer";

export default function ExpertClone() {
  const { t } = useLocale();
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
              // addOnLeading={<Search color="#6D278E" />}
              addOnSuffix={
                <div className="text-secondary flex justify-items-center gap-4 border-l-0">
                  <Mic /> <SendIcon fill="#6D278E" className="rotate-45" />
                </div>
              }
              placeholder="Ask me anything ..."
              inputwidth="lg"
              addOnClassname="border-pink !border-pink !text-secondary !h-[50px] !bg-transparent"
              inputMode="search"
              className="!border-pink text-secondary selection:border-pink placeholder:text-secondary/60 !bg-transparent py-2 text-2xl"
            />
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
