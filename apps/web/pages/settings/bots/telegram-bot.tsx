import { useRouter } from "next/router";
import React, { useState, useEffect, ReactElement } from "react";
import axios from 'axios';

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui";

import { withQuery } from "@lib/QueryCell";

import PageWrapper from "@components/PageWrapper";
import BotDataInput from "@components/create-bot/BotDataInput";
import ImageUploader from "@components/create-bot/ImageUploader";
import SkeletonLoader from "@components/create-bot/SkeletonLoader";
import VoiceUploader from "@components/create-bot/VoiceUploader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithQuery = withQuery(trpc.viewer.timetokenswallet.getAddedExperts as any);

const TelegramBotView = () => {
  const { t } = useLocale();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const [botname, setBotName] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const VIDEO_SERVICE_URL = process.env.NEXT_PUBLIC_VIDEO_SERVICE

  useEffect(() => {
    console.log(voice);
  }, [voice]);

  const getBrainInfo = () => {
    // get directly from db e.g: data.expertId and api key
    return { BRAIN_ID: "446457d5-3943-4c25-a4fb-0a68bb7301d2", BRAIN_API_KEY: "671c23c2c10df49b25a37416af14f647" }
  }

  const handleSubmit = async () => {

    // get video api key
    const video_api = user?.videoCloneToken;
    if (!video_api) {
      console.log("no api key");
      return;
    }

    // Perform API call using image, voice, and bot data
    const formData = new FormData();
    formData.append("source_image", image);
    formData.append("source_voice", voice);
    formData.append("visible", "1");
    formData.append("description", "create awesome bot called " + botname)

    formData.append('_method', 'PUT');

    try {
      const res = await axios.post(`${VIDEO_SERVICE_URL}/clone/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${video_api}`
        }
      })
      if (res.data && res.data.clone_id) {
        console.log("success: ", res.data)
        const clone_id = res.data.clone_id

      } else {
        console.log("no clone id");
        return
      }
    } catch (err) {
      console.log("error", err)
    }
  };

  return (
    <div className="flex flex-row">
      <Meta title={t("telegram_bot")} description={t("telegram_bot_description", { appName: APP_NAME })} />
      <WithQuery
        customLoader={<SkeletonLoader />}
        success={({ data }) => {
          return (
            <div className="mx-auto lg:w-[85%] ">
              <VoiceUploader setVoice={setVoice} />
              <div className="flex flex-row">
                <div className="my-auto me-2 md:my-0 md:me-6">
                  <ImageUploader setImage={setImage} />
                </div>
                <BotDataInput setBotName={setBotName} setUserName={setUserName} setToken={setToken} />
              </div>
              <div className="flex items-start justify-start mt-2 mb-4 md:my-4">
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

TelegramBotView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
TelegramBotView.PageWrapper = PageWrapper;

export default TelegramBotView;
