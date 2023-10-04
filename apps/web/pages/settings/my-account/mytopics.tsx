import { useState } from "react";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Meta } from "@calcom/ui";
import { Plus, Pencil, Trash } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface ITopic {
  topicName: string;
  topicDesc: string;
}
const TopicCard = ({ topicName, topicDesc }: ITopic) => {
  const { t } = useLocale();
  return (
    <div className="flex justify-between justify-items-center p-[20px]">
      <div className="flex justify-items-start text-sm font-bold leading-4 text-[#101010]">
        <p>{topicName}</p>
      </div>
      <div className="w-[300px]">
        <p className="text-sm leading-5 text-[#6B7280]">{topicDesc}</p>
      </div>
      <div className="flex justify-between px-[20px] py-[10px] gap-[13px]">
        <Button
          color="secondary"
          onClick={() => {
            console.log("edit");
          }}
          EndIcon={Pencil}>
          {t("edit")}
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            console.log("remove");
          }}
          EndIcon={Trash}>
          {t("remove")}
        </Button>
      </div>
    </div>
  );
};

const TopicsView = () => {
  const { t } = useLocale();
  const [topics, setTopics] = useState<ITopic[]>([
    {
      topicName: "Topic1",
      topicDesc: "Evaluate a Residential property in the Rural area with a Buy and Hold investment strategy.",
    },
    {
      topicName: "Topic2",
      topicDesc: "Evaluate a Residential property in the Rural area with a Buy and Hold investment strategy.",
    },
    {
      topicName: "Topic3",
      topicDesc: "Evaluate a Residential property in the Rural area with a Buy and Hold investment strategy.",
    },
  ]);

  return (
    <div className="flex flex-col">
      <Meta
        title={t("microcard_description")}
        description=" "
        CTA={
          <Button
            color="primary"
            StartIcon={Plus}
            className="h-[40px] w-[40px] !rounded-full"
            variant="icon"
            onClick={() => {
              console.log("click plus");
            }}
          />
        }
      />
      <div className="flex flex-col gap-[10px]">
        {topics.map((topic, key) => (
          <TopicCard key={key} {...topic} />
        ))}
      </div>
      <Button color="primary">{t("save")}</Button>
    </div>
  );
};

TopicsView.getLayout = getLayout;
TopicsView.PageWrapper = PageWrapper;

export default TopicsView;
