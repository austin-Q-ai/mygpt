import axios from "axios";
import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { UserLevel } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Alert, Button, Meta, PasswordField, showToast, Input } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import { FileUploader } from "@components/create-bot/FileUploader";
import UploadCard from "@components/create-bot/UploadCard";

const ExpertGPTView = () => {
    const { data: user } = trpc.viewer.me.useQuery();
    const { t } = useLocale();
    const utils = trpc.useContext();
    const supabase = createClientComponentClient();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState<string>("");
    const [notConfirmed, setNotConfirmed] = useState(false);

    const mutation = trpc.viewer.updateProfile.useMutation({
        onSuccess: () => {
            showToast(t("successfully_created"), "success");
            utils.viewer.me.invalidate();
        },
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
                            setConfirmPasswordErrorMessage(
                                t("email_for_supabase_not_confirmed_click_resend_email_button")
                            );
                        } else if (data.error.message === "Invalid login credentials") {
                            // email and password is correct, this means that you are not signed up yet to supabase
                            supabase.auth.signUp({
                                email: user?.email,
                                password: confirmPassword,
                            })
                                .then(() => {
                                    setConfirmPasswordErrorMessage(
                                        t("please_confirm_your_email_for_supabase_signup_and_try_again")
                                    )
                                });
                        } else {
                            setConfirmPasswordErrorMessage(data.error.message);
                        }
                    } else {
                        setConfirmPasswordErrorMessage("");
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
                                axios
                                    .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains/default/`, {
                                        headers: {
                                            Authorization: `Bearer ${data.data.session.access_token}`,
                                        },
                                    })
                                    .then((response) => {
                                        mutation.mutate({
                                            expertId: response.data.id,
                                            apiKey: resp.data.api_key,
                                        });
                                    });
                            });
                    }
                });
        },
        onError() {
            setConfirmPasswordErrorMessage(t("incorrect_password"));
            setConfirmPassword("");
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
                {user?.level !== UserLevel.FREEMIUM ? (
                    <>
                        {user?.expertId ?
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    {!user?.social?.linkedin && <Alert className="mb-4" key="info_input_linekdin_bot" severity="info" title={t("input_linkedin_bot")} />}
                                    <Button color="primary" disabled={user?.social?.linkedin ? false : true} onClick={() => showToast(t("successfully_created"), "success")}>
                                        {t("linkedin_scraping")}
                                    </Button>
                                </div>
                                <FileUploader />

                                <UploadCard className="flex items-center justify-center h-32 gap-5 px-5 mt-5">
                                    <div className="flex flex-col items-center w-full max-w-sm gap-5 text-center">
                                        <Input
                                            name="crawlurl"
                                            // ref={urlInputRef}
                                            type="text"
                                            placeholder="Enter a website URL"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-5 -mt-2">
                                        <Button
                                        // isLoading={isCrawling}
                                        // onClick={() => void crawlWebsite(currentBrain?.id)}
                                        >
                                            Crawl
                                        </Button>
                                    </div>
                                </UploadCard>
                            </> :
                            <form onSubmit={onSubmit}>
                                <div className="w-full">
                                    {confirmPasswordErrorMessage && <Alert className="mb-4" severity="error" title={confirmPasswordErrorMessage} />}
                                    <PasswordField
                                        name="Confirm Password"
                                        className="mb-5"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                        }}
                                        required
                                    />
                                </div>

                                <div className='flex gap-5'>
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
                                                        setConfirmPasswordErrorMessage(
                                                            t("verification_email_was_sent_please_check_and_try_again")
                                                        );
                                                    })
                                                    .catch((e) => setConfirmPasswordErrorMessage(e));
                                            }}>
                                            {t("resend_email")}
                                        </Button>
                                    )}
                                    <Button type="submit" color="primary">
                                        {t("create")}
                                    </Button>
                                </div>
                            </form>
                        }
                    </>) : <Alert className="mb-4" key="info_plan_upgrade_bots" severity="info" title={t("plan_upgrade_bots")} />}
            </div>
        </div>
    );
};

ExpertGPTView.getLayout = function getLayout(page: ReactElement) {
    return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
ExpertGPTView.PageWrapper = PageWrapper;

export default ExpertGPTView;
