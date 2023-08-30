import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2023-08-16" });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { amount } = req.body;
  // console.log("paragon here are payment--s", paymentMethodId);
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount), // Amount in cents
      currency: "usd",
      description: "Timed Token Purchase",
      // payment_method: paymentMethodId,
      // confirm: true,
      // return_url: "http://localhost:3000",
    });

    // if (paymentIntent.status !== "succeeded") {
    //   throw new Error("Payment intent not succeeded");
    // }

    const tokenCount = 10; // The number of tokens to grant to the user upon purchase

    // Update user's token balance or perform any necessary actions
    // You can use your own logic and database operations here

    res.status(200).json({ client_secret: paymentIntent.client_secret } );
  } catch (error) {
    console.error("Error purchasing tokens:", error);
    res.status(500).json({ error: "Failed to purchase tokens" });
  }
}
