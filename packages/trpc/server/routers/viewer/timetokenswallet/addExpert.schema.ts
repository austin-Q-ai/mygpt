import { z } from "zod";

export const ZAddExpertSchema = z.object({
  userId: z.string(),
});

export type TAddExpertSchema = z.infer<typeof ZAddExpertSchema>;
