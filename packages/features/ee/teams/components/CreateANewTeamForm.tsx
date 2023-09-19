import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { extractDomainFromWebsiteUrl } from "@calcom/ee/organizations/lib/utils";
import { useOrgBrandingValues } from "@calcom/features/ee/organizations/hooks";
import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import slugify from "@calcom/lib/slugify";
import { telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { trpc } from "@calcom/trpc/react";
import { Button, Form, ImageUploader, TextField, Alert } from "@calcom/ui";

import type { NewTeamFormValues } from "../lib/types";

const querySchema = z.object({
  returnTo: z.string().optional(),
  slug: z.string().optional(),
});

export const CreateANewTeamForm = () => {
  const { t } = useLocale();
  const router = useRouter();
  const telemetry = useTelemetry();
  const parsedQuery = querySchema.safeParse(router.query);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string>("");
  const orgBranding = useOrgBrandingValues();

  const returnToParam =
    (parsedQuery.success ? getSafeRedirectUrl(parsedQuery.data.returnTo) : "/settings/teams") ||
    "/settings/teams";

  const newTeamFormMethods = useForm<NewTeamFormValues>({
    defaultValues: {
      slug: parsedQuery.success ? parsedQuery.data.slug : "",
    },
  });

  const createTeamMutation = trpc.viewer.teams.create.useMutation({
    onSuccess: (data) => {
      telemetry.event(telemetryEventTypes.team_created);
      router.push(`/settings/teams/${data.id}/onboard-members`);
    },
    onError: (err) => {
      if (err.message === "team_url_taken") {
        newTeamFormMethods.setError("slug", { type: "custom", message: t("url_taken") });
      } else {
        setServerErrorMessage(err.message);
      }
    },
  });

  return (
    <>
      <Form
        className="mb-3 rounded-md border border-gray-100 p-5 dark:border-neutral-800"
        form={newTeamFormMethods}
        handleSubmit={(v) => {
          if (!createTeamMutation.isLoading) {
            setServerErrorMessage(null);
            createTeamMutation.mutate(v);
          }
        }}>
        <div className="mb-8 px-4 pt-4">
          {serverErrorMessage && (
            <div className="mb-4">
              <Alert severity="error" message={serverErrorMessage} />
            </div>
          )}

          <Controller
            name="name"
            control={newTeamFormMethods.control}
            defaultValue=""
            rules={{
              required: t("must_enter_team_name"),
            }}
            render={({ field: { value } }) => (
              <>
                <TextField
                  className="mt-2"
                  placeholder="Acme Inc."
                  name="name"
                  label={t("team_name")}
                  defaultValue={value}
                  onChange={(e) => {
                    newTeamFormMethods.setValue("name", e?.target.value);
                    setTeamName(e?.target.value);
                    if (newTeamFormMethods.formState.touchedFields["slug"] === undefined) {
                      newTeamFormMethods.setValue("slug", slugify(e?.target.value));
                    }
                  }}
                  autoComplete="off"
                />
              </>
            )}
          />
        </div>

        <div className="mb-8 px-4">
          <Controller
            name="slug"
            control={newTeamFormMethods.control}
            rules={{ required: t("team_url_required") }}
            render={({ field: { value } }) => (
              <TextField
                className="mt-2"
                name="slug"
                placeholder="acme"
                label={t("team_url")}
                addOnLeading={`${
                  orgBranding?.fullDomain.replace("https://", "").replace("http://", "") ??
                  `${extractDomainFromWebsiteUrl}/team/`
                }`}
                defaultValue={value}
                onChange={(e) => {
                  newTeamFormMethods.setValue("slug", slugify(e?.target.value), {
                    shouldTouch: true,
                  });
                  newTeamFormMethods.clearErrors("slug");
                }}
              />
            )}
          />
        </div>

        <div className="mb-8 px-4">
          <Controller
            control={newTeamFormMethods.control}
            name="logo"
            render={({ field: { value } }) => (
              <>
                <div className="flew-row flex items-center">
                  <div className=" flex-1">
                    <ImageUploader
                      large
                      target="avatar"
                      id="avatar-upload"
                      buttonMsg={t("update")}
                      handleAvatarChange={(newAvatar: string) => {
                        newTeamFormMethods.setValue("logo", newAvatar);
                        createTeamMutation.reset();
                      }}
                      imageSrc={value}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* <AddNewTeamMembers /> */}
                    {/* <div className="flex w-full flex-row rounded-md border px-2 py-2 ">
                      <div className="flex-col">
                        <Avatar
                          className="border-default h-[45px] w-[45px] border"
                          alt=""
                          imageSrc={value}
                          size="lg"
                        />
                      </div>
                      <div className="text-subtle m-1 flex flex-col gap-1 pl-1 text-sm font-light">
                        <span className="flex-row">
                          {teamName && teamName.length > 0 ? teamName : "acme"}
                        </span>
                        <span className="flex-row">
                          {`${orgBranding?.fullDomain ?? `${extractDomainFromWebsiteUrl}`}`}
                        </span>
                      </div>
                    </div>
                    <div className=" text-subtle flex w-full flex-row rounded-md border px-2 py-2 ">
                      + Add club deal member
                    </div> */}
                  </div>
                </div>
              </>
            )}
          />
        </div>

        <div className="px-4">
          <div className="ms-4 flex justify-end pb-4 rtl:space-x-reverse">
            <Button
              disabled={newTeamFormMethods.formState.isSubmitting || createTeamMutation.isLoading}
              color="primary"
              type="submit"
              className=" w-full justify-center md:w-[50%]">
              {t("continue")}
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};
