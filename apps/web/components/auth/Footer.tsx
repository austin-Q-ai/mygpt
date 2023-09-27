import { X, type LucideIcon as IconType } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  col?: number;
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
  return windowWidth >= 1024 ? (
    <div className="text-pink absolute  mt-6 flex w-full flex-row justify-evenly pb-2 font-medium">
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
                  className="to-emphasis bg-gradient-to-b from-gray-100"
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
  ) : (
    <div className="text-pink align-center absolute my-6 grid w-full grid-cols-12 gap-4  pb-2 text-sm font-medium">
      {props.items.map((item) => {
        const { Icon, name } = item;
        const nameKey: nameKey = name.toLocaleLowerCase() as nameKey;
        return (
          <div className={`col-span-${item.col} mx-auto my-auto w-full text-center`} key={item.name}>
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
              <Link className="col-span-1  mx-auto my-auto w-full text-center" href={item.url}>
                <div className="flex w-full flex-row justify-center">
                  <div className="flex-col px-2">
                    {item.picture ? (
                      <Image src={item.picture} alt={item.name} width={180} height={55} />
                    ) : Icon && Icon !== undefined ? (
                      <>
                        <Icon />
                      </>
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
