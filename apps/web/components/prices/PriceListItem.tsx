import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui";
import { ArrowRight, CheckCircle2 } from "@calcom/ui/components/icon";

type PriceListItemProps = {
  priceItem: { name: string; features: string[]; ipDevice: string; password: string };
};
export default function PriceListItem({ priceItem: props }: PriceListItemProps) {
  const { t } = useLocale();
  return (
    <div className="container col-span-1 my-4 flex flex-col rounded-md border bg-white p-3 shadow md:my-0">
      <div className="my-3 h-3/4 flex-row">
        {props.features.map((feature) => {
          return (
            <div className="my-2 flex flex-row gap-2 " key={feature}>
              <CheckCircle2 className="h-5 w-5 text-white " fill="#5d2782" />
              <span className=" w-full text-xs">{t(feature)}</span>
            </div>
          );
        })}
      </div>
      <div className="text-pink my-10 flex-row text-center font-sans text-xl font-bold">{t(props.name)}</div>

      <div className=" my-3 flex  flex-row justify-center">
        <div className="flex flex-col">
          <div className="mb-4 flex-row text-center text-[0.5rem]">
            {t("read_and_accept_the_terms_and_conditions")}
          </div>
          <div className="flex-row text-center">
            <Button className="!hover:bg-[#5d278270] !bg-[#5d2782] !text-white" EndIcon={ArrowRight}>
              {t("sign_up")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
