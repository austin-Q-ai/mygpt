import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
  FilterSearchField,
  Form,
  ImageUploader,
  Label,
  TextField,
  TextAreaField,
  Meta,
  Group,
  RadioField,
} from "@calcom/ui";
import { Share2, Trash, Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import type {
  IPersonalityForm,
  IBotInfoForm,
  IPersonalityBasicForm,
  MinimalBrainEntity,
} from "@components/create-bot/BrainType";
import { BrainEntityInput, PersonalityEntityInput } from "@components/create-bot/BrainType";

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

const BotInfoForm = ({ form, nextAvailable, setNextAvailable }: IBotInfoForm) => {
  const { t } = useLocale();
  const { register } = form;

  return (
    <div className="mt-3 space-y-6 pb-11">
      <TextField label={t("enter_bot_name")} placeholder={t("E.g. History notes")} {...register("name")} />
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
          defaultChecked={nextAvailable}
          checked={nextAvailable}
          onChange={() => setNextAvailable(!nextAvailable)}
        />
        <hr className="w-[15%]" />
      </div>
    </div>
  );
};

const PersonalityBasicForm: React.FC<IPersonalityBasicForm> = ({ children }) => {
  return <>{children}</>;
};

const PersonalityForm = ({ form, formItems, isLast }: IPersonalityForm) => {
  const { t } = useLocale();
  const { register } = form;

  return (
    <div className="mt-3 flex flex-col gap-2.5 space-y-6 pb-11">
      {formItems.map((item, key) => (
        <div key={key} className="flex flex-col gap-2.5 p-2.5 !font-normal text-black/50">
          <Label className="text-[12px] leading-[17px] tracking-[0.12px] ">{item.label}</Label>
          <Group className="flex flex-col gap-1.5 p-1.5 text-[11px] leading-4" {...register(item.value)}>
            <RadioField id="0" value="0" label="Totally disagree" />
            <RadioField id="1" value="1" label="disagree" />
            <RadioField id="2" value="2" label="neutral" />
            <RadioField id="3" value="3" label="agree" />
            <RadioField id="3" value="3" label="Totally agree" />
          </Group>
        </div>
      ))}
      {isLast && (
        <div className="flex gap-2">
          <Label className="!mb-0 text-[12px] font-normal leading-4 text-black/50">Set as default bot</Label>
          <Checkbox description="" label="" color="pink" {...register("setDefault")} />
        </div>
      )}
    </div>
  );
};

const CreateExpertButton = () => {
  const { t } = useLocale();
  const form = useForm<z.infer<typeof BrainEntityInput>>({
    resolver: zodResolver(BrainEntityInput),
  });
  const personalityForm = useForm<z.infer<typeof PersonalityEntityInput>>({
    resolver: zodResolver(PersonalityEntityInput),
  });
  const [nextAvailable, setNextAvailable] = useState(false);
  const [currentFormId, setCurrentFormId] = useState(0);

  const formPanels = [
    <BotInfoForm key={0} form={form} nextAvailable={nextAvailable} setNextAvailable={setNextAvailable} />,
    <PersonalityBasicForm key={1}>
      <PersonalityForm
        form={personalityForm}
        formItems={[
          {
            value: "feelingAnxious",
            label: "Do you find yourself feeling anxious in situations that others do not?",
          },
          {
            value: "taskAccuracy",
            label: "Do you take pride in doing tasks thoroughly and accurately?",
          },
          {
            value: "criticism",
            label: "Are you able to easily shrug off criticism without taking it to heart?",
          },
        ]}
      />
    </PersonalityBasicForm>,
    <PersonalityBasicForm key={2}>
      <PersonalityForm
        form={personalityForm}
        formItems={[
          {
            value: "forgetful",
            label: "Are you often forgetful when it comes to your responsibilities?",
          },
          {
            value: "procrastinate",
            label: "Do you procrastinate when it comes to important tasks?",
          },
          {
            value: "socialSettings",
            label: "Are you usually uncomfortable or anxious in social settings?",
          },
        ]}
      />
    </PersonalityBasicForm>,
    <PersonalityBasicForm key={3}>
      <PersonalityForm
        form={personalityForm}
        formItems={[
          {
            value: "carryingoutTask",
            label: "Are you reliable and dependable in carrying out tasks?",
          },
          {
            value: "interactingPeople",
            label: "Do you enjoy being in social settings and interacting with other people?",
          },
          {
            value: "remainingCalm",
            label: "Do you find yourself remaining calm in difficult situations?",
          },
        ]}
        isLast
      />
    </PersonalityBasicForm>,
  ];

  return (
    <Dialog name="new">
      <DialogTrigger asChild>
        <Button rounded StartIcon={Plus} variant="icon" />
      </DialogTrigger>
      <DialogContent
        type="creation"
        enableOverflow
        title={t("add_new_event_type")}
        description={
          !currentFormId
            ? t("new_event_type_to_book_description")
            : `Personality ${currentFormId} / ${formPanels.length - 1}`
        }>
        <Form
          form={form}
          handleSubmit={(values) => {
            // createMutation.mutate(values);
            if (nextAvailable) {
              if (currentFormId === formPanels.length - 1) {
                console.log("last form");
              } else {
                setCurrentFormId(currentFormId + 1);
              }
            } else {
              console.log("create without personalities");
            }
          }}>
          {formPanels[currentFormId]}
          <DialogFooter showDivider>
            {currentFormId ? (
              <Button color="secondary" onClick={() => setCurrentFormId(currentFormId - 1)}>
                Previous
              </Button>
            ) : (
              <DialogClose />
            )}
            {/* <Button type="submit" loading={createMutation.isLoading}> */}
            <Button type="submit">
              {!nextAvailable || currentFormId === formPanels.length - 1 ? t("create") : t("next")}
            </Button>
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
        <div className="mb-5 lg:w-[60%]">
          <FilterSearchField placeholder={t("search")} />
        </div>
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
