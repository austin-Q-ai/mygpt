import getBrandColours from "@calcom/lib/getBrandColours";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, useCalcomTheme } from "@calcom/ui";
import { ArrowRight, CheckCircle2 } from "@calcom/ui/components/icon";
import Link from "next/link";

type PriceListItemProps = {
  priceItem: { name: string; features: string[]; ipDevice: string; password: string };
  handleClick: () => void;
  disabled?: boolean
};

export default function PriceListItem({ priceItem: props, handleClick, disabled }: PriceListItemProps) {
  const { t } = useLocale();
  const brandTheme = getBrandColours({
    lightVal: "#6d278e",
    darkVal: "#fafafa",
  });
  useCalcomTheme(brandTheme);

  return (
    <div className="container flex flex-col col-span-1 p-3 my-4 bg-white border rounded-md shadow md:my-0">
      <div className="flex-row my-3 h-3/4">
        {props.features.map((feature) => {
          return (
            <div className="flex flex-row items-center gap-2 my-2" key={feature}>
              <CheckCircle2 className="w-5 h-5 text-white " fill="#6d278e" />
              <span className="w-full text-xs ">{t(feature)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex-row my-10 font-sans text-xl font-bold text-center text-secondary">
        {t(props.name)}
      </div>

      <div className="flex flex-row justify-center my-3 ">
        <div className="flex flex-col">
          <div className="mb-4 flex-row text-center text-[0.5rem]">
            {t("read_and_accept_the_terms_and_conditions")}
          </div>
          <div className="flex-row text-center">
            <Link href="/signup"><Button color="primary" EndIcon={ArrowRight} onClick={handleClick} hidden={disabled}>
              {t("sign_up")}
            </Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
