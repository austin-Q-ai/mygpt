import { MeiliSearch } from "meilisearch";

import { deleteStripeCustomer } from "@calcom/app-store/stripepayment/lib/customer";
import { ErrorCode } from "@calcom/features/auth/lib/ErrorCode";
import { deleteWebUser as syncServicesDeleteWebUser } from "@calcom/lib/sync/SyncServiceManager";
import { prisma } from "@calcom/prisma";
import { IdentityProvider } from "@calcom/prisma/enums";
import type { TrpcSessionUser } from "@calcom/trpc/server/trpc";

type DeleteMeWithoutPasswordOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

const client = new MeiliSearch({
  host:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.MEILISEARCH_HOST}`
      : `http://${process.env.MEILISEARCH_HOST}`,
  apiKey: process.env.ADMIN_API_KEY, // admin apiKey
});

const index = client.index("users");

export const deleteMeWithoutPasswordHandler = async ({ ctx }: DeleteMeWithoutPasswordOptions) => {
  const user = await prisma.user.findUnique({
    where: {
      email: ctx.user.email.toLowerCase(),
    },
  });
  if (!user) {
    throw new Error(ErrorCode.UserNotFound);
  }

  if (user.identityProvider === IdentityProvider.CAL) {
    throw new Error(ErrorCode.SocialIdentityProviderRequired);
  }

  if (user.twoFactorEnabled) {
    throw new Error(ErrorCode.SocialIdentityProviderRequired);
  }

  // Remove me from Stripe
  await deleteStripeCustomer(user).catch(console.warn);

  // Remove my account
  const deletedUser = await prisma.user.delete({
    where: {
      id: ctx.user.id,
    },
  });

  // remove userInfo to meilisearch by id after remove userInfo
  if (deletedUser) {
    await index.deleteDocuments([deletedUser.id]);
  }

  // Sync Services
  syncServicesDeleteWebUser(deletedUser);

  return;
};
