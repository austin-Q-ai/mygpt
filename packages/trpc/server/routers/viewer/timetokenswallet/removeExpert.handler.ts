import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TRemoveExpertSchema } from "./removeExpert.schema";

type RemoveExpertOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TRemoveExpertSchema;
};

export const removeExpertHandler = async ({ ctx, input }: RemoveExpertOptions) => {
  const { user } = ctx;
  const { emitterId } = input;

  const emitter = await prisma?.timeTokensWallet.findFirst({
    where: {
      ownerId: user.id,
      emitterId: emitterId,
    },
    select: {
      id: true,
    },
  });

  if (emitter)
    await prisma?.timeTokensWallet.delete({
      where: {
        id: emitter.id,
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
