import { prisma } from "@calcom/prisma";

import type { TUserInputSchema } from "./user.schema";

type UserOptions = {
  ctx: Record<string, unknown>;
  input: TUserInputSchema;
};

export const userHandler = async ({ input }: UserOptions) => {
  const user = await prisma.user.findFirst({
    where: {
      id: input.userId,
    },
    select: {
      username: true,
      name: true,
      position: true,
      address: true,
      aiAdvantage: true,
      timeTokenAdvantage: true,
      eventTypes: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};
