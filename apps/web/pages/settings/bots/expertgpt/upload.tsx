import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import FileBotUploader from "@components/create-bot/FileUploader";

const UploadView = () => {
    const { t } = useLocale();
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("expertgpt")} description={t("expertgpt_upload_description")} />
                <div className="mx-auto lg:w-[65%] ">
                    <FileBotUploader />
                </div>
            </div>
        </div>
    );
}

UploadView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
UploadView.PageWrapper = PageWrapper;

export default UploadView;
