import { MeiliSearch } from "meilisearch";
import React, { useState, useEffect } from "react";
import { components } from "react-select";
import { useRouter } from "next/router";
import { createPaymentLink } from "@calcom/app-store/stripepayment/lib/client";
import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Select, Button, Avatar, Badge, ConfirmationDialogContent, Dialog } from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

import { withQuery } from "@lib/QueryCell";

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

function TimeTokensWallet() {
  const { t } = useLocale();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const router = useRouter();
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
    host: `https://${process.env.MEILISEARCH_HOST}`,
    apiKey: process.env.SEARCH_API_KEY,
  });

  const columns: string[] = ["Expert", "Tokens amount(expert)", "Tokens amount(me)", "Token price", ""];

  const handleBuyEvent = (userId: number, tokens: number) => {
    setBuyConfirmOpen(true);
    setBuyExpertID(userId);
    setBuyTokensAmount(tokens);
  };

  const handleRemoveEvent = (emitterId: number) => {
    setRemoveConfirmOpen(true);
    setRemoveExpertID(emitterId);
  };

  const CustomOption = ({ icon, label, added }: { icon: string; label: string; added: boolean }) => {
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
      setAddedExpertsDataHandler(data.users);
    },
  });

  const removeExpertMutation = trpc.viewer.timetokenswallet.removeExpert.useMutation({
    onSuccess: (data) => {
      console.log("=== remove expert ====");
      setAddedExpertsDataHandler(data.users);
    },
  });

  const buyTokensMutation = trpc.viewer.timetokenswallet.buyTokens.useMutation({
    onSuccess: (data) => {
      setAddedExpertsDataHandler(data.users);
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

  return (
    <Shell heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
      <WithQuery
        customLoader={<SkeletonLoader />}
        success={({ data }) => {
          return (
            <>
              <div className="mb-8 flex w-full items-center justify-center gap-4 px-1 sm:mb-12 sm:px-4 lg:w-2/3">
                <Select
                  options={expertOptions}
                  components={{
                    Option: (props) => {
                      return (
                        <components.Option {...props}>
                          <CustomOption
                            icon={props.data.avatar}
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
                    router.push(
                      createPaymentLink({
                        expertid: buyExpertID,
                        amount: buyTokensAmount,
                        absolute: false,
                      })
                    );
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
