import type { AppCategories, Prisma } from "@prisma/client";

import appStore from "@calcom/app-store";
import type { EventTypeAppsList } from "@calcom/app-store/utils";
import type { IAbstractPaymentService, PaymentApp } from "@calcom/types/PaymentService";

const handleUpgradePayment = async (subscriptionId: number) => {
  console.log(subscriptionId, "===subscriptionId===");
  const paymentApp = (await appStore["stripepayment" as keyof typeof appStore]()) as PaymentApp;
  if (!paymentApp?.lib?.PaymentService) {
    console.warn(`payment App service of type ${paymentApp} is not implemented`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PaymentService = paymentApp.lib.PaymentService as any;

  const paymentInstance = new PaymentService() as IAbstractPaymentService;

  const paymentData = await paymentInstance.createUpgradePayment(subscriptionId);

  if (!paymentData) {
    console.error("Payment data is null");
    throw new Error("Payment data is null");
  }

  return paymentData;
};

const handleBuyPayment = async (
  walletId: number,
  paymentAppCredentials: {
    key: Prisma.JsonValue;
    appId: EventTypeAppsList;
    app: {
      dirName: string;
      categories: AppCategories[];
    } | null;
  }
) => {
  const paymentApp = (await appStore[
    paymentAppCredentials?.app?.dirName as keyof typeof appStore
  ]()) as PaymentApp;
  if (!paymentApp?.lib?.PaymentService) {
    console.warn(`payment App service of type ${paymentApp} is not implemented`);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PaymentService = paymentApp.lib.PaymentService as any;

  const paymentInstance = new PaymentService(paymentAppCredentials) as IAbstractPaymentService;

  const paymentData = await paymentInstance.createBuyPayment(walletId);

  if (!paymentData) {
    console.error("Payment data is null");
    throw new Error("Payment data is null");
  }

  return paymentData;
};

// const handlePayment = async (
//   evt: CalendarEvent,
//   selectedEventType: Pick<Zod.infer<typeof EventTypeModel>, "metadata">,
//   paymentAppCredentials: {
//     key: Prisma.JsonValue;
//     appId: EventTypeAppsList;
//     app: {
//       dirName: string;
//       categories: AppCategories[];
//     } | null;
//   },
//   booking: {
//     user: { email: string | null; name: string | null; timeZone: string } | null;
//     id: number;
//     startTime: { toISOString: () => string };
//     uid: string;
//   },
//   bookerEmail: string,
//   userId: number
// ) => {
//   const paymentApp = (await appStore[
//     paymentAppCredentials?.app?.dirName as keyof typeof appStore
//   ]()) as PaymentApp;
//   if (!paymentApp?.lib?.PaymentService) {
//     console.warn(`payment App service of type ${paymentApp} is not implemented`);
//     return null;
//   }
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const PaymentService = paymentApp.lib.PaymentService as any;

//   const paymentInstance = new PaymentService(paymentAppCredentials) as IAbstractPaymentService;

//   const paymentOption =
//     selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId].paymentOption || "ON_BOOKING";

//   let paymentData;
//   if (paymentOption === "HOLD") {
//     paymentData = await paymentInstance.collectCard(
//       {
//         amount: selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId].price,
//         currency: selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId].currency,
//       },
//       booking.id,
//       bookerEmail,
//       paymentOption
//     );
//   } else {
//     paymentData = await paymentInstance.create(
//       {
//         amount: selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId].price,
//         currency: selectedEventType?.metadata?.apps?.[paymentAppCredentials.appId].currency,
//       },
//       booking.id,
//       bookerEmail,
//       userId,
//       paymentOption
//     );
//   }

//   if (!paymentData) {
//     console.error("Payment data is null");
//     throw new Error("Payment data is null");
//   }
//   // try {
//   //   await paymentInstance.afterPayment(evt, booking, paymentData);
//   // } catch (e) {
//   //   console.error(e);
//   // }
//   return paymentData;
// };

export { handleBuyPayment, handleUpgradePayment };
