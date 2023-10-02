import { z } from "zod";

export const ZUserInputSchema = z.object({
  userId: z.number(),
});

export type TUserInputSchema = z.infer<typeof ZUserInputSchema>;
