import { type PrismaClient } from "@prisma/client";

import type { TrpcSessionUser } from "../../../trpc";
import type { TSearchUserInputSchema } from "./searchUser.schema";

type SearchUserOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    prisma: PrismaClient;
  };
  input: TSearchUserInputSchema;
};

export const searchUserHandler = async ({ ctx, input }: SearchUserOptions) => {
  const { prisma } = ctx;

  // const user = await prisma.user.findMany({
  //   where: {
  //     name: {
  //       contains: input.name,
  //       mode: "insensitive",
  //     },
  //   },
  //   select: {
  //     name: true,
  //     email: true,
  //     avatar: true,
  //   },
  // });

  // if (!user) {
  //   throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  // }

  return {
    // user: user,
    greeting: "hello!",
  };
};
