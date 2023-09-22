import type { FormValues } from "pages/event-types/[type]";
import { useForm } from "react-hook-form";

import { Button, TextField } from "@calcom/ui";
import { ArrowRight, CheckCircle2 } from "@calcom/ui/components/icon";

type PriceListItemProps = {
  priceItem: { name: string; features: string[]; ipDevice: string; password: string };
};
export default function PriceListItem({ priceItem: props }: PriceListItemProps) {
  console.log(props);
  const methods = useForm<FormValues>({
    defaultValues: { ipDevice: props.ipDevice, password: props.password },
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <>
      <div className="container flex flex-col rounded-md border bg-white p-3">
        <div className="my-3 h-3/4 flex-row">
          {props.features.map((feature) => {
            return (
              <div className="my-2 flex flex-row gap-2 " key={feature}>
                <CheckCircle2 className="h-5 w-5 text-white " fill="#5d2782" />
                <span className=" w-full text-xs">{feature}</span>
              </div>
            );
          })}
        </div>
        <div className="text-pink my-3 flex-row text-center font-sans text-xl font-bold">{props.name}</div>
        <div className="my-3 flex-row">
          <TextField floatingLabel size="lg" {...register("ipDevice")} required />
          <TextField floatingLabel size="lg" {...register("password")} required />
        </div>
        <div className=" my-3 flex  flex-row justify-end">
          <div className="flex flex-col">
            <div className="mb-4 flex-row text-right text-[0.5rem]">
              Read and accept the terms and conditions
            </div>
            <div className="flex-row text-right">
              <Button className="!hover:bg-[#5d278270] !bg-[#5d2782] !text-white" EndIcon={ArrowRight}>
                I Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
