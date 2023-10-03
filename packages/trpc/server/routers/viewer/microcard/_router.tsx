import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";
import { ZUserInputSchema } from "./user.schema";

type microcardRouterHandlerCache = {
  user?: typeof import("./user.handler").userHandler;
};

const UNSTABLE_HANDLER_CACHE: microcardRouterHandlerCache = {};

export const microcardRouter = router({
  user: publicProcedure.input(ZUserInputSchema).query(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.user) {
      UNSTABLE_HANDLER_CACHE.user = await import("./user.handler").then((mod) => mod.userHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.user) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.user({
      ctx,
      input,
    });
  }),
});
