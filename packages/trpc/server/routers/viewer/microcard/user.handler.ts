import { prisma } from "@calcom/prisma";
import { UserPermissionRole } from "@calcom/prisma/enums";

import type { TUserInputSchema } from "./user.schema";

type UserOptions = {
  ctx: Record<string, unknown>;
  input: TUserInputSchema;
};

export const userHandler = async ({ input }: UserOptions) => {
  const userlst = await prisma.user.findMany({
    where: {
      role: UserPermissionRole.USER,
      completedOnboarding: true,
    },
    select: {
      id: true,
    },
  });

  const usrId =
    input.userId !== -1
      ? input.userId
      : userlst.map((user) => user.id)[Math.floor(Math.random() * userlst.length)];

  const user = await prisma.user.findFirst({
    where: {
      id: usrId,
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
