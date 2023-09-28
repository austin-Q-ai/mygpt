import classNames from "classnames";
import { Twitter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Dialog, DialogContent, useCalcomTheme } from "@calcom/ui";

import Login from "./Login";
import Signup from "./Singup";

type AuthModalProps = {
  isOpen: boolean;
  selectedTab: string;
  onExit: () => void;
};

type LoginProps = {
  onExit: () => void;
};
export function LoginDialog(props: LoginProps) {
  const { t } = useLocale();
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-subtle flex flex-row justify-center font-medium">
        {t("sign_in_your_account_for_free")}
      </div>
      <Login
        csrfToken={undefined}
        isGoogleLoginEnabled={false}
        isSAMLLoginEnabled={false}
        samlTenantID=""
        samlProductID=""
        totpEmail={null}
      />
      <SocialLinks onExit={() => props.onExit()} />
    </div>
  );
}

export function SignupDialog(props: LoginProps) {
  const { t } = useLocale();

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-subtle flex flex-row justify-center font-medium">
        {t("create_for_free_your_account")}
      </div>
      <Signup />
      <SocialLinks onExit={() => props.onExit()} />
    </div>
  );
}

export function SocialLinks(props: LoginProps) {
  const { t } = useLocale();
  const handleClose = () => {
    props.onExit();
  };
  return (
    <>
      <div className="flex flex-row justify-center">
        <span className="text-secondary cursor-pointer hover:underline" onClick={() => handleClose()}>
          {t("close")}
        </span>
      </div>
      <div className="text-secondary flex flex-row justify-center ">
        <span className="bg-brand-default  mx-2 my-auto h-[1px] w-16">{null}</span>
        <span className="my-auto">{t("or_login_with")}</span>
        <span className="bg-brand-default  mx-2 my-auto h-[1px] w-16">{null}</span>
      </div>
      <div className="text-secondary flex flex-row justify-center gap-5">
        <Image
          src="/app-social/google.svg"
          width={46}
          height={46}
          className="border-pink hover:bg-subtle cursor-pointer rounded-full border p-2"
          alt="gIcon"
        />
        <Twitter
          className="border-pink hover:bg-subtle cursor-pointer rounded-full border p-2"
          width={46}
          height={46}
        />
      </div>
    </>
  );
}
export default function InviteAuhtModal(props: AuthModalProps) {
  const { t } = useLocale();
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);
  const brandTheme = useGetBrandingColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  useCalcomTheme(brandTheme);
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={() => {
        props.onExit();
      }}>
      <DialogContent type="creation" title="">
        <div className="flex flex-col">
          <div className="flex w-full flex-row justify-around gap-4">
            <div className="!w-full flex-col">
              <div
                onClick={() => {
                  setSelectedTab("sign_in");
                }}
                className={classNames(
                  "border-subtle text-secondary cursor-pointer rounded-md border p-2 text-center ",
                  selectedTab === "sign_in" ? "bg-brand-default  text-white" : "hover:bg-muted"
                )}>
                {t("sign_in")}
              </div>
            </div>
            <div className="!w-full flex-col">
              <div
                onClick={() => {
                  setSelectedTab("sign_up");
                }}
                className={classNames(
                  "border-subtle text-secondary cursor-pointer rounded-md border p-2 text-center ",
                  selectedTab === "sign_up" ? "bg-brand-default  text-white" : "hover:bg-muted"
                )}>
                {t("sign_up")}
              </div>
            </div>
          </div>
          <div className="border-subtle mt-4 flex w-full flex-row justify-center rounded-md border md:p-6">
            {selectedTab === "sign_in" ? (
              <LoginDialog onExit={() => props.onExit()} />
            ) : (
              <SignupDialog onExit={() => props.onExit()} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
