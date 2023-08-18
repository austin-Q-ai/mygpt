"use client";

import Image from "next/image";
import { it } from "node:test";
import React, { ChangeEvent, useState } from "react";

export default function Home() {
  const [item, setItem] = useState({
    name: "Apple AirPods",
    description: "Latest Apple AirPods.",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    quantity: 0,
    price: 999,
  });
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
        <Image src={item.image} width={300} height={150} alt={item.name} />
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
          className="mt-2 block w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-100">
          Buy
        </button>
      </div>
    </main>
  );
}
