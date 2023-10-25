import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge, Button, Checkbox, Dialog, DialogTrigger, ConfirmationDialogContent, Meta } from "@calcom/ui";
import { Share2, Trash, Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface ExpertCardProps {
    id: string;
    botName: string;
    isDefault?: boolean;
    handleShare: (edit_id: string) => void;
    handleDelete: (delete_id: string) => void;
}

const ExpertCard = ({ id, botName, isDefault, handleShare, handleDelete }: ExpertCardProps) => {
    const { t } = useLocale();

    return (
        <div className="flex justify-between justify-items-center rounded-none border border-solid border-[#E5E7EB] bg-[#6D278E0D] px-5">
            <div className="flex items-center text-sm font-bold leading-4 text-[#101010]">
                <p>{botName}</p>
            </div>
            {isDefault ?
                <Badge variant="gray" className="justify-start px-[10px] text-sm my-3 text-pink rounded-md">Default Expert</Badge>
                : <div className="flex items-center justify-start">
                    <Checkbox label="Set as default bot" description="" />
                </div>}
            {/* </div> */}
            <div className="flex justify-between gap-[13px] px-[20px] py-[10px]">
                <Button
                    className="flex gap-[11px] p-[10px] text-sm leading-4 shadow-md"
                    color="secondary"
                    onClick={() => {
                        handleShare(id);
                    }}
                    StartIcon={Share2}>
                    {t("share")}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button color="secondary" className="border" StartIcon={Trash}>
                            {t("delete")}
                        </Button>
                    </DialogTrigger>
                    <ConfirmationDialogContent
                        variety="danger"
                        title={t("delete_bot")}
                        confirmBtnText={t("confirm_delete_bot")}
                        onConfirm={() => handleDelete(id)}>
                        {t("delete_bot_confirmation_message")}
                    </ConfirmationDialogContent>
                </Dialog>
            </div>
        </div>
    );
};

const CreateExpertButton = () => {
    return (
        <>
            <Button rounded StartIcon={Plus} variant="icon" />
        </>
    )
}

const BotsView = () => {
    const { t } = useLocale();
    const handleShare = () => {
        console.log("share");
    }
    const handleDelete = () => {
        console.log("Delete");
    }
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("bots")} description={t("expertgpt_bots_description")} CTA={<CreateExpertButton />} />
                <div className="flex flex-col gap-2">
                    <ExpertCard id="1" botName="MyBot1" isDefault handleShare={handleShare} handleDelete={handleDelete} />
                    <ExpertCard id="2" botName="MyBot2" handleShare={handleShare} handleDelete={handleDelete} />
                    <ExpertCard id="3" botName="MyBot3" handleShare={handleShare} handleDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
}

BotsView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
BotsView.PageWrapper = PageWrapper;

export default BotsView;
