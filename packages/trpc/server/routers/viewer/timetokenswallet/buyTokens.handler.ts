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

  const emitter = await prisma?.timeTokensWallet.findFirst({
    where: {
      ownerId: user.id,
      emitterId: emitterId,
    },
    select: {
      id: true,
    },
  });

  console.log(emitter);

  if (emitter)
    await prisma?.timeTokensWallet.update({
      where: {
        id: emitter.id,
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
