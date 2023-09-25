import { X, type LucideIcon as IconType } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { SVGComponent } from "@calcom/types/SVGComponent";
import { Button, Dialog, DialogContent, DialogTrigger } from "@calcom/ui";

import Benifits from "@components/auth/Benifits";
import Features from "@components/auth/Features";
import UseCases from "@components/auth/UseCases";

export type LinkProps = {
  name: string;
  url: string;
  Icon?: SVGComponent | IconType;
  picture?: string | undefined;
  sideLabel?: string;
  type?: "modal";
};
type FooterPropsTypes = {
  items: LinkProps[];
};
type nameKey = "benifits" | "features" | "use cases";
interface ModalsMapType {
  [key: string]: JSX.Element;
}

const ModalsMap: ModalsMapType = {
  benifits: <Benifits />,
  features: <Features />,
  "use cases": <UseCases />,
} as const;
export default function Footer(props: FooterPropsTypes) {
  const { t } = useLocale();
  return (
    <div className="text-pink absolute  mt-6  flex w-full flex-row justify-evenly pb-2">
      {props.items.map((item) => {
        const { Icon, name } = item;
        const nameKey: nameKey = name.toLocaleLowerCase() as nameKey;
        return (
          <div className="my-auto flex-col" key={item.name}>
            {item.type === "modal" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="icon"
                    size="lg"
                    color="secondary"
                    aria-label={item.name}
                    className="p-none text-pink mr-1 hidden border-0 bg-transparent sm:inline">
                    {item.name}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${
                    ["benifits", "use cases"].includes(nameKey)
                      ? "from-bg-emphasis to-bg-white bg-gradient-to-t"
                      : "bg-emphasis"
                  }`}
                  size="lg"
                  Icon={X}
                  title={t("")}>
                  {ModalsMap[nameKey]}
                </DialogContent>
              </Dialog>
            ) : (
              <Link className="flex" href={item.url}>
                <div className="flex flex-row gap-2">
                  <div className="flex-col">
                    {item.picture ? (
                      <Image src={item.picture} alt={item.name} width={125} height={55} />
                    ) : Icon && Icon !== undefined ? (
                      <Icon />
                    ) : (
                      <span className="opacity-80">{item.name}</span>
                    )}
                  </div>
                  <div className="flex-col">{item.sideLabel ? item.sideLabel : ""}</div>
                </div>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
