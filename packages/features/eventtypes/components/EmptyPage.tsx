import { useLocale } from "@calcom/lib/hooks/useLocale";

const SkeletonEventType = () => {
  return (
    <div className="dark:bg-darkgray-100 bg-pink/5 h-24 w-full  ">
      <div className="px-10 py-5">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <div className="dark:bg-darkgray-400 h-2 w-1/2 rounded-md bg-neutral-200/90" />
          <div className="dark:bg-darkgray-400 h-2 w-1/2 rounded-md bg-neutral-200/90" />
        </div>
        <div className="flex space-x-2 py-2 rtl:space-x-reverse">
          <div className="dark:bg-darkgray-400 h-2 w-1/3 rounded-md bg-neutral-200/90" />
          <div className="dark:bg-darkgray-400 h-2 w-1/3 rounded-md bg-neutral-200/90" />
          <div className="dark:bg-darkgray-400 h-2 w-1/3 rounded-md bg-neutral-200/90" />
        </div>
        <div className="flex space-x-2 py-1 rtl:space-x-reverse">
          <div className="dark:bg-darkgray-200 h-6 w-1/2 rounded-md bg-neutral-300/80" />
          <div className="dark:bg-darkgray-200 h-6 w-1/2 rounded-md bg-neutral-300/80" />
        </div>
      </div>
    </div>
  );
};

function EmptyPage({ name }: { name: string }) {
  const { t } = useLocale();
  return (
    <div className="relative  text-center">
      <div className="dark:divide-darkgray-100 flex flex-col divide-y-2 blur-[3px]">
        <SkeletonEventType />
        <SkeletonEventType />
        <SkeletonEventType />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <h3 className="text-emphasis text-xl font-semibold">{t("no_event_types")} </h3>
        <h4 className="text-sm leading-normal text-gray-700">{t("no_event_types_description", { name })}</h4>
      </div>
    </div>
  );
}

export default EmptyPage;
