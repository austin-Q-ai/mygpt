import { z } from "zod";

export const ZSearchUserInputSchema = z.object({
  name: z.string(),
});

export type TSearchUserInputSchema = z.infer<typeof ZSearchUserInputSchema>;
