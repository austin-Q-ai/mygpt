import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import type { GetServerSidePropsContext } from "next";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";

import { getLayout } from "@calcom/features/MainLayout";
import { ShellMain } from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";

import { Button } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

function TimeTokens() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  // not working because of https schema
  const searchClient = instantMeiliSearch(
    `https://${process.env.MEILISEARCH_HOST}`,
    process.env.SEARCH_API_KEY // search apiKey
  );

  console.log(process.env.MEILISEARCH_HOST);

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

  return (
    <ShellMain heading={t("timetokens_wallet")} hideHeadingOnMobile subtitle={t("buy_sell_timetokens")}>
      <div>
        <InstantSearch indexName="users" searchClient={searchClient}>
          <Hits hitComponent={Hit} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ marginRight: "10px" }}>Search New Expert:</h2>
            <SearchBox
              translations={{
                placeholder: "Search for experts",
              }}
              submit={<Button>SEARCH</Button>}
              reset={<Button>CLEAR</Button>}
            />
            <style>
              {`
                .ais-SearchBox-resetIcon {
                  background: white;
                }
                .ais-SearchBox-submitIcon {
                  background: white;
                }
                .ais-SearchBox-input {
                  color: var(--cal-text);
                  background: var(--cal-bg);
                }
              `}
            </style>
          </div>
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
