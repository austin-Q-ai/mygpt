import { debounce } from "lodash";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import React from "react";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import getBrandColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, EmailField, useCalcomTheme } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import AuthContainer from "@components/ui/AuthContainer";

export default function ForgotPassword({ csrfToken }: { csrfToken: string }) {
  const { t } = useLocale();

  const brandTheme = getBrandColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  useCalcomTheme(brandTheme);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<{ message: string } | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const router = useRouter();

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & { value: string };
    setEmail(target.value);
  };

  const submitForgotPasswordRequest = async ({ email }: { email: string }) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json);
      } else if ("resetLink" in json) {
        router.push(json.resetLink);
      } else {
        setSuccess(true);
      }

      return json;
    } catch (reason) {
      setError({ message: t("unexpected_error_try_again") });
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleSubmitPasswordRequest = debounce(submitForgotPasswordRequest, 250);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    await debouncedHandleSubmitPasswordRequest({ email });
  };

  const Success = () => {
    return (
      <div className="space-y-6 text-sm leading-normal ">
        <p className="">{t("password_reset_email", { email })}</p>
        <p className="">{t("password_reset_leading")}</p>
        {error && <p className="text-center text-red-600">{error.message}</p>}
        <Button color="secondary" className="w-full justify-center" href="/auth/login">
          {t("back_to_signin")}
        </Button>
      </div>
    );
  };

  return (
    <AuthContainer
      hideFooter
      showLogo
      title={!success ? t("forgot_password") : t("reset_link_sent")}
      heading={!success ? t("forgot_password") : t("reset_link_sent")}
      description={t("request_password_reset")}
      footerText={
        !success && (
          <>
            <Link href="/auth/login" className="text-emphasis font-medium">
              {t("back_to_signin")}
            </Link>
          </>
        )
      }>
      {success && <Success />}
      {!success && (
        <div className="my-6 md:mx-8">
          <div className="space-y-6">{error && <p className="text-red-600">{error.message}</p>}</div>
          <form className="space-y-6" onSubmit={handleSubmit} action="#">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} hidden />
            <EmailField
              onChange={handleChange}
              id="email"
              floatingLabel
              inputwidth="lg"
              name="email"
              label={t("email_address")}
              placeholder="john.doe@example.com"
              required
            />
            <div className="space-y-2">
              <Button
                className="!bg-pink w-full  justify-center p-2 text-lg !text-white"
                color="secondary"
                type="submit"
                disabled={loading}
                aria-label={t("request_password_reset")}
                loading={loading}>
                {t("request_password_reset")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AuthContainer>
  );
}

// ForgotPassword.isThemeSupported = false;
ForgotPassword.PageWrapper = PageWrapper;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const session = await getServerSession({ req, res });

  if (session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      ...(await serverSideTranslations(context.locale || "en", ["common"])),
    },
  };
};
