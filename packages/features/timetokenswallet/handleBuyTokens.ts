import type { App } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { NextApiRequest } from "next";
import short from "short-uuid";

import type { EventTypeAppsList } from "@calcom/app-store/utils";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import getIP from "@calcom/lib/getIP";
import { HttpError } from "@calcom/lib/http-error";
import logger from "@calcom/lib/logger";
import { handleBuyPayment } from "@calcom/lib/payment/handlePayment";
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

async function handler(req: NextApiRequest & { userId?: number | undefined }): {
  paymentUid: string;
} {
  const { userId } = req;
  const { emitterId, amount } = req.body;

  let result: {
    paymentUid: string;
  };

  if (!emitterId || !amount || !userId) throw new Error("Missing parameter!");

  const userIp = getIP(req);

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: userIp,
  });

  const createdWallet = await prisma?.timeTokensTransaction.create({
    data: {
      owner: { connect: { id: userId } },
      emitter: { connect: { id: emitterId } },
      amount: amount,
    },
    select: {
      id: true,
    },
  });

  const paymentAppCredential = await prisma.credential.findFirst({
    where: {
      userId: emitterId,
      app: {
        categories: {
          hasSome: ["payment"],
        },
      },
    },
    select: {
      key: true,
      appId: true,
      app: {
        select: {
          categories: true,
          dirName: true,
        },
      },
    },
  });

  if (!paymentAppCredential) {
    throw new HttpError({ statusCode: 400, message: "Missing payment credentials" });
  }

  const payment = await handleBuyPayment(
    createdWallet.id,
    paymentAppCredential as IEventTypePaymentCredentialType
  );

  result = {
    paymentUid: payment?.uid,
  }

  return result;
}

export default handler