import type { GetServerSidePropsContext } from "next";
import { z } from "zod";

import type { StripePaymentData } from "@calcom/app-store/stripepayment/lib/server";
import prisma from "@calcom/prisma";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import { ssrInit } from "@server/lib/ssr";

export type PaymentPageProps = inferSSRProps<typeof getServerSideProps>;

const querySchema = z.object({
  uid: z.string(),
});

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);

  const { uid } = querySchema.parse(context.query);

  const rawPayment = await prisma.payment.findFirst({
    where: {
      uid,
    },
    select: {
      data: true,
      success: true,
      uid: true,
      refunded: true,
      appId: true,
      amount: true,
      currency: true,
      paymentOption: true,
      bookingId: true,
      walletId: true,
      subscriptionId: true,
    },
  });

  if (!rawPayment) return { notFound: true };

  const { data, ...restPayment } = rawPayment;
  const payment = {
    ...restPayment,
    data: data as unknown as StripePaymentData,
  };

  return {
    props: {
      trpcState: ssr.dehydrate(),
      payment,
    },
  };
};
