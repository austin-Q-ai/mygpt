import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface Item {
  quantity: any;
  description: any;
  image: any;
  name: string;
  price: number;
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { item }: { item: Item } = req.body;
  console.log("Here!!!", item);
  const redirectURL =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:3000";
  const transformedItem = {
    price_data: {
      currency: "usd",
      product_data: {
        images: [item?.image],
        description: item?.description,
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item?.quantity,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [transformedItem],
    mode: "payment",
    success_url: redirectURL + "?status=success",
    cancel_url: redirectURL + "?status=cancel",
    metadata: {
      images: item.image,
    },
  });

  // Your processing logic goes here

  res.status(200).json({ id: session.id }); // Return a response
};
