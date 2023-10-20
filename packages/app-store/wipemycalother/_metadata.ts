import type { AppMeta } from "@calcom/types/App";

import _package from "./package.json";

export const metadata = {
  name: _package.name,
  description: _package.description,
  installed: true,
  category: "automation",
  categories: ["automation"],
  // If using static next public folder, can then be referenced from the base URL (/).
  logo: "icon-dark.svg",
  publisher: "MyGPT.fi",
  slug: "wipe-my-cal",
  title: "Wipe my cal",
  type: "wipemycal_other",
  url: "https://mygpt.fi/apps/wipe-my-cal",
  variant: "other",
  email: "help@mygpt.fi",
  dirName: "wipemycalother",
} as AppMeta;

export default metadata;
