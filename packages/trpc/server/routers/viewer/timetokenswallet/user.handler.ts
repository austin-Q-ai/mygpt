import { prisma } from "@calcom/prisma";

import type { TUserInputSchema } from "./user.schema";

type UserOptions = {
  ctx: Record<string, unknown>;
  input: TUserInputSchema;
};

export const userHandler = async ({ input }: UserOptions) => {
  const users = await prisma.user.findMany({
    where: {
      name: { contains: input.username },
    },
    select: {
      name: true,
      email: true,
      avatar: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return {
    users: users,
  };
};
