import type { Prisma } from "@prisma/client";
import { MeiliSearch } from "meilisearch";

import type { TUploadProfileInputSchema } from "./uploadProfile.schema";
import { prisma } from "@calcom/prisma";

type UploadProfileOptions = {
  input: TUploadProfileInputSchema;
};

const client = new MeiliSearch({
  host: `https://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

export const uploadProfileHandler = async ({ input } : UploadProfileOptions) => {
  try {
    const data: Prisma.UserCreateInput = {
      ...input,
      experiences: input.experiences ? {
        create: input.experiences,
      } : {},
      educations: input.educations ? {
        create: input.educations,
      } : {},
      password: "$2a$12$2Q9uAjv9GHmjmhUNblYWz.Ej1ZHgHVZR9OA9EGDhdvayUfNcPQuIa", //default password : 123456
      emailVerified: new Date(),
      metadata: input.metadata as Prisma.InputJsonValue,
    };

    const newUser = await prisma.user.create({
      data,
    });

    if (newUser) {
      const newUserInfo = {
        objectID: newUser.id,
        name: newUser.name,
        bio: newUser.bio,
        avatar: newUser.avatar,
        added: [],
      };
      await index.addDocuments([newUserInfo]);
    }

    return {
      data: "success",
    };
  } catch (error) {
    return {
      data: error,
    };
  }
};
