import { MeiliSearch } from "meilisearch";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import dayjs from "@calcom/dayjs";
import { WEBAPP_URL } from "@calcom/lib/constants";
import { prisma } from "@calcom/prisma";

const verifySchema = z.object({
  token: z.string(),
});

const client = new MeiliSearch({
  host:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.MEILISEARCH_HOST}`
      : `http://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = verifySchema.parse(req.query);

  const foundToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!foundToken) {
    return res.status(401).json({ message: "No token found" });
  }

  if (dayjs(foundToken?.expires).isBefore(dayjs())) {
    return res.status(401).json({ message: "Token expired" });
  }

  const user = await prisma.user.update({
    where: {
      email: foundToken?.identifier,
    },
    data: {
      tokens: parseInt(process.env.AMOUNT_MINTED_DEFAULT || "0"), // amount of tokens minted for 6 months default
      emailVerified: new Date(),
    },
  });

  // add new user to meilisearch and generate a tokenprice record after email verified
  if (user.emailVerified) {
    const newUserInfo = {
      objectID: user.id,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      added: [],
    };
    await index.addDocuments([newUserInfo], { primaryKey: "objectID" });
  }

  // Delete token from DB after it has been used
  await prisma.verificationToken.delete({
    where: {
      id: foundToken?.id,
    },
  });

  const hasCompletedOnboarding = user.completedOnboarding;

  res.redirect(`${WEBAPP_URL}/${hasCompletedOnboarding ? "/event-types" : "/getting-started"}`);
}
