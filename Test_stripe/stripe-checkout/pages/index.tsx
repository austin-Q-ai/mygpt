import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { it } from "node:test";
import React, { ChangeEvent, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { status } = router.query;
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState({
    name: "Apple AirPods",
    description: "Latest Apple AirPods.",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    quantity: 0,
    price: 999,
  });

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const stripePromise = loadStripe(publishableKey!);

  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/api/create-stripe-session", { item: item });
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result?.error) {
      alert(result.error.message);
    }

    setLoading(false);
  };

  const changeQuantity = (value: number) => {
    setItem({ ...item, quantity: Math.max(0, value) });
  };

  const onQuantityPlus = () => {
    changeQuantity(item.quantity + 1);
  };

  const onQuantityMinus = () => {
    changeQuantity(item.quantity - 1);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    changeQuantity(parseInt(e?.target?.value));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="rounded border p-2 shadow-lg ">
        {/* <span>
          <Image src={item.image} width={300} height={150} alt={item.name} />
        </span> */}
        <h2 className="text-2xl">$ {item.price}</h2>
        <h3 className="text-xl">{item.name}</h3>
        <p className="text-gray-500">{item.description}</p>
        <p className="mt-1 text-sm text-gray-600">Quantity:</p>
        <div className="rounded border">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={onQuantityMinus}>
            -
          </button>
          <input
            type="number"
            className="p-2"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInputChange(event)}
            value={item.quantity}
          />
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={onQuantityPlus}>
            +
          </button>
        </div>
        <p>Total: ${item.quantity * item.price}</p>
        <button
          disabled={item.quantity === 0}
          onClick={createCheckOutSession}
          className="mt-2 block w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-100">
          {loading ? "Processing..." : "Buy"}
        </button>
        {status && status === "success" && (
          <div className="mb-2 rounded border border-green-700 bg-green-100 p-2 text-green-700">
            Payment Successful
          </div>
        )}
        {status && status === "cancel" && (
          <div className="mb-2 rounded border border-red-700 bg-red-100 p-2 text-red-700">
            Payment Unsuccessful
          </div>
        )}
      </div>
    </main>
  );
}
