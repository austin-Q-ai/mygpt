import { z } from "zod";

export const ZAddExpertSchema = z.object({
  userId: z.number(),
});

export type TAddExpertSchema = z.infer<typeof ZAddExpertSchema>;
