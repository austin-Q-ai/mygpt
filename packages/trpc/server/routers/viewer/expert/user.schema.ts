import { z } from "zod";

export const ZUserInputSchema = z.object({
  username: z.string(),
});

export type TUserInputSchema = z.infer<typeof ZUserInputSchema>;
