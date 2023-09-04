import classNames from "classnames";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import {
  sdkActionManager,
  useEmbedNonStylesConfig,
  useEmbedStyles,
  useIsEmbed,
} from "@calcom/embed-core/embed-iframe";
import { orgDomainConfig } from "@calcom/features/ee/organizations/lib/orgDomains";
import { EventTypeDescriptionLazy as EventTypeDescription } from "@calcom/features/eventtypes/components";
import EmptyPage from "@calcom/features/eventtypes/components/EmptyPage";
import defaultEvents, {
  getDynamicEventDescription,
  getGroupName,
  getUsernameList,
  getUsernameSlugLink,
} from "@calcom/lib/defaultEvents";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import useTheme from "@calcom/lib/hooks/useTheme";
import { markdownToSafeHTML } from "@calcom/lib/markdownToSafeHTML";
import { stripMarkdown } from "@calcom/lib/stripMarkdown";
import prisma from "@calcom/prisma";
import { baseEventTypeSelect } from "@calcom/prisma/selects";
import { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
import { Avatar, AvatarGroup, HeadSeo, Card, Button, Label } from "@calcom/ui";
import {
  Verified,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  MousePointer2,
} from "@calcom/ui/components/icon";

import type { inferSSRProps } from "@lib/types/inferSSRProps";
import type { EmbedProps } from "@lib/withEmbedSsr";

import PageWrapper from "@components/PageWrapper";

import { ssrInit } from "@server/lib/ssr";

const months = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' }
];

export type UserPageProps = inferSSRProps<typeof getServerSideProps> & EmbedProps;
export function UserPage(props: UserPageProps) {
  const {
    users,
    profile,
    eventTypes,
    isDynamicGroup,
    dynamicNames,
    dynamicUsernames,
    isSingleUser,
    markdownStrippedBio,
  } = props;
  const [user] = users; //To be used when we only have a single user, not dynamic group
  useTheme(user.theme);
  const { t } = useLocale();
  const router = useRouter();

  const isBioEmpty = !user.bio || !user.bio.replace("<p><br></p>", "").length;

  const groupEventTypes = props.users.some((user) => !user.allowDynamicBooking) ? (
    <div className="space-y-6" data-testid="event-types">
      <div className="overflow-hidden rounded-sm border ">
        <div className="text-muted p-8 text-center">
          <h2 className="font-cal text-default  mb-2 text-3xl">{" " + t("unavailable")}</h2>
          <p className="mx-auto max-w-md">{t("user_dynamic_booking_disabled") as string}</p>
        </div>
      </div>
    </div>
  ) : (
    <ul>
      {eventTypes.map((type, index) => (
        <li
          key={index}
          className=" border-subtle bg-default dark:bg-muted dark:hover:bg-emphasis hover:bg-muted group relative border-b first:rounded-t-md last:rounded-b-md last:border-b-0">
          <ArrowRight className="text-emphasis absolute right-3 top-3 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          <Link
            href={getUsernameSlugLink({ users: props.users, slug: type.slug })}
            className="flex justify-between px-6 py-4"
            data-testid="event-type-link">
            <div className="flex-shrink">
              <p className=" text-emphasis text-sm font-semibold">{type.title}</p>
              <EventTypeDescription className="text-sm" eventType={type} />
            </div>
            <div className="mt-1 self-center">
              <AvatarGroup
                truncateAfter={4}
                className="flex flex-shrink-0"
                size="sm"
                items={props.users.map((user) => ({
                  alt: user.name || "",
                  image: user.avatar,
                }))}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  const isEmbed = useIsEmbed(props.isEmbed);
  const eventTypeListItemEmbedStyles = useEmbedStyles("eventTypeListItem");
  const shouldAlignCentrallyInEmbed = useEmbedNonStylesConfig("align") !== "left";
  const shouldAlignCentrally = !isEmbed || shouldAlignCentrallyInEmbed;
  const query = { ...router.query };
  delete query.user; // So it doesn't display in the Link (and make tests fail)
  delete query.orgSlug;
  const nameOrUsername = user.name || user.username || "";

  /*
   const telemetry = useTelemetry();
   useEffect(() => {
    if (top !== window) {
      //page_view will be collected automatically by _middleware.ts
      telemetry.event(telemetryEventTypes.embedView, collectPageParameters("/[user]"));
    }
  }, [telemetry, router.asPath]); */
  const isEventListEmpty = eventTypes.length === 0;
  return (
    <>
      <HeadSeo
        title={isDynamicGroup ? dynamicNames.join(", ") : nameOrUsername}
        description={isDynamicGroup ? `Book events with ${dynamicUsernames.join(", ")}` : markdownStrippedBio}
        meeting={{
          title: isDynamicGroup ? "" : markdownStrippedBio,
          profile: { name: `${profile.name}`, image: null },
          users: isDynamicGroup
            ? dynamicUsernames.map((username, index) => ({ username, name: dynamicNames[index] }))
            : [{ username: `${user.username}`, name: `${user.name}` }],
        }}
      />

      <div className={classNames(shouldAlignCentrally ? "mx-auto" : "", isEmbed ? "max-w-3xl" : "")}>
        <main
          className={classNames(
            shouldAlignCentrally ? "mx-auto" : "",
            isEmbed ? "border-booker border-booker-width  bg-default rounded-md border" : "",
            "max-w-3xl px-4 py-24"
          )}>
          {isSingleUser && ( // When we deal with a single user, not dynamic group
            <div className="flex flex-col justify-center">
              <div className="flex justify-center">
                <Card
                  title=""
                  containerProps={{ style: { width: "60%", minWidth: "410px", borderRadius: "20px" } }}
                  variant="ProfileCard"
                  description={
                    <div className="flex items-center">
                      <div className="flex-grow">
                        <Avatar imageSrc={user.avatar} size="xl" alt={nameOrUsername} />
                      </div>
                      <div className="items-left ms-4 flex flex-col flex-grow">
                        <div className="text-xl">
                          {nameOrUsername ? nameOrUsername : t("nameless")}
                          {user.verified && (
                            <Verified className=" mx-1 -mt-1 inline h-6 w-6 fill-blue-500 text-white dark:text-black" />
                          )}
                        </div>
                        {user.position && <div className="mt-4">
                          {user.position}
                        </div>}
                        {user.address && <div className="flex mt-2">
                          <MousePointer2 className="rotate-90 transform w-4 h-4" />{user.address}
                        </div>}
                        <div className="mt-2 flex items-center gap-2">
                          <div>
                            <Button color="secondary" className="rounded-full text-gray-500" variant="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 496 512"
                                style={{ fill: "gray" }}>
                                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                              </svg>
                            </Button>
                          </div>
                          <div>
                            <Button
                              color="secondary"
                              StartIcon={Facebook}
                              className="rounded-full"
                              variant="icon"
                            />
                          </div>
                          <div>
                            <Button color="secondary" className="rounded-full" variant="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                style={{ fill: "gray" }}>
                                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                              </svg>
                            </Button>
                          </div>
                          <div>
                            <Button
                              color="secondary"
                              StartIcon={Instagram}
                              className="rounded-full"
                              variant="icon"
                            />
                          </div>
                          <div>
                            <Button
                              color="secondary"
                              StartIcon={Linkedin}
                              className="rounded-full"
                              variant="icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="mt-8">
                <Card
                  title=""
                  containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
                  variant="ProfileCard"
                  description={
                    <>
                      <div className="mb-4 flex justify-between">
                        <Label className="text-lg">{t("about")}</Label>
                      </div>
                      <div className={user.bio.length ? "m-4" : "w-[100%] text-center p-2"}>
                        {user.bio.length ? (
                          user.bio
                        ) : (
                          t("no_data_yet")
                        )}
                      </div>
                    </>
                  }
                />
              </div>
              <div className="mt-8">
                <Card
                  title=""
                  containerProps={{ style: { width: "100%", borderRadius: "20px" } }}
                  variant="ProfileCard"
                  description={
                    <>
                      <div className="mb-4 flex justify-between">
                        <Label className="text-lg">{t("skill")}</Label>
                      </div>
                      <div className="mb-4 flex gap-2 w-[100%] overflow-x-auto">
                        {user.skills.length === 0 ? (
                          <div className="w-[100%] text-center p-2">{t("no_data_yet")}</div>
                        ) : (
                          <>
                            {user.skills.map((skill, i) => (
                              <div className="w-[100%] border border-solid border-gray-500 text-center p-2 rounded rounded-md" key={i}>
                                {skill}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  }
                />
              </div>
              <div className="mt-8 flex gap-2">
                <Card
                  title=""
                  containerProps={{ style: { width: "50%", borderRadius: "20px" } }}
                  variant="ProfileCard"
                  description={
                    <>
                      <div className="mb-4 flex justify-between">
                        <Label className="text-lg">{t("exp")}</Label>
                      </div>
                      <div className="flex flex-col pl-4">
                        {user.experiences.length === 0 ?
                          (<div className="w-[100%] text-center p-2">{t("no_data_yet")}</div>) :
                          (<>
                            {user.experiences.map((exp, i) => {
                              return (
                                <div className="items-left mb-4 flex flex-col" key={`exp-${exp.id}`}>
                                  <div className="mb-4 flex gap-2">
                                    <div className="mr-4">
                                      <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                                    </div>
                                    <div className="flex flex-col justify-start">
                                      <div className="mb-1">
                                        <b>{exp.position}</b>
                                      </div>
                                      <div>{exp.company}</div>
                                      <div>{`${months[exp.startMonth - 1]['label']} ${exp.startYear} - ${months[exp.endMonth - 1]['label']} ${exp.endYear}`}</div>
                                      {exp.address && <div>{exp.address}</div>}
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              );
                            })}
                          </>)}
                      </div>
                    </>
                  }
                />
                <Card
                  title=""
                  containerProps={{ style: { width: "50%", borderRadius: "20px" } }}
                  variant="ProfileCard"
                  description={
                    <>
                      <div className="mb-4 flex justify-between">
                        <Label className="text-lg">{t("edu")}</Label>
                      </div>
                      <div className="flex flex-col pl-4">
                        {user.educations.length === 0 ?
                          (<div className="w-[100%] text-center p-2">{t("no_data_yet")}</div>) :
                          (<>
                          {user.educations.map((edu, i) => {
                            return (
                              <div className="items-left mb-4 flex flex-col" key={`edu-${edu.id}`}>
                                <div className="mb-4 flex gap-2">
                                  <div className="mr-4">
                                    <Avatar alt="" imageSrc="" gravatarFallbackMd5="fallback" size="sm" />
                                  </div>
                                  <div className="flex flex-col justify-start">
                                    <div className="mb-1">
                                      <b>{edu.school}</b>
                                    </div>
                                    {edu.degree && <div>{edu.degree}</div>}
                                    <div>{`${months[edu.startMonth - 1]['label']} ${edu.startYear} - ${months[edu.endMonth - 1]['label']} ${edu.endYear}`}</div>
                                    {edu.major && <div>{edu.major}</div>}
                                  </div>
                                </div>
                                <hr />
                              </div>
                            );
                          })}
                        </>)}
                      </div>
                    </>
                  }
                />
              </div>
              <div className="mt-8 flex justify-end">
                <Link
                  prefetch={false}
                  href={{
                    pathname: `/${user.username}`
                  }}
                >
                  <Button
                    color="secondary"
                    EndIcon={ArrowRight}
                    variant="icon"
                  >
                    {t("back")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {isEventListEmpty && <EmptyPage name={user.name ?? "User"} />}
        </main>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
}

UserPage.isBookingPage = true;
UserPage.PageWrapper = PageWrapper;

const getEventTypesWithHiddenFromDB = async (userId: number) => {
  return (
    await prisma.eventType.findMany({
      where: {
        AND: [
          {
            teamId: null,
          },
          {
            OR: [
              {
                userId,
              },
              {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            ],
          },
        ],
      },
      orderBy: [
        {
          position: "desc",
        },
        {
          id: "asc",
        },
      ],
      select: {
        ...baseEventTypeSelect,
        metadata: true,
      },
    })
  ).map((eventType) => ({
    ...eventType,
    metadata: EventTypeMetaDataSchema.parse(eventType.metadata),
  }));
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);
  const crypto = await import("crypto");
  const { currentOrgDomain, isValidOrgDomain } = orgDomainConfig(context.req.headers.host ?? "");

  const usernameList = getUsernameList(context.query.user as string);
  const dataFetchStart = Date.now();
  const usersWithoutAvatar = await prisma.user.findMany({
    where: {
      username: {
        in: usernameList,
      },
      organization: isValidOrgDomain
        ? {
            slug: currentOrgDomain,
          }
        : null,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      position: true,
      address: true,
      skills: true,
      experiences: true,
      educations: true,
      brandColor: true,
      darkBrandColor: true,
      organizationId: true,
      theme: true,
      away: true,
      verified: true,
      allowDynamicBooking: true,
    },
  });

  const users = usersWithoutAvatar.map((user) => ({
    ...user,
    avatar: `/${user.username}/avatar.png`,
  }));

  if (!users.length || (!isValidOrgDomain && !users.some((user) => user.organizationId === null))) {
    return {
      notFound: true,
    } as {
      notFound: true;
    };
  }
  const isDynamicGroup = users.length > 1;

  if (isDynamicGroup) {
    // sort and be in the same order as usernameList so first user is the first user in the list
    users.sort((a, b) => {
      const aIndex = (a.username && usernameList.indexOf(a.username)) || 0;
      const bIndex = (b.username && usernameList.indexOf(b.username)) || 0;
      return aIndex - bIndex;
    });
  }

  const dynamicNames = isDynamicGroup
    ? users.map((user) => {
        return user.name || "";
      })
    : [];
  const [user] = users; //to be used when dealing with single user, not dynamic group

  const profile = isDynamicGroup
    ? {
        name: getGroupName(dynamicNames),
        image: null,
        theme: null,
        weekStart: "Sunday",
        brandColor: "",
        darkBrandColor: "",
        allowDynamicBooking: !users.some((user) => {
          return !user.allowDynamicBooking;
        }),
      }
    : {
        name: user.name || user.username,
        image: user.avatar,
        theme: user.theme,
        brandColor: user.brandColor,
        darkBrandColor: user.darkBrandColor,
      };

  const eventTypesWithHidden = isDynamicGroup ? [] : await getEventTypesWithHiddenFromDB(user.id);
  const dataFetchEnd = Date.now();
  if (context.query.log === "1") {
    context.res.setHeader("X-Data-Fetch-Time", `${dataFetchEnd - dataFetchStart}ms`);
  }
  const eventTypesRaw = eventTypesWithHidden.filter((evt) => !evt.hidden);

  const eventTypes = eventTypesRaw.map((eventType) => ({
    ...eventType,
    metadata: EventTypeMetaDataSchema.parse(eventType.metadata || {}),
    descriptionAsSafeHTML: markdownToSafeHTML(eventType.description),
  }));

  const isSingleUser = users.length === 1;
  const dynamicUsernames = isDynamicGroup
    ? users.map((user) => {
        return user.username || "";
      })
    : [];

  const safeBio = markdownToSafeHTML(user.bio) || "";

  const markdownStrippedBio = stripMarkdown(user?.bio || "");

  return {
    props: {
      users,
      safeBio,
      profile,
      // Dynamic group has no theme preference right now. It uses system theme.
      themeBasis: isDynamicGroup ? null : user.username,
      user: {
        emailMd5: crypto.createHash("md5").update(user.email).digest("hex"),
      },
      eventTypes: isDynamicGroup
        ? defaultEvents.map((event) => {
            event.description = getDynamicEventDescription(dynamicUsernames, event.slug);
            return event;
          })
        : eventTypes,
      trpcState: ssr.dehydrate(),
      isDynamicGroup,
      dynamicNames,
      dynamicUsernames,
      isSingleUser,
      markdownStrippedBio,
    },
  };
};

export default UserPage;
