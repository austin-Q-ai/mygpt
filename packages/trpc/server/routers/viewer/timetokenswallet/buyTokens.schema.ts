import { z } from "zod";

export const ZBuyTokensSchema = z.object({
  emitterId: z.number(),
  amount: z.number(),
});

export type TBuyTokensSchema = z.infer<typeof ZBuyTokensSchema>;
