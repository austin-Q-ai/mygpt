import type { ReactElement } from "react";

import SettingsLayout from "@calcom/features/settings/layouts/SettingsLayout";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Dialog, DialogTrigger, ConfirmationDialogContent, Meta, Select } from "@calcom/ui";
import { Eye, Trash } from "@calcom/ui/components/icon";

import PageWrapper from "@components/PageWrapper";

interface ExpertCardProps {
  id: string;
  botName: string;
  isDefault?: boolean;
  handleView: (edit_id: string) => void;
  handleDelete: (delete_id: string) => void;
}

const ExpertCard = ({ id, botName, isDefault, handleView, handleDelete }: ExpertCardProps) => {
  const { t } = useLocale();

  return (
    <div className="flex justify-between justify-items-center rounded-none border border-solid border-[#E5E7EB] bg-[#6D278E0D] px-5">
      <div className="flex items-center text-sm font-bold leading-4 text-[#101010]">
        <p>{botName}</p>
      </div>
      <div className="flex items-center justify-start">
        <p>linkedin</p>
      </div>
      <div className="flex justify-between gap-[13px] px-[20px] py-[10px]">
        <Button
          className="flex gap-[11px] p-[10px] text-sm leading-4 shadow-md"
          color="secondary"
          onClick={() => {
            handleView(id);
          }}
          StartIcon={Eye}>
          {t("share")}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button color="secondary" className="border" StartIcon={Trash}>
              {t("delete")}
            </Button>
          </DialogTrigger>
          <ConfirmationDialogContent
            variety="danger"
            title={t("delete_bot")}
            confirmBtnText={t("confirm_delete_bot")}
            onConfirm={() => handleDelete(id)}>
            {t("delete_bot_confirmation_message")}
          </ConfirmationDialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ExploreView = () => {
  const { t } = useLocale();
  const handleView = () => {
    console.log("view");
  };
  const handleDelete = () => {
    console.log("Delete");
  };
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("expertgpt_explore_title")} description={t("expertgpt_explore_description")} />
        <Select
          // options={expertOptions}
          // components={{
          //     Option: (props) => {
          //         return (
          //             <components.Option {...props}>
          //                 <CustomOption
          //                     icon={props.data.avatar}
          //                     value={props.data.value}
          //                     label={props.data.label}
          //                     added={props.data.added}
          //                 />
          //             </components.Option>
          //         );
          //     },
          // }}
          isSearchable={true}
          // filterOption={customFilter}
          className="mb-7 w-full rounded-md text-[.5rem] sm:text-sm"
          // onChange={(event) => {
          //     console.log(event);
          //     setAddExpertId(event?.added ? -1 : event?.value || -1);
          // }}
          // onInputChange={(value) => {
          //     handleExpertSearch(value);
          // }}
        />
        <div className="flex flex-col gap-2">
          <ExpertCard id="1" botName="MyBot1" isDefault handleView={handleView} handleDelete={handleDelete} />
          <ExpertCard id="2" botName="MyBot2" handleView={handleView} handleDelete={handleDelete} />
          <ExpertCard id="3" botName="MyBot3" handleView={handleView} handleDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

ExploreView.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout isWide={true}>{page}</SettingsLayout>;
};
ExploreView.PageWrapper = PageWrapper;

export default ExploreView;
