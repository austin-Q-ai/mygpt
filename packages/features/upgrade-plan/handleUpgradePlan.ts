import type { App } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { NextApiRequest } from "next";
import short from "short-uuid";

import type { EventTypeAppsList } from "@calcom/app-store/utils";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import { SUBSCRIPTION_PRICE } from "@calcom/lib/constants";
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
  console.log(req.body, "====");
  const { userId } = req;
  const { level } = req.body;

  if (!level || !userId) throw new Error("Missing parameter!");

  const userIp = getIP(req);

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: userIp,
  });

  const user = await prisma?.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      level: true,
      currency: true,
    },
  });

  if (!user) throw new Error("User not found");

  const createSubscription = await prisma?.subscription.create({
    data: {
      user: { connect: { id: userId } },
      level: level,
      price:
        SUBSCRIPTION_PRICE[level][user.currency.toUpperCase()] -
        SUBSCRIPTION_PRICE[user.level][user.currency.toUpperCase()],
    },
    select: {
      id: true,
    },
  });

  console.log("=== 1 ===");

  const payment = await handleUpgradePayment(createSubscription.id);

  console.log("=== 2 ===");

  const result: { paymentUid: string } = { paymentUid: payment?.uid || "" };

  return result;
}

export default handler;
