import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { microcardRouter } from "@calcom/trpc/server/routers/viewer/microcard/_router";

export default createNextApiHandler(microcardRouter);
