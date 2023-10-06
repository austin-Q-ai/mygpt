import classNames from "classnames";
import Head from "next/head";
import type { FC } from "react";
import { useEffect } from "react";

import { sdkActionManager, useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { CreditCard } from "@calcom/ui/components/icon";

import type { PaymentPageProps } from "../pages/u/payment";
import UpgradePaymentComponent from "./UpgradePayment";

const UpgradePaymentPage: FC<PaymentPageProps> = (props) => {
  const { t, i18n } = useLocale();

  const isEmbed = useIsEmbed();
  useEffect(() => {
    let embedIframeWidth = 0;
    if (isEmbed) {
      requestAnimationFrame(function fixStripeIframe() {
        // HACK: Look for stripe iframe and center position it just above the embed content
        const stripeIframeWrapper = document.querySelector(
          'iframe[src*="https://js.stripe.com/v3/authorize-with-url-inner"]'
        )?.parentElement;
        if (stripeIframeWrapper) {
          stripeIframeWrapper.style.margin = "0 auto";
          stripeIframeWrapper.style.width = embedIframeWidth + "px";
        }
        requestAnimationFrame(fixStripeIframe);
      });
      sdkActionManager?.on("__dimensionChanged", (e) => {
        embedIframeWidth = e.detail.data.iframeWidth as number;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmbed]);

  return (
    <div className="h-screen">
      <Head>
        <title>
          {t("payment")} | {APP_NAME}
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
                      {t("payment")}
                    </h3>
                    <div className="text-default mt-4 grid grid-cols-3 border-b border-t py-4 text-left dark:border-gray-900 dark:text-gray-300">
                      {/* <div className="font-medium">{t("expert")}</div>
                      <div className="col-span-2 mb-6">{props.payment.wallet?.emitter?.username}</div>
                      <div className="font-medium">{t("token_price")}</div>
                      <div className="col-span-2 mb-6">
                        {props.payment.wallet?.emitter.price[props.payment.wallet?.emitter.price.length - 1]}
                      </div>
                      <div className="font-medium">{t("token_amount")}</div>
                      <div className="col-span-2 mb-6 font-semibold">{props.payment.wallet?.amount}</div> */}
                    </div>
                  </div>
                </div>
                <div>
                  {props.payment.appId === "stripe" && !props.payment.success && (
                    <UpgradePaymentComponent payment={props.payment} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpgradePaymentPage;
