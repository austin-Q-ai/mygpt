import type { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { components } from "react-select";

import { getLayout } from "@calcom/features/MainLayout";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Select, Button, Avatar, Badge, ConfirmationDialogContent, Dialog } from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";
import CustomExpertTable from "@components/timetokens-wallet/CustomExpertTable";

import { ssrInit } from "@server/lib/ssr";

function TimeTokens() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  const [addedExpertsData, setAddedExpertsData] = useState([]);
  const [buyConfirmOpen, setBuyConfirmOpen] = useState(false);
  const [buyExpertEmail, setBuyExpertEmail] = useState("");
  const [buyTokensAmount, setBuyTokensAmount] = useState(0);
  const [expertSearchResult, setExpertSearchResult] = useState([]);
  const [expertOptions, setExpertOptions] = useState([]);
  const [addExpertEmail, setAddExpertEmail] = useState<string>("");

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

  const columns = ["Expert", "Tokens amount", "Token price", ""];

  useEffect(() => {
    if (expertSearchResult.length === 0) {
      setAddedExpertsData([]);
      setExpertSearchResult(mockupData);
      changeExpertOptions(mockupData);
    }

    console.log(addedExpertsData);
  }, []);

  const handleBuyEvent = (email: string, tokens: number) => {
    setBuyConfirmOpen(true);
    setBuyExpertEmail(email);
    setBuyTokensAmount(tokens);
  };

  const changeExpertOptions = (searchResult) => {
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
    const data = addedExpertsData;

    for (const expert of expertSearchResult) {
      if (expert?.email === addExpertEmail) {
        data.push(expert);
        break;
      }
    }

    setAddedExpertsData(data);
  };

  return (
    <ShellMain heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
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
          className="w-full rounded-md text-sm"
          onChange={(event) => {
            setAddExpertEmail(event?.value);
          }}
        />
        <Button disabled={addExpertEmail === ""} onClick={addExpert} data-testid="" StartIcon={Plus}>
          {t("add")}
        </Button>
      </div>
      <CustomExpertTable columns={columns} expertsData={addedExpertsData} handleBuyEvent={handleBuyEvent} />
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
    </ShellMain>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);
  await ssr.viewer.me.prefetch();

  return { props: { trpcState: ssr.dehydrate() } };
};

TimeTokens.requiresLicense = false;
TimeTokens.PageWrapper = PageWrapper;
TimeTokens.getLayout = getLayout;
export default TimeTokens;
