import axios from "axios";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button, Meta, showToast } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

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
        <Button color="primary" onClick={() => getExpertId()}>
          {t("create")}
        </Button>
      </div>
    </div>
  );
};

ExpertView.getLayout = getLayout;
ExpertView.PageWrapper = PageWrapper;

export default ExpertView;
