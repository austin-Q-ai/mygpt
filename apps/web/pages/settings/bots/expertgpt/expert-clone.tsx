import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const ExpertCloneView = () => {
  const { t } = useLocale();
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("expert_clone")} description={t("expert_clone_description", { appName: APP_NAME })} />
      </div>
    </div>
  );
}

ExpertCloneView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
ExpertCloneView.PageWrapper = PageWrapper;

export default ExpertCloneView;
