import { getFeatureFlagMap } from "@calcom/features/flags/server/utils";
import {
  // AverageEventDurationChart,
  BookingKPICards, // BookingStatusLineChart,
  LeastBookedTeamMembersTable,
  MostBookedTeamMembersTable,
  PopularEventsTable,
} from "@calcom/features/insights/components";
import { FiltersProvider } from "@calcom/features/insights/context/FiltersProvider";
import { Filters } from "@calcom/features/insights/filters";
import Shell from "@calcom/features/shell/Shell";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc";
import { RefreshCcw, UserPlus, Users } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

const Heading = () => {
  const { t } = useLocale();

  return (
    <div className="min-w-52 hidden md:block">
      <h3 className="font-cal max-w-28 sm:max-w-72 md:max-w-80 text-emphasis truncate text-xl font-semibold tracking-wide xl:max-w-full">
        {t("insights")}
      </h3>
      <p className="text-default mt-2 hidden text-sm md:block">{t("insights_subtitle")}</p>
    </div>
  );
};

export default function InsightsPage() {
  const { t } = useLocale();
  const { data: user } = trpc.viewer.me.useQuery();
  console.log("userData", user);
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: t("view_bookings_across"),
      description: t("view_bookings_across_description"),
    },
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      title: t("identify_booking_trends"),
      description: t("identify_booking_trends_description"),
    },
    {
      icon: <UserPlus className="h-5 w-5" />,
      title: t("spot_popular_event_types"),
      description: t("spot_popular_event_types_description"),
    },
  ];

  return (
    <div>
      <Shell hideHeadingOnMobile>
        {/* <UpgradeTip
          title={t("make_informed_decisions")}
          description={t("make_informed_decisions_description")}
          features={features}
          background="/tips/insights"
          buttons={
            <div className="space-y-2 rtl:space-x-reverse sm:space-x-2">
              <ButtonGroup>
                <Button color="primary" href={`${WEBAPP_URL}/settings/teams/new`}>
                  {t("create_team")}
                </Button>
                <Button color="minimal" href="https://go.mygpt.fi/insights" target="_blank">
                  {t("learn_more")}
                </Button>
              </ButtonGroup>
            </div>
          }
        /> */}
        {!user ? (
          <></>
        ) : (
          <FiltersProvider>
            <div className="ml-auto mt-0">
              <Heading />
            </div>

            <Filters />

            <div className="mb-4 space-y-6">
              <BookingKPICards />

              {/* <BookingStatusLineChart /> */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <PopularEventsTable />
                {/* <AverageEventDurationChart /> */}
                <div className="grid grid-cols-1 gap-5">
                  <MostBookedTeamMembersTable />
                  <LeastBookedTeamMembersTable />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* most <MostBookedTeamMembersTable />
                least <LeastBookedTeamMembersTable /> */}
              </div>
              {/* <small className="text-default block text-center">
                {t("looking_for_more_insights")}{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href="mailto:updates@mygpt.fi?subject=Feature%20Request%3A%20More%20Analytics&body=Hey%20mygpt.fi%20Team%2C%20I%20love%20the%20analytics%20page%20but%20I%20am%20looking%20for%20...">
                  {" "}
                  {t("contact_support")}
                </a>
              </small> */}
            </div>
          </FiltersProvider>
        )}
      </Shell>
    </div>
  );
}

InsightsPage.PageWrapper = PageWrapper;

// If feature flag is disabled, return not found on getServerSideProps
export const getServerSideProps = async () => {
  const prisma = await import("@calcom/prisma").then((mod) => mod.default);
  const flags = await getFeatureFlagMap(prisma);
  if (flags.insights === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
