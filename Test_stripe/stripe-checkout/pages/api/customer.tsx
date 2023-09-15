import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Stripe from "stripe";

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
    const { email, name } = req.body;
    const customer = await stripe.customers.create({
      email,
      name,
    });

    res.status(200).json({
      code: "customer created",
      customer,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      code: "customer creation failed",
      error: e,
    });
  }
};

const handler = createRouter<NextApiRequest, NextApiResponse>();
handler.post(createCustomer);
