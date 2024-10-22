import { MeiliSearch } from "meilisearch";

import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TRemoveExpertSchema } from "./removeExpert.schema";

type RemoveExpertOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TRemoveExpertSchema;
};

const client = new MeiliSearch({
  host:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.MEILISEARCH_HOST}`
      : `http://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

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

  if (!emitter) throw new Error("Expert not found");

  const deletedUser = await prisma?.timeTokensWallet.delete({
    where: {
      id: emitter.id,
    },
    select: {
      emitter: true,
    },
  });

  const owners = await prisma?.timeTokensWallet.findMany({
    where: {
      emitterId: emitterId,
    },
    orderBy: {
      id: "asc",
    },
  });

  const ownerIds: number[] = [];

  for (const owner of owners) {
    ownerIds.push(owner.ownerId);
  }

  const updatedUserInfo = {
    objectID: deletedUser.emitter.id,
    name: deletedUser.emitter.name,
    bio: deletedUser.emitter.bio,
    avatar: deletedUser.emitter.avatar,
    added: ownerIds,
  };
  await index.updateDocuments([updatedUserInfo]);

  const users = await prisma?.timeTokensWallet.findMany({
    where: {
      ownerId: user.id,
    },
    select: {
      emitter: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          tokens: true,
          price: true,
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
