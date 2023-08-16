import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import type { GetServerSidePropsContext } from "next";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch-dom";

import { getLayout } from "@calcom/features/MainLayout";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

function TimeTokens() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  // not working because of https schema
  const searchClient = instantMeiliSearch(
    "http://50.116.10.156:7700", // meilisearch is running on http://50.116.10.156:7700
    "2306d45c66453e622b9178211e215f15c72568cd6d89c2eec74ea51270a3df89" // search apiKey
  );

  const Hit = ({ hit }) => <Highlight attribute="title" hit={hit} />;

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
      <div>
        {/* searching movie titles indexed to meilisearch */}
        <InstantSearch indexName="movies" searchClient={searchClient}>
          Search New Expert:
          <SearchBox />
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </div>
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
