import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZAddExpertSchema } from "./addExpert.schema";
import { ZUserInputSchema } from "./user.schema";

type AvailabilityRouterHandlerCache = {
  list?: typeof import("./list.handler").listHandler;
  user?: typeof import("./user.handler").userHandler;
};

const UNSTABLE_HANDLER_CACHE: AvailabilityRouterHandlerCache = {};

export const timetokenswalletRouter = router({
  getAddedExperts: authedProcedure.query(async ({ ctx }) => {
    if (!UNSTABLE_HANDLER_CACHE.list) {
      UNSTABLE_HANDLER_CACHE.list = await import("./getAddedExperts.handler").then(
        (mod) => mod.getAddedExpertsHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.list) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.list({
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
    if (!UNSTABLE_HANDLER_CACHE.user) {
      UNSTABLE_HANDLER_CACHE.user = await import("./addExpert.handler").then((mod) => mod.addExpertHandler);
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
