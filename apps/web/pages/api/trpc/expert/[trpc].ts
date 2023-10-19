import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { expertRouter } from "@calcom/trpc/server/routers/viewer/expert/_router";

export default createNextApiHandler(expertRouter);
