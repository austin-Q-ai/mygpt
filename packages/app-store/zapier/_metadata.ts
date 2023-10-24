import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: "Zapier",
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  logo: "icon.svg",
  publisher: "MyGPT.fi",
  slug: "zapier",
  title: "Zapier",
  type: "zapier_automation",
  url: "https://mygpt.fi/apps/zapier",
  variant: "automation",
  email: "help@mygpt.fi",
  dirName: "zapier",
} as AppMeta;

export default metadata;
