import type { NextApiRequest, NextApiResponse } from "next";

export default async function CalcomApi(_: NextApiRequest, res: NextApiResponse) {
  res.status(201).json({ message: "Welcome to mygpt.fi API - docs are at https://developer.mygpt.fi/api" });
}
