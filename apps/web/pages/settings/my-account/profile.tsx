import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import type { BaseSyntheticEvent } from "react";
import { useRef, useState } from "react";
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
  Editor,
  Card,
} from "@calcom/ui";
import {
  AlertTriangle,
  Trash2,
  Edit2,
  Facebook,
  Instagram,
  Linkedin,
  Cross,
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
          <SkeletonAvatar className="me-4 mt-0 h-16 w-16 px-4" />
          <SkeletonButton className="h-6 w-32 rounded-md p-5" />
        </div>
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />

        <SkeletonButton className="mr-6 h-8 w-20 rounded-md p-5" />
      </div>
    </SkeletonContainer>
  );
};

interface DeleteAccountValues {
  totpCode: string;
}

type FormValues = {
  username: string;
  avatar: string;
  name: string;
  email: string;
  bio: string;
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

  const defaultValues = {
    username: user.username || "",
    avatar: avatar.avatar || "",
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
  };

  return (
    <>
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

      <hr className="border-subtle my-6" />

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
              <p className="text-default mb-4">
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
    </>
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
  const [editableAbout, setEditableAbout] = useState(false);
  const [editableSkill, setEditableSkill] = useState(false);
  const [editableExp, setEditableExp] = useState(false);
  const [editableEducation, setEditableEducation] = useState(false);

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
  });

  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(profileFormSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const isDisabled = isSubmitting || !isDirty;

  return (
    <Form form={formMethods} handleSubmit={onSubmit}>
      <div className="flex items-center">
        <Controller
          control={formMethods.control}
          name="avatar"
          render={({ field: { value } }) => (
            <Card
              title=""
              containerProps={{ style: { width: "60%", borderRadius: "20px" } }}
              variant="ProfileCard"
              description={
                <div className="flex items-center">
                  {!editableHeader ? (
                    <Avatar alt="" imageSrc={value} gravatarFallbackMd5="fallback" size="lg" />
                  ) : (
                    <ImageUploader
                      target="avatar"
                      id="avatar-upload"
                      buttonMsg={<Edit2 />}
                      handleAvatarChange={(newAvatar) => {
                        formMethods.setValue("avatar", newAvatar, { shouldDirty: true });
                      }}
                      imageSrc={value || undefined}
                    />
                  )}
                  <div className="items-left ms-4 flex flex-col">
                    <div className="text-xl">
                      {!editableHeader ? (
                        <>{defaultValues.name}</>
                      ) : (
                        <TextField label={t("full_name")} {...formMethods.register("name")} />
                      )}
                    </div>
                    <div className="mt-4">Full Stack Software Developer</div>
                    <div className="mt-2">24 Nga Tsin Wai Road, Kowloon, Hong Kong</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div>
                        <Button color="secondary" className="rounded-full text-gray-500" variant="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 496 512"
                            style={{ fill: "gray" }}>
                            <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                          </svg>
                        </Button>
                      </div>
                      <div>
                        <Button
                          color="secondary"
                          StartIcon={Facebook}
                          className="rounded-full"
                          variant="icon"
                        />
                      </div>
                      <div>
                        <Button color="secondary" className="rounded-full" variant="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 640 512"
                            style={{ fill: "gray" }}>
                            <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                          </svg>
                        </Button>
                      </div>
                      <div>
                        <Button
                          color="secondary"
                          StartIcon={Instagram}
                          className="rounded-full"
                          variant="icon"
                        />
                      </div>
                      <div>
                        <Button
                          color="secondary"
                          StartIcon={Linkedin}
                          className="rounded-full"
                          variant="icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ms-4">
                    <Button
                      color="secondary"
                      StartIcon={!editableHeader ? Edit2 : Cross}
                      className={!editableHeader ? "rounded-full" : "rotate-45 transform rounded-full"}
                      variant="icon"
                      onClick={() => {
                        setEditableHeader(!editableHeader);
                      }}
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
              <div className="mb-4 flex justify-between">
                <Label className="text-lg">{t("about")}</Label>
                <Button
                  color="secondary"
                  StartIcon={!editableAbout ? Edit2 : Cross}
                  className={!editableAbout ? "rounded-full" : "rotate-45 transform rounded-full"}
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
                <>{defaultValues.bio}</>
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
              <div className="mb-4 flex justify-between">
                <Label className="text-lg">{t("skill")}</Label>
                <Button
                  color="secondary"
                  StartIcon={!editableSkill ? Edit2 : Cross}
                  className={!editableSkill ? "rounded-full" : "rotate-45 transform rounded-full"}
                  variant="icon"
                  onClick={() => {
                    setEditableSkill(!editableSkill);
                  }}
                />
              </div>
            </>
          }
        />
      </div>
      <div className="mt-8 flex gap-2">
        <Card
          title=""
          containerProps={{ style: { width: "50%", borderRadius: "20px" } }}
          variant="ProfileCard"
          description={
            <>
              <div className="mb-4 flex justify-between">
                <Label className="text-lg">{t("exp")}</Label>
                <Button
                  color="secondary"
                  StartIcon={!editableExp ? Edit2 : Cross}
                  className={!editableExp ? "rounded-full" : "rotate-45 transform rounded-full"}
                  variant="icon"
                  onClick={() => {
                    setEditableExp(!editableExp);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="items-left mb-4 flex flex-col">
                  <div className="mb-4 flex gap-2">
                    <div>
                      <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <b>Full Stack Software Developer</b>
                      </div>
                      <div>Lambda Vision</div>
                      <div>Aug 2023 - Present : 1 month</div>
                      <div>24 Nga Tsin Wai Road, Kowloon, Hong Kong</div>
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="items-left mb-4 flex flex-col">
                  <div className="mb-4 flex gap-2">
                    <div>
                      <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <b>Full Stack Software Developer</b>
                      </div>
                      <div>Lambda Vision</div>
                      <div>Aug 2023 - Present : 1 month</div>
                      <div>24 Nga Tsin Wai Road, Kowloon, Hong Kong</div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </>
          }
        />
        <Card
          title=""
          containerProps={{ style: { width: "50%", borderRadius: "20px" } }}
          variant="ProfileCard"
          description={
            <>
              <div className="mb-4 flex justify-between">
                <Label className="text-lg">{t("education")}</Label>
                <Button
                  color="secondary"
                  StartIcon={!editableEducation ? Edit2 : Cross}
                  className={!editableEducation ? "rounded-full" : "rotate-45 transform rounded-full"}
                  variant="icon"
                  onClick={() => {
                    setEditableEducation(!editableEducation);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="items-left mb-4 flex flex-col">
                  <div className="mb-4 flex gap-2">
                    <div>
                      <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <b>The Univerity Of Hong Kong</b>
                      </div>
                      <div>Bachelor's Degree</div>
                      <div>Computer Science</div>
                      <div>Feb 2012 - Feb 2016</div>
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="items-left mb-4 flex flex-col">
                  <div className="mb-4 flex gap-2">
                    <div>
                      <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-1">
                        <b>The Univerity Of Hong Kong</b>
                      </div>
                      <div>Bachelor's Degree</div>
                      <div>Computer Science</div>
                      <div>Feb 2012 - Feb 2016</div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </>
          }
        />
      </div>
      <div className="hidden">{extraField}</div>
      <div className="hidden">
        <TextField label={t("email")} hint={t("change_email_hint")} {...formMethods.register("email")} />
      </div>
      <Button loading={isLoading} disabled={isDisabled} color="primary" className="mt-8" type="submit">
        {t("update")}
      </Button>
    </Form>
  );
};

ProfileView.getLayout = getLayout;
ProfileView.PageWrapper = PageWrapper;

export default ProfileView;
