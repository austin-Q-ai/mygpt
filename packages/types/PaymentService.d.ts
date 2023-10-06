import type { Payment } from "@prisma/client";

export interface PaymentApp {
  lib?: {
    PaymentService: IAbstractPaymentService;
  };
}

export interface IAbstractPaymentService {
  /* This method is for creating charges at the time of upgrading */
  createUpgradePayment(subscriptionId: number): Promise<Payment>;
  /* This method is for creating charges at the time of buying tokens */
  createBuyPayment(walletId: number): Promise<Payment>;
  // /* This method is for creating charges at the time of booking */
  // create(
  //   payment: Pick<Prisma.PaymentUncheckedCreateInput, "amount" | "currency">,
  //   bookingId: Booking["id"],
  //   bookerEmail: string,
  //   userId: number,
  //   paymentOption: PaymentOption
  // ): Promise<Payment>;
  // /* This method is to collect card details to charge at a later date ex. no-show fees */
  // collectCard(
  //   payment: Pick<Prisma.PaymentUncheckedCreateInput, "amount" | "currency">,
  //   bookingId: Booking["id"],
  //   bookerEmail: string,
  //   paymentOption: PaymentOption
  // ): Promise<Payment>;
  // chargeCard(
  //   payment: Pick<Prisma.PaymentUncheckedCreateInput, "amount" | "currency">,
  //   bookingId?: Booking["id"]
  // ): Promise<Payment>;
  // update(paymentId: Payment["id"], data: Partial<Prisma.PaymentUncheckedCreateInput>): Promise<Payment>;
  // refund(paymentId: Payment["id"]): Promise<Payment>;
  getPaymentPaidStatus(): Promise<string>;
  getPaymentDetails(): Promise<Payment>;
  // afterPayment(
  //   event: CalendarEvent,
  //   booking: {
  //     user: { email: string | null; name: string | null; timeZone: string } | null;
  //     id: number;
  //     startTime: { toISOString: () => string };
  //     uid: string;
  //   },
  //   paymentData: Payment
  // ): Promise<void>;
  deletePayment(paymentId: Payment["id"]): Promise<boolean>;
}
