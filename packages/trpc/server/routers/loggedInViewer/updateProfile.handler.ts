/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Prisma } from "@prisma/client";
import axios from "axios";
import { MeiliSearch } from "meilisearch";
import type { NextApiResponse, GetServerSidePropsContext } from "next";

import stripe from "@calcom/app-store/stripepayment/lib/server";
import { getPremiumPlanProductId } from "@calcom/app-store/stripepayment/lib/utils";
import { GOOGLE_MAP_API_KEY } from "@calcom/lib/constants";
import hasKeyInMetadata from "@calcom/lib/hasKeyInMetadata";
import { getTranslation } from "@calcom/lib/server";
import { checkUsername } from "@calcom/lib/server/checkUsername";
import { resizeBase64Image } from "@calcom/lib/server/resizeBase64Image";
import slugify from "@calcom/lib/slugify";
import { updateWebUser as syncServicesUpdateWebUser } from "@calcom/lib/sync/SyncServiceManager";
import { validateBookerLayouts } from "@calcom/lib/validateBookerLayouts";
import { prisma } from "@calcom/prisma";
import { userMetadata } from "@calcom/prisma/zod-utils";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

import { TRPCError } from "@trpc/server";

import type { TUpdateProfileInputSchema } from "./updateProfile.schema";

const QDRANT_URL = process.env.NEXT_PUBLIC_QDRANT_URL;
const COLLECTION_NAME = "topics";

type UpdateProfileOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    res?: NextApiResponse | GetServerSidePropsContext["res"];
  };
  input: TUpdateProfileInputSchema;
};

const client = new MeiliSearch({
  host:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.MEILISEARCH_HOST}`
      : `http://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");
async function validateAddress(address: any) {
  const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
    params: {
      key: GOOGLE_MAP_API_KEY,
      address: address,
    },
  });

  const data = response.data;

  if (data.results.length > 0) {
    // The address is valid
    return true;
  } else {
    // The address is invalid
    return false;
  }
}
export const updateProfileHandler = async ({ ctx, input }: UpdateProfileOptions) => {
  const { user } = ctx;
  const data: Prisma.UserUpdateInput & { defaultValue?: boolean } = {
    ...input,
    experiences: input.experiences
      ? {
        updateMany: input.experiences
          .filter((exp) => exp.id !== undefined && !exp.delete)
          .map((exp) => {
            const { id, userId, ...data } = exp;
            delete data.delete;
            return {
              where: {
                id: exp.id,
              },
              data,
            };
          }),
        create: input.experiences.filter((exp) => exp.id === undefined && !exp.delete),
        deleteMany: input.experiences
          .filter((exp) => exp.id !== undefined && exp.delete)
          .map((exp) => ({
            id: exp.id,
          })),
      }
      : {},
    educations: input.educations
      ? {
        updateMany: input.educations
          .filter((edu) => edu.id !== undefined && !edu.delete)
          .map((edu) => {
            const { id, userId, ...data } = edu;
            delete data.delete;
            return {
              where: {
                id: edu.id,
              },
              data,
            };
          }),
        create: input.educations.filter((edu) => edu.id === undefined && !edu.delete),
        deleteMany: input.educations
          .filter((edu) => edu.id !== undefined && edu.delete)
          .map((edu) => ({
            id: edu.id,
          })),
      }
      : {},
    metadata: input.metadata as Prisma.InputJsonValue,
    social: input.social,
  };
  const price: number = input.price || 1;

  if (price) {
    delete data.price;
  }

  if (data.address) {
    const response = await validateAddress(data.address);
    if (!response) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid_address",
      });
    }
  }

  if (input.defaultValue) {
    data.aiAdvantage = [
      "Increased Efficiency",
      "24/7 Availability",
      "Rapid Data Processing",
      "Data-Driven Decision Making",
      "Reduction of Human Errors",
      "Task Flexibility",
      "Personalized Services",
      "Reduced Operational Costs",
      "Improved Quality of Products or Services",
    ];
    data.timeTokenAdvantage = [
      "Efficient Time Management",
      "Transparency and Traceability",
      "Flexibility and Liquidity",
      "Global Accessibility",
      "Customization",
      "Reduced Transaction Fees",
      "Task Automation",
      "Transferability and Interoperability",
      "User Engagement and Loyalty",
    ];
    delete data.defaultValue;
  }

  let isPremiumUsername = false;

  const layoutError = validateBookerLayouts(input?.metadata?.defaultBookerLayouts || null);
  if (layoutError) {
    const t = await getTranslation("en", "common");
    throw new TRPCError({ code: "BAD_REQUEST", message: t(layoutError) });
  }

  if (input.username && !user.organizationId) {
    const username = slugify(input.username);
    // Only validate if we're changing usernames
    if (username !== user.username) {
      data.username = username;
      const response = await checkUsername(username);
      isPremiumUsername = response.premium;
      if (!response.available) {
        throw new TRPCError({ code: "BAD_REQUEST", message: response.message });
      }
    }
  }
  if (input.avatar) {
    data.avatar = await resizeBase64Image(input.avatar);
  }
  if (input.hasBot) {
    data.hasBot = input.hasBot
  }
  if (input.botId) {
    data.botId = input.botId
  }
  const userToUpdate = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userToUpdate) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }
  const metadata = userMetadata.parse(userToUpdate.metadata);

  const isPremium = metadata?.isPremium;
  if (isPremiumUsername) {
    const stripeCustomerId = metadata?.stripeCustomerId;
    if (!isPremium || !stripeCustomerId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "User is not premium" });
    }

    const stripeSubscriptions = await stripe.subscriptions.list({ customer: stripeCustomerId });

    if (!stripeSubscriptions || !stripeSubscriptions.data.length) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No stripeSubscription found",
      });
    }

    // Iterate over subscriptions and look for premium product id and status active
    // @TODO: iterate if stripeSubscriptions.hasMore is true
    const isPremiumUsernameSubscriptionActive = stripeSubscriptions.data.some(
      (subscription) =>
        subscription.items.data[0].price.product === getPremiumPlanProductId() &&
        subscription.status === "active"
    );

    if (!isPremiumUsernameSubscriptionActive) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You need to pay for premium username",
      });
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      position: true,
      address: true,
      experiences: true,
      educations: true,
      skills: true,
      metadata: true,
      social: true,
      name: true,
      createdDate: true,
      bio: true,
      avatar: true,
      hasBot: true,
      botId: true
    },
  });

  if (price) {
    const checkUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        price: true,
      },
    });

    if (checkUser !== null && checkUser.price[checkUser.price.length - 1] !== price) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          price: {
            push: price,
          },
          TokenPrice: {
            create: {
              price: price,
            },
          },
        },
      });
    }
  }

  // update userInfo to meilisearch by id after update userInfo
  if (updatedUser) {
    const updatedUserInfo = {
      objectID: updatedUser.id,
      name: updatedUser.name,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      hasBot: updatedUser.hasBot,
      botId: updatedUser.botId
    };
    await index.updateDocuments([updatedUserInfo]);
  }

  // Sync Services
  await syncServicesUpdateWebUser(updatedUser);

  // Notify stripe about the change
  if (updatedUser && updatedUser.metadata && hasKeyInMetadata(updatedUser, "stripeCustomerId")) {
    const stripeCustomerId = `${updatedUser.metadata.stripeCustomerId}`;
    await stripe.customers.update(stripeCustomerId, {
      metadata: {
        username: updatedUser.username,
        email: updatedUser.email,
        userId: updatedUser.id,
      },
    });
  }
  // Revalidate booking pages
  // Disabled because the booking pages are currently not using getStaticProps
  /*const res = ctx.res as NextApiResponse;
  if (typeof res?.revalidate !== "undefined") {
    const eventTypes = await prisma.eventType.findMany({
      where: {
        userId: user.id,
        team: null,
      },
      select: {
        id: true,
        slug: true,
      },
    });
    // waiting for this isn't needed
    Promise.all(
      eventTypes.map((eventType) => res?.revalidate(`/new-booker/${ctx.user.username}/${eventType.slug}`))
    )
      .then(() => console.info("Booking pages revalidated"))
      .catch((e) => console.error(e));
  }*/

  // update data on qdrant db
  axios
    .post(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/payload`, {
      payload: {
        name: input.name,
        avatar: input.avatar,
        bio: input.bio,
        bookingCallLink: input.username,
        hasBot: input.hasBot
      },
      points: [user.id],
    })
    .then((res) => {
      console.log("success");
    })
    .catch((err) => {
      console.log("error on saving to qdrant: ", err);
    });
  return input;
};
