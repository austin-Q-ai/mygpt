import Link from "next/link";

import getBrandColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, useCalcomTheme } from "@calcom/ui";
import { ArrowRight, CheckCircle2 } from "@calcom/ui/components/icon";

type PriceListItemProps = {
  priceItem: { name: string; features: string[]; ipDevice: string; password: string };
  handleClick: () => void;
  disabled?: boolean;
};

export default function PriceListItem({ priceItem: props, handleClick, disabled }: PriceListItemProps) {
  const { t } = useLocale();
  const brandTheme = getBrandColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  useCalcomTheme(brandTheme);

  return (
    <div className="container col-span-1 my-4 flex flex-col rounded-md border bg-white p-3 shadow md:my-0">
      <div className="my-3 h-3/4 flex-row">
        {props.features.map((feature) => {
          return (
            <div className="my-2 flex flex-row items-center gap-2" key={feature}>
              <CheckCircle2 className="h-5 w-5 text-white " fill="#6d278e" />
              <span className="w-full text-xs ">{t(feature)}</span>
            </div>
          );
        })}
      </div>
      <div className="text-secondary my-10 flex-row text-center font-sans text-xl font-bold">
        {t(props.name)}
      </div>

      <div className="my-3 flex flex-row justify-center ">
        <div className="flex flex-col">
          <div className="mb-4 flex-row text-center text-[0.5rem]">
            {t("read_and_accept_the_terms_and_conditions")}
          </div>
          <div className="flex-row text-center">
            <Link href="/signup">
              <Button color="primary" EndIcon={ArrowRight} onClick={handleClick} hidden={disabled}>
                {t("sign_up")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
