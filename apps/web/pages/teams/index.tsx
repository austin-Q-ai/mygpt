import type { GetServerSidePropsContext } from "next";
import CreateNewTeamPage from "pages/settings/teams/new";

import { TeamsListing } from "@calcom/features/ee/teams/components";
import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button, Dialog, DialogContent, DialogTrigger } from "@calcom/ui";
import { Plus, X, Users } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

function Teams() {
  const { t } = useLocale();
  const [user] = trpc.viewer.me.useSuspenseQuery();

  return (
    // Add Modal here for adding new team
    <Shell
      heading={t("teams")}
      hideHeadingOnMobile
      subtitle={t("create_manage_teams_collaborative")}
      CTA={
        (!user.organizationId || user.organization.isOrgAdmin) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" rounded StartIcon={Plus} variant="icon" color="primary" />
            </DialogTrigger>
            <DialogContent type="creation" HeaderIcon={Users} Icon={X} className="py-4">
              <CreateNewTeamPage />
            </DialogContent>
          </Dialog>
        )
      }>
      <TeamsListing />
    </Shell>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);
  await ssr.viewer.me.prefetch();

  return { props: { trpcState: ssr.dehydrate() } };
};

Teams.requiresLicense = false;
Teams.PageWrapper = PageWrapper;

export default Teams;
