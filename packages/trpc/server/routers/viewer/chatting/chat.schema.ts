import { z } from "zod";

export const ZChatSchema = z.object({
  chatText: z.string(),
});

export type TChatSchema = z.infer<typeof ZChatSchema>;
