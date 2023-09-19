import type { ReactNode } from "react";

import { useHasTeamPlan } from "@calcom/lib/hooks/useHasPaidPlan";
import { useLocale } from "@calcom/lib/hooks/useLocale";

export function UpgradeTip({
  dark,
  title,
  description,
  background,
  features,
  buttons,
  isParentLoading,
  children,
}: {
  dark?: boolean;
  title: string;
  description: string;
  /* overwrite EmptyScreen text */
  background?: string;
  features: Array<{ icon: JSX.Element; title: string; description: string }>;
  buttons?: JSX.Element;
  /**Chldren renders when the user is in a team */
  children: JSX.Element;
  isParentLoading?: ReactNode;
}) {
  const { t } = useLocale();
  const { isLoading, hasTeamPlan } = useHasTeamPlan();

  if (hasTeamPlan) return children;

  if (isLoading) return <>{isParentLoading}</>;

  return (
    <>
      <div className="mt-4 grid-cols-3 px-6 md:grid md:gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className=" mb-4 min-h-[180px] w-full rounded-md !bg-[#d3bedd40] p-8 md:mb-0">
            {feature.icon}
            <h2 className="font-cal text-emphasis mt-4 text-lg">{feature.title}</h2>
            <p className="text-default">{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
