import type { GetServerSidePropsContext } from "next";
import { z } from "zod";

import type { StripePaymentData, StripeSetupIntentData } from "@calcom/app-store/stripepayment/lib/server";
import prisma from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";
import { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import { ssrInit } from "@server/lib/ssr";

export type PaymentPageProps = inferSSRProps<typeof getServerSideProps>;

const querySchema = z.object({
  uid: z.string(),
});

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const ssr = await ssrInit(context);

  const { uid } = querySchema.parse(context.query);

  const testPayment = await prisma.payment.findFirst({
    where: {
      uid,
    },
    select: {
      data: true,
      success: true,
      uid: true,
      refunded: true,
      bookingId: true,
      walletId: true,
      wallet: {
        select: {
          emitter: {
            select: {
              username: true,
              price: true,
            },
          },
          amount: true,
        },
      },
      appId: true,
      amount: true,
      currency: true,
      paymentOption: true,
      booking: {
        select: {
          id: true,
          uid: true,
          description: true,
          title: true,
          startTime: true,
          endTime: true,
          attendees: {
            select: {
              email: true,
              name: true,
            },
          },
          eventTypeId: true,
          location: true,
          status: true,
          rejectionReason: true,
          cancellationReason: true,
          eventType: {
            select: {
              id: true,
              title: true,
              description: true,
              length: true,
              eventName: true,
              requiresConfirmation: true,
              userId: true,
              metadata: true,
              users: {
                select: {
                  name: true,
                  username: true,
                  hideBranding: true,
                  theme: true,
                  price: true,
                },
              },
              team: {
                select: {
                  name: true,
                  hideBranding: true,
                },
              },
              price: true,
              currency: true,
              successRedirectUrl: true,
            },
          },
        },
      },
    },
  });

  if (testPayment && testPayment.walletId) {
    const { data, booking, ...restPayment } = testPayment;
    const payment = {
      ...restPayment,
      data: data as unknown as StripePaymentData | StripeSetupIntentData,
    };

    return {
      props: {
        trpcState: ssr.dehydrate(),
        payment: payment,
        buyToken: true,
      },
    };
  }

  const rawPayment = await prisma.payment.findFirst({
    where: {
      uid,
    },
    select: {
      data: true,
      success: true,
      uid: true,
      refunded: true,
      bookingId: true,
      walletId: true,
      wallet: {
        select: {
          emitter: {
            select: {
              username: true,
              price: true,
            },
          },
          amount: true,
        },
      },
      appId: true,
      amount: true,
      currency: true,
      paymentOption: true,
      booking: {
        select: {
          id: true,
          uid: true,
          description: true,
          title: true,
          startTime: true,
          endTime: true,
          attendees: {
            select: {
              email: true,
              name: true,
            },
          },
          eventTypeId: true,
          location: true,
          status: true,
          rejectionReason: true,
          cancellationReason: true,
          eventType: {
            select: {
              id: true,
              title: true,
              description: true,
              length: true,
              eventName: true,
              requiresConfirmation: true,
              userId: true,
              metadata: true,
              users: {
                select: {
                  name: true,
                  username: true,
                  hideBranding: true,
                  theme: true,
                  price: true,
                },
              },
              team: {
                select: {
                  name: true,
                  hideBranding: true,
                },
              },
              price: true,
              currency: true,
              successRedirectUrl: true,
            },
          },
        },
      },
    },
  });

  if (!rawPayment) return { notFound: true };

  const { data, booking: _booking, ...restPayment } = rawPayment;
  const payment = {
    ...restPayment,
    data: data as unknown as StripePaymentData | StripeSetupIntentData,
  };

  if (!_booking) return { notFound: true };

  const { startTime, endTime, eventType, ...restBooking } = _booking;
  const booking = {
    ...restBooking,
    length: (endTime.getTime() - startTime.getTime()) / 60000,
    startTime: startTime.toString(),
  };

  if (!eventType) return { notFound: true };

  const [user] = eventType.users;
  if (!user) return { notFound: true };

  const profile = {
    name: eventType.team?.name || user?.name || null,
    price: user?.price ? user?.price[user?.price.length - 1] : 0,
    theme: (!eventType.team?.name && user?.theme) || null,
    hideBranding: eventType.team?.hideBranding || user?.hideBranding || null,
  };

  if (
    ([BookingStatus.CANCELLED, BookingStatus.REJECTED] as BookingStatus[]).includes(
      booking.status as BookingStatus
    )
  ) {
    return {
      redirect: {
        destination: `/booking/${booking.uid}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      eventType: {
        ...eventType,
        metadata: EventTypeMetaDataSchema.parse(eventType.metadata),
      },
      booking,
      trpcState: ssr.dehydrate(),
      payment,
      profile,
    },
  };
};
