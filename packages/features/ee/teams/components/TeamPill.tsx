import classNames from "classnames";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { MembershipRole } from "@calcom/prisma/enums";

type PillColor = "pink" | "green" | "red" | "orange";

interface Props {
  text: string;
  color?: PillColor;
}

export default function TeamPill(props: Props) {
  return (
    <div
      className={classNames("text-medium self-center rounded-md px-1 py-0.5 text-xs ltr:mr-1 rtl:ml-1", {
        " bg-subtle text-emphasis": !props.color,
        " bg-badge text-emphasis": props.color === "pink",
        " bg-error text-red-800 ": props.color === "red",
        " bg-attention text-orange-800": props.color === "orange",
      })}>
      {props.text}
    </div>
  );
}

export function TeamRole(props: { role: MembershipRole }) {
  const { t } = useLocale();
  const keys: Record<MembershipRole, PillColor | undefined> = {
    [MembershipRole.OWNER]: "pink",
    [MembershipRole.ADMIN]: "red",
    [MembershipRole.MEMBER]: undefined,
  };
  return <TeamPill text={t(props.role.toLowerCase())} color={keys[props.role]} />;
}
