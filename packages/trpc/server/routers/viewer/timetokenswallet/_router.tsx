import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZAddExpertSchema } from "./addExpert.schema";
import { ZBuyTokensSchema } from "./buyTokens.schema";
import { ZUserInputSchema } from "./user.schema";

type AvailabilityRouterHandlerCache = {
  list?: typeof import("./list.handler").listHandler;
  user?: typeof import("./user.handler").userHandler;
};

const UNSTABLE_HANDLER_CACHE: AvailabilityRouterHandlerCache = {};

export const timetokenswalletRouter = router({
  getAddedExperts: authedProcedure.query(async ({ ctx }) => {
    if (!UNSTABLE_HANDLER_CACHE.getAddedExperts) {
      UNSTABLE_HANDLER_CACHE.getAddedExperts = await import("./getAddedExperts.handler").then(
        (mod) => mod.getAddedExpertsHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.getAddedExperts) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.getAddedExperts({
      ctx,
    });
  }),

  user: authedProcedure.input(ZUserInputSchema).query(async ({ ctx, input }) => {
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

  addExpert: authedProcedure.input(ZAddExpertSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.addExpert) {
      UNSTABLE_HANDLER_CACHE.addExpert = await import("./addExpert.handler").then(
        (mod) => mod.addExpertHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.addExpert) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.addExpert({
      ctx,
      input,
    });
  }),

  buyTokens: authedProcedure.input(ZBuyTokensSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.buyTokens) {
      UNSTABLE_HANDLER_CACHE.buyTokens = await import("./buyTokens.handler").then(
        (mod) => mod.buyTokensHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.buyTokens) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.buyTokens({
      ctx,
      input,
    });
  }),
});
