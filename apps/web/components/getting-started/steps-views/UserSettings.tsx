import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { components } from "react-select";
import { z } from "zod";

import dayjs from "@calcom/dayjs";
import { FULL_NAME_LENGTH_MAX_LIMIT } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { trpc } from "@calcom/trpc/react";
import { Alert, Button, Select, PasswordField, TimezoneSelect, Tooltip } from "@calcom/ui";
import { ArrowRight, AlertCircle } from "@calcom/ui/components/icon";

import { UsernameAvailabilityField } from "@components/ui/UsernameAvailability";

interface IUserSettingsProps {
  nextStep: () => void;
}

type CurrencyOptionType = {
  label: string;
  value: string;
};

const currencyOption: CurrencyOptionType[] = [
  {
    label: "US Dollar(USD)",
    value: "usd",
  },
  {
    label: "Euro(EUR)",
    value: "eur",
  },
];

const UserSettings = (props: IUserSettingsProps) => {
  const { nextStep } = props;
  const [user] = trpc.viewer.me.useSuspenseQuery();
  const [currency, setCurrency] = useState<string>("usd");
  const { t } = useLocale();
  const [selectedTimeZone, setSelectedTimeZone] = useState(dayjs.tz.guess());
  const telemetry = useTelemetry();
  const supabase = createClientComponentClient();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordErrorMessage, setConfirmPasswordDeleteErrorMessage] = useState<string>("");
  const [notConfirmed, setNotConfirmed] = useState(false);
  const userSettingsSchema = z.object({
    name: z
      .string()
      .min(1)
      .max(FULL_NAME_LENGTH_MAX_LIMIT, {
        message: t("max_limit_allowed_hint", { limit: FULL_NAME_LENGTH_MAX_LIMIT }),
      }),
    price: z.string(),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof userSettingsSchema>>({
    defaultValues: {
      name: user?.name || "",
      price: "1",
    },
    reValidateMode: "onChange",
    resolver: zodResolver(userSettingsSchema),
  });

  const CustomOption = ({ value, label }: CurrencyOptionType) => {
    return (
      <div className="flex items-center">
        <span>{label}</span>
      </div>
    );
  };

  useEffect(() => {
    telemetry.event(telemetryEventTypes.onboardingStarted);
  }, [telemetry]);

  const utils = trpc.useContext();
  const onSuccess = async () => {
    await utils.viewer.me.invalidate();
    nextStep();
  };
  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: onSuccess,
  });

  const confirmPasswordMutation = trpc.viewer.auth.verifyPassword.useMutation({
    onSuccess() {
      supabase.auth
        .signInWithPassword({
          email: user?.email,
          password: confirmPassword,
        })
        .then((data) => {
          setConfirmPassword("");
          if (data.error) {
            if (data.error.message === "Email not confirmed") {
              setNotConfirmed(true);
              setConfirmPasswordDeleteErrorMessage("Email for Supabase not confirmed, Click resend button");
            } else {
              setConfirmPasswordDeleteErrorMessage(data.error.message);
            }
          } else {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/api-key`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${data.data.session.access_token}`,
                  },
                }
              )
              .then((data) => {
                const formData = getValues();
                mutation.mutate({
                  name: formData.name,
                  price: parseFloat(formData.price),
                  timeZone: selectedTimeZone,
                  defaultValue: true,
                  currency: currency,
                  apiKey: data.data.api_key,
                });
              });
          }
        });
    },
    onError() {
      setConfirmPasswordDeleteErrorMessage(t("incorrect_password"));
      setConfirmPassword("");
    },
  });

  const onSubmit = handleSubmit(() => {
    confirmPasswordMutation.mutate({ passwordInput: confirmPassword });
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        {/* Username textfield */}
        <UsernameAvailabilityField />

        {/* Full name textfield */}
        <div className="w-full">
          <label htmlFor="name" className="text-default mb-2 block text-sm font-medium">
            {t("full_name")}
          </label>
          <input
            {...register("name", {
              required: true,
            })}
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            className="border-default w-full rounded-md border text-sm"
          />
          {errors.name && (
            <p data-testid="required" className="py-2 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Token price textfield */}
        <div className="w-full">
          <label htmlFor="price" className="text-default mb-2 block text-sm font-medium">
            {t("token_price")}
          </label>
          <input
            {...register("price", {
              required: true,
            })}
            id="price"
            name="price"
            type="number"
            autoComplete="off"
            autoCorrect="off"
            min="0"
            step="0.01"
            className="border-default w-full rounded-md border text-sm"
          />
          {errors.price && (
            <p data-testid="required" className="py-2 text-xs text-red-500">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Currency select field */}
        <div className="w-full">
          <label htmlFor="Currency" className="text-default block text-sm font-medium">
            {t("currency")}
          </label>

          <div className="flex items-center">
            <Select
              id="currency"
              options={currencyOption}
              components={{
                Option: (props) => {
                  return (
                    <components.Option {...props}>
                      <CustomOption value={props.data.value} label={props.data.label} />
                    </components.Option>
                  );
                },
              }}
              onChange={(event) => {
                setCurrency(event?.value || "eur");
              }}
              className="mt-2 w-full rounded-md text-sm"
            />

            <Tooltip content="You define your base currency once and you can't change it later">
              <AlertCircle className="ml-2 h-4 w-4 text-black/10" />
            </Tooltip>
          </div>
        </div>

        {/* Timezone select field */}
        <div className="w-full">
          <label htmlFor="timeZone" className="text-default block text-sm font-medium">
            {t("timezone")}
          </label>

          <TimezoneSelect
            id="timeZone"
            value={selectedTimeZone}
            onChange={({ value }) => setSelectedTimeZone(value)}
            className="mt-2 w-full rounded-md text-sm"
          />

          <p className="text-subtle dark:text-inverted mt-3 flex flex-row font-sans text-xs leading-tight">
            {t("current_time")} {dayjs().tz(selectedTimeZone).format("LT").toString().toLowerCase()}
          </p>
        </div>

        {/* Confirm your password for get API key */}
        <div className="w-full">
          <PasswordField
            name="Confirm Password"
            className="mb-5"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          {confirmPasswordErrorMessage && <Alert severity="error" title={confirmPasswordErrorMessage} />}
        </div>

        {notConfirmed && (
          <Button
            color="secondary"
            onClick={() => {
              supabase.auth
                .resend({
                  type: "signup",
                  email: user?.email,
                })
                .then(() => {
                  setConfirmPasswordDeleteErrorMessage(
                    "Verification Email was sent. Plz check and try again."
                  );
                })
                .catch((e) => setConfirmPasswordDeleteErrorMessage(e));
            }}>
            {t("resend")}
          </Button>
        )}
      </div>
      <Button
        type="submit"
        className="mt-8 flex w-full flex-row justify-center"
        disabled={mutation.isLoading}>
        {t("next_step_text")}
        <ArrowRight className="ml-2 h-4 w-4 self-center" aria-hidden="true" />
      </Button>
    </form>
  );
};

export { UserSettings };
