import type { GetServerSidePropsContext } from "next";

import { getLayout } from "@calcom/features/MainLayout";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

function TimeTokens() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  const mockupData = [
    {
      fullname: "Expert 1",
      token_amount: 200,
      token_price: 5,
    },
    {
      fullname: "Expert 2",
      token_amount: 200,
      token_price: 5,
    },
    {
      fullname: "Expert 3",
      token_amount: 200,
      token_price: 5,
    },
  ];

  return (
    <ShellMain heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
      {mockupData.map((item) => (
        <div key={item.fullname}>{item.fullname}</div>
      ))}
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
