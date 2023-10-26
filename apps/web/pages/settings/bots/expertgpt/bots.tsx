import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  ConfirmationDialogContent,
  Form,
  ImageUploader,
  Label,
  TextField,
  TextAreaField,
  Meta,
} from "@calcom/ui";
import { Share2, Trash, Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import { MinimalBrainEntity, BrainEntityInput } from "@components/create-bot/BrainType";

const handleShare = (id: string) => {
  console.log("share");
};
const handleDelete = (id: string) => {
  console.log("Delete");
};
const ExpertCard = ({ id, name, isDefault }: z.infer<typeof MinimalBrainEntity>) => {
  const { t } = useLocale();
  return (
    <div className="flex justify-between justify-items-center rounded-none border border-solid border-[#E5E7EB] bg-[#6D278E0D] px-5">
      <div className="flex items-center text-sm font-bold leading-4 text-[#101010]">
        <p>{name}</p>
      </div>
      {isDefault ? (
        <Badge variant="gray" className="text-pink my-3 justify-start rounded-md px-[10px] text-sm">
          Default Expert
        </Badge>
      ) : (
        <div className="flex items-center justify-start">
          <Checkbox label="Set as default bot" description="" />
        </div>
      )}
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
  const form = useForm<z.infer<typeof BrainEntityInput>>({
    resolver: zodResolver(BrainEntityInput),
  });
  const { register } = form;
  const [nextAvailable, setNextAvailable] = useState(false);
  const [showNext, setShowNext] = useState(false);
  return (
    <Dialog name="new">
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
          {!showNext ? (
            <div className="mt-3 space-y-6 pb-11">
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
                <Checkbox
                  label="Personality"
                  description=""
                  value={nextAvailable}
                  onChange={() => setNextAvailable(!nextAvailable)}
                />
                <hr className="w-[15%]" />
              </div>
            </div>
          ) : (
            <></>
          )}
          <DialogFooter showDivider>
            <DialogClose />
            {/* <Button type="submit" loading={createMutation.isLoading}> */}
            <Button type="submit">{nextAvailable ? t("next") : t("create")}</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const BotsView = () => {
  const { t } = useLocale();
  const { data: user } = trpc.viewer.me.useQuery();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        // axios.get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains/default`, {
        //     headers: {
        //         Authorization: `Bearer ${user?.apiKey}`,
        //         "Content-Type": "application/json",
        //     },
        // }).then(resp => {
        //     console.log(resp);
        console.log(data);
        // })
      });
  }, [user]);

  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("bots")} description={t("expertgpt_bots_description")} CTA={<CreateExpertButton />} />
        <div className="flex flex-col gap-2">
          <ExpertCard id="1" name="MyBot1" isDefault />
          <ExpertCard id="2" name="MyBot2" />
          <ExpertCard id="3" name="MyBot3" />
        </div>
      </div>
    </div>
  );
};

BotsView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
BotsView.PageWrapper = PageWrapper;

export default BotsView;
