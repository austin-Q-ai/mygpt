import { useBookerStore } from "@calcom/features/bookings/Booker/store";
import getPaymentAppData from "@calcom/lib/getPaymentAppData";

import type { PublicEvent } from "../../types";

export const EventPrice = ({ event }: { event: PublicEvent }) => {
  const stripeAppData = getPaymentAppData(event);
  const [selectedDuration] = useBookerStore((state) => [state.selectedDuration]);

  const price = event.users[0].price[event.users[0].price.length - 1];

  if (stripeAppData.price === 0) return null;

  return (
    <>
      {Intl.NumberFormat("en", {
        style: "currency",
        currency: stripeAppData.currency.toUpperCase(),
      }).format(Math.ceil(selectedDuration / 5) * price)}
    </>
  );
};
