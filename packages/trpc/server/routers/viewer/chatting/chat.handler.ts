import { prisma } from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../trpc";
import type { TChatSchema } from "./chat.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TChatSchema;
};

export const chatHandler = async ({ ctx, input }: GetOptions) => {
  const { chatText } = input;
  const { user } = ctx;

  const response = await prisma.chats.create({
    data: {
      userId: user.id,
      chatText,
      sentFlag: false,
      createdAt: new Date(),
    },
  });

  if (!response) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Bad Request`,
    });
  }

  return {
    success: true,
  };
};
