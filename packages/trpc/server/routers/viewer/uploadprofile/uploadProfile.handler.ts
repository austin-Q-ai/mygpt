import { MeiliSearch } from "meilisearch";

import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TUploadProfileInputSchema } from "./uploadProfile.schema";

type UploadProfileOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUploadProfileInputSchema;
};

const client = new MeiliSearch({
  host: `https://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

export const uploadProfileHandler = async ({ ctx, input }: UploadProfileOptions) => {
  const { user } = ctx;

  const _user = await prisma.user.create({
    data: user,
  });

  return {
    user: _user
  };
};
