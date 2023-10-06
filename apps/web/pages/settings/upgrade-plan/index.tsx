import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useState } from "react";

import { createUpgradePaymentLink } from "@calcom/app-store/stripepayment/lib/client";
import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { upgradePlan } from "@calcom/features/upgrade-plan";
import { classNames } from "@calcom/lib";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { UserLevel } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import {
  Meta,
  ScrollableArea,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonContainer,
  SkeletonText,
  Button,
  ConfirmationDialogContent,
  Dialog,
} from "@calcom/ui";
import { Check, ArrowRight } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface SubscriptionCardProps {
  isCurrent: boolean;
  advantageList: string[];
  price: string;
  isDisabled?: boolean;
  handleUpgrade: () => void;
}

interface SubscriptionDataType {
  advantageList: string[];
  price: string;
  level: UserLevel;
}

const data: SubscriptionDataType[] = [
  {
    advantageList: [
      "basic_feature_access",
      "500_messages/month_limit",
      "email_support_with_a_response_within_48h",
      "data_storage_limited_to_1_gb",
      "one_active_user_online",
    ],
    price: "freemium",
    level: UserLevel.FREEMIUM,
  },
  {
    advantageList: [
      "access_to_advanced_features",
      "5000_messages/month_limit",
      "email_support_with_a_response_within_24h",
      "data_storage_up_to_10_gb",
      "two_active_users_online",
    ],
    price: "29 €/month",
    level: UserLevel.LEVEL1,
  },
  {
    advantageList: [
      "access_to_all_premium_features",
      "20000_messages/month_limit",
      "priority_support_by_email_and_chat",
      "data_storage_up_to_50_gb",
      "ten_active_users_online",
      "access_to_detailed_analysis_and_reports",
    ],
    price: "59 €/month",
    level: UserLevel.LEVEL2,
  },
  {
    advantageList: [
      "unlimited_access_to_all_features",
      "100000_messages/month_limit",
      "24/7_priority_support",
      "unlimited_data_storage",
      "twenty_five_active_users_online",
    ],
    price: "99 €/month",
    level: UserLevel.LEVEL3,
  },
  {
    advantageList: [
      "customized_message_volume",
      "customized_data_storage",
      "customized_number_of_active_bots",
      "specific_integrations_or_custom_developments",
      "Access to customized detailed analysis and reports",
    ],
    price: "contact_us",
    level: UserLevel.CUSTOM,
  },
];

const SkeletonLoader = ({ title, description }: { title: string; description: string }) => {
  return (
    <SkeletonContainer>
      <Meta title={title} description={description} />
      <div className="mb-8 space-y-6">
        <div className="flex items-center">
          <SkeletonAvatar className="me-4 mt-0 h-16 w-16 px-4" />
          <SkeletonButton className="h-6 w-32 rounded-md p-5" />
        </div>
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />

        <SkeletonButton className="mr-6 h-8 w-20 rounded-md p-5" />
      </div>
    </SkeletonContainer>
  );
};

const SubscriptionCard = (props: SubscriptionCardProps) => {
  const { t } = useLocale();
  return (
    <div className="flex flex-col">
      <div className="text-pink h-10 pb-16 text-center text-xl font-bold">
        {props.isCurrent ? t("your_currently_plan") : ""}
      </div>
      <div
        className={classNames(
          "border-pink flex h-full flex-col justify-between gap-10 rounded-3xl border px-8 pb-16 pt-12",
          props.isCurrent ? "bg-pink/10" : "bg-white"
        )}>
        <div className="flex h-2/3 flex-col">
          <div className="flex flex-col gap-4">
            {props.advantageList.map((item, key) => (
              <div className="flex items-center" key={key}>
                <div className="h-5 w-5">
                  <Check className="bg-pink h-5 w-5 rounded-full p-1 text-white" />
                </div>
                <p className="pl-2 text-xs">{t(item)}</p>
              </div>
            ))}
          </div>

          <div className="text-pink mt-auto pt-10 text-center text-xl font-bold">{t(props.price)}</div>
        </div>
        <div className={classNames("text-gray", props.isCurrent ? "hidden" : "flex flex-col")}>
          <p className="pb-10 text-center text-xs lg:pb-20">
            {t("read_and_accept_the")}{" "}
            <Link className="underline" href="/">
              {t("terms_and_conditions")}
            </Link>
          </p>
          <Button
            className="mt-auto flex w-full justify-center"
            disabled={props?.isDisabled}
            onClick={() => props.handleUpgrade()}>
            {t("upgrade")}
            <ArrowRight className="ml-2 h-4 w-4 self-center" aria-hidden="true" />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionView = () => {
  const { t } = useLocale();
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();

  const [upgradeConfirmOpen, setUpgradeConfirmOpen] = useState<boolean>(false);
  const [upgradeLevel, setUpgradeLevel] = useState<UserLevel>(UserLevel.FREEMIUM);

  // const mutation = trpc.viewer.updateProfile.useMutation({
  //   onSuccess: () => {
  //     showToast(t("settings_updated_successfully"), "success");
  //     utils.viewer.me.invalidate();
  //     utils.viewer.avatar.invalidate();
  //   },
  //   onError: () => {
  //     showToast(t("error_updating_settings"), "error");
  //   },
  // });

  const upgradeMutation = useMutation(upgradePlan, {
    onSuccess: async (responseData) => {
      const { paymentUid } = responseData;
      if (paymentUid) {
        return await router.push(
          createUpgradePaymentLink({
            paymentUid,
          })
        );
      }
    },
  });

  if (isLoading || !user)
    return (
      <SkeletonLoader title={t("profile")} description={t("profile_description", { appName: APP_NAME })} />
    );

  const handleUpgrade = (level: UserLevel) => {
    setUpgradeLevel(level);
    setUpgradeConfirmOpen(true);
  };

  return (
    <div className="flex flex-row">
      <div className="flex-1 ">
        <Meta
          title={t("your_subscription")}
          description={t("subscription_description", { appName: APP_NAME })}
        />
        <ScrollableArea className="grid grid-cols-1 gap-4 md:h-[100vh] md:grid-cols-2 lg:grid-cols-3 2xl:h-[70vh] 2xl:grid-cols-5">
          {data.map((e, key) => (
            <SubscriptionCard
              isCurrent={e.level === user.level}
              advantageList={e.advantageList}
              price={e.price}
              key={key}
              isDisabled={
                Object.keys(UserLevel).indexOf(e.level) < Object.keys(UserLevel).indexOf(user.level)
              }
              handleUpgrade={() => handleUpgrade(e.level)}
            />
          ))}
        </ScrollableArea>
        <Dialog open={upgradeConfirmOpen} onOpenChange={setUpgradeConfirmOpen}>
          <ConfirmationDialogContent
            variety="danger"
            title="Confirmation"
            confirmBtnText={t(`confirm_upgrade_event`)}
            loadingText={t(`confirm_upgrade_event`)}
            onConfirm={(e) => {
              e.preventDefault();
              setUpgradeConfirmOpen(false);
              upgradeMutation.mutate({ level: upgradeLevel });
            }}>
            <p className="mt-5">{t(`confirm_upgrade_question`)}</p>
          </ConfirmationDialogContent>
        </Dialog>
      </div>
    </div>
  );
};

SubscriptionView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
SubscriptionView.PageWrapper = PageWrapper;

export default SubscriptionView;
