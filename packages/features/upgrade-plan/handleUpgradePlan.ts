import type { App } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { NextApiRequest } from "next";
import short from "short-uuid";

import type { EventTypeAppsList } from "@calcom/app-store/utils";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import getIP from "@calcom/lib/getIP";
import logger from "@calcom/lib/logger";
import { handleUpgradePayment } from "@calcom/lib/payment/handlePayment";
import type { userSelect } from "@calcom/prisma";
import prisma from "@calcom/prisma";
import type { BufferedBusyTime } from "@calcom/types/BufferedBusyTime";

const translator = short();
const log = logger.getChildLogger({ prefix: ["[api] book:user"] });

type User = Prisma.UserGetPayload<typeof userSelect>;
type BufferedBusyTimes = BufferedBusyTime[];

interface IEventTypePaymentCredentialType {
  appId: EventTypeAppsList;
  app: {
    categories: App["categories"];
    dirName: string;
  };
  key: Prisma.JsonValue;
}

async function handler(req: NextApiRequest & { userId?: number | undefined }) {
  const { userId } = req;
  const { level } = req.body;

  if (!level || !userId) throw new Error("Missing parameter!");

  const userIp = getIP(req);

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: userIp,
  });

  const createSubscription = await prisma?.subscription.create({
    data: {
      user: { connect: { id: userId } },
      level: level,
    },
    select: {
      id: true,
    },
  });

  const payment = await handleUpgradePayment(createSubscription.id);

  const result: { paymentUid: string } = { paymentUid: payment?.uid || "" };

  return result;
}

export default handler;
