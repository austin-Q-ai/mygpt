import { z } from "zod";

export const ZChatListSchema = z.object({
  limit: z.number().min(1).max(100),
  cursor: z.number().nullish(),
});

export type TChatListSchema = z.infer<typeof ZChatListSchema>;
