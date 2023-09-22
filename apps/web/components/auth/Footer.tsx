import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { SVGComponent } from "@calcom/types/SVGComponent";

type LinkProps = {
  name: string;
  url: string;
  Icon?: SVGComponent | React.ElementType | undefined;
  picture?: string | undefined;
  sideLabel?: string;
};
type FooterPropsTypes = {
  items: LinkProps[];
};

type IconContentProps = React.ComponentProps<any> & {
  Icon?: string;
};
export function IconContent(props: IconContentProps) {
  const { Icon } = props;
  return Icon;
}

export default function Footer(props: FooterPropsTypes) {
  return (
    <div className="text-pink absolute  mt-6  flex w-full flex-row justify-center pb-2 md:gap-6 lg:gap-10 xl:gap-20">
      {props.items.map((link) => {
        const { Icon } = link;
        return (
          <div className="my-auto flex-col" key={link.name}>
            <Link className="flex" href={link.url}>
              <div className="flex flex-row gap-2">
                <div className="flex-col">
                  {link.picture ? (
                    <Image src={link.picture} alt={link.name} width={125} height={55} />
                  ) : Icon && Icon !== undefined ? (
                    <IconContent Icon={Icon} />
                  ) : (
                    <span className="opacity-80">{link.name}</span>
                  )}
                </div>
                <div className="flex-col">{link.sideLabel ? link.sideLabel : ""}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
