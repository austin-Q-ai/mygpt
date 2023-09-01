import type { Payment } from "@prisma/client";
import { useElements, useStripe, Elements, PaymentElement } from "@stripe/react-stripe-js";
import type stripejs from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import type { StripePaymentData, StripeSetupIntentData } from "@calcom/app-store/stripepayment/lib/server";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
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

const PaymentForm = (props) => {
  console.log("paragon payment---", props);
  const { t, i18n } = useLocale();
  const router = useRouter();
  const [state, setState] = useState<States>({ status: "idle" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const buyTokensMutation = trpc.viewer.timetokenswallet.buyTokens.useMutation();
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
    if (!paymentElement) return;
    let payload;
    try {
      payload = await stripe
        .confirmPayment({
          elements,
          // confirmParams: {
          //   return_url: "http://localhost:3000/timetokens-wallet",
          // },
          redirect: "if_required",
        })
        .then(async (result) => {
          if (result.error) {
            throw new Error("Failed to process payment");
          }
          console.log("paragon herehere22----", props.expertId, props.amount);

          await buyTokensMutation.mutate({ emitterId: props.expertId, amount: parseInt(props.amount) });
          setState({ status: "ok" });
          if (props?.renderUrl) router.push(props.renderUrl);
          else props.setModalVisible(false);
          // onPaymentSuccess(tokenCount);
        });
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
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/purchase-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: props.amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });
  }, []);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  if (clientSecret != "")
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
  else return <></>;
}
