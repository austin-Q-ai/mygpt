import axios from "axios";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { UserLevel } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Alert, Button, Meta, showToast, Input } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import { FileUploader } from "@components/create-bot/FileUploader";
import UploadCard from "@components/create-bot/UploadCard";

const ExpertView = () => {
  const { data: user } = trpc.viewer.me.useQuery();
  const { t } = useLocale();
  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: () => {
      showToast(t("successfully_created"), "success");
    },
  });
  const getExpertId = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains/default/`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
        },
      })
      .then((data) => {
        mutation.mutate({
          expertId: data.data.id,
        });
      });
  };
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("expert_clone")} description={t("expert_description", { appName: APP_NAME })} />
        {user?.level !== UserLevel.FREEMIUM ? (
          <>
            {!user?.expertId ?
              <>
                <div className="flex flex-col items-center mb-4">
                  {!user?.social?.linkedin && <Alert className="mb-4" key="info_input_linekdin_bot" severity="info" title={t("input_linkedin_bot")} />}
                  <Button color="primary" disabled={user?.social?.linkedin ? false : true}>
                    {t("linkedin_scraping")}
                  </Button>
                </div>
                <FileUploader />

                <UploadCard className="flex items-center justify-center h-32 gap-5 px-5 mt-5">
                  <div className="flex flex-col items-center w-full max-w-sm gap-5 text-center">
                    <Input
                      name="crawlurl"
                      // ref={urlInputRef}
                      type="text"
                      placeholder="Enter a website URL"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-5 -mt-2">
                    <Button
                    // isLoading={isCrawling}
                    // onClick={() => void crawlWebsite(currentBrain?.id)}
                    >
                      Crawl
                    </Button>
                  </div>
                </UploadCard>
              </> :
              <>
                <Button color="primary" onClick={() => getExpertId()}>
                  {t("create")}
                </Button>
              </>
            }
          </>) : <Alert className="mb-4" key="info_plan_upgrade_bots" severity="info" title={t("plan_upgrade_bots")} />}
      </div>
    </div>
  );
};

ExpertView.getLayout = getLayout;
ExpertView.PageWrapper = PageWrapper;

export default ExpertView;
