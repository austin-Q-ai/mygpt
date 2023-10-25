import axios from "axios";
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { UserLevel } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { EmptyScreen, Button, Meta, PasswordField, showToast, InputField } from "@calcom/ui";
import { Mail } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

const ExpertGPTView = () => {
    const { data: user } = trpc.viewer.me.useQuery();
    const { t } = useLocale();
    const supabase = createClientComponentClient();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);

    const mutation = trpc.viewer.updateProfile.useMutation();
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
                        if (data.error.message === "Email not confirmed" || data.error.message === "Invalid login credentials") {
                            supabase.auth.signUp({
                                email: user?.email,
                                password: confirmPassword,
                            })
                                .then(() => {
                                    setShowVerifyEmail(true);
                                });
                        } else {
                            showToast(t("error_during_login"), "error");
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
                            .then((resp) => {
                                mutation.mutate({
                                    apiKey: resp.data.api_key,
                                })
                            });
                    }
                });
        },
        onError(error) {
            if (error.message === "UNAUTHORIZED") {
                showToast(t("current_incorrect_password"), "error");
            } else {
                showToast(t("unexpected_error_try_again") + "\n" + error.message, "error");
            }
        },
    });
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        confirmPasswordMutation.mutate({ passwordInput: confirmPassword });
    };
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <Meta title={t("expert_clone")} description={t("expert_clone_description", { appName: APP_NAME })} />
                {!showVerifyEmail ? <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <InputField
                            name="E-mail"
                            className="mb-5"
                            value={user?.email}
                            readOnly
                        />
                        <PasswordField
                            name="Password"
                            className="mb-5"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <Button type="submit" color="primary" loading={confirmPasswordMutation.isLoading}>
                        {t("sign_in")}
                    </Button>
                </form>
                    : <div className="h-[100vh] w-full ">
                        <div className="flex flex-col items-center w-full h-full">
                            <div className="max-w-3xl">
                                <EmptyScreen
                                    border={false}
                                    dashedBorder={false}
                                    Icon={Mail}
                                    headline={t("confirm_email_supabase_title")}
                                    description={t("confirm_email_supabase_description")}
                                    className="bg-transparent"
                                    buttonRaw={
                                        <Button
                                            color="primary"
                                            loading={mutation.isLoading}
                                            onClick={() => {
                                                supabase.auth
                                                    .resend({
                                                        type: "signup",
                                                        email: user?.email,
                                                    }).then(() => showToast("Sent email", "success"))
                                            }}>
                                            {t("request_a_resend")}
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    );
};

ExpertGPTView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
ExpertGPTView.PageWrapper = PageWrapper;

export default ExpertGPTView;
