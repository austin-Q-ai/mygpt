import type { Payment, Prisma } from "@prisma/client";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import prisma from "@calcom/prisma";
import type { IAbstractPaymentService } from "@calcom/types/PaymentService";

import { retrieveOrCreateStripeCustomerByEmail } from "./customer";
import type { StripePaymentData } from "./server";

const stripeCredentialKeysSchema = z.object({
  stripe_user_id: z.string(),
  default_currency: z.string(),
  stripe_publishable_key: z.string(),
});

const stripeAppKeysSchema = z.object({
  client_id: z.string(),
  payment_fee_fixed: z.number(),
  payment_fee_percentage: z.number(),
});

export class PaymentService implements IAbstractPaymentService {
  private stripe: Stripe;
  private credentials?: z.infer<typeof stripeCredentialKeysSchema>;

  constructor(credentials?: { key: Prisma.JsonValue }) {
    // parse credentials key
    if (credentials) this.credentials = stripeCredentialKeysSchema.parse(credentials.key);
    this.stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "", {
      apiVersion: "2020-08-27",
    });
  }

  /** This method is for creating charges at the time of upgrading subscription plan */
  async createUpgradePayment(subscriptionId: number) {
    try {
      const subscription = await prisma?.subscription.findUnique({
        where: {
          id: subscriptionId,
        },
        select: {
          user: {
            select: {
              email: true,
              currency: true,
            },
          },
          level: true,
          price: true,
        },
      });

      console.log(subscription, "===");

      if (!subscription) throw new Error("Subscription not found");

      const amount = subscription.price * 100.0;
      console.log(amount);

      const customer = await retrieveOrCreateStripeCustomerByEmail(subscription.user.email, "");

      const params: Stripe.PaymentIntentCreateParams = {
        amount: amount,
        currency: subscription.user.currency,
        payment_method_types: ["card"],
        customer: customer.id,
      };

      const paymentIntent = await this.stripe.paymentIntents.create(params);

      const paymentData = await prisma?.payment.create({
        data: {
          uid: uuidv4(),
          app: {
            connect: {
              slug: "stripe",
            },
          },
          subscription: {
            connect: {
              id: subscriptionId,
            },
          },
          amount: amount,
          currency: subscription.user.currency,
          externalId: paymentIntent.id,

          data: Object.assign({}, paymentIntent) as unknown as Prisma.InputJsonValue,
          fee: 0,
          refunded: false,
          success: false,
        },
      });
      if (!paymentData) {
        throw new Error();
      }
      return paymentData;
    } catch (error) {
      console.error(`Payment could not be created for subscription ${subscriptionId}`, error);
      throw new Error("Payment could not be created");
    }
  }

  /** This method is for creating charges at the time of buying timetokens */
  async createBuyPayment(walletId: number) {
    try {
      const wallet = await prisma?.timeTokensTransaction.findFirst({
        where: {
          id: walletId,
        },
        select: {
          emitter: {
            select: {
              price: true,
            },
          },
          owner: {
            select: {
              email: true,
            },
          },
          amount: true,
        },
      });

      if (!wallet) {
        throw new Error("TimeTokenTransaction does not exist!");
      }

      const amount = wallet?.emitter.price[wallet?.emitter.price.length - 1] * wallet?.amount * 100;

      console.log("AMOUNT: ", amount);

      // Load stripe keys
      const stripeAppKeys = await prisma?.app.findFirst({
        select: {
          keys: true,
        },
        where: {
          slug: "stripe",
        },
      });

      // Parse keys with zod
      const { payment_fee_fixed, payment_fee_percentage } = stripeAppKeysSchema.parse(stripeAppKeys?.keys);
      const paymentFee = Math.round(amount * payment_fee_percentage + payment_fee_fixed);

      const customer = await retrieveOrCreateStripeCustomerByEmail(
        wallet?.owner.email,
        this.credentials?.stripe_user_id || ""
      );

      const params: Stripe.PaymentIntentCreateParams = {
        amount: amount,
        application_fee_amount: paymentFee,
        currency: this.credentials?.default_currency || "eur",
        payment_method_types: ["card"],
        customer: customer.id,
      };

      const paymentIntent = await this.stripe.paymentIntents.create(params, {
        stripeAccount: this.credentials?.stripe_user_id,
      });

      const paymentData = await prisma?.payment.create({
        data: {
          uid: uuidv4(),
          app: {
            connect: {
              slug: "stripe",
            },
          },
          wallet: {
            connect: {
              id: walletId,
            },
          },
          amount: amount,
          currency: this.credentials?.default_currency || "eur",
          externalId: paymentIntent.id,

          data: Object.assign({}, paymentIntent, {
            stripe_publishable_key: this.credentials?.stripe_publishable_key || "",
            stripeAccount: this.credentials?.stripe_user_id || "",
          }) as unknown as Prisma.InputJsonValue,
          fee: 0,
          refunded: false,
          success: false,
        },
      });
      if (!paymentData) {
        throw new Error();
      }
      return paymentData;
    } catch (error) {
      console.error(`Payment could not be created for walletId ${walletId}`, error);
      throw new Error("Payment could not be created");
    }
  }

  // /* This method is for creating charges at the time of booking */
  // async create(
  //   payment: Pick<Prisma.PaymentUncheckedCreateInput, "amount" | "currency">,
  //   bookingId: Booking["id"],
  //   bookerEmail: string,
  //   userId: number,
  //   paymentOption: PaymentOption
  // ) {
  //   try {
  //     // Ensure that the payment service can support the passed payment option
  //     if (paymentOptionEnum.parse(paymentOption) !== "ON_BOOKING") {
  //       throw new Error("Payment option is not compatible with create method");
  //     }

  //     // Check that user has enough timetokens for booking
  //     const booking = await prisma.booking.findFirst({
  //       where: {
  //         id: bookingId,
  //       },
  //       select: {
  //         user: {
  //           select: {
  //             id: true,
  //             price: true,
  //           },
  //         },
  //         startTime: true,
  //         endTime: true,
  //       },
  //     });

  //     if (!booking) throw Error("Booking not found");

  //     console.log("==== 1 ====", booking);

  //     const timetokens = await prisma.timeTokensWallet.findFirst({
  //       where: {
  //         emitterId: booking.user?.id,
  //         ownerId: userId,
  //       },
  //       select: {
  //         id: true,
  //         amount: true,
  //       },
  //     });

  //     // if (!timetokens) throw Error("Wallet not found");

  //     const length = (booking.endTime.getTime() - booking.startTime.getTime()) / 60000; // minutes

  //     if (timetokens?.amount || 0 > Math.ceil(length / 5)) {
  //       // user has enough timetokens
  //       const updateWallet = prisma.timeTokensWallet.update({
  //         where: {
  //           id: timetokens?.id,
  //         },
  //         data: {
  //           amount: {
  //             decrement: Math.ceil(length / 5),
  //           },
  //         },
  //       });

  //       const updateBooking = prisma.booking.update({
  //         where: {
  //           id: bookingId,
  //         },
  //         data: {
  //           paid: true,
  //           status: BookingStatus.ACCEPTED,
  //         },
  //       });

  //       await prisma.$transaction([updateWallet, updateBooking]);

  //       // payment.amount = 0;
  //       const tmpPaymentData = {
  //         id: -1,
  //         uid: "",
  //         appId: null,
  //         bookingId: null,
  //         walletId: null,
  //         amount: 0,
  //         fee: 0,
  //         currency: "",
  //         success: false,
  //         refunded: false,
  //         data: {},
  //         externalId: "",
  //         paymentOption: null,
  //       };

  //       return tmpPaymentData;
  //     }

  //     // user doesn't have enough timetokens
  //     const deltaTokens = Math.ceil(length / 5) - (timetokens?.amount || 0);

  //     const totalTokens = await prisma.user.findUnique({
  //       where: {
  //         id: booking.user?.id,
  //       },
  //       select: {
  //         tokens: true,
  //       },
  //     });

  //     if (!totalTokens) throw new Error("Expert not found");

  //     if (totalTokens.tokens < deltaTokens) throw new Error("Expert doesn't have enough timeTokens");

  //     const price =
  //       (booking.user?.price ? booking.user?.price[booking.user?.price.length - 1] : 0) * deltaTokens;
  //     payment.amount = price * 100;

  //     // Load stripe keys
  //     const stripeAppKeys = await prisma?.app.findFirst({
  //       select: {
  //         keys: true,
  //       },
  //       where: {
  //         slug: "stripe",
  //       },
  //     });

  //     // Parse keys with zod
  //     const { payment_fee_fixed, payment_fee_percentage } = stripeAppKeysSchema.parse(stripeAppKeys?.keys);
  //     const paymentFee = Math.round(payment.amount * payment_fee_percentage + payment_fee_fixed);

  //     const customer = await retrieveOrCreateStripeCustomerByEmail(
  //       bookerEmail,
  //       this.credentials?.stripe_user_id || ""
  //     );

  //     console.log(customer.id, paymentFee, "=======");

  //     const params: Stripe.PaymentIntentCreateParams = {
  //       amount: payment.amount,
  //       application_fee_amount: payment.amount * 0.1,
  //       currency: this.credentials?.default_currency || "eur",
  //       payment_method_types: ["card"],
  //       customer: customer.id,
  //     };

  //     const paymentIntent = await this.stripe.paymentIntents.create(params, {
  //       stripeAccount: this.credentials?.stripe_user_id,
  //     });

  //     const paymentData = await prisma?.payment.create({
  //       data: {
  //         uid: uuidv4(),
  //         app: {
  //           connect: {
  //             slug: "stripe",
  //           },
  //         },
  //         booking: {
  //           connect: {
  //             id: bookingId,
  //           },
  //         },
  //         amount: payment.amount,
  //         currency: payment.currency,
  //         externalId: paymentIntent.id,

  //         data: Object.assign({}, paymentIntent, {
  //           stripe_publishable_key: this.credentials?.stripe_publishable_key || "",
  //           stripeAccount: this.credentials?.stripe_user_id || "",
  //         }) as unknown as Prisma.InputJsonValue,
  //         fee: 0,
  //         refunded: false,
  //         success: false,
  //         paymentOption: paymentOption || "ON_BOOKING",
  //       },
  //     });
  //     if (!paymentData) {
  //       throw new Error();
  //     }
  //     return paymentData;
  //   } catch (error) {
  //     console.error(`Payment could not be created for bookingId ${bookingId}`, error);
  //     throw new Error("Payment could not be created");
  //   }
  // }

  // async collectCard(
  //   payment: Pick<Prisma.PaymentUncheckedCreateInput, "amount" | "currency">,
  //   bookingId: Booking["id"],
  //   bookerEmail: string,
  //   paymentOption: PaymentOption
  // ): Promise<Payment> {
  //   try {
  //     // Ensure that the payment service can support the passed payment option
  //     if (paymentOptionEnum.parse(paymentOption) !== "HOLD") {
  //       throw new Error("Payment option is not compatible with create method");
  //     }

  //     // Load stripe keys
  //     const stripeAppKeys = await prisma?.app.findFirst({
  //       select: {
  //         keys: true,
  //       },
  //       where: {
  //         slug: "stripe",
  //       },
  //     });

  //     // Parse keys with zod
  //     const { payment_fee_fixed, payment_fee_percentage } = stripeAppKeysSchema.parse(stripeAppKeys?.keys);
  //     const paymentFee = Math.round(payment.amount * payment_fee_percentage + payment_fee_fixed);

  //     const customer = await retrieveOrCreateStripeCustomerByEmail(
  //       bookerEmail,
  //       this.credentials?.stripe_user_id || ""
  //     );

  //     const params = {
  //       customer: customer.id,
  //       payment_method_types: ["card"],
  //       metadata: {
  //         bookingId,
  //       },
  //     };

  //     const setupIntent = await this.stripe.setupIntents.create(params, {
  //       stripeAccount: this.credentials?.stripe_user_id,
  //     });

  //     const paymentData = await prisma?.payment.create({
  //       data: {
  //         uid: uuidv4(),
  //         app: {
  //           connect: {
  //             slug: "stripe",
  //           },
  //         },
  //         booking: {
  //           connect: {
  //             id: bookingId,
  //           },
  //         },
  //         amount: payment.amount,
  //         currency: payment.currency,
  //         externalId: setupIntent.id,

  //         data: Object.assign(
  //           {},
  //           {
  //             setupIntent,
  //             stripe_publishable_key: this.credentials?.stripe_publishable_key || "",
  //             stripeAccount: this.credentials?.stripe_user_id || "",
  //           }
  //         ) as unknown as Prisma.InputJsonValue,
  //         fee: paymentFee,
  //         refunded: false,
  //         success: false,
  //         paymentOption: paymentOption || "ON_BOOKING",
  //       },
  //     });

  //     return paymentData;
  //   } catch (error) {
  //     console.error(`Payment method could not be collected for bookingId ${bookingId}`, error);
  //     throw new Error("Payment could not be created");
  //   }
  // }

  // async chargeCard(payment: Payment, _bookingId?: Booking["id"]): Promise<Payment> {
  //   try {
  //     const stripeAppKeys = await prisma?.app.findFirst({
  //       select: {
  //         keys: true,
  //       },
  //       where: {
  //         slug: "stripe",
  //       },
  //     });

  //     const paymentObject = payment.data as unknown as StripeSetupIntentData;

  //     const setupIntent = paymentObject.setupIntent;

  //     // Parse keys with zod
  //     const { payment_fee_fixed, payment_fee_percentage } = stripeAppKeysSchema.parse(stripeAppKeys?.keys);

  //     const paymentFee = Math.round(payment.amount * payment_fee_percentage + payment_fee_fixed);

  //     // Ensure that the stripe customer & payment method still exists
  //     const customer = await this.stripe.customers.retrieve(setupIntent.customer as string, {
  //       stripeAccount: this.credentials?.stripe_user_id,
  //     });
  //     const paymentMethod = await this.stripe.paymentMethods.retrieve(setupIntent.payment_method as string, {
  //       stripeAccount: this.credentials?.stripe_user_id,
  //     });

  //     if (!customer) {
  //       throw new Error(`Stripe customer does not exist for setupIntent ${setupIntent.id}`);
  //     }

  //     if (!paymentMethod) {
  //       throw new Error(`Stripe paymentMethod does not exist for setupIntent ${setupIntent.id}`);
  //     }

  //     const params = {
  //       amount: payment.amount,
  //       currency: payment.currency,
  //       application_fee_amount: paymentFee,
  //       customer: setupIntent.customer as string,
  //       payment_method: setupIntent.payment_method as string,
  //       off_session: true,
  //       confirm: true,
  //     };

  //     const paymentIntent = await this.stripe.paymentIntents.create(params, {
  //       stripeAccount: this.credentials?.stripe_user_id,
  //     });

  //     const paymentData = await prisma.payment.update({
  //       where: {
  //         id: payment.id,
  //       },
  //       data: {
  //         success: true,
  //         data: {
  //           ...paymentObject,
  //           paymentIntent,
  //         } as unknown as Prisma.InputJsonValue,
  //       },
  //     });

  //     if (!paymentData) {
  //       throw new Error();
  //     }

  //     return paymentData;
  //   } catch (error) {
  //     console.error(`Could not charge card for payment ${payment.id}`, error);
  //     throw new Error("Payment could not be created");
  //   }
  // }

  // async update(): Promise<Payment> {
  //   throw new Error("Method not implemented.");
  // }

  // async refund(paymentId: Payment["id"]): Promise<Payment> {
  //   try {
  //     const payment = await prisma.payment.findFirst({
  //       where: {
  //         id: paymentId,
  //         success: true,
  //         refunded: false,
  //       },
  //     });
  //     if (!payment) {
  //       throw new Error("Payment not found");
  //     }

  //     const refund = await this.stripe.refunds.create(
  //       {
  //         payment_intent: payment.externalId,
  //       },
  //       { stripeAccount: (payment.data as unknown as StripePaymentData)["stripeAccount"] }
  //     );

  //     if (!refund || refund.status === "failed") {
  //       throw new Error("Refund failed");
  //     }

  //     const updatedPayment = await prisma.payment.update({
  //       where: {
  //         id: payment.id,
  //       },
  //       data: {
  //         refunded: true,
  //       },
  //     });
  //     return updatedPayment;
  //   } catch (e) {
  //     const err = getErrorFromUnknown(e);
  //     throw err;
  //   }
  // }

  // async afterPayment(
  //   event: CalendarEvent,
  //   booking: {
  //     user: { email: string | null; name: string | null; timeZone: string } | null;
  //     id: number;
  //     startTime: { toISOString: () => string };
  //     uid: string;
  //   },
  //   paymentData: Payment
  // ): Promise<void> {
  //   await sendAwaitingPaymentEmail({
  //     ...event,
  //     paymentInfo: {
  //       link: createPaymentLink({
  //         paymentUid: paymentData.uid,
  //         name: booking.user?.name,
  //         email: booking.user?.email,
  //         date: booking.startTime.toISOString(),
  //       }),
  //       paymentOption: paymentData.paymentOption || "ON_BOOKING",
  //       amount: paymentData.amount,
  //       currency: paymentData.currency,
  //     },
  //   });
  // }

  async deletePayment(paymentId: Payment["id"]): Promise<boolean> {
    try {
      const payment = await prisma.payment.findFirst({
        where: {
          id: paymentId,
        },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }
      const stripeAccount = (payment.data as unknown as StripePaymentData).stripeAccount;

      if (!stripeAccount) {
        throw new Error("Stripe account not found");
      }
      // Expire all current sessions
      const sessions = await this.stripe.checkout.sessions.list(
        {
          payment_intent: payment.externalId,
        },
        { stripeAccount }
      );
      for (const session of sessions.data) {
        await this.stripe.checkout.sessions.expire(session.id, { stripeAccount });
      }
      // Then cancel the payment intent
      await this.stripe.paymentIntents.cancel(payment.externalId, { stripeAccount });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  getPaymentPaidStatus(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getPaymentDetails(): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
}
