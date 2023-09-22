import { MeiliSearch } from "meilisearch";

import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TAddExpertSchema } from "./addExpert.schema";

type AddExpertOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAddExpertSchema;
};

const client = new MeiliSearch({
  host: `https://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

export const addExpertHandler = async ({ ctx, input }: AddExpertOptions) => {
  const { user } = ctx;
  const { emitterId } = input;

  const emitter = await prisma?.user.findFirst({
    where: {
      id: emitterId,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      avatar: true,
    },
  });

  if (!emitter) throw new Error("Expert not found");

  const emitterRecord = await prisma?.timeTokensWallet.findFirst({
    where: {
      ownerId: user.id,
      emitterId: emitterId,
    },
    select: {
      id: true,
    },
  });

  if (emitterRecord) throw new Error("Expert already exsits");

  await prisma?.timeTokensWallet.create({
    data: {
      owner: { connect: { id: user.id } },
      emitter: { connect: { id: emitterId } },
      amount: 0,
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
    objectID: emitter.id,
    name: emitter.name,
    bio: emitter.bio,
    avatar: emitter.avatar,
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
    env: process.env,
  };
};
