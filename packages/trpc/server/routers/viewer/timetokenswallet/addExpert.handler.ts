import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TAddExpertSchema } from "./addExpert.handler.schema";

type AddExpertOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAddExpertSchema;
};

export const addExpertHandler = async ({ ctx, input }: AddExpertOptions) => {
  const { user } = ctx;
  const { emitterId } = input;
  // const ownerId = ctx.user.id;
  // const emitterId = input.userId;

  await prisma?.timeTokensWallet.create({
    data: {
      owner: { connect: { id: user.id } },
      emitter: { connect: { id: emitterId } },
      amount: 0,
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
