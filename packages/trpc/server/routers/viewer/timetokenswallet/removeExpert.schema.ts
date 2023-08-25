import { z } from "zod";

export const ZRemoveExpertSchema = z.object({
  emitterId: z.number(),
});

export type TRemoveExpertSchema = z.infer<typeof ZRemoveExpertSchema>;
