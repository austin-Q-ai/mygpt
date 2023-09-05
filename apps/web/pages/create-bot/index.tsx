import { useRouter } from "next/router";
import React from "react";

import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import { withQuery } from "@lib/QueryCell";

import PageWrapper from "@components/PageWrapper";
import ImageUploader from "@components/create-bot/ImageUploader";
import VoiceUploader from "@components/create-bot/VoiceUploader";
import SkeletonLoader from "@components/timetokens-wallet/SkeletonLoader";
import BotDataInputForm from "@components/create-bot/BotDataInputForm";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithQuery = withQuery(trpc.viewer.timetokenswallet.getAddedExperts as any);

function CreateBot() {
  const { t } = useLocale();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const router = useRouter();

  return (
    <Shell heading={t("Create Bot")} hideHeadingOnMobile subtitle={t("Create your telegram bot")}>
      <WithQuery
        customLoader={<SkeletonLoader />}
        success={({ data }) => {
          return (
            <>
              <ImageUploader />
              <VoiceUploader />
              <BotDataInputForm />
            </>
          );
        }}
      />
    </Shell>
  );
}

CreateBot.PageWrapper = PageWrapper;

export default CreateBot;
