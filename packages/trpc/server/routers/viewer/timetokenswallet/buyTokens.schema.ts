import { z } from "zod";

export const ZBuyTokensSchema = z.object({
  userId: z.number(),
  amount: z.number(),
});

export type TBuyTokensSchema = z.infer<typeof ZBuyTokensSchema>;
