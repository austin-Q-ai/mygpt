import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { timetokenswalletRouter } from "@calcom/trpc/server/routers/viewer/timetokenswallet/_router";

export default createNextApiHandler(timetokenswalletRouter);
