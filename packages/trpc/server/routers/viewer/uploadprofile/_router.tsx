import localeMiddleware from "../../middlewares/localeMiddleware";
import sessionMiddleware from "../../middlewares/sessionMiddleware";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { slotsRouter } from "../viewer/slots/_router";
import { ZUploadProfileInputSchema } from "./uploadProfile.schema";

type UploadProfileViewerRouterHandlerCache = {
  uploadProfile?: typeof import("./uploadProfile.handler").uploadProfileHandler;
};

const UNSTABLE_HANDLER_CACHE: UploadProfileViewerRouterHandlerCache = {};

// things that unauthenticated users can query about themselves
export const uploadprofileViewerRouter = router({
  uploadProfile: publicProcedure.input(ZUploadProfileInputSchema).mutation(async ({ ctx, input }) => {
    if (!UNSTABLE_HANDLER_CACHE.uploadProfile) {
      UNSTABLE_HANDLER_CACHE.uploadProfile = await import("./uploadProfile.handler").then(
        (mod) => mod.uploadProfileHandler
      );
    }

    // Unreachable code but required for type safety
    if (!UNSTABLE_HANDLER_CACHE.uploadProfile) {
      throw new Error("Failed to load handler");
    }

    return UNSTABLE_HANDLER_CACHE.uploadProfile({
      ctx,
      input,
    });
  }),
});
