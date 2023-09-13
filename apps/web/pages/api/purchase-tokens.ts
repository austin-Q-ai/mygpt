import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { amount } = req.body;
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 1000, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      description: "Timed Token Purchase",
      // confirm: true,
      // return_url: "http://localhost:3000",
    });

    // if (paymentIntent.status !== "succeeded") {
    //   throw new Error("Payment intent not succeeded");
    // }
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error purchasing tokens:", error);
    res.status(500).json({ error: "Failed to purchase tokens" });
  }
}
