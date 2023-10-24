import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const SettingsBotView = () => {
    const { t } = useLocale();
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("expertgpt") + " " + t("settings_bot")} description={t("expertgpt_settings_description")} />
            </div>
        </div>
    );
}

SettingsBotView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
SettingsBotView.PageWrapper = PageWrapper;

export default SettingsBotView;
