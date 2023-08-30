import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@calcom/prisma";

type DateType = {
  year: number;
  month: number;
  date: number;
};

function convertDateToTimezone(date: Date, timezone: string): string {
  // Get the local date/time string in the specified timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
  };

  const convertedDate: string = date.toLocaleString("en-US", options);

  return convertedDate;
}

function extractDataFromDate(currentDate: string): DateType {
  // Extract year and month
  const year: number = new Date(currentDate).getFullYear();
  const month: number = new Date(currentDate).getMonth() + 1;
  const date: number = new Date(currentDate).getDate();

  return {
    year: year,
    month: month,
    date: date,
  };
}

function checkNeedReward(timezone: string, lastRewardedDate: Date | null): number {
  if (lastRewardedDate === null) return 0;
  const lastRewarded: DateType = extractDataFromDate(convertDateToTimezone(lastRewardedDate, timezone));
  const currentDate: DateType = extractDataFromDate(convertDateToTimezone(new Date(), timezone));

  if (lastRewarded.year === currentDate.year) {
    const delta: number = currentDate.month - lastRewarded.month;
    if (delta > 0) {
      return delta;
    }
  } else if (lastRewarded.year < currentDate.year) {
    return (currentDate.year - lastRewarded.year) * 12 + (currentDate.month - lastRewarded.month);
  }

  return -1;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = req.headers.authorization || req.query.apiKey;

  if (process.env.CRON_API_KEY !== apiKey) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ message: "Invalid method" });
    return;
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    const delta: number = checkNeedReward(user.timeZone, user.lastRewardedDate);
    if (delta > 0) {
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tokens: {
            increment: parseInt(process.env.AMOUNT_MINTED_PER_MONTH || "480") * delta,
          },
          lastRewardedDate: new Date(),
        },
        select: {
          tokens: true,
        },
      });
    }
  }

  res.json({ ok: true, users: users });
}
