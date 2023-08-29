import MeiliSearch from "meilisearch";
import React, { useEffect, useState } from "react";
import { components } from "react-select";

import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Select, Button, Avatar, Badge, ConfirmationDialogContent, Dialog } from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

import { withQuery } from "@lib/QueryCell";

import PageWrapper from "@components/PageWrapper";
import SkeletonLoader from "@components/availability/SkeletonLoader";
import CustomExpertTable from "@components/timetokens-wallet/CustomExpertTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithQuery = withQuery(trpc.viewer.availability.list as any);

function TimeTokensWallet() {
  const { t } = useLocale();

  trpc.viewer.timetokenswallet.searchUser.useQuery(
    { name: "a" },
    {
      onSuccess: (data) => {
        console.log(data, "=====");
      },
    }
  );

  const [addedExpertsData, setAddedExpertsData] = useState<any[]>([]);
  const [buyConfirmOpen, setBuyConfirmOpen] = useState<boolean>(false);
  const [buyExpertEmail, setBuyExpertEmail] = useState<string>("");
  const [buyTokensAmount, setBuyTokensAmount] = useState<number>(0);
  const [expertSearchResult, setExpertSearchResult] = useState<any[]>([]);
  const [expertOptions, setExpertOptions] = useState<any[]>([]);
  const [addExpertEmail, setAddExpertEmail] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const mockupData: any[] = [
    {
      email: "cawsonoliver33@gmail.com",
      fullname: "Expert 1",
      expert_token_amount: 1000,
      token_amount: 200,
      token_price: 5,
      added: false,
    },
    {
      email: "cawsonoliver44@gmail.com",
      fullname: "Expert 2",
      expert_token_amount: 1000,
      token_amount: 200,
      token_price: 5,
      added: false,
    },
    {
      email: "cawsonoliver55@gmail.com",
      fullname: "Expert 3",
      expert_token_amount: 1000,
      token_amount: 0,
      token_price: 5,
      added: true,
    },
    {
      email: "cawsonoliver66@gmail.com",
      fullname: "Expert 4",
      expert_token_amount: 1000,
      token_amount: 0,
      token_price: 5,
      added: true,
    },
    {
      email: "cawsonoliver77@gmail.com",
      fullname: "Expert 5",
      expert_token_amount: 1000,
      token_amount: 200,
      token_price: 5,
      added: false,
    },
    {
      email: "cawsonoliver88@gmail.com",
      fullname: "Expert 6",
      token_amount: 200,
      token_price: 5,
      added: false,
    },
  ];

  const client = new MeiliSearch({
    host: `https://${process.env.MEILISEARCH_HOST}`,
    apiKey: process.env.SEARCH_API_KEY, // search apiKey
  });

  console.log(process.env.MEILISEARCH_HOST);

  const columns: string[] = ["Expert", "Tokens amount", "Token price", ""];

  useEffect(() => {
    if (expertSearchResult.length === 0) {
      setAddedExpertsData([]);
      setExpertSearchResult(mockupData);
      changeExpertOptions(mockupData);
    }

    console.log(addedExpertsData);
  }, []);

  useEffect(() => {
    const search = async () => {
      const results = await client.index("users").search("");
      setSearchResults(results.hits);
    };
    search();
  }, []);

  const handleBuyEvent = (email: string, tokens: number) => {
    setBuyConfirmOpen(true);
    setBuyExpertEmail(email);
    setBuyTokensAmount(tokens);
  };

  const changeExpertOptions = (searchResult: any[]) => {
    const data = [];
    for (const expert of searchResult) {
      data.push({
        label: expert.fullname,
        value: expert.email,
        added: expert.added,
      });
    }

    setExpertOptions(data);
    console.log(data);
  };

  const CustomOption = ({ icon, label, added }: { icon: string; label: string; added: boolean }) => {
    return (
      <div className="flex items-center">
        <Avatar className="mr-2" alt="Nameless" size="sm" imageSrc={icon} />
        <span>{label}</span>
        {added && (
          <Badge className="ml-auto" size="md" variant="gray">
            {t("added")}
          </Badge>
        )}
      </div>
    );
  };

  const addExpert = () => {
    for (const expert of expertSearchResult) {
      if (expert?.email === addExpertEmail) {
        setAddedExpertsData([...addedExpertsData, expert]);
        break;
      }
    }
  };

  return (
    <Shell heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
      <WithQuery
        customLoader={<SkeletonLoader />}
        success={({ data }) => {
          return (
            <>
              <div className="mb-4 flex w-full items-center justify-center gap-4 px-4 lg:w-2/3">
                <Select
                  options={expertOptions}
                  components={{
                    Option: (props) => {
                      return (
                        <components.Option {...props}>
                          <CustomOption
                            icon={props.data.icon}
                            label={props.data.label}
                            added={props.data.added}
                          />
                        </components.Option>
                      );
                    },
                  }}
                  isSearchable={true}
                  className="w-full rounded-md text-sm"
                  onChange={(event) => {
                    setAddExpertEmail(event?.value);
                  }}
                />
                <Button disabled={addExpertEmail === ""} onClick={addExpert} data-testid="" StartIcon={Plus}>
                  {t("add")}
                </Button>
              </div>
              <CustomExpertTable
                columns={columns}
                expertsData={addedExpertsData}
                handleBuyEvent={handleBuyEvent}
              />
              <Dialog open={buyConfirmOpen} onOpenChange={setBuyConfirmOpen}>
                <ConfirmationDialogContent
                  variety="danger"
                  title="Confirmation"
                  confirmBtnText={t(`confirm_buy_event`)}
                  loadingText={t(`confirm_buy_event`)}
                  onConfirm={(e) => {
                    e.preventDefault();
                    console.log(buyExpertEmail, buyTokensAmount);
                    setBuyConfirmOpen(false);
                  }}>
                  <p className="mt-5">Do you want to really buy tokens?</p>
                </ConfirmationDialogContent>
              </Dialog>
            </>
          );
        }}
      />
      <div>
        {searchResults.map((result, index) => (
          <p key={result.objectID}>{result.name}</p> // Or whatever property your objects have
        ))}
      </div>
    </Shell>
  );
}

TimeTokensWallet.PageWrapper = PageWrapper;

export default TimeTokensWallet;
