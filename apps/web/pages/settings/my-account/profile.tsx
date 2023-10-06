/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import type { BaseSyntheticEvent } from "react";
import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorCode } from "@calcom/features/auth/lib/ErrorCode";
import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { FULL_NAME_LENGTH_MAX_LIMIT } from "@calcom/lib/constants";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { md } from "@calcom/lib/markdownIt";
import turndown from "@calcom/lib/turndownService";
import { IdentityProvider } from "@calcom/prisma/enums";
import type { TRPCClientErrorLike } from "@calcom/trpc/client";
import { trpc } from "@calcom/trpc/react";
import type { AppRouter } from "@calcom/trpc/server/routers/_app";
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  Form,
  ImageUploader,
  Label,
  Meta,
  PasswordField,
  showToast,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonContainer,
  SkeletonText,
  TextField,
  SelectField,
  Editor,
  Card,
  Input,
} from "@calcom/ui";
import {
  AlertTriangle,
  Trash2,
  Edit2,
  Facebook,
  Instagram,
  Linkedin,
  Cross,
  X,
  MousePointer2,
} from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import TwoFactor from "@components/auth/TwoFactor";
import { UsernameAvailabilityField } from "@components/ui/UsernameAvailability";

const SkeletonLoader = ({ title, description }: { title: string; description: string }) => {
  return (
    <SkeletonContainer>
      <Meta title={title} description={description} />
      <div className="mb-8 space-y-6">
        <div className="flex items-center">
          <SkeletonAvatar className="w-16 h-16 px-4 mt-0 me-4" />
          <SkeletonButton className="w-32 h-6 p-5 rounded-md" />
        </div>
        <SkeletonText className="w-full h-8" />
        <SkeletonText className="w-full h-8" />
        <SkeletonText className="w-full h-8" />

        <SkeletonButton className="w-20 h-8 p-5 mr-6 rounded-md" />
      </div>
    </SkeletonContainer>
  );
};

interface DeleteAccountValues {
  totpCode: string;
}

type ExperienceInput = {
  id: number | undefined;
  key: string;
  position: string;
  company: string;
  address: string | undefined;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  avatar: string | null;
  delete: boolean | undefined;
};

type SocialType = {
  telegram?: string;
  facebook?: string;
  discord?: string;
  instagram?: string;
  linkedin?: string;
};
type EducationInput = {
  id: number | undefined;
  key: string;
  school: string;
  major: string | undefined;
  degree: string | undefined;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  avatar: string | null;
  delete: boolean | undefined;
};

type FormValues = {
  username: string;
  avatar: string;
  name: string;
  email: string;
  bio: string;
  position: string;
  address: string;
  experiences: ExperienceInput[];
  educations: EducationInput[];
  skills: string[];
  social: SocialType;
};

const ProfileView = () => {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const { data: avatar, isLoading: isLoadingAvatar } = trpc.viewer.avatar.useQuery();
  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: () => {
      showToast(t("settings_updated_successfully"), "success");
      utils.viewer.me.invalidate();
      console.log("updated: ", user)
      utils.viewer.avatar.invalidate();
      setTempFormValues(null);
    },
    onError: () => {
      showToast(t("error_updating_settings"), "error");
    },
  });

  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [tempFormValues, setTempFormValues] = useState<FormValues | null>(null);
  const [confirmPasswordErrorMessage, setConfirmPasswordDeleteErrorMessage] = useState("");

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [hasDeleteErrors, setHasDeleteErrors] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const form = useForm<DeleteAccountValues>();

  const onDeleteMeSuccessMutation = async () => {
    await utils.viewer.me.invalidate();
    showToast(t("Your account was deleted"), "success");

    setHasDeleteErrors(false); // dismiss any open errors
    if (process.env.NEXT_PUBLIC_WEBAPP_URL === "https://app.cal.com") {
      signOut({ callbackUrl: "/auth/logout?survey=true" });
    } else {
      signOut({ callbackUrl: "/auth/logout" });
    }
  };

  const confirmPasswordMutation = trpc.viewer.auth.verifyPassword.useMutation({
    onSuccess() {
      if (tempFormValues) mutation.mutate(tempFormValues);
      setConfirmPasswordOpen(false);
    },
    onError() {
      setConfirmPasswordDeleteErrorMessage(t("incorrect_password"));
    },
  });

  const onDeleteMeErrorMutation = (error: TRPCClientErrorLike<AppRouter>) => {
    setHasDeleteErrors(true);
    setDeleteErrorMessage(errorMessages[error.message]);
  };
  const deleteMeMutation = trpc.viewer.deleteMe.useMutation({
    onSuccess: onDeleteMeSuccessMutation,
    onError: onDeleteMeErrorMutation,
    async onSettled() {
      await utils.viewer.me.invalidate();
    },
  });
  const deleteMeWithoutPasswordMutation = trpc.viewer.deleteMeWithoutPassword.useMutation({
    onSuccess: onDeleteMeSuccessMutation,
    onError: onDeleteMeErrorMutation,
    async onSettled() {
      await utils.viewer.me.invalidate();
    },
  });

  const isCALIdentityProviver = user?.identityProvider === IdentityProvider.CAL;

  const onConfirmPassword = (e: Event | React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    const password = passwordRef.current.value;
    confirmPasswordMutation.mutate({ passwordInput: password });
  };

  const onConfirmButton = (e: Event | React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    if (isCALIdentityProviver) {
      const totpCode = form.getValues("totpCode");
      const password = passwordRef.current.value;
      deleteMeMutation.mutate({ password, totpCode });
    } else {
      deleteMeWithoutPasswordMutation.mutate();
    }
  };

  const onConfirm = ({ totpCode }: DeleteAccountValues, e: BaseSyntheticEvent | undefined) => {
    e?.preventDefault();
    if (isCALIdentityProviver) {
      const password = passwordRef.current.value;
      deleteMeMutation.mutate({ password, totpCode });
    } else {
      deleteMeWithoutPasswordMutation.mutate();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const passwordRef = useRef<HTMLInputElement>(null!);

  const errorMessages: { [key: string]: string } = {
    [ErrorCode.SecondFactorRequired]: t("2fa_enabled_instructions"),
    [ErrorCode.IncorrectPassword]: `${t("incorrect_password")} ${t("please_try_again")}`,
    [ErrorCode.UserNotFound]: t("no_account_exists"),
    [ErrorCode.IncorrectTwoFactorCode]: `${t("incorrect_2fa_code")} ${t("please_try_again")}`,
    [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t("please_try_again_and_contact_us")}`,
    [ErrorCode.ThirdPartyIdentityProviderEnabled]: t("account_created_with_identity_provider"),
  };

  if (isLoading || !user || isLoadingAvatar || !avatar)
    return (
      <SkeletonLoader title={t("profile")} description={t("profile_description", { appName: APP_NAME })} />
    );

  const defaultValues: FormValues = {
    username: user.username || "",
    avatar: avatar.avatar || "",
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    position: user.position || "",
    address: user.address || "",
    experiences: user.experiences
      ? user.experiences.map((experience) => ({
          id: experience.id,
          key: "0",
          position: experience.position,
          company: experience.company,
          address: experience.address || "",
          startMonth: experience.startMonth,
          startYear: experience.startYear,
          endMonth: experience.endMonth,
          endYear: experience.endYear,
          avatar: experience.avatar || null,
          delete: false,
        }))
      : ([] as ExperienceInput[]),
    educations: user.educations
      ? user.educations.map((education) => ({
          id: education.id,
          key: "0",
          school: education.school,
          major: education.major || "",
          degree: education.degree || "",
          startMonth: education.startMonth,
          startYear: education.startYear,
          endMonth: education.endMonth,
          endYear: education.endYear,
          avatar: education.avatar || null,
          delete: false,
        }))
      : ([] as EducationInput[]),
    skills: user.skills || [],
    social: (user.social as SocialType) || ({} as SocialType),
  };

  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("profile")} description={t("profile_description", { appName: APP_NAME })} />
        <ProfileForm
          key={JSON.stringify(defaultValues)}
          defaultValues={defaultValues}
          isLoading={mutation.isLoading}
          onSubmit={(values) => {
            if (values.email !== user.email && isCALIdentityProviver) {
              setTempFormValues(values);
              setConfirmPasswordOpen(true);
            } else {
              mutation.mutate(values);
            }
          }}
          extraField={
            <div className="mt-8">
              <UsernameAvailabilityField
                onSuccessMutation={async () => {
                  showToast(t("settings_updated_successfully"), "success");
                  await utils.viewer.me.invalidate();
                }}
                onErrorMutation={() => {
                  showToast(t("error_updating_settings"), "error");
                }}
              />
            </div>
          }
        />

        <hr className="my-6 border-subtle" />

        <Label>{t("danger_zone")}</Label>
        {/* Delete account Dialog */}
        <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
          <DialogTrigger asChild>
            <Button data-testid="delete-account" color="destructive" className="mt-1" StartIcon={Trash2}>
              {t("delete_account")}
            </Button>
          </DialogTrigger>
          <DialogContent
            title={t("delete_account_modal_title")}
            description={t("confirm_delete_account_modal", { appName: APP_NAME })}
            type="creation"
            Icon={AlertTriangle}>
            <>
              <div className="mb-10">
                <p className="mb-4 text-default">
                  {t("delete_account_confirmation_message", { appName: APP_NAME })}
                </p>
                {isCALIdentityProviver && (
                  <PasswordField
                    data-testid="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    label="Password"
                    ref={passwordRef}
                  />
                )}

                {user?.twoFactorEnabled && isCALIdentityProviver && (
                  <Form handleSubmit={onConfirm} className="pb-4" form={form}>
                    <TwoFactor center={false} />
                  </Form>
                )}

                {hasDeleteErrors && <Alert severity="error" title={deleteErrorMessage} />}
              </div>
              <DialogFooter showDivider>
                <DialogClose />
                <Button
                  color="primary"
                  data-testid="delete-account-confirm"
                  onClick={(e) => onConfirmButton(e)}>
                  {t("delete_my_account")}
                </Button>
              </DialogFooter>
            </>
          </DialogContent>
        </Dialog>

        {/* If changing email, confirm password */}
        <Dialog open={confirmPasswordOpen} onOpenChange={setConfirmPasswordOpen}>
          <DialogContent
            title={t("confirm_password")}
            description={t("confirm_password_change_email")}
            type="creation"
            Icon={AlertTriangle}>
            <div className="mb-10">
              <PasswordField
                data-testid="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                label="Password"
                ref={passwordRef}
              />

              {confirmPasswordErrorMessage && <Alert severity="error" title={confirmPasswordErrorMessage} />}
            </div>
            <DialogFooter showDivider>
              <Button color="primary" onClick={(e) => onConfirmPassword(e)}>
                {t("confirm")}
              </Button>
              <DialogClose />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ProfileForm = ({
  defaultValues,
  onSubmit,
  extraField,
  isLoading = false,
}: {
  defaultValues: FormValues;
  onSubmit: (values: FormValues) => void;
  extraField?: React.ReactNode;
  isLoading: boolean;
}) => {
  const { t } = useLocale();
  const [firstRender, setFirstRender] = useState(true);
  const [editableHeader, setEditableHeader] = useState(false);
  const [editableExp, setEditableExp] = useState(false);
  const [editableEdu, setEditableEdu] = useState(false);
  const [showErrorInHeader, setShowErrorInHeader] = useState(false);
  const [editableAbout, setEditableAbout] = useState(false);
  const [editableSkill, setEditableSkill] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [expEduAvatar, setExpEduAvatar] = useState<string>("");

  const [addExpOpen, setAddExpOpen] = useState(false);
  const [showErrorInExp, setShowErrorInExp] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceInput[]>([]);
  const [indexExp, setIndexExp] = useState(-1);
  const [positionExp, setPositionExp] = useState("");
  const [companyExp, setCompanyExp] = useState("");
  const [addressExp, setAddressExp] = useState<string | undefined>("");
  const [startMonthExp, setStartMonthExp] = useState(new Date().getMonth() + 1);
  const [startYearExp, setStartYearExp] = useState(new Date().getFullYear());
  const [endMonthExp, setEndMonthExp] = useState(new Date().getMonth() + 1);
  const [endYearExp, setEndYearExp] = useState(new Date().getFullYear());

  const [addEduOpen, setAddEduOpen] = useState(false);
  const [showErrorInEdu, setShowErrorInEdu] = useState(false);
  const [educations, setEducations] = useState<EducationInput[]>([]);
  const [social, setSocial] = useState<SocialType>({
    telegram: "",
    facebook: "",
    discord: "",
    instagram: "",
    linkedin: "",
  });
  const [indexEdu, setIndexEdu] = useState(-1);
  const [schoolEdu, setSchoolEdu] = useState("");
  const [majorEdu, setMajorEdu] = useState<string | undefined>("");
  const [degreeEdu, setDegreeEdu] = useState<string | undefined>("");
  const [startMonthEdu, setStartMonthEdu] = useState(new Date().getMonth() + 1);
  const [startYearEdu, setStartYearEdu] = useState(new Date().getFullYear());
  const [endMonthEdu, setEndMonthEdu] = useState(new Date().getMonth() + 1);
  const [endYearEdu, setEndYearEdu] = useState(new Date().getFullYear());

  let settable = true;
  const profileFormSchema = z.object({
    username: z.string(),
    avatar: z.string(),
    name: z
      .string()
      .trim()
      .min(1, t("you_need_to_add_a_name"))
      .max(FULL_NAME_LENGTH_MAX_LIMIT, {
        message: t("max_limit_allowed_hint", { limit: FULL_NAME_LENGTH_MAX_LIMIT }),
      }),
    email: z.string().email(),
    bio: z.string(),
    position: z.string(),
    address: z.string(),
    experiences: z.array(
      z.object({
        id: z.number().optional(),
        position: z.string(),
        company: z.string(),
        address: z.string().optional(),
        startMonth: z.number().optional(),
        startYear: z.number().optional(),
        endMonth: z.number().optional(),
        endYear: z.number().optional(),
        avatar: z.nullable(z.string()),
        userId: z.number().optional(),
        delete: z.boolean().optional(),
      })
    ),
    educations: z.array(
      z.object({
        id: z.number().optional(),
        school: z.string(),
        major: z.string().optional(),
        degree: z.string().optional(),
        startMonth: z.number().optional(),
        startYear: z.number().optional(),
        endMonth: z.number().optional(),
        endYear: z.number().optional(),
        avatar: z.nullable(z.string()),
        userId: z.number().optional(),
        delete: z.boolean().optional(),
      })
    ),
    skills: z.array(z.string()),
    social: z.object({
      telegram: z.string().optional(),
      facebook: z.string().optional(),
      discord: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    }),
  });

  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(profileFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const isDisabled = isSubmitting || !isDirty;

  useEffect(() => {
    setSkills(formMethods.getValues("skills"));
    setExperiences(
      formMethods.getValues("experiences").map((exp) => {
        return {
          ...exp,
          key: Math.floor(Math.random() * 1000000).toString(),
        };
      })
    );
    setEducations(
      formMethods.getValues("educations").map((edu) => {
        return {
          ...edu,
          key: Math.floor(Math.random() * 1000000).toString(),
        };
      })
    );
    setSocial(formMethods.getValues("social"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  const handleUpdateContactInfo = () => {
    if (
      (formMethods.getValues("name") &&
        formMethods.getValues("position") &&
        formMethods.getValues("address")) ||
      !editableHeader
    ) {
      setEditableHeader(!editableHeader);
      setShowErrorInHeader(false);
    } else {
      setEditableHeader(!editableHeader);
      setShowErrorInHeader(false);
    }
  };

  return (
    <div>
      <Form form={formMethods} handleSubmit={onSubmit}>
        {!isDisabled && (
          <Alert className="mb-4" key="info_save_change" severity="info" title={t("info_save_change")} />
        )}
        <div className="flex items-center">
          <Controller
            control={formMethods.control}
            name="avatar"
            render={({ field: { value } }) => (
              <Card
                title=""
                containerProps={{
                  style: { width: "100%", borderRadius: "20px" },
                }}
                variant="ProfileCard"
                description={
                  <div className="flex flex-col items-start justify-between md:flex-row">
                    <div className="flex w-full justify-between md:w-auto md:justify-normal">
                      {!editableHeader ? (
                        <Avatar
                          alt=""
                          imageSrc={value}
                          gravatarFallbackMd5="fallback"
                          size="xl"
                          className="bg-white border-2 border-solid border-pink"
                        />
                      ) : (
                        <ImageUploader
                          target="avatar"
                          id="avatar-upload"
                          avatar={value}
                          buttonMsg=""
                          handleAvatarChange={(newAvatar) => {
                            formMethods.setValue("avatar", newAvatar, { shouldDirty: true });
                          }}
                          imageSrc={value || undefined}
                        />
                      )}
                      <div className="flex md:hidden">
                        <Button
                          color="primary"
                          StartIcon={!editableHeader ? Edit2 : Cross}
                          className={`!rounded-full ${editableHeader ? "rotate-45 transform" : ""}`}
                          variant="icon"
                          onClick={handleUpdateContactInfo}
                        />
                      </div>
                    </div>
                    <div className="items-left mx-4 mt-4 flex flex-grow flex-col md:mt-0">
                      <div
                        className={
                          !editableHeader && defaultValues.position
                            ? ""
                            : "flex w-full flex-col gap-2 md:flex-row"
                        }>
                        <div
                          className={
                            !editableHeader && defaultValues.position ? "" : "w-full flex-col text-xl"
                          }>
                          {!editableHeader ? (
                            <p className="text-3xl font-bold text-black">
                              {defaultValues.name ? defaultValues.name : t("nameless")}
                            </p>
                          ) : (
                            <>
                              <TextField label={`${t("full_name")}*`} {...formMethods.register("name")} />
                              {showErrorInHeader && !formMethods.getValues("name") && (
                                <Alert
                                  key="error_full_name_required"
                                  severity="error"
                                  title={t("error_full_name_required")}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <div
                          className={classNames(
                            !editableHeader && defaultValues.position ? "mt-4" : "w-full flex-col"
                          )}>
                          {!editableHeader ? (
                            <>{defaultValues.position}</>
                          ) : (
                            <>
                              <TextField label={`${t("position")}*`} {...formMethods.register("position")} />
                              {showErrorInHeader && !formMethods.getValues("position") && (
                                <Alert
                                  key="error_current_position_required"
                                  severity="error"
                                  title={t("error_current_position_required")}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className={!editableHeader ? "" : "flex w-full flex-col gap-2 md:flex-row"}>
                        <div
                          className={
                            !editableHeader && defaultValues.address ? "mt-2 flex" : "flex w-full flex-col"
                          }>
                          {!editableHeader ? (
                            <>
                              <MousePointer2 className="w-4 h-4 mr-2 transform rotate-90" fill="gray" />
                              {defaultValues.address}
                            </>
                          ) : (
                            <>
                              <TextField label={`${t("address")}*`} {...formMethods.register("address")} />
                              {showErrorInHeader && !formMethods.getValues("address") && (
                                <Alert
                                  className="mb-2"
                                  key="error_address_required"
                                  severity="error"
                                  title={t("error_address_required")}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <div
                          className={
                            !editableHeader
                              ? "mt-2 flex flex-wrap items-center gap-2"
                              : "mt-2 flex w-full flex-col items-start md:mt-7"
                          }>
                          <div className={!editableHeader ? "" : "flex w-full flex-row items-center gap-2"}>
                            <Button
                              color="secondary"
                              className="bg-transparent border-gray-700 rounded-full md:rounded-full"
                              variant="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 496 512"
                                style={{ fill: "#434C5C" }}>
                                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                              </svg>
                            </Button>
                            <TextField
                              autoComplete="off"
                              value={social.telegram}
                              onChange={(e: any) => {
                                setSocial({ ...social, telegram: e.target.value });
                                formMethods.setValue(
                                  "social",
                                  { ...social, telegram: e.target.value },
                                  { shouldDirty: true }
                                );
                              }}
                              label=""
                              className={!editableHeader ? "hidden" : "w-full"}
                            />
                          </div>

                          <div className={!editableHeader ? "" : "flex w-full flex-row items-center gap-2"}>
                            <Button
                              color="secondary"
                              StartIcon={Facebook}
                              className="bg-transparent border-gray-700 rounded-full md:rounded-full"
                              variant="icon"
                            />
                            <TextField
                              autoComplete="off"
                              value={social.facebook}
                              onChange={(e: any) => {
                                setSocial({ ...social, facebook: e.target.value });
                                formMethods.setValue(
                                  "social",
                                  { ...social, facebook: e.target.value },
                                  { shouldDirty: true }
                                );
                              }}
                              label=""
                              className={!editableHeader ? "hidden" : ""}
                            />
                          </div>
                          <div className={!editableHeader ? "" : "flex w-full flex-row items-center gap-2"}>
                            <Button
                              color="secondary"
                              className="bg-transparent border-gray-700 rounded-full md:rounded-full"
                              variant="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                style={{ fill: "#434C5C" }}>
                                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                              </svg>
                            </Button>
                            <TextField
                              autoComplete="off"
                              value={social.discord}
                              onChange={(e: any) => {
                                setSocial({ ...social, discord: e.target.value });
                                formMethods.setValue(
                                  "social",
                                  { ...social, discord: e.target.value },
                                  { shouldDirty: true }
                                );
                              }}
                              label=""
                              className={!editableHeader ? "hidden" : ""}
                            />
                          </div>
                          <div className={!editableHeader ? "" : "flex w-full flex-row items-center gap-2"}>
                            <Button
                              color="secondary"
                              StartIcon={Instagram}
                              className="bg-transparent border-gray-700 rounded-full md:rounded-full"
                              variant="icon"
                            />
                            <TextField
                              autoComplete="off"
                              value={social.instagram}
                              onChange={(e: any) => {
                                setSocial({ ...social, instagram: e.target.value });
                                formMethods.setValue(
                                  "social",
                                  { ...social, instagram: e.target.value },
                                  { shouldDirty: true }
                                );
                              }}
                              label=""
                              className={!editableHeader ? "hidden" : ""}
                            />
                          </div>
                          <div className={!editableHeader ? "" : "flex w-full flex-row items-center gap-2"}>
                            <Button
                              color="secondary"
                              StartIcon={Linkedin}
                              className="bg-transparent border-gray-700 rounded-full md:rounded-full"
                              variant="icon"
                            />
                            <TextField
                              autoComplete="off"
                              value={social.linkedin}
                              onChange={(e: any) => {
                                setSocial({ ...social, linkedin: e.target.value });
                                formMethods.setValue(
                                  "social",
                                  { ...social, linkedin: e.target.value },
                                  { shouldDirty: true }
                                );
                              }}
                              label=""
                              className={!editableHeader ? "hidden" : ""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex">
                      <Button
                        color="primary"
                        StartIcon={!editableHeader ? Edit2 : Cross}
                        className={`!rounded-full ${editableHeader ? "rotate-45 transform" : ""}`}
                        variant="icon"
                        onClick={handleUpdateContactInfo}
                      />
                    </div>
                  </div>
                }
              />
            )}
          />
        </div>
        <div className="mt-8">
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="flex justify-between mb-4">
                  <Label className="text-lg">{t("about")}</Label>
                  <Button
                    color="primary"
                    StartIcon={!editableAbout ? Edit2 : Cross}
                    className={`!rounded-full ${editableAbout ? "rotate-45 transform" : ""}`}
                    variant="icon"
                    onClick={() => {
                      if (!editableAbout) {
                        settable = true;
                      }
                      setEditableAbout(!editableAbout);
                    }}
                  />
                </div>
                {editableAbout ? (
                  <Editor
                    getText={() => {
                      if (settable) {
                        settable = false;
                        return md.render(formMethods.getValues("bio") || "");
                      } else {
                        return md.render("");
                      }
                    }}
                    setText={(value: string) => {
                      formMethods.setValue("bio", turndown(value), { shouldDirty: true });
                    }}
                    excludedToolbarItems={["blockType"]}
                    disableLists
                    firstRender={firstRender}
                    setFirstRender={setFirstRender}
                  />
                ) : (
                  <div className={defaultValues.bio.length ? "m-4" : "w-full p-2 text-center"}>
                    {defaultValues.bio.length ? defaultValues.bio : t("no_data_yet")}
                  </div>
                )}
              </>
            }
          />
        </div>
        <div className="mt-8">
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="flex justify-between mb-4">
                  <Label className="text-lg">{t("skill")}</Label>
                  <div className="flex gap-2">
                    {editableSkill && (
                      <Button
                        color="primary"
                        StartIcon={Cross}
                        className="!rounded-full"
                        variant="icon"
                        onClick={() => {
                          const tmp = skills.concat("");
                          setSkills(tmp);
                        }}
                      />
                    )}
                    <Button
                      color="primary"
                      StartIcon={!editableSkill ? Edit2 : Cross}
                      className={`!rounded-full ${editableSkill ? "rotate-45 transform" : ""}`}
                      variant="icon"
                      onClick={() => {
                        setEditableSkill(!editableSkill);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full gap-2 mb-4">
                  {(!editableSkill && defaultValues.skills.length === 0) ||
                  (editableSkill && skills.length === 0) ? (
                    <div className="p-2 text-center">{t("no_data_yet")}</div>
                  ) : (
                    <>
                      {!editableSkill
                        ? defaultValues.skills.map((skill, i) => (
                            <div
                              className="p-2 text-center bg-white border-gray-500 border-none rounded-md"
                              key={i}>
                              {skill}
                            </div>
                          ))
                        : skills.map((skill, i) => (
                            <div className="flex" key={i}>
                              <Input
                                className="w-[100px] !rounded-full !rounded-r-none border-r-0 focus:ring-0"
                                value={skill}
                                onChange={(event) => {
                                  const formData = [...skills];
                                  formData[i] = event.target.value;
                                  formMethods.setValue(
                                    "skills",
                                    formData.filter((skill) => skill),
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                  setSkills(formData);
                                }}
                              />
                              <Button
                                color="secondary"
                                StartIcon={X}
                                className="!rounded-full !rounded-l-none border-l-0"
                                variant="icon"
                                onClick={() => {
                                  const formData = [...skills.slice(0, i), ...skills.slice(i + 1)];
                                  formMethods.setValue("skills", formData, { shouldDirty: true });
                                  setSkills(formData);
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
        <div className="flex flex-col gap-2 mt-8 md:flex-row">
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="flex justify-between mb-4">
                  <Label className="text-lg">{t("exp")}</Label>
                  <div className="flex gap-2">
                    {editableExp && (
                      <Button
                        color="primary"
                        StartIcon={Cross}
                        className="!rounded-full"
                        variant="icon"
                        onClick={() => {
                          setAddExpOpen(true);
                          setPositionExp("");
                          setCompanyExp("");
                          setAddressExp("");
                          setIndexExp(-1);
                          setExpEduAvatar("");
                          setStartMonthExp(new Date().getMonth() + 1);
                          setStartYearExp(new Date().getFullYear());
                          setEndMonthExp(new Date().getMonth() + 1);
                          setEndYearExp(new Date().getFullYear());
                        }}
                      />
                    )}
                    <Button
                      color="primary"
                      StartIcon={!editableExp ? Edit2 : Cross}
                      className={`!rounded-full ${editableExp ? "rotate-45 transform" : ""}`}
                      variant="icon"
                      onClick={() => {
                        setEditableExp(!editableExp);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col pl-4">
                  {!editableExp ? (
                    <>
                      {defaultValues.experiences.length === 0 ? (
                        <div className="w-full p-2 text-center">{t("no_data_yet")}</div>
                      ) : (
                        <>
                          {defaultValues.experiences.map((exp) => {
                            return (
                              <div className="flex flex-col mb-4 items-left" key={`exp-${exp.id}`}>
                                <div className="flex gap-2 mb-4">
                                  <div className="mr-4">
                                    <Avatar
                                      alt=""
                                      imageSrc={exp.avatar || ""}
                                      gravatarFallbackMd5="fallback"
                                      size="sm"
                                    />
                                  </div>
                                  <div className="flex flex-col justify-start">
                                    <div className="mb-1">
                                      <b>{exp.position}</b>
                                    </div>
                                    <div>{exp.company}</div>
                                    <div>{`${months[exp.startMonth - 1]["label"]} ${exp.startYear} - ${
                                      months[exp.endMonth - 1]["label"]
                                    } ${exp.endYear}`}</div>
                                    {exp.address && <div>{exp.address}</div>}
                                  </div>
                                </div>
                                <hr />
                              </div>
                            );
                          })}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {experiences.filter((exp) => !exp.delete).length === 0 ? (
                        <div className="w-full p-2 text-center">{t("no_data_yet")}</div>
                      ) : (
                        <>
                          {experiences.map((exp, i) => {
                            if (exp.delete) {
                              return <></>;
                            } else {
                              return (
                                <div className="flex flex-col mb-4 items-left" key={exp.key}>
                                  <div className="flex gap-2 mb-4">
                                    <div className="flex-grow">
                                      <Avatar
                                        alt=""
                                        imageSrc={exp.avatar || ""}
                                        gravatarFallbackMd5="fallback"
                                        size="sm"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start flex-grow">
                                      <div className="mb-1">
                                        <b>{exp.position}</b>
                                      </div>
                                      <div>{exp.company}</div>
                                      <div>{`${months[exp.startMonth - 1]["label"]} ${exp.startYear} - ${
                                        months[exp.endMonth - 1]["label"]
                                      } ${exp.endYear}`}</div>
                                      {exp.address && <div>{exp.address}</div>}
                                    </div>
                                    <div className="flex justify-end flex-grow">
                                      <Button
                                        color="primary"
                                        StartIcon={Edit2}
                                        className="!rounded-full"
                                        variant="icon"
                                        size="sm"
                                        onClick={() => {
                                          setAddExpOpen(true);
                                          setIndexExp(i);
                                          setPositionExp(exp.position);
                                          setCompanyExp(exp.company);
                                          setAddressExp(exp.address);
                                          setStartMonthExp(exp.startMonth);
                                          setStartYearExp(exp.startYear);
                                          setEndMonthExp(exp.endMonth);
                                          setEndYearExp(exp.endYear);
                                          setExpEduAvatar(exp.avatar || "");
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              );
                            }
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            }
          />
          <Card
            title=""
            containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
            variant="ProfileCard"
            description={
              <>
                <div className="flex justify-between mb-4">
                  <Label className="text-lg">{t("edu")}</Label>
                  <div className="flex gap-2">
                    {editableEdu && (
                      <Button
                        color="primary"
                        StartIcon={Cross}
                        className="!rounded-full"
                        variant="icon"
                        onClick={() => {
                          setAddEduOpen(true);
                          setSchoolEdu("");
                          setDegreeEdu("");
                          setMajorEdu("");
                          setIndexEdu(-1);
                          setExpEduAvatar("");
                          setStartMonthEdu(new Date().getMonth() + 1);
                          setStartYearEdu(new Date().getFullYear());
                          setEndMonthEdu(new Date().getMonth() + 1);
                          setEndYearEdu(new Date().getFullYear());
                        }}
                      />
                    )}
                    <Button
                      color="primary"
                      StartIcon={!editableEdu ? Edit2 : Cross}
                      className={`!rounded-full ${editableEdu ? "rotate-45 transform" : ""}`}
                      variant="icon"
                      onClick={() => {
                        setEditableEdu(!editableEdu);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col pl-4">
                  {!editableEdu ? (
                    <>
                      {defaultValues.educations.length === 0 ? (
                        <div className="w-full p-2 text-center">{t("no_data_yet")}</div>
                      ) : (
                        <>
                          {defaultValues.educations.map((edu) => {
                            return (
                              <div className="flex flex-col mb-4 items-left" key={`edu-${edu.id}`}>
                                <div className="flex gap-2 mb-4">
                                  <div className="mr-4">
                                    <Avatar
                                      alt=""
                                      imageSrc={edu.avatar || ""}
                                      gravatarFallbackMd5="fallback"
                                      size="sm"
                                    />
                                  </div>
                                  <div className="flex flex-col justify-start">
                                    <div className="mb-1">
                                      <b>{edu.school}</b>
                                    </div>
                                    {edu.degree && <div>{edu.degree}</div>}
                                    <div>{`${months[edu.startMonth - 1]["label"]} ${edu.startYear} - ${
                                      months[edu.endMonth - 1]["label"]
                                    } ${edu.endYear}`}</div>
                                    {edu.major && <div>{edu.major}</div>}
                                  </div>
                                </div>
                                <hr />
                              </div>
                            );
                          })}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {educations.filter((edu) => !edu.delete).length === 0 ? (
                        <div className="w-full p-2 text-center">{t("no_data_yet")}</div>
                      ) : (
                        <>
                          {educations.map((edu, i) => {
                            if (edu.delete) {
                              return <></>;
                            } else {
                              return (
                                <div className="flex flex-col mb-4 items-left" key={edu.key}>
                                  <div className="flex gap-2 mb-4">
                                    <div className="flex-grow">
                                      <Avatar
                                        alt=""
                                        imageSrc={edu.avatar || ""}
                                        gravatarFallbackMd5="fallback"
                                        size="sm"
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start flex-grow">
                                      <div className="mb-1">
                                        <b>{edu.school}</b>
                                      </div>
                                      {edu.degree && <div>{edu.degree}</div>}
                                      <div>{`${months[edu.startMonth - 1]["label"]} ${edu.startYear} - ${
                                        months[edu.endMonth - 1]["label"]
                                      } ${edu.endYear}`}</div>
                                      {edu.major && <div>{edu.major}</div>}
                                    </div>
                                    <div className="flex justify-end flex-grow">
                                      <Button
                                        color="primary"
                                        StartIcon={Edit2}
                                        className="!rounded-full"
                                        variant="icon"
                                        size="sm"
                                        onClick={() => {
                                          setAddEduOpen(true);
                                          setIndexEdu(i);
                                          setSchoolEdu(edu.school);
                                          setDegreeEdu(edu.degree);
                                          setMajorEdu(edu.major);
                                          setStartMonthEdu(edu.startMonth);
                                          setStartYearEdu(edu.startYear);
                                          setEndMonthEdu(edu.endMonth);
                                          setEndYearEdu(edu.endYear);
                                          setExpEduAvatar(edu.avatar || "");
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              );
                            }
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            }
          />
        </div>
        <div className="hidden">{extraField}</div>
        <div className="hidden">
          <TextField label={t("email")} hint={t("change_email_hint")} {...formMethods.register("email")} />
        </div>
        <Button loading={isLoading} disabled={isDisabled} color="primary" className="mt-8 mr-4" type="submit">
          {t("update")}
        </Button>
        {!isDisabled && (
          <Button
            onClick={() => {
              formMethods.reset(defaultValues);
              setSkills(formMethods.getValues("skills"));
              setExperiences(
                formMethods.getValues("experiences").map((exp) => {
                  return {
                    ...exp,
                    key: Math.floor(Math.random() * 1000000).toString(),
                  };
                })
              );
              setEducations(
                formMethods.getValues("educations").map((edu) => {
                  return {
                    ...edu,
                    key: Math.floor(Math.random() * 1000000).toString(),
                  };
                })
              );
              setEditableHeader(false);
              setEditableExp(false);
              setEditableEdu(false);
              setEditableAbout(false);
              setEditableSkill(false);
            }}
            color="secondary"
            className="mt-8">
            {t("restore")}
          </Button>
        )}
      </Form>
      {/* add Exp */}
      <Dialog open={addExpOpen} onOpenChange={setAddExpOpen}>
        <DialogContent
          title={indexExp === -1 ? t("add_exp") : t("change_exp")}
          description={t("enter_previous_work_exp")}
          type="creation"
          Icon={AlertTriangle}>
          <div className="mb-10">
            <TextField
              className="mb-2"
              label={`${t("position")}*`}
              name={t("position")}
              value={positionExp}
              onChange={(e) => {
                setPositionExp(e.target.value);
              }}
            />
            {showErrorInExp && !positionExp && (
              <Alert key="error_position_required" severity="error" title={t("error_position_required")} />
            )}
            <TextField
              className="mb-2"
              label={`${t("company")}*`}
              name={t("company")}
              value={companyExp}
              onChange={(e) => {
                setCompanyExp(e.target.value);
              }}
            />
            {showErrorInExp && !companyExp && (
              <Alert key="error_company_required" severity="error" title={t("error_company_required")} />
            )}
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <SelectField
                  options={months}
                  label={t("startMonth")}
                  value={{ value: startMonthExp, label: months[startMonthExp - 1]["label"] }}
                  onChange={(e) => {
                    if (e && (startYearExp < endYearExp || e.value <= endMonthExp)) {
                      setStartMonthExp(e.value);
                    }
                  }}
                />
                <SelectField
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const options = [];

                    for (let i = currentYear; i >= currentYear - 30; i--) {
                      options.push({ value: i, label: `${i}` });
                    }

                    return options;
                  })()}
                  label={t("startYear")}
                  value={{ value: startYearExp, label: `${startYearExp}` }}
                  onChange={(e) => {
                    if (
                      e &&
                      (e.value < endYearExp || (e.value === endYearExp && startMonthExp <= endMonthExp))
                    ) {
                      setStartYearExp(e.value);
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <SelectField
                  options={months}
                  label={t("endMonth")}
                  value={{ value: endMonthExp, label: months[endMonthExp - 1]["label"] }}
                  onChange={(e) => {
                    if (e && (startYearExp < endYearExp || e.value >= startMonthExp)) {
                      if (!(endYearExp === new Date().getFullYear() && e.value > new Date().getMonth() + 1)) {
                        setEndMonthExp(e.value);
                      }
                    }
                  }}
                />
                <SelectField
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const options = [];

                    for (let i = currentYear; i >= currentYear - 30; i--) {
                      options.push({ value: i, label: `${i}` });
                    }

                    return options;
                  })()}
                  label={t("endYear")}
                  value={{ value: endYearExp, label: `${endYearExp}` }}
                  onChange={(e) => {
                    if (
                      e &&
                      (e.value > startYearExp || (e.value === startYearExp && startMonthExp <= endMonthExp))
                    ) {
                      setEndYearExp(e.value);
                    }
                  }}
                />
              </div>
            </div>
            <TextField
              className="mb-2"
              label={t("address")}
              name={t("address")}
              value={addressExp}
              onChange={(e) => {
                setAddressExp(e.target.value);
              }}
            />
            <div className="flex flex-col">
              <Label className="text-sm">{t("image")}</Label>
              <ImageUploader
                target="Image"
                id="image-exp-upload"
                isFilled
                buttonMsg=""
                large
                handleAvatarChange={(avatar) => {
                  setExpEduAvatar(avatar);
                }}
                imageSrc={expEduAvatar || undefined}
              />
            </div>
          </div>
          <DialogFooter showDivider>
            {indexExp !== -1 && (
              <Button
                color="primary"
                onClick={() => {
                  setAddExpOpen(false);
                  const formData = [...experiences];
                  formData[indexExp].delete = true;
                  setExperiences(formData);
                  formMethods.setValue("experiences", formData, { shouldDirty: true });
                  setShowErrorInEdu(false);
                }}>
                {t("delete")}
              </Button>
            )}
            <Button
              color="primary"
              onClick={() => {
                if (positionExp && companyExp) {
                  setAddExpOpen(false);
                  let formData;
                  if (indexExp === -1) {
                    formData = experiences.concat({
                      id: undefined,
                      key: Math.floor(Math.random() * 1000000).toString(),
                      position: positionExp,
                      company: companyExp,
                      address: addressExp,
                      startMonth: startMonthExp,
                      startYear: startYearExp,
                      endMonth: endMonthExp,
                      endYear: endYearExp,
                      avatar: expEduAvatar || "",
                      delete: undefined,
                    });
                  } else {
                    formData = [...experiences];
                    formData[indexExp] = {
                      ...formData[indexExp],
                      position: positionExp,
                      company: companyExp,
                      address: addressExp,
                      startMonth: startMonthExp,
                      startYear: startYearExp,
                      endMonth: endMonthExp,
                      endYear: endYearExp,
                      avatar: expEduAvatar || "",
                    };
                  }
                  setExperiences(formData);
                  formMethods.setValue("experiences", formData, { shouldDirty: true });
                  setShowErrorInExp(false);
                } else {
                  setShowErrorInExp(true);
                }
              }}>
              {indexExp === -1 ? t("add") : t("update")}
            </Button>
            <DialogClose
              onClick={() => {
                setShowErrorInEdu(false);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* add Edu */}
      <Dialog open={addEduOpen} onOpenChange={setAddEduOpen}>
        <DialogContent
          title={indexEdu === -1 ? t("add_edu") : t("change_edu")}
          description={t("enter_edu")}
          type="creation"
          Icon={AlertTriangle}>
          <div className="mb-10">
            <TextField
              className="mb-2"
              label={`${t("school")}*`}
              name={t("school")}
              value={schoolEdu}
              onChange={(e) => {
                setSchoolEdu(e.target.value);
              }}
            />
            {showErrorInEdu && !schoolEdu && (
              <Alert key="error_school_required" severity="error" title={t("error_school_required")} />
            )}
            <TextField
              className="mb-2"
              label={t("degree")}
              name={t("degree")}
              value={degreeEdu}
              onChange={(e) => {
                setDegreeEdu(e.target.value);
              }}
            />
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <SelectField
                  options={months}
                  label={t("startMonth")}
                  value={{ value: startMonthEdu, label: months[startMonthEdu - 1]["label"] }}
                  onChange={(e) => {
                    if (e && (startYearEdu < endYearEdu || e.value <= endMonthEdu)) {
                      setStartMonthEdu(e.value);
                    }
                  }}
                />
                <SelectField
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const options = [];

                    for (let i = currentYear; i >= currentYear - 30; i--) {
                      options.push({ value: i, label: `${i}` });
                    }

                    return options;
                  })()}
                  label={t("startYear")}
                  value={{ value: startYearEdu, label: `${startYearEdu}` }}
                  onChange={(e) => {
                    if (
                      e &&
                      (e.value < endYearEdu || (e.value === endYearEdu && startMonthEdu <= endMonthEdu))
                    ) {
                      setStartYearEdu(e.value);
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <SelectField
                  options={months}
                  label={t("endMonth")}
                  value={{ value: endMonthEdu, label: months[endMonthEdu - 1]["label"] }}
                  onChange={(e) => {
                    if (e && (startYearEdu < endYearEdu || e.value >= startMonthEdu)) {
                      if (!(endYearEdu === new Date().getFullYear() && e.value > new Date().getMonth() + 1)) {
                        setEndMonthEdu(e.value);
                      }
                    }
                  }}
                />
                <SelectField
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const options = [];

                    for (let i = currentYear; i >= currentYear - 30; i--) {
                      options.push({ value: i, label: `${i}` });
                    }

                    return options;
                  })()}
                  label={t("endYear")}
                  value={{ value: endYearEdu, label: `${endYearEdu}` }}
                  onChange={(e) => {
                    if (
                      e &&
                      (e.value > startYearEdu || (e.value === startYearEdu && startMonthEdu <= endMonthEdu))
                    ) {
                      setEndYearEdu(e.value);
                    }
                  }}
                />
              </div>
            </div>
            <TextField
              className="mb-2"
              label={t("major")}
              name={t("major")}
              value={majorEdu}
              onChange={(e) => {
                setMajorEdu(e.target.value);
              }}
            />
            <div className="flex flex-col">
              <Label className="text-sm">{t("image")}</Label>
              <ImageUploader
                target="Image"
                id="image-edu-upload"
                isFilled
                buttonMsg=""
                large
                handleAvatarChange={(avatar) => {
                  setExpEduAvatar(avatar);
                }}
                imageSrc={expEduAvatar || undefined}
              />
            </div>
          </div>
          <DialogFooter showDivider>
            {indexEdu !== -1 && (
              <Button
                color="primary"
                onClick={() => {
                  setAddEduOpen(false);
                  const formData = [...educations];
                  formData[indexEdu].delete = true;
                  setEducations(formData);
                  formMethods.setValue("educations", formData, { shouldDirty: true });
                  setShowErrorInEdu(false);
                }}>
                {t("delete")}
              </Button>
            )}
            <Button
              color="primary"
              onClick={() => {
                if (schoolEdu) {
                  setAddEduOpen(false);
                  let formData;
                  if (indexEdu === -1) {
                    formData = educations.concat({
                      id: undefined,
                      key: Math.floor(Math.random() * 1000000).toString(),
                      school: schoolEdu,
                      degree: degreeEdu,
                      major: majorEdu,
                      startMonth: startMonthEdu,
                      startYear: startYearEdu,
                      endMonth: endMonthEdu,
                      endYear: endYearEdu,
                      avatar: expEduAvatar || "",
                      delete: undefined,
                    });
                  } else {
                    formData = [...educations];
                    formData[indexEdu] = {
                      ...formData[indexEdu],
                      school: schoolEdu,
                      degree: degreeEdu,
                      major: majorEdu,
                      startMonth: startMonthEdu,
                      startYear: startYearEdu,
                      endMonth: endMonthEdu,
                      endYear: endYearEdu,
                      avatar: expEduAvatar || "",
                    };
                  }
                  setEducations(formData);
                  formMethods.setValue("educations", formData, { shouldDirty: true });
                  setShowErrorInEdu(false);
                } else {
                  setShowErrorInEdu(true);
                }
              }}>
              {indexEdu === -1 ? t("add") : t("update")}
            </Button>
            <DialogClose
              onClick={() => {
                setShowErrorInEdu(false);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ProfileView.getLayout = getLayout;
ProfileView.PageWrapper = PageWrapper;

export default ProfileView;
