import { z } from "zod";

export const ZAddExpertSchema = z.object({
  emitterId: z.number(),
});

export type TAddExpertSchema = z.infer<typeof ZAddExpertSchema>;
