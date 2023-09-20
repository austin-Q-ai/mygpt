import type { Payment } from "@prisma/client";
import { useElements, useStripe, PaymentElement, Elements } from "@stripe/react-stripe-js";
import type stripejs from "@stripe/stripe-js";
import type { StripeElementLocale } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import getStripe from "@calcom/app-store/stripepayment/lib/client";
import type { StripePaymentData, StripeSetupIntentData } from "@calcom/app-store/stripepayment/lib/server";
import { CAL_URL } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui";

type Props = {
  payment: Omit<Payment, "id" | "fee" | "success" | "refunded" | "externalId" | "data"> & {
    data: StripePaymentData | StripeSetupIntentData;
  };
};

type States =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "error"; error: Error }
  | { status: "ok" };

const PaymentForm = (props: Props) => {
  const { t, i18n } = useLocale();
  const router = useRouter();
  const [state, setState] = useState<States>({ status: "idle" });
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    elements?.update({ locale: i18n.language as StripeElementLocale });
  }, [elements, i18n.language]);

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    if (!stripe || !elements || !router.isReady) return;
    setState({ status: "processing" });

    const payload = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${CAL_URL}/timetokens-wallet`,
      },
    });
  };

  return (
    <form id="payment-form" className="bg-subtle mt-4 rounded-md p-6" onSubmit={handleSubmit}>
      <div>
        <PaymentElement onChange={() => setState({ status: "idle" })} />
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <Button
          color="minimal"
          disabled={["processing", "error"].includes(state.status)}
          id="cancel"
          onClick={() => router.back()}>
          <span id="button-text">{t("cancel")}</span>
        </Button>
        <Button
          type="submit"
          disabled={["processing", "error"].includes(state.status)}
          loading={state.status === "processing"}
          id="submit"
          color="secondary">
          <span id="button-text">
            {state.status === "processing" ? <div className="spinner" id="spinner" /> : t("pay_now")}
          </span>
        </Button>
      </div>
      {state.status === "error" && (
        <div className="mt-4 text-center text-red-900 dark:text-gray-300" role="alert">
          {state.error.message}
        </div>
      )}
    </form>
  );
};

const ELEMENT_STYLES: stripejs.Appearance = {
  theme: "none",
};

const ELEMENT_STYLES_DARK: stripejs.Appearance = {
  theme: "night",
  variables: {
    colorText: "#d6d6d6",
    fontWeightNormal: "600",
    borderRadius: "6px",
    colorBackground: "#101010",
    colorPrimary: "#d6d6d6",
  },
};

export default function TokenPaymentComponent(props: Props) {
  const stripePromise = getStripe((props.payment.data as StripePaymentData).stripe_publishable_key);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const clientSecret: string | null = (props.payment.data as StripePaymentData).client_secret;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret!,
        appearance: darkMode ? ELEMENT_STYLES_DARK : ELEMENT_STYLES,
      }}>
      <PaymentForm {...props} />
    </Elements>
  );
}
