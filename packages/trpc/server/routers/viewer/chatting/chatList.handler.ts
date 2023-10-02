import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TChatListSchema } from "./chatList.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TChatListSchema;
};
export const listChatsHandler = async ({ ctx, input }: GetOptions) => {
  const { cursor, limit } = input;
  const { user } = ctx;
  const getTotalUsers = await prisma.user.count();

  const chats = await prisma.chats.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1, // We take +1 as itll be used for the next cursor
    where: {
      userId: user.id,
    },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (chats && chats.length > limit) {
    const nextItem = chats.pop();
    nextCursor = nextItem!.id;
  }

  return {
    rows: chats || [],
    nextCursor,
    meta: {
      totalRowCount: getTotalUsers || 0,
    },
  };
};
