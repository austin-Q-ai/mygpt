/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MeiliSearch } from "meilisearch";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { components } from "react-select";
import { z } from "zod";

import { createTokenPaymentLink } from "@calcom/app-store/stripepayment/lib/client";
import { LineChart } from "@calcom/features/insights/components/LineChart";
import { valueFormatter } from "@calcom/features/insights/lib";
import Shell from "@calcom/features/shell/Shell";
import { buyTokens } from "@calcom/features/timetokenswallet";
import { IS_PRODUCTION } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import {
  Select,
  Button,
  Avatar,
  Badge,
  ConfirmationDialogContent,
  Dialog,
  Form,
  InputField,
  showToast,
} from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

import { withQuery } from "@lib/QueryCell";
import type { HttpError } from "@lib/core/http/error";

import PageWrapper from "@components/PageWrapper";
import CustomExpertTable from "@components/timetokens-wallet/CustomExpertTable";
import type { ExpertDataType } from "@components/timetokens-wallet/CustomExpertTable";
import SkeletonLoader from "@components/timetokens-wallet/SkeletonLoader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithQuery = withQuery(trpc.viewer.timetokenswallet.getAddedExperts as any);

type ExpertOptionType = {
  label: string;
  value: number;
  avatar: string;
  added: boolean;
};

type FormValues = {
  price: number;
  priceUnit: number;
};

function TimeTokensWallet() {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const router = useRouter();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();

  const [addedExpertsData, setAddedExpertsData] = useState<ExpertDataType[]>([]);
  const [buyConfirmOpen, setBuyConfirmOpen] = useState<boolean>(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState<boolean>(false);
  const [buyExpertID, setBuyExpertID] = useState<number>(-1);
  const [removeExpertID, setRemoveExpertID] = useState<number>(-1);
  const [buyTokensAmount, setBuyTokensAmount] = useState<number>(0);
  const [expertOptions, setExpertOptions] = useState<ExpertOptionType[]>([]);
  const [addExpertId, setAddExpertId] = useState<number>(-1);
  // const [user, setUser] = useState<any>(null);

  const meiliClient = new MeiliSearch({
    host: IS_PRODUCTION
      ? `https://${process.env.NEXT_PUBLIC_MEILISEARCH_HOST}`
      : `http://${process.env.NEXT_PUBLIC_MEILISEARCH_HOST}`,
    apiKey: process.env.NEXT_PUBLIC_SEARCH_API_KEY,
  });

  const columns: string[] = ["Expert", "Tokens amount(expert)", "Tokens amount(me)", "Token price", ""];

  const handleBuyEvent = (emitterId: number, tokens: number) => {
    setBuyConfirmOpen(true);
    setBuyExpertID(emitterId);
    setBuyTokensAmount(tokens);
  };

  const handleRemoveEvent = (emitterId: number) => {
    setRemoveConfirmOpen(true);
    setRemoveExpertID(emitterId);
  };

  const CustomOption = ({
    icon,
    value,
    label,
    added,
  }: {
    icon: string;
    value: number;
    label: string;
    added: boolean;
  }) => {
    return (
      <div className="flex items-center">
        <Avatar className="mr-2" alt="Nameless" size="sm" imageSrc={icon} />
        <span>{label}</span>
        {added && (
          <Badge className="ml-auto text-[.5rem] sm:text-sm" size="md" variant="gray">
            {t("added")}
          </Badge>
        )}
      </div>
    );
  };

  trpc.viewer.timetokenswallet.getAddedExperts.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data, "===== get added experts");
      setAddedExpertsDataHandler(data.users);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const mutation = trpc.viewer.updateProfile.useMutation({
    onSuccess: () => {
      showToast(t("profile_updated_successfully"), "success");
      utils.viewer.me.invalidate();
    },
    onError: () => {
      showToast(t("error_updating_settings"), "error");
    },
  });

  // trpc.viewer.me.useQuery(undefined, {
  //   onSuccess: (data) => {
  //     setUser(data);
  //   },
  //   onError: (error) => {
  //     console.log("error", "==== error ====");
  //   },
  // });

  const addExpertMutation = trpc.viewer.timetokenswallet.addExpert.useMutation({
    onSuccess: (data) => {
      console.log("=== add expert ====");
      if (data?.env) {
        console.log("=== env ===");
        console.log(data.env);
        console.log("=== env ===");
      }
      setAddedExpertsDataHandler(data.users);
    },
  });

  const removeExpertMutation = trpc.viewer.timetokenswallet.removeExpert.useMutation({
    onSuccess: (data) => {
      console.log("=== remove expert ====");
      setAddedExpertsDataHandler(data.users);
    },
  });

  // const buyTokensMutation = trpc.viewer.timetokenswallet.buyTokens.useMutation({
  //   onSuccess: (data) => {
  //     setAddedExpertsDataHandler(data.users);
  //   },
  // });

  const buyTokensMutation = useMutation(buyTokens, {
    onSuccess: async (responseData) => {
      const { paymentUid } = responseData;
      if (paymentUid) {
        return await router.push(
          createTokenPaymentLink({
            paymentUid,
          })
        );
      }
    },
    onError: (error: HttpError) => {
      if (error?.message === "Missing payment credentials") {
        showToast(t("not_able_recieve_payment"), "error");
      }
    },
  });

  const addExpert = () => {
    console.log(addExpertId, "=====");
    addExpertMutation.mutate({ emitterId: addExpertId });
  };

  const customFilter = (option: any, searchText: string) => {
    return true;
  };

  const handleExpertSearch = async (value: string) => {
    const index = meiliClient.index("users");
    const res = await index.search(value);

    const data = [];

    if (value) {
      for (const expert of res.hits) {
        if (isLoading || expert.objectID === user?.id) continue;
        data.push({
          label: expert.name,
          value: expert.objectID,
          avatar: expert.avatar,
          added: expert.added && expert?.added.indexOf(user?.id) > -1,
        });
      }
    }

    setExpertOptions(data);
    // try {
    //   const index = meiliClient.index("users");
    //   index.search(value).then((res) => {
    //     const data = [];

    //     for (const expert of res.hits) {
    //       if (isLoading || expert.objectID === user?.id) continue;
    //       data.push({
    //         label: expert.name,
    //         value: expert.objectID,
    //         avatar: expert.avatar,
    //         added: expert.added && expert?.added.indexOf(user?.id) > -1,
    //       });
    //     }

    //     setExpertOptions(data);
    //   });
    // } catch (error) {
    //   console.error("Error searching:", error);
    // }
  };

  const setAddedExpertsDataHandler = (users: any) => {
    const data = [];

    for (const item of users) {
      data.push({
        userId: item.emitter.id,
        username: item.emitter.username,
        fullname: item.emitter.name,
        avatar: item.emitter.avatar,
        expert_token_amount: item.emitter.tokens,
        token_amount: item.amount,
        token_price: item.emitter.price[item.emitter.price.length - 1],
        buy_amount: 10,
        added: true,
      });
    }

    setAddedExpertsData(data);
  };

  const defaultValues: FormValues = {
    price: user?.price[user?.price.length - 1] || 1,
    priceUnit: 1,
  };

  const priceSchema = z.object({
    price: z.union([z.string(), z.number()]),
  });

  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(priceSchema),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const isDisabled = isSubmitting || !isDirty;

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      price: parseFloat(values.price),
    });
  };

  return (
    <Shell heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
      <WithQuery
        customLoader={<SkeletonLoader />}
        success={({ data }) => {
          return (
            <>
              <div className="flex flex-col-reverse justify-between lg:flex-row">
                <div className="mb-8 flex w-full items-center justify-center gap-4 px-1 sm:mb-12 sm:px-4 lg:mt-[150px] lg:w-2/3">
                  <Select
                    options={expertOptions}
                    components={{
                      Option: (props) => {
                        return (
                          <components.Option {...props}>
                            <CustomOption
                              icon={props.data.avatar}
                              value={props.data.value}
                              label={props.data.label}
                              added={props.data.added}
                            />
                          </components.Option>
                        );
                      },
                    }}
                    isSearchable={true}
                    filterOption={customFilter}
                    className="w-full rounded-md text-[.5rem] sm:text-sm"
                    onChange={(event) => {
                      console.log(event);
                      setAddExpertId(event?.added ? -1 : event?.value || -1);
                    }}
                    onInputChange={(value) => {
                      handleExpertSearch(value);
                    }}
                  />
                  <Button
                    disabled={addExpertId === -1}
                    className="text-[.5rem] sm:text-sm"
                    onClick={addExpert}
                    data-testid=""
                    StartIcon={Plus}>
                    {t("add")}
                  </Button>
                </div>
                {/* Time Token Price update Graph  */}
                <Form form={formMethods} handleSubmit={onSubmit}>
                  <div className="bg-pink/10 mx-4 mb-2 flex min-w-[250px] flex-col gap-1 rounded-md p-4 lg:absolute lg:right-14 lg:top-10 lg:w-1/5">
                    {/* need to be fixed */}
                    <p className="text-center font-bold">TimeToken Price</p>
                    {!isLoading && user && (
                      <>
                        {user.TokenPrice.length > 0 && (
                          <LineChart
                            className="h-24 bg-white p-1"
                            data={user.TokenPrice.map((v) => ({
                              price: v.price,
                              createdDate: v.createdDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              }),
                            }))}
                            index="createdDate"
                            colors={["green"]}
                            categories={["price"]}
                            valueFormatter={valueFormatter}
                            showLegend={false}
                          />
                        )}
                        <InputField
                          label=""
                          addOnLeading={user.currency.toUpperCase() || "EUR"}
                          {...formMethods.register("price")}
                          type="number"
                          step="0.01"
                        />
                      </>
                    )}
                    <Button
                      loading={mutation.isLoading}
                      disabled={isDisabled}
                      className="bg-pink/20 hover:bg-pink/10 text-secondary flex w-full items-center justify-center !rounded-full"
                      type="submit">
                      {t("update")} {t("token_price")}
                    </Button>
                  </div>
                </Form>
              </div>

              <CustomExpertTable
                columns={columns}
                expertsData={addedExpertsData}
                handleBuyEvent={handleBuyEvent}
                handleRemoveEvent={handleRemoveEvent}
              />

              <Dialog open={buyConfirmOpen} onOpenChange={setBuyConfirmOpen}>
                <ConfirmationDialogContent
                  variety="danger"
                  title="Confirmation"
                  confirmBtnText={t(`confirm_buy_event`)}
                  loadingText={t(`confirm_buy_event`)}
                  onConfirm={(e) => {
                    e.preventDefault();
                    buyTokensMutation.mutate({ emitterId: buyExpertID, amount: buyTokensAmount });
                    setBuyConfirmOpen(false);
                  }}>
                  <p className="mt-5">{t(`confirm_buy_question`)}</p>
                </ConfirmationDialogContent>
              </Dialog>

              <Dialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
                <ConfirmationDialogContent
                  variety="danger"
                  title="Confirmation"
                  confirmBtnText={t(`confirm_remove_event`)}
                  loadingText={t(`confirm_remove_event`)}
                  onConfirm={(e) => {
                    e.preventDefault();
                    removeExpertMutation.mutate({ emitterId: removeExpertID });
                    setRemoveConfirmOpen(false);
                  }}>
                  <p className="mt-5">{t(`confirm_remove_question`)}</p>
                </ConfirmationDialogContent>
              </Dialog>
            </>
          );
        }}
      />
    </Shell>
  );
}

TimeTokensWallet.PageWrapper = PageWrapper;

export default TimeTokensWallet;
