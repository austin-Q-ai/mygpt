import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { MeiliSearch } from "meilisearch";
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
  // const [user] = trpc.viewer.me.useSuspenseQuery();
  trpc.viewer.timetokenswallet.user.useQuery(
    { username: "a" },
    {
      onSuccess: (data) => {
        const expertData = [];
        for (const user of data.users) {
          expertData.push({
            email: user.email,
            fullname: user.name,
            expert_token_amount: 1000,
            token_amount: 200,
            token_price: 5,
            added: false,
          });
        }

        // setAddedExpertsData(expertData);
        // changeExpertOptions(expertData);
      },
    }
  );

  const [addedExpertsData, setAddedExpertsData] = useState([]);
  const [buyConfirmOpen, setBuyConfirmOpen] = useState(false);
  const [buyExpertEmail, setBuyExpertEmail] = useState("");
  const [buyTokensAmount, setBuyTokensAmount] = useState(0);
  const [expertSearchResult, setExpertSearchResult] = useState([]);
  const [expertOptions, setExpertOptions] = useState([]);
  const [addExpertId, setAddExpertId] = useState<string>("");

  const mockupData = [
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

  // not working because of https schema
  const searchClient = instantMeiliSearch(
    `https://${process.env.MEILISEARCH_HOST}`,
    process.env.SEARCH_API_KEY // search apiKey
  );

  const meiliClient = new MeiliSearch({
    host: `https://${process.env.MEILISEARCH_HOST}`,
    apiKey: process.env.SEARCH_API_KEY,
  });

  const Hit = ({ hit }) => {
    return (
      <div key={`expert-${hit.id}`}>
        <hr />
        <div>Name: {hit.name}</div>
        <div>Bio: {hit.bio}</div>
        <hr />
      </div>
    );
  };

  const columns = ["Expert", "Tokens amount", "Token price", ""];

  useEffect(() => {
    if (expertSearchResult.length === 0) {
      setAddedExpertsData([]);
      setExpertSearchResult(mockupData);
      // changeExpertOptions(mockupData);
    }
  }, []);

  const handleBuyEvent = (email: string, tokens: number) => {
    setBuyConfirmOpen(true);
    setBuyExpertEmail(email);
    setBuyTokensAmount(tokens);
  };

  // const changeExpertOptions = (searchResult) => {
  //   const data = [];
  //   for (const expert of searchResult) {
  //     data.push({
  //       label: expert.fullname,
  //       value: expert.email,
  //       added: expert.added,
  //     });
  //   }

  //   setExpertOptions(data);
  //   console.log(data);
  // };

  const CustomOption = ({ icon, label, added }) => {
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
    trpc.viewer.timetokenswallet.addExpert.useQuery(
      { userId: addExpertId },
      {
        onSuccess: (data) => {
          console.log(data, "======");
        },
      }
    );
  };

  const customFilter = (option, searchText) => {
    return true;
  };

  const handleExpertSearch = async (value) => {
    if (value.length === 0) {
      setExpertOptions([]);
      return;
    }

    try {
      const index = meiliClient.index("users");
      const searchResults = index.search(value).then((res) => {
        const data = [];
        console.log(res.hits);
        for (const expert of res.hits) {
          data.push({
            label: expert?.name,
            value: expert?.objectId,
            added: true,
          });
        }

        setExpertOptions(data);
      });
    } catch (error) {
      console.error("Error searching:", error);
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
                          <CustomOption icon={null} label={props.data.label} added={props.data.added} />
                        </components.Option>
                      );
                    },
                  }}
                  isSearchable={true}
                  filterOption={customFilter}
                  className="w-full rounded-md text-sm"
                  onChange={(event) => {
                    setAddExpertId(event?.value);
                  }}
                  onInputChange={(value) => {
                    handleExpertSearch(value);
                  }}
                />
                <Button disabled={addExpertId === ""} onClick={addExpert} data-testid="" StartIcon={Plus}>
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
    </Shell>
  );
}

TimeTokensWallet.PageWrapper = PageWrapper;

export default TimeTokensWallet;
