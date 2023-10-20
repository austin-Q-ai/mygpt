import axios from "axios";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import React, { useState, useEffect } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Meta } from "@calcom/ui";
import { Button, Dialog, DialogContent, PasswordField, showToast } from "@calcom/ui";

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
  const utils = trpc.useContext();
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const [botname, setBotName] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");

  const VIDEO_SERVICE_URL = process.env.NEXT_PUBLIC_VIDEO_SERVICE;
  const BOT_CONTROL_SERVICE_URL = process.env.NEXT_PUBLIC_BOT_CONTROL_SERVICE;

  const passwordMutation = trpc.viewer.auth.verifyPassword.useMutation({
    onSuccess: () => {
      console.log("success");
      handleCreation();
    },
    onError: () => {
      setPassword("");
      showToast(t("incorrect_password"), "error");
    },
  });

  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: () => {
      showToast(t("telegram_bot_creation_success"), "success");
      utils.viewer.me.invalidate();
      console.log("updated: ", user);
      setIsOpen(false);
    },
    onError: () => {
      showToast(t("telegram_bot_creation_error"), "error");
      setIsOpen(false);
    },
  });

  useEffect(() => {
    console.log(voice);
  }, [voice]);

  const getBrainInfo = async () => {
    // get from HongYu's backend
    return {
      BRAIN_ID: "446457d5-3943-4c25-a4fb-0a68bb7301d2",
      BRAIN_API_KEY: "671c23c2c10df49b25a37416af14f647",
    };
  };

  const getVideoCloneApi = async (token: string) => {
    try {
      const res = await axios.post(
        `${VIDEO_SERVICE_URL}/users/api_key`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("api key: ", res);
      if (res && res.data) return res.data;
      else return null;
    } catch (_err) {
      console.log("error on getting api: ");
      return null;
    }
  };

  const getVideoCloneToken = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${VIDEO_SERVICE_URL}/registry`, {
        email,
        password,
      });
      console.log("video: ", res.data);
      if (res && res.data) {
        const _res = await getVideoCloneApi(res.data.access_token || "");
        if (_res && _res.api_key) return _res.api_key;
        else return null;
      } else return null;
    } catch (_err) {
      console.log("error: ");
      return null;
    }
  };

  const getCloneId = async (video_api: string) => {
    // Perform API call using image, voice, and bot data
    const formData = new FormData();
    formData.append("source_image", image);
    formData.append("source_voice", voice);
    formData.append("visible", "1");
    formData.append("description", "create awesome bot called " + botname);

    formData.append("_method", "PUT");

    try {
      const res = await axios.put(`${VIDEO_SERVICE_URL}/clone/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${video_api}`,
        },
      });
      if (res.data && res.data.clone_id) {
        console.log("clone success: ", res.data);
        return res.data.clone_id;
      } else {
        console.log("no clone id");
        return null;
      }
    } catch (err) {
      console.log("clone error", err);
      return null;
    }
  };

  const getTelegramToken = async (video_api: string, brain_api_key: string) => {
    try {
      const res = await axios.post(`${BOT_CONTROL_SERVICE_URL}/users`, {
        email: user?.email,
        brain_api: brain_api_key,
        video_api: video_api,
        password: password,
      });
      console.log("tg token: ", res?.data);
      if (res && res.data) return res.data?.access_token;
      return null;
    } catch (err) {
      console.log("err on getting tg token", err);
      return null;
    }
  };

  const getBotContainerId = async (clone_id: string, brain_id: string, tg_token: string) => {
    try {
      const res = await axios.post(
        `${BOT_CONTROL_SERVICE_URL}/bot/create`,
        {
          bot_username: username,
          bot_name: botname,
          brain_id: brain_id,
          video_id: clone_id,
          bot_token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${tg_token}`,
          },
        }
      );
      if (res && res.data) return res.data?.container_id;
      return null;
    } catch (err) {
      console.log("err on bot creation: ", err);
      return null;
    }
  };

  const handleCreation = async () => {
    if (!user?.email) {
      console.log("fail");
      showToast(t("telegram_bot_creation_error"), "error");
      return;
    }
    // 2. get video api key
    let video_api = user?.videoCloneToken;
    if (!video_api) {
      video_api = await getVideoCloneToken(user?.email, password);
      if (!video_api) {
        console.log("fail on getting video api");
        showToast(t("telegram_bot_creation_error"), "error");
        return;
      }
    }

    // 3. get clone id
    const clone_id = await getCloneId(video_api);
    if (!clone_id) {
      console.log("fail on video clone");
      showToast(t("telegram_bot_creation_error"), "error");
      return;
    }

    // 4. get brain api and id
    const { BRAIN_ID, BRAIN_API_KEY } = await getBrainInfo();

    // 5. telegram signup
    const tg_token = await getTelegramToken(video_api, BRAIN_API_KEY);
    if (!tg_token) {
      console.log("fail on telegram signup");
      showToast(t("telegram_bot_creation_error"), "error");
      return;
    }

    // 6. bot creation
    const container_id = await getBotContainerId(clone_id, BRAIN_ID, tg_token);
    if (!container_id) {
      console.log("fail on bot creation");
      showToast(t("telegram_bot_creation_error"), "error");
      return;
    }

    // 7. update container_id and hasbot on qdrant and postgres
    mutation.mutate({
      hasBot: true,
      botId: container_id,
    });
  };

  const handleSubmit = async () => {
    // 1. confirm password
    // if (password && botname && username && token && video && image)
    if (password) passwordMutation.mutate({ passwordInput: password });
  };

  return (
    <>
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
                <div className="mb-4 mt-2 flex items-start justify-start md:my-4">
                  <Button onClick={() => setIsOpen(true)}>Submit</Button>
                </div>
              </div>
            );
          }}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent title={t("confirm_password")} type="creation">
          <div className="flex flex-col gap-[29.6px] rounded-[6.166px] border-[0.617px] border-solid border-[#E5E7EB] p-[30.83px]">
            <div className="flex flex-col gap-[18.5px]">
              <div className="text-[14.798px] leading-[17.264px]">
                {t("telegram_confirm_password_description")}
              </div>
              <PasswordField
                id="confirm_password"
                // label
                placeholder={t("confirm_password")}
                className="rounded-[3.083px] border-[0.617px] border-[#C4C4C4]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="primary"
                onClick={handleSubmit}
                className="flex h-[36px] w-[80px] justify-center p-[6.166px]"
                disabled={password === ""}>
                {t("submit")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

TelegramBotView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
TelegramBotView.PageWrapper = PageWrapper;

export default TelegramBotView;
