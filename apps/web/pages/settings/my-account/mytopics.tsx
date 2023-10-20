import axios from "axios";
import { useEffect, useState } from "react";

import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import {
  Button,
  Dialog,
  DialogContent,
  TextArea,
  Meta,
  EmptyScreen,
  DialogTrigger,
  ConfirmationDialogContent,
  showToast,
} from "@calcom/ui";
import { Plus, Pencil, Trash2, Newspaper } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

const QDRANT_URL = process.env.NEXT_PUBLIC_QDRANT_URL;
const COLLECTION_NAME = "topics";

interface ITopic {
  id: string;
  topicDesc: string;
}
interface TopicCardProps {
  id: string;
  topicName: string;
  topicDesc: string;
  handleEdit: (edit_id: string, desc: string) => void;
  handleRemove: (delete_id: string) => void;
}
const TopicCard = ({ id, topicName, topicDesc, handleEdit, handleRemove }: TopicCardProps) => {
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
            handleEdit(id, topicDesc);
          }}
          EndIcon={Pencil}>
          {t("edit")}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button color="secondary" className="border" StartIcon={Trash2}>
              {t("remove")}
            </Button>
          </DialogTrigger>
          <ConfirmationDialogContent
            variety="danger"
            title={t("delete_topic")}
            confirmBtnText={t("confirm_delete_topic")}
            onConfirm={() => handleRemove(id)}>
            {t("delete_topic_confirmation_message")}
          </ConfirmationDialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const TopicsView = () => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState("");
  const [topics, setTopics] = useState<ITopic[]>([]);

  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const [topicTitle, setTopicTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    if (isEdit) {
      setTopics(
        topics.map((topic) => {
          if (topic.id === editID) return { id: topic.id, topicDesc: topicTitle };
          else return topic;
        })
      );
    } else {
      setTopics([...topics, { id: Date.now().toString(36), topicDesc: topicTitle }]);
    }
    setTopicTitle("");
    setIsOpen(false);
  };

  const handleEdit = (edit_id: string, desc: string) => {
    setIsEdit(true);
    setEditID(edit_id);
    setTopicTitle(desc);
    setIsOpen(true);
  };

  const handleRemove = (delete_id: string) => {
    setTopics(topics.filter((topic) => topic.id !== delete_id));
  };

  const handleSave = () => {
    if (isLoading || !user) return;
    // add some save functionality to qdrant
    // console.log("userdata: ", user, "topics: ", topics);
    setIsSaving(true);
    axios
      .get(`${QDRANT_URL}/collections`)
      .then((res) => {
        const collections = res.data.result.collections;
        console.log("collections: ", collections);
        if (collections.find((collection: { name: string }) => collection.name === COLLECTION_NAME)) {
          axios
            .put(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, {
              points: [
                {
                  id: user.id, //Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                  vector: [0],
                  payload: {
                    name: user.name,
                    topics: topics,
                    avatar: user.avatar,
                    hasBot: user.hasBot,
                    isOnline: !user.away,
                    bookingCallLink: user.username,
                  },
                },
              ],
            })
            .then((_res) => {
              console.log("save success: ", _res);
              showToast(t("topics_saved_successfully"), "success");
            })
            .catch((_err) => {
              console.log("save error: ", _err);
              showToast(t("error_topics_save"), "error");
            });
        } else {
          console.log("collection ", COLLECTION_NAME, " does not exist");
          axios
            .put(`${QDRANT_URL}/collections/${COLLECTION_NAME}`, {
              vectors: {
                size: 1,
                distance: "Cosine",
              },
            })
            .then((_res) => {
              console.log(`collection ${COLLECTION_NAME} created`);
              axios
                .put(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`, {
                  points: [
                    {
                      id: user.id, //Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                      vector: [0],
                      payload: {
                        name: user.name,
                        topics: topics,
                        avatar: user.avatar,
                        hasBot: user.hasBot,
                        isOnline: !user.away,
                        bookingCallLink: user.username,
                        bio: user.bio,
                      },
                    },
                  ],
                })
                .then((_res) => {
                  console.log("save success: ", _res);
                  showToast(t("topics_saved_successfully"), "success");
                })
                .catch((_err) => {
                  console.log("save error: ", _err);
                  showToast(t("error_topics_save"), "error");
                });
            })
            .catch((_err) => {
              console.log("collection creating failed: ", _err);
              showToast(t("error_topics_save"), "error");
            });
        }
      })
      .catch((err) => {
        // console.log("fetch collection error: ", err);
        // showToast(t("error_topics_save"), "error");
      })
      .finally(() => setIsSaving(false));
  };

  useEffect(() => {
    if (isLoading || !user) return;
    axios
      .get(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/${user.id}`)
      .then((res) => {
        const payload = res.data.result.payload;
        console.log("payload: ", payload);
        setTopics(payload.topics);
      })
      .catch((_err) => {
        console.log("err on fetching existing data: ", _err);
        showToast(t("error_get_topics"), "error");
      });
  }, [isLoading]);

  return (
    <>
      <div className="flex flex-col gap-[30px]">
        <Meta
          title={t("my_topics_description")}
          description=" "
          CTA={
            <Button
              color="primary"
              StartIcon={Plus}
              className="h-[40px] w-[40px] !rounded-full"
              variant="icon"
              onClick={() => {
                setIsEdit(false);
                setTopicTitle("");
                setIsOpen(true);
              }}
            />
          }
        />
        <div className="flex flex-col gap-[10px]">
          {topics.map((topic, _key) => (
            <TopicCard
              key={_key}
              id={topic.id}
              topicName={`Topic ${_key + 1}`}
              topicDesc={topic.topicDesc}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          ))}
        </div>
        <div>
          <Button
            color="primary"
            className="flex h-[36px] w-[80px] justify-center p-[6.166px] text-[12.332px] leading-[17.264px]"
            loading={isSaving}
            onClick={handleSave}>
            {t("save")}
          </Button>
        </div>
        <div className="w-full px-1 sm:px-4">
          {!topics.length && (
            <EmptyScreen
              Icon={Newspaper}
              headline={t("no_topics_data")}
              description={t("no_topics_data_description")}
            />
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent title={isEdit ? t("edit_topic") : t("add_topic")} type="creation">
          <div className="flex flex-col gap-[29.6px] rounded-[6.166px] border-[0.617px] border-solid border-[#E5E7EB] p-[30.83px]">
            <div className="flex flex-col gap-[18.5px]">
              <div className="text-[14.798px] leading-[17.264px]">{t("title")}</div>
              <TextArea
                id="topic_title"
                placeholder={t("add_topic_placeholder")}
                rows={5}
                className="rounded-[3.083px] border-[0.617px] border-[#C4C4C4]"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="primary"
                onClick={handleAdd}
                className="flex h-[36px] w-[80px] justify-center p-[6.166px]"
                disabled={topicTitle === ""}>
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
