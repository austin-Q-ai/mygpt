import classNames from "classnames";
import { X, type LucideIcon as IconType } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { SVGComponent } from "@calcom/types/SVGComponent";
import { Dialog, DialogContent, DialogTrigger } from "@calcom/ui";

import Benefits from "@components/auth/Benefits";
import Features from "@components/auth/Features";
import UseCases from "@components/auth/UseCases";

export type LinkProps = {
  name: string;
  url: string;
  Icon?: SVGComponent | IconType;
  picture?: string | undefined;
  sideLabel?: string;
  col?: number;
  type?: "modal";
};
type FooterPropsTypes = {
  items: LinkProps[];
  className?: string;
};
type nameKey = "benefits" | "features" | "use cases";
interface ModalsMapType {
  [key: string]: JSX.Element;
}

const ModalsMap: ModalsMapType = {
  benefits: <Benefits />,
  features: <Features />,
  "use cases": <UseCases />,
} as const;
useState;
export default function Footer(props: FooterPropsTypes) {
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { t } = useLocale();
  return (
    <div
      className={classNames(
        windowWidth >= 1024
          ? "text-secondary absolute mt-6 flex w-full flex-row justify-evenly pb-2 font-medium"
          : "text-secondary align-center absolute grid w-full grid-cols-12 gap-4 bg-[#CFBDDA]  py-6 pb-2 text-sm font-medium",

        props.className
      )}>
      {props.items.map((item) => {
        const { Icon, name } = item;
        const nameKey: nameKey = name.toLocaleLowerCase() as nameKey;
        return (
          <div
            className={classNames(
              windowWidth >= 1024
                ? "my-auto flex-col"
                : `col-span-${item.col} mx-auto my-auto w-full text-center`
            )}
            key={item.name}>
            {item.type === "modal" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Link href="" aria-label={item.name}>
                    {item.name}
                  </Link>
                </DialogTrigger>
                <DialogContent
                  className="to-emphasis bg-gradient-to-b from-gray-100"
                  size="lg"
                  Icon={X}
                  title={t("")}>
                  {ModalsMap[nameKey]}
                </DialogContent>
              </Dialog>
            ) : (
              <Link
                className={classNames(
                  windowWidth >= 1024 ? "flex" : "col-span-1  mx-auto my-auto w-full text-center"
                )}
                href={item.url}>
                <div
                  className={classNames(
                    windowWidth >= 1024 ? "flex flex-row gap-2" : "flex w-full flex-row justify-center"
                  )}>
                  <div className={classNames(windowWidth >= 1024 ? "flex-col" : "flex-col px-2")}>
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
