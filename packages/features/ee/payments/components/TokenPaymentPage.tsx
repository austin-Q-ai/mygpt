import classNames from "classnames";
import Head from "next/head";
import type { FC } from "react";
import { useState } from "react";

import { useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { APP_NAME } from "@calcom/lib/constants";
import getPaymentAppData from "@calcom/lib/getPaymentAppData";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { isBrowserLocale24h } from "@calcom/lib/timeFormat";
import { CreditCard } from "@calcom/ui/components/icon";
import TokenPaymentComponent from "./TokenPayment";
const user_example = {
    name: 'linPhill',
    username: 'globalstar',
    hideBranding: false,
    theme: null
  }
const props_example = {
  success: false,
  uid: "9269051d-edc0-466b-965b-eb16de818cc6",
  refunded: false,
  bookingId: 31,
  appId: "stripe",
  amount: 1000,
  currency: "usd",
  paymentOption: "ON_BOOKING",
  data: {
    id: "pi_3NiuFyAiCJmAoe1U0GkivjuL",
    amount: 1000,
    object: "payment_intent",
    review: null,
    source: null,
    status: "requires_payment_method",
    charges: [Object],
    created: 1692947794,
    invoice: null,
    currency: "usd",
    customer: "cus_OVw86A3O3Jx0Xv",
    livemode: false,
    metadata: {},
    shipping: null,
    processing: null,
    application: "ca_OVXXZQKHTKCt3Fap1ioJVOkL6fdnXgy3",
    canceled_at: null,
    description: null,
    next_action: null,
    on_behalf_of: null,
    client_secret: "pi_3NiuFyAiCJmAoe1U0GkivjuL_secret_r8eJ3YOB5SeMUtLxQAy86NO5q",
    latest_charge: null,
    receipt_email: null,
    stripeAccount: "acct_1NitPKAiCJmAoe1U",
    transfer_data: null,
    amount_details: [Object],
    capture_method: "automatic",
    payment_method: null,
    transfer_group: null,
    amount_received: 0,
    amount_capturable: 0,
    last_payment_error: null,
    setup_future_usage: null,
    cancellation_reason: null,
    confirmation_method: "automatic",
    payment_method_types: [Array],
    statement_descriptor: null,
    application_fee_amount: null,
    payment_method_options: [Object],
    stripe_publishable_key:
      "pk_test_51NitPKAiCJmAoe1UifBt6MFNyNsEkJtHudSYE8r1RJV0Gsfphxv2eSSfAOV4B4jimzZB46RRadr4nggiH6RQyzRy00Wg3qUz1I",
    automatic_payment_methods: null,
    statement_descriptor_suffix: null,
  },
};
const TokenPaymentPage: FC<PaymentPageProps> = (props) => {
  console.log("paragon here------", props)
  const expert_user = props?.expertData
  const { t, i18n } = useLocale();
  const [is24h, setIs24h] = useState(isBrowserLocale24h());
  const isEmbed = useIsEmbed();
  const paymentAppData = getPaymentAppData(props.eventType);
  const eventName = "Token Purchase";

  return (
    <div className="h-screen">
      <Head>
        <title>
          {t("payment")} | {eventName} | {APP_NAME}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-3xl py-24">
        <div className="fixed inset-0 z-50 overflow-y-auto scroll-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="inset-0 my-4 transition-opacity sm:my-0" aria-hidden="true">
              <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                &#8203;
              </span>
              <div
                className={classNames(
                  "main bg-default border-subtle inline-block transform overflow-hidden rounded-lg border px-8 pb-4 pt-5 text-left align-bottom transition-all  sm:w-full sm:max-w-lg sm:py-6 sm:align-middle",
                  isEmbed ? "" : "sm:my-8"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline">
                <div>
                  <div className="bg-success mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <CreditCard className="h-8 w-8 text-green-600" />
                  </div>

                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-emphasis text-2xl font-semibold leading-6" id="modal-headline">
                      {t("Token Purchase")}
                    </h3>
                    <div className="text-default mt-4 grid grid-cols-3 border-b border-t py-4 text-left dark:border-gray-900 dark:text-gray-300">
                      <div className="font-medium">{t("From")}</div>
                      <div className="col-span-2 mb-6">{expert_user?.name}</div>
                      <div className="font-medium">{t("Amount")}</div>
                      <div className="col-span-2 mb-6">{props.amount}</div>
                      <div className="font-medium">{t("Price")}</div>
                      <div className="col-span-2 mb-6">{expert_user?.price[expert_user?.price.length -1]}</div>
                    </div>
                  </div>
                </div>
                <TokenPaymentComponent
                  payment={props_example}
                  eventType="props.eventType"
                  user={user_example}
                  location="1"
                  bookingId="1"
                  bookingUid="1"
                />
                {/* <div>
                  {props.payment.success && !props.payment.refunded && (
                    <div className="text-default mt-4 text-center dark:text-gray-300">{t("paid")}</div>
                  )}
                  {props.payment.appId === "stripe" && !props.payment.success && (
                    <PaymentComponent
                      payment={props.payment}
                      eventType={props.eventType}
                      user={props.user}
                      location={props.booking.location}
                      bookingId={props.booking.id}
                      bookingUid={props.booking.uid}
                    />
                  )}
                  {props.payment.refunded && (
                    <div className="text-default mt-4 text-center dark:text-gray-300">{t("refunded")}</div>
                  )}
                </div>
                {!props.profile.hideBranding && (
                  <div className="text-muted dark:text-inverted mt-4 border-t pt-4 text-center text-xs dark:border-gray-900">
                    <a href={`${WEBSITE_URL}/signup`}>
                      {t("create_booking_link_with_calcom", { appName: APP_NAME })}
                    </a>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TokenPaymentPage;
