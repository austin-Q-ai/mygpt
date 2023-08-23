import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-08-16" });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { paymentMethodId } = req.body;

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // Amount in cents
      currency: "usd",
      description: "Timed Token Purchase",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:3000",
    });

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment intent not succeeded");
    }

    const tokenCount = 10; // The number of tokens to grant to the user upon purchase

    // Update user's token balance or perform any necessary actions
    // You can use your own logic and database operations here

    res.status(200).json({ tokenCount });
  } catch (error) {
    console.error("Error purchasing tokens:", error);
    res.status(500).json({ error: "Failed to purchase tokens" });
  }
}
