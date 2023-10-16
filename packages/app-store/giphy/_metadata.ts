import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: "Giphy",
  description: _package.description,
  installed: true,
  categories: ["other"],
  logo: "icon.svg",
  publisher: "MyGPT.fi",
  slug: "giphy",
  title: "Giphy",
  type: "giphy_other",
  url: "https://mygpt.fi/apps/giphy",
  variant: "other",
  extendsFeature: "EventType",
  email: "help@mygpt.fi",
  dirName: "giphy",
} as AppMeta;

export default metadata;
