import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZAddExpertSchema } from "./addExpert.schema";
import { ZBuyTokensSchema } from "./buyTokens.schema";
import { ZRemoveExpertSchema } from "./removeExpert.schema";
import { ZUserInputSchema } from "./user.schema";

type TimeTokensWalletRouterHandlerCache = {
  user?: typeof import("./user.handler").userHandler;
  getAddedExperts?: typeof import("./getAddedExperts.handler").getAddedExpertsHandler;
  addExpert?: typeof import("./addExpert.handler").addExpertHandler;
  removeExpert?: typeof import("./removeExpert.handler").removeExpertHandler;
  buyTokens?: typeof import("./buyTokens.handler").buyTokensHandler;
  revokeToken?: typeof import("./revokeToken.handler").revokeTokenHandler;
};

const UNSTABLE_HANDLER_CACHE: TimeTokensWalletRouterHandlerCache = {};

export const timetokenswalletRouter = router({
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

  removeExpert: authedProcedure.input(ZRemoveExpertSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.removeExpert) {
      UNSTABLE_HANDLER_CACHE.removeExpert = await import("./removeExpert.handler").then(
        (mod) => mod.removeExpertHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.removeExpert) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.removeExpert({
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

  revokeToken: authedProcedure.mutation(async ({ ctx }) => {
    if (!UNSTABLE_HANDLER_CACHE.revokeToken) {
      UNSTABLE_HANDLER_CACHE.revokeToken = await import("./revokeToken.handler").then((mod) => mod.revokeTokenHandler);
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.revokeToken) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.revokeToken({
      ctx
    });
  }),
});
