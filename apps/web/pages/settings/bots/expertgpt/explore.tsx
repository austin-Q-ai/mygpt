import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const ExploreView = () => {
    const { t } = useLocale();
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("expertgpt_explore_title")} description={t("expertgpt_explore_description")} />
            </div>
        </div>
    );
}

ExploreView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
ExploreView.PageWrapper = PageWrapper;

export default ExploreView;
