import { prisma } from "@calcom/prisma";

import type { TUserInputSchema } from "./user.schema";

type UserOptions = {
  ctx: Record<string, unknown>;
  input: TUserInputSchema;
};

export const userHandler = async ({ input }: UserOptions) => {
  if (input.username) {
    const user = await prisma.user.findFirst({
      where: {
        username: input.username,
      },
      select: {
        username: true,
        apiKey: true,
        expertId: true,
        id: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } else {
    return;
  }
};
