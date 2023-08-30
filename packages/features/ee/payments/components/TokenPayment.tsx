import type { Payment } from "@prisma/client";
import { useElements, useStripe, Elements, PaymentElement } from "@stripe/react-stripe-js";
import type stripejs from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import type { StripePaymentData, StripeSetupIntentData } from "@calcom/app-store/stripepayment/lib/server";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui";

import type { EventType } from ".prisma/client";

type Props = {
  payment: Omit<Payment, "id" | "fee" | "success" | "refunded" | "externalId" | "data"> & {
    data: StripePaymentData | StripeSetupIntentData;
  };
  eventType: { id: number; successRedirectUrl: EventType["successRedirectUrl"] };
  user: { username: string | null };
  location?: string | null;
  bookingId: number;
  bookingUid: string;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  // const paymentOption = props.payment.paymentOption;
  // const [holdAcknowledged, setHoldAcknowledged] = useState<boolean>(paymentOption === "HOLD" ? false : true);

  // useEffect(() => {
  //   elements?.update({ locale: i18n.language as StripeElementLocale });
  // }, [elements, i18n.language]);k

  const handleSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();
    if (!stripe || !elements || !router.isReady) return;
    setState({ status: "processing" });
    setErrorMessage(null);
    if (!stripe || !elements) return;
    const paymentElement = elements.getElement(PaymentElement);
    console.log("paragon here5----");

    if (!paymentElement) return;
    console.log("paragon here6----");

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: paymentElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await fetch("/api/purchase-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod?.id }),
      });
      console.log("paragon herehere----");

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      // const { tokenCount } = await response.json();

      setState({ status: "ok" });
      // onPaymentSuccess(tokenCount);
    } catch (error: any) {
      setState({ status: "error" });
      setErrorMessage(error.message);
    }
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
          {errorMessage}
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
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  // console.log("paragon stripe key1 here ----", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  // console.log(
  //   "paragon stripe key here ----",
  //   (props.payment.data as StripePaymentData).stripe_publishable_key
  // );
  // const stripePromise = getStripe((props.payment.data as StripePaymentData).stripe_publishable_key);
  // const paymentOption = props.payment.paymentOption;
  const [darkMode, setDarkMode] = useState<boolean>(false);
  let clientSecret: string | null;

  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // if (paymentOption === "HOLD" && "setupIntent" in props.payment.data) {
  //   clientSecret = props.payment.data.setupIntent.client_secret;
  // } else if (!("setupIntent" in props.payment.data)) {

  // console.log("paragon, client scret key----", clientSecret);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        // clientSecret: clientSecret!,
        appearance: darkMode ? ELEMENT_STYLES_DARK : ELEMENT_STYLES,
      }}>
      <PaymentForm {...props} />
    </Elements>
  );
}
