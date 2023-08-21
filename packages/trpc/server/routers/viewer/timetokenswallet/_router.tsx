import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZSearchUserInputSchema } from "./searchUser.schema";

type TimetokenswalletRouterHandlerCache = {
  searchUser?: typeof import("./searchUser.handler").searchUserHandler;
};

const UNSTABLE_HANDLER_CACHE: TimetokenswalletRouterHandlerCache = {};

export const timetokenswalletRouter = router({
  searchUser: authedProcedure.input(ZSearchUserInputSchema).query(async ({ input, ctx }) => {
    if (!UNSTABLE_HANDLER_CACHE.searchUser) {
      UNSTABLE_HANDLER_CACHE.searchUser = await import("./searchUser.handler").then(
        (mod) => mod.searchUserHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.searchUser) {
      throw new Error("Failed to load handler");
    }

    // const timer = logP(`searchUser(${ctx.user.id})`);

    const result = await UNSTABLE_HANDLER_CACHE.searchUser({
      ctx,
      input,
    });

    // timer();

    return result;
  }),
});
