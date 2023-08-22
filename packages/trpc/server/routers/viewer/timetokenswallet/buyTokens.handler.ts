import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TBuyTokensSchema } from "./addExpert.handler.schema";

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

  await prisma?.timeTokensWallet.update({
    where: {
      ownerId: user.id,
      emitterId: emitterId,
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
    }
  })

  const users = await prisma.timeTokensWallet.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      emitter: {
        select: {
          id: true,
          avatar: true,
          name: true,
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
