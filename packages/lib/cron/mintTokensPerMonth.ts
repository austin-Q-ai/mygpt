// import type { Prisma } from "@prisma/client";

// import prisma from "@calcom/prisma";

// export type DateType = {
//   year: number;
//   month: number;
//   date: number;
// };

// export function convertDateToTimezone(timezone: string): string {
//   // Get the current date
//   const currentDate: Date = new Date();

//   // Get the local date/time string in the specified timezone
//   const options: Intl.DateTimeFormatOptions = {
//     timeZone: timezone,
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//   };

//   const formattedDate: string = currentDate.toLocaleString("en-US", options);

//   return formattedDate;
// }

// export function extractDataFromDate(currentDate: string): DateType {
//   // Extract year and month
//   const year: number = new Date(currentDate).getFullYear();
//   const month: number = new Date(currentDate).getMonth() + 1;
//   const date: number = new Date(currentDate).getDate();

//   return {
//     year: year,
//     month: year,
//     date: date,
//   };
// }

// export function checkNeedReward(timezone: string, lastRewardedDate: Prisma.DateTime) {
//   lastRewarded: DateType = extractDataFromDate(lastRewarded);
// }

// export default async function mintTokensPerMonth() {
//   const users = await prisma.user.findMany();

//   for (const user of users) {
//     console.log(user);
//   }
// }

export default function mintTokensPerMonth() {
  console.log("");
}
