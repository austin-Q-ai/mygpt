import Image from "next/image";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ScrollableArea } from "@calcom/ui";

const features = [
  {
    id: 1,
    title: "Data security",
    description:
      "Explore the latest advancements in AI, dive into thought-provoking discussions, and participate in stimulating challenges. Our platform opens the doors to endless opportunities to learn, share, and create.",
    img: "/app-features/data-secuirty.svg",
  },
  {
    id: 2,
    title: "Cloud Storage",
    description:
      "Explore the latest advancements in AI, dive into thought-provoking discussions, and participate in stimulating challenges. Our platform opens the doors to endless opportunities to learn, share, and create.",
    img: "/app-features/cloud-storage.svg",
  },
  {
    id: 3,
    title: "Daily Analytics",
    description:
      "Explore the latest advancements in AI, dive into thought-provoking discussions, and participate in stimulating challenges. Our platform opens the doors to endless opportunities to learn, share, and create.",
    img: "/app-features/daily-analytic.svg",
  },
];

export default function Features() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col justify-center gap-4 text-center lg:!h-[500px]">
      <span className="flex-row py-4 font-sans text-2xl font-medium md:p-4 md:text-3xl">
        {t("our_features_you_can_get")}
      </span>
      <div>
        <ScrollableArea className="grid h-[500px] flex-row gap-4 bg-transparent md:m-5 md:h-full md:grid-cols-3">
          {features.map((item) => {
            return (
              <div className="col-span-1 rounded-md border bg-white py-2 shadow" key={item.id}>
                <div className="mt-5 flex h-20 w-full flex-row  items-center justify-center">
                  <Image src={item.img} alt={item.title} width={70} height={50} />
                </div>
                <div className="my-4 flex-row text-xl font-medium">{item.title}</div>
                <div className="text-muted mx-2 my-4 flex-row px-4 text-sm">{item.description}</div>
              </div>
            );
          })}
        </ScrollableArea>
      </div>
    </div>
  );
}
