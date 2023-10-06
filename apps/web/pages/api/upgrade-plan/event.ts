import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import handleUpgradePlan from "@calcom/features/upgrade-plan/handleUpgradePlan";
import { defaultResponder } from "@calcom/lib/server";

async function handler(req: NextApiRequest & { userId?: number }, res: NextApiResponse) {
  const session = await getServerSession({ req, res });
  /* To mimic API behavior and comply with types */
  console.log(req.body.level, "===");
  req.userId = session?.user?.id || -1;
  const wallet = await handleUpgradePlan(req);
  return wallet;
}

export default defaultResponder(handler);
