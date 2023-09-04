import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@calcom/prisma";

// type DateType = {
//   year: number;
//   month: number;
//   date: number;
// };

// function convertDateToTimezone(date: Date, timezone: string): string {
//   // Get the local date/time string in the specified timezone
//   const options: Intl.DateTimeFormatOptions = {
//     timeZone: timezone,
//   };

//   const convertedDate: string = date.toLocaleString("en-US", options);

//   return convertedDate;
// }

// function extractDataFromDate(currentDate: string): DateType {
//   // Extract year and month
//   const year: number = new Date(currentDate).getFullYear();
//   const month: number = new Date(currentDate).getMonth() + 1;
//   const date: number = new Date(currentDate).getDate();

//   return {
//     year: year,
//     month: month,
//     date: date,
//   };
// }

function checkNeedReward(lastRewardedDate: Date): boolean {
  const currentDate: Date = new Date();

  const differenceInMilliseconds: number = currentDate.getTime() - lastRewardedDate.getTime();
  const differenceInDays: number = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return differenceInDays > 30;
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
    if (checkNeedReward(user.lastRewardedDate)) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tokens: {
            increment: parseInt(process.env.AMOUNT_MINTED_PER_MONTH || "480"),
          },
          lastRewardedDate: new Date(),
        },
      });
    }
  }

  res.json({ ok: true });
}
