import { post } from "@calcom/lib/fetch-wrapper";
import type { BuyTokensBody } from "@calcom/prisma/zod-utils";

type BuyTokensResponse = Awaited<
  ReturnType<typeof import("@calcom/features/timetokenswallet/handleBuyTokens").default>
>;

export const buyTokens = async (data: BuyTokensBody) => {
  const response = await post<BuyTokensBody, BuyTokensResponse>("/api/timetokenswallet/event", data);
  return response;
};
