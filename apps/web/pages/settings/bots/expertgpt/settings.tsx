import { useState, type ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Meta } from "@calcom/ui";
import { Plus, X } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import AddNewUser from "@components/create-bot/AddNewUsers";
import ManageSettings from "@components/create-bot/ManageSettings";

const SettingsBotView = () => {
  const { t } = useLocale();

  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex-1">
          <Meta
            title={t("expertgpt") + " " + t("settings_bot")}
            description={t("expertgpt_settings_description")}
            CTA={
              <Button
                className="flex h-9 items-center gap-2 rounded-md bg-[rgba(109,39,142,0.2)] py-2 pl-3 pr-4 opacity-80"
                onClick={() => setIsAdding(!isAdding)}>
                {isAdding ? (
                  <X width="16px" className="self-stretch" stroke="#6D278E" />
                ) : (
                  <Plus width="16px" className="self-stretch" stroke="#6D278E" />
                )}
                <p className="max-h-4 text-center text-[14px] leading-5 text-[#6D278E]">
                  {isAdding ? "Cancel adding the new user" : "Add new users to your bot"}
                </p>
              </Button>
            }
          />
        </div>
      </div>
      {isAdding ? <AddNewUser /> : <ManageSettings />}
    </>
  );
};

SettingsBotView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
SettingsBotView.PageWrapper = PageWrapper;

export default SettingsBotView;
