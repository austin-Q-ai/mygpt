import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import {
  Button,
  Input,
  Form,
  Label,
  Meta,
  showToast,
  SkeletonButton,
  SkeletonContainer,
  SkeletonText,
  Card,
} from "@calcom/ui";
import { Edit2, Cross, X } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import MicroCards from "@components/microcard";

const SkeletonLoader = ({ title, description }: { title: string; description: string }) => {
  return (
    <SkeletonContainer>
      <Meta title={title} description={description} />
      <div className="mb-8 space-y-6">
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />

        <SkeletonButton className="mr-6 h-8 w-20 rounded-md p-5" />
      </div>
    </SkeletonContainer>
  );
};

type FormValues = {
  ais: string[];
  timetokens: string[];
};

const MicrocardView = () => {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: () => {
      showToast(t("settings_updated_successfully"), "success");
      utils.viewer.me.invalidate();
      utils.viewer.microcard.user.invalidate();
    },
    onError: () => {
      showToast(t("error_updating_settings"), "error");
    },
  });

  if (isLoading || !user)
    return (
      <SkeletonLoader
        title={t("microcard")}
        description={t("microcard_description", { appName: APP_NAME })}
      />
    );

  const defaultValues: FormValues = {
    ais: user.aiAdvantage || [],
    timetokens: user.timeTokenAdvantage || [],
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div>
        <Meta title={t("microcard")} description={t("microcard_description", { appName: APP_NAME })} />
        <MicrocardForm
          key={JSON.stringify(defaultValues)}
          defaultValues={defaultValues}
          isLoading={mutation.isLoading}
          onSubmit={(values) => {
            console.log({
              aiAdvantage: values.ais,
              timeTokenAdvantage: values.timetokens,
            });
            mutation.mutate({
              aiAdvantage: values.ais,
              timeTokenAdvantage: values.timetokens,
            });
          }}
        />
      </div>
      <div className="h-[70vh] w-full">
        <MicroCards userId={user.id} />
      </div>
    </div>
  );
};

const MicrocardForm = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}: {
  defaultValues: FormValues;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}) => {
  const { t } = useLocale();
  const [editableAI, setEditableAI] = useState(false);
  const [editableTimeToken, setEditableTimeToken] = useState(false);
  const [AIs, setAIs] = useState<string[]>([]);
  const [timeTokens, setTimeTokens] = useState<string[]>([]);

  const microcardFormSchema = z.object({
    ais: z.array(z.string()),
    timetokens: z.array(z.string()),
  });

  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(microcardFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const isDisabled = isSubmitting || !isDirty;

  useEffect(() => {
    setAIs(formMethods.getValues("ais"));
    setTimeTokens(formMethods.getValues("timetokens"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Form form={formMethods} handleSubmit={onSubmit}>
        <div className="mt-8">
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="mb-4 flex justify-between">
                  <Label className="text-lg">{t("Your Artificial Intelligence advantages")}</Label>
                  <div className="flex gap-2">
                    {editableAI && (
                      <Button
                        color="primary"
                        StartIcon={Cross}
                        className="!rounded-full"
                        variant="icon"
                        onClick={() => {
                          const tmp = AIs.concat("");
                          setAIs(tmp);
                        }}
                      />
                    )}
                    <Button
                      color="primary"
                      StartIcon={!editableAI ? Edit2 : Cross}
                      className={`!rounded-full ${editableAI ? "rotate-45 transform" : ""}`}
                      variant="icon"
                      onClick={() => {
                        setEditableAI(!editableAI);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4 flex w-full flex-wrap gap-2">
                  {(!editableAI && defaultValues.ais.length === 0) || (editableAI && AIs.length === 0) ? (
                    <div className="p-2 text-center">{t("no_data_yet")}</div>
                  ) : (
                    <>
                      {!editableAI
                        ? defaultValues.ais.map((ai, i) => (
                            <div
                              className="rounded-md border-none border-gray-500 bg-white p-2 text-center"
                              key={i}>
                              {ai}
                            </div>
                          ))
                        : AIs.map((ai, i) => (
                            <div className="flex" key={i}>
                              <Input
                                className="w-[100px] !rounded-full !rounded-r-none border-r-0 focus:ring-0"
                                value={ai}
                                onChange={(event) => {
                                  const formData = [...AIs];
                                  formData[i] = event.target.value;
                                  formMethods.setValue(
                                    "ais",
                                    formData.filter((ai) => ai),
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                  setAIs(formData);
                                }}
                              />
                              <Button
                                color="secondary"
                                StartIcon={X}
                                className="!rounded-full !rounded-l-none border-l-0"
                                variant="icon"
                                onClick={() => {
                                  const formData = [...AIs.slice(0, i), ...AIs.slice(i + 1)];
                                  formMethods.setValue("ais", formData, { shouldDirty: true });
                                  setAIs(formData);
                                }}
                              />
                            </div>
                          ))}
                    </>
                  )}
                </div>
              </>
            }
          />
        </div>
        <div className="mt-8 flex flex-col gap-2 md:flex-row">
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="mb-4 flex justify-between">
                  <Label className="text-lg">{t("Your Timetoken advantages")}</Label>
                  <div className="flex gap-2">
                    {editableTimeToken && (
                      <Button
                        color="primary"
                        StartIcon={Cross}
                        className="!rounded-full"
                        variant="icon"
                        onClick={() => {
                          const tmp = timeTokens.concat("");
                          setTimeTokens(tmp);
                        }}
                      />
                    )}
                    <Button
                      color="primary"
                      StartIcon={!editableTimeToken ? Edit2 : Cross}
                      className={`!rounded-full ${editableTimeToken ? "rotate-45 transform" : ""}`}
                      variant="icon"
                      onClick={() => {
                        setEditableTimeToken(!editableTimeToken);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4 flex w-full flex-wrap gap-2">
                  {(!editableTimeToken && defaultValues.timetokens.length === 0) ||
                  (editableTimeToken && timeTokens.length === 0) ? (
                    <div className="w-full p-2 text-center">{t("no_data_yet")}</div>
                  ) : (
                    <>
                      {!editableTimeToken
                        ? defaultValues.timetokens.map((timetoken, i) => (
                            <div
                              className="rounded-md border-none border-gray-500 bg-white p-2 text-center"
                              key={i}>
                              {timetoken}
                            </div>
                          ))
                        : timeTokens.map((timetoken, i) => (
                            <div className="flex" key={i}>
                              <Input
                                className="w-[100px] !rounded-full !rounded-r-none border-r-0 focus:ring-0"
                                value={timetoken}
                                onChange={(event) => {
                                  const formData = [...timeTokens];
                                  formData[i] = event.target.value;
                                  formMethods.setValue(
                                    "timetokens",
                                    formData.filter((timetoken) => timetoken),
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                  setTimeTokens(formData);
                                }}
                              />
                              <Button
                                color="secondary"
                                StartIcon={X}
                                className="!rounded-full !rounded-l-none border-l-0"
                                variant="icon"
                                onClick={() => {
                                  const formData = [...timeTokens.slice(0, i), ...timeTokens.slice(i + 1)];
                                  formMethods.setValue("timetokens", formData, { shouldDirty: true });
                                  setTimeTokens(formData);
                                }}
                              />
                            </div>
                          ))}
                    </>
                  )}
                </div>
              </>
            }
          />
        </div>
        <Button loading={isLoading} disabled={isDisabled} color="primary" className="mr-4 mt-8" type="submit">
          {t("save")}
        </Button>
      </Form>
    </div>
  );
};

MicrocardView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
MicrocardView.PageWrapper = PageWrapper;

export default MicrocardView;
