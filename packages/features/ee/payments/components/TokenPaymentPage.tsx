import classNames from "classnames";
import Head from "next/head";
import type { FC } from "react";

import { useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { CreditCard } from "@calcom/ui/components/icon";

import TokenPaymentComponent from "./TokenPayment";

const user_example = {
  name: "linPhill",
  username: "globalstar",
  hideBranding: false,
  theme: null,
};

const TokenPaymentPage: FC<PaymentPageProps> = (props) => {
  const expert_user = props?.expertData;
  const { t, i18n } = useLocale();
  const isEmbed = useIsEmbed();
  const eventName = "Token Purchase";

  return (
    <div className="h-screen">
      <Head>
        <title>
          {t("payment")} | {eventName} | {APP_NAME}
        </title>
        <link rel="iy" href="/favicon.ico" />
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
                      <div className="col-span-2 mb-6">
                        {expert_user?.price[expert_user?.price.length - 1]}
                      </div>
                    </div>
                  </div>
                </div>
                <TokenPaymentComponent
                  amount={props.amount}
                  expertId={expert_user?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TokenPaymentPage;
