import type { AppFrontendPayload as App } from "@calcom/types/App";

export const _SBApps: App[] = [
  {
    name: "Google Calendar",
    description: "Google Calendar",
    installed: true,
    type: "google_calendar",
    title: "Google Calendar",
    variant: "calendar",
    category: "calendar",
    categories: ["calendar"],
    logo: "/api/app-store/googlecalendar/icon.svg",
    publisher: "MyGPT.fi",
    slug: "google-calendar",
    url: "https://mygpt.fi/",
    email: "help@mygpt.fi",
    dirName: "googlecalendar",
  },
  {
    name: "Zoom Video",
    description: "Zoom Video",
    type: "zoom_video",
    categories: ["video"],
    variant: "conferencing",
    logo: "/api/app-store/zoomvideo/icon.svg",
    publisher: "MyGPT.fi",
    url: "https://zoom.us/",
    category: "video",
    slug: "zoom",
    title: "Zoom Video",
    email: "help@mygpt.fi",
    appData: {
      location: {
        default: false,
        linkType: "dynamic",
        type: "integrations:zoom",
        label: "Zoom Video",
      },
    },
    dirName: "zoomvideo",
  },
];

export const _SBAppCategoryList = [
  {
    name: "Calendar",
    count: 1,
  },
  {
    name: "Video",
    count: 5,
  },
];
