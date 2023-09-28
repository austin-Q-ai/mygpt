import classNames from "classnames";
import { Twitter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useGetBrandingColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, DialogContent, EmailField, PasswordField, useCalcomTheme } from "@calcom/ui";

type AuthModalProps = {
  isOpen: boolean;
  selectedTab: string;
  onExit: () => void;
};

type LoginProps = {
  onExit: () => void;
};
export function Login(props: LoginProps) {
  const { t } = useLocale();
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-subtle mb-3 flex flex-row justify-center font-medium">
        {t("sign_in_your_account_for_free")}
      </div>
      <div className="w-full  flex-row">
        <EmailField
          floatingLabel
          id="email"
          label={t("email_address")}
          // defaultValue={totpEmail || (router.query.email as string)}
          placeholder="john.doe@example.com"
          required
          // {...register("email")}
          inputwidth="lg"
        />
      </div>
      <div className=" w-full flex-row">
        <PasswordField
          floatingLabel
          label={t("password")}
          id="password"
          autoComplete="off"
          // required={!totpEmail}
          className="mb-0"
          // {...register("password")}
          inputwidth="lg"
        />
        {/* <div className="absolute -top-[2px] ltr:right-0 rtl:left-0">
                    <Link
                      href="/auth/forgot-password"
                      tabIndex={-1}
                      className="text-default text-sm font-medium">
                      {t("forgot")}
                    </Link>
                  </div> */}
      </div>
      <div className="flex-row">
        <Button
          type="submit"
          color="primary"
          // disabled={formState.isSubmitting}
          className="w-full  justify-center p-2 text-lg">
          {t("sign_in")}
          {/* {twoFactorRequired ? t("submit") : t("sign_in")} */}
        </Button>
      </div>
      <SocialLinks onExit={() => props.onExit} />
    </div>
  );
}
type FormValues = {
  username: string;
  email: string;
  password: string;
  apiError: string;
  token?: string;
};
export function Signup(props: LoginProps) {
  const { t } = useLocale();
  const methods = useForm<FormValues>();
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
  } = methods;
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-subtle mb-3 flex flex-row justify-center font-medium">
        {t("create_for_free_your_account")}
      </div>
      <div className="w-full  flex-row">
        <EmailField
          floatingLabel
          id="email"
          // defaultValue={totpEmail || (router.query.email as string)}
          placeholder="john.doe@example.com"
          required
          {...register("email")}
          inputwidth="lg"
        />
      </div>
      <div className=" w-full flex-row">
        <PasswordField
          className="border-default mb-2 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
          floatingLabel
          id="password"
          {...register("password")}
          labelProps={{
            className: "block text-sm font-medium text-default",
          }}
          hintErrors={["caplow", "min", "num"]}
          inputwidth="lg"
        />
      </div>
      <div className=" w-full flex-row">
        <PasswordField
          floatingLabel
          label={t("confirm_password")}
          id="password"
          autoComplete="off"
          className="mb-0"
          inputwidth="lg"
        />
      </div>
      <div className="flex-row">
        <Button
          type="submit"
          color="primary"
          // disabled={formState.isSubmitting}
          className="w-full  justify-center p-2 text-lg">
          {t("create_my_free_account")}
          {/* {twoFactorRequired ? t("submit") : t("sign_in")} */}
        </Button>
      </div>
      <SocialLinks onExit={() => props.onExit} />
    </div>
  );
}

export function SocialLinks(props: LoginProps) {
  const { t } = useLocale();
  return (
    <>
      <div className="flex flex-row justify-center">
        <span className="text-secondary cursor-pointer hover:underline" onClick={() => props.onExit()}>
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
          <div className="border-subtle mt-4 flex w-full flex-row justify-center rounded-md border p-6">
            {selectedTab === "sign_in" ? (
              <Login onExit={() => props.onExit} />
            ) : (
              <Signup onExit={() => props.onExit} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
