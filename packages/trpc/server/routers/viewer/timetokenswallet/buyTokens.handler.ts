import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TBuyTokensSchema } from "./buyTokens.schema";

type BuyTokensOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TBuyTokensSchema;
};

export const buyTokensHandler = async ({ ctx, input }: BuyTokensOptions) => {
  const { user } = ctx;
  const { emitterId, amount } = input;
  // const ownerId = ctx.user.id;
  // const emitterId = input.userId;

  const emitterRecord = await prisma?.timeTokensWallet.findFirst({
    where: {
      ownerId: user.id,
      emitterId: emitterId,
    },
    select: {
      id: true,
    },
  });

  const emitter = await prisma?.user.findFirst({
    where: {
      id: emitterId,
    },
    select: {
      tokens: true,
    },
  });

  if (!emitter) throw new Error("Expert not found");
  if (!emitterRecord) throw new Error("Added Expert not found");

  if (emitter.tokens < amount) throw new Error("Expert does not have enough tokens");

  await prisma?.timeTokensWallet.update({
    where: {
      id: emitterRecord.id,
    },
    data: {
      amount: { increment: amount },
    },
  });

  await prisma?.user.update({
    where: {
      id: emitterId,
    },
    data: {
      tokens: { decrement: amount },
    },
  });

  const users = await prisma?.timeTokensWallet.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      emitter: {
        select: {
          id: true,
          avatar: true,
          name: true,
          tokens: true,
          price: true,
        },
      },
      amount: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return {
    users: users,
  };
};
