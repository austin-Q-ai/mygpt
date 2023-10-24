import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const BotsView = () => {
    const { t } = useLocale();
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("bots")} description={t("expertgpt_bots_description")} />
            </div>
        </div>
    );
}

BotsView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
BotsView.PageWrapper = PageWrapper;

export default BotsView;
