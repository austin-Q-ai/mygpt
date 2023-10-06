import { post } from "@calcom/lib/fetch-wrapper";
import type { UpgradePlanBody } from "@calcom/prisma/zod-utils";

type UpgradePlanResponse = Awaited<
  ReturnType<typeof import("@calcom/features/upgrade-plan/handleUpgradePlan").default>
>;

export const upgradePlan = async (data: UpgradePlanBody) => {
  const response = await post<UpgradePlanBody, UpgradePlanResponse>("/api/upgrade-plan/event", data);
  return response;
};
