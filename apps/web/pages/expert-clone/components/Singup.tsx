import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { checkPremiumUsername } from "@calcom/features/ee/common/lib/checkPremiumUsername";
import { getOrgFullDomain } from "@calcom/features/ee/organizations/lib/orgDomains";
import { isSAMLLoginEnabled } from "@calcom/features/ee/sso/lib/saml";
import { useFlagMap } from "@calcom/features/flags/context/provider";
import { getFeatureFlagMap } from "@calcom/features/flags/server/utils";
import { IS_SELF_HOSTED, WEBAPP_URL } from "@calcom/lib/constants";
import getBrandColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { collectPageParameters, telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { teamMetadataSchema } from "@calcom/prisma/zod-utils";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";
import { Alert, Button, EmailField, PasswordField, TextField, useCalcomTheme } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

import { IS_GOOGLE_LOGIN_ENABLED } from "../../../server/lib/constants";
import { ssrInit } from "../../../server/lib/ssr";

type FormValues = {
  username: string;
  email: string;
  password: string;
  apiError: string;
  token?: string;
};

type SignupProps = inferSSRProps<typeof getServerSideProps>;

export default function Signup({ prepopulateFormValues, token, orgSlug }: SignupProps) {
  const { t, i18n } = useLocale();

  const brandTheme = getBrandColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  useCalcomTheme(brandTheme);

  const router = useRouter();
  const flags = useFlagMap();
  const telemetry = useTelemetry();
  const methods = useForm<FormValues>({
    defaultValues: prepopulateFormValues,
  });
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
  } = methods;
  const handleErrors = async (resp: Response) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
  };

  const signUp: SubmitHandler<FormValues> = async (data) => {
    await fetch("/api/auth/signup", {
      body: JSON.stringify({
        ...data,
        language: i18n.language,
        token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(handleErrors)
      .then(async () => {
        telemetry.event(telemetryEventTypes.signup, collectPageParameters());
        const verifyOrGettingStarted = flags["email-verification"] ? "auth/verify-email" : "getting-started";
        await signIn<"credentials">("credentials", {
          ...data,
          callbackUrl: router.query.callbackUrl
            ? `${WEBAPP_URL}/${router.query.callbackUrl}`
            : `${WEBAPP_URL}/${verifyOrGettingStarted}`,
        });
      })
      .catch((err) => {
        methods.setError("apiError", { message: err.message });
      });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (methods.formState?.errors?.apiError) {
              methods.clearErrors("apiError");
            }
            methods.handleSubmit(signUp)(event);
          }}
          className="space-y-6">
          {errors.apiError && <Alert severity="error" message={errors.apiError?.message} />}
          <div className="flex w-full flex-row gap-4">
            <div className="flex w-full flex-col">
              <div className="w-full  flex-row py-2">
                <TextField
                  floatingLabel
                  inputwidth="lg"
                  addOnClassname="!h-[50px] !bg-white"
                  addOnSuffix={
                    orgSlug ? (
                      getOrgFullDomain(orgSlug, { protocol: false })
                    ) : (
                      <div className="text-secondary font-sans font-bold">.myGPT.fi</div>
                    )
                  }
                  {...register("username")}
                  required
                />
              </div>
              <div className="w-full  flex-row py-2">
                <EmailField
                  floatingLabel
                  inputwidth="lg"
                  {...register("email")}
                  disabled={prepopulateFormValues?.email}
                  className="disabled:bg-emphasis disabled:hover:cursor-not-allowed"
                />
              </div>
              <div className="mb-2  w-full flex-row py-2">
                <PasswordField
                  floatingLabel
                  inputwidth="lg"
                  labelProps={{
                    className: "block text-sm font-medium text-default",
                  }}
                  {...register("password")}
                  hintErrors={["caplow", "min", "num"]}
                  className="border-default mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
                />
              </div>
              <div className="flex rtl:space-x-reverse">
                <Button type="submit" loading={isSubmitting} className="w-full justify-center">
                  {t("create_account")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const prisma = await import("@calcom/prisma").then((mod) => mod.default);
  const flags = await getFeatureFlagMap(prisma);
  const ssr = await ssrInit(ctx);
  const token = z.string().optional().parse(ctx.query.token);

  const props = {
    isGoogleLoginEnabled: IS_GOOGLE_LOGIN_ENABLED,
    isSAMLLoginEnabled,
    trpcState: ssr.dehydrate(),
    prepopulateFormValues: undefined,
  };

  if (process.env.NEXT_PUBLIC_DISABLE_SIGNUP === "true" || flags["disable-signup"]) {
    console.log({ flag: flags["disable-signup"] });

    return {
      notFound: true,
    };
  }

  // no token given, treat as a normal signup without verification token
  if (!token) {
    return {
      props: JSON.parse(JSON.stringify(props)),
    };
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return {
      notFound: true,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      AND: [
        {
          email: verificationToken?.identifier,
        },
        {
          emailVerified: {
            not: null,
          },
        },
      ],
    },
  });

  if (existingUser) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login?callbackUrl=" + `${WEBAPP_URL}/${ctx.query.callbackUrl}`,
      },
    };
  }

  const guessUsernameFromEmail = (email: string) => {
    const [username] = email.split("@");
    return username;
  };

  let username = guessUsernameFromEmail(verificationToken.identifier);

  const orgInfo = await prisma.user.findFirst({
    where: {
      email: verificationToken?.identifier,
    },
    select: {
      organization: {
        select: {
          slug: true,
          metadata: true,
        },
      },
    },
  });

  const userOrgMetadata = teamMetadataSchema.parse(orgInfo?.organization?.metadata ?? {});

  if (!IS_SELF_HOSTED) {
    // Im not sure we actually hit this because of next redirects signup to website repo - but just in case this is pretty cool :)
    const { available, suggestion } = await checkPremiumUsername(username);

    username = available ? username : suggestion || username;
  }

  return {
    props: {
      ...props,
      token,
      prepopulateFormValues: {
        email: verificationToken.identifier,
        username,
      },
      orgSlug: (orgInfo?.organization?.slug || userOrgMetadata?.requestedSlug) ?? null,
    },
  };
};

// Signup.isThemeSupported = false;
Signup.PageWrapper = PageWrapper;
