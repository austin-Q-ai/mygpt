import { useState } from "react";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, DialogContent, TextArea, Meta } from "@calcom/ui";
import { Plus, Pencil, Trash } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface ITopic {
  topicName: string;
  topicDesc: string;
}
const TopicCard = ({ topicName, topicDesc }: ITopic) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-between justify-items-center rounded-none border border-solid border-[#E5E7EB] bg-[#6D278E0D] p-[20px]">
      <div className="flex justify-items-start text-sm font-bold leading-4 text-[#101010]">
        <p>{topicName}</p>
      </div>
      <div className="w-[300px]">
        <p className="text-sm leading-5 text-[#6B7280]">{topicDesc}</p>
      </div>
      <div className="flex justify-between gap-[13px] px-[20px] py-[10px]">
        <Button
          className="flex gap-[11px] p-[10px] text-sm leading-4 shadow-md"
          color="secondary"
          onClick={() => {
            console.log("edit");
          }}
          EndIcon={Pencil}>
          {t("edit")}
        </Button>
        <Button
          className="flex gap-[11px] p-[10px] text-sm leading-4 shadow-md"
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
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      <div className="flex flex-col gap-[30px]">
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
                setIsOpen(true);
              }}
            />
          }
        />
        <div className="flex flex-col gap-[10px]">
          {topics.map((topic, key) => (
            <TopicCard key={key} {...topic} />
          ))}
        </div>
        <div>
          <Button
            color="primary"
            className="flex h-[36px] w-[80px] justify-center p-[6.166px] text-[12.332px] leading-[17.264px]">
            {t("save")}
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent title={t("add_topic")} type="creation">
          <div className="flex flex-col gap-[29.6px] rounded-[6.166px] border-[0.617px] border-solid border-[#E5E7EB] p-[30.83px]">
            <div className="flex flex-col gap-[18.5px]">
              <div className="text-[14.798px] leading-[17.264px]">{t("title")}</div>
              <TextArea
                id="topic_title"
                placeholder={t("form_description_placeholder")}
                rows={5}
                className="rounded-[3.083px] border-[0.617px] border-[#C4C4C4]"
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="primary"
                onClick={() => console.log("click")}
                className="flex h-[36px] w-[80px] justify-center p-[6.166px]">
                {t("save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

TopicsView.getLayout = getLayout;
TopicsView.PageWrapper = PageWrapper;

export default TopicsView;
