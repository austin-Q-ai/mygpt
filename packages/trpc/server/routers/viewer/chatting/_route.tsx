import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZChatSchema } from "./chat.schema";
import { ZChatListSchema } from "./chatList.schema";

type ChattingRouterHandlerCache = {
  chat?: typeof import("./chat.handler").chatHandler;
  getChatsList?: typeof import("./chatList.handler").listChatsHandler;
};

const UNSTABLE_HANDLER_CACHE: ChattingRouterHandlerCache = {};

export const chattingRouter = router({
  chat: authedProcedure.input(ZChatSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.chat) {
      UNSTABLE_HANDLER_CACHE.chat = await import("./chat.handler").then((mod) => mod.chatHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.chat) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.chat({
      ctx,
      input,
    });
  }),

  getChatsList: authedProcedure.input(ZChatListSchema).query(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.getChatsList) {
      UNSTABLE_HANDLER_CACHE.getChatsList = await import("./chatList.handler").then(
        (mod) => mod.listChatsHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.getChatsList) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.getChatsList({
      ctx,
      input,
    });
  }),
});
