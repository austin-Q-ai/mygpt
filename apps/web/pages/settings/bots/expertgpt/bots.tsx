import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge, Button, Checkbox, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, ConfirmationDialogContent, Form, ImageUploader, Label, TextField, TextAreaField, Meta } from "@calcom/ui";
import { Share2, Trash, Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface ExpertCardProps {
    id: string;
    botName: string;
    isDefault?: boolean;
    handleShare: (edit_id: string) => void;
    handleDelete: (delete_id: string) => void;
}

const createBotTypeProps = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    linkedin: z.string().optional(),
    promptTitle: z.string().optional(),
    promptContent: z.string().optional(),
    logo: z.string().optional(),
})

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
    const { t } = useLocale();
    const form = useForm<z.infer<typeof createBotTypeProps>>({
        resolver: zodResolver(createBotTypeProps),
    });
    const { register } = form;
    const [nextAvailable, setNextAvailable] = useState(false);
    const [showNext, setShowNext] = useState(false);

    return (
        <>
            <Dialog
                name="new">
                <DialogTrigger asChild>
                    <Button rounded StartIcon={Plus} variant="icon" />
                </DialogTrigger>
                <DialogContent
                    type="creation"
                    enableOverflow
                    title={t("add_new_event_type")}
                    description={t("new_event_type_to_book_description")}>
                    <Form
                        form={form}
                        handleSubmit={(values) => {
                            // createMutation.mutate(values);
                            if (nextAvailable) {
                                setShowNext(true);
                            }
                        }}>
                        {!showNext ? <div className="mt-3 space-y-6 pb-11">
                            <TextField
                                label={t("enter_bot_name")}
                                placeholder={t("E.g. History notes")}
                                {...register("name")}
                            />
                            <TextAreaField
                                label={t("enter_bot_description")}
                                id="enter_bot_description"
                                placeholder={t("my new brain is about...")}
                                rows={3}
                                className="rounded-[3.083px] border-[0.617px] border-[#C4C4C4]"
                                {...register("description")}
                            />
                            <TextField
                                label={t("enter_your_linkedin")}
                                placeholder={t("https://www.linkedin.com/in/")}
                                {...register("linkedin")}
                            />
                            <TextField
                                label={t("prompt_title")}
                                placeholder={t("My awesome prompt name")}
                                {...register("promptTitle")}
                            />
                            <TextAreaField
                                label={t("prompt_content")}
                                id="prompt_content"
                                placeholder={t("As an AI, your...")}
                                rows={3}
                                className="rounded-[3.083px] border-[0.617px] border-[#C4C4C4]"
                                {...register("promptContent")}
                            />
                            <div className="flex flex-col">
                                <Label className="text-sm">{t("image")}</Label>
                                <ImageUploader
                                    target="Image"
                                    id="image-upload"
                                    isFilled
                                    buttonMsg=""
                                    large
                                    handleAvatarChange={(logo) => {
                                        form.setValue("logo", logo, { shouldDirty: true });
                                    }}
                                    imageSrc={undefined}
                                />
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <hr className="w-[15%]" />
                                <Checkbox label="Personality" description="" value={nextAvailable} onChange={() => setNextAvailable(!nextAvailable)} />
                                <hr className="w-[15%]" />
                            </div>
                        </div> : <></>}
                        <DialogFooter showDivider>
                            <DialogClose />
                            {/* <Button type="submit" loading={createMutation.isLoading}> */}
                            <Button type="submit">
                                {nextAvailable ? t("next") : t("create")}
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
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
