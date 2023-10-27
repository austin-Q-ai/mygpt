import { Copy, Link2, MinusCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Form, InputField, Select } from "@calcom/ui";

const AddNewUser = () => {
  const { t } = useLocale();
  const [botOptions, setBotOptions] = useState<{ value: string; label: string }[]>([
    {
      value: "suzy",
      label: "Suzi Bot",
    },
  ]);

  const formMethods = useForm({
    defaultValues: {
      bot: {
        value: "suzy",
        label: "Suzi Bot",
      },
      email: "snowflake30518@gmail.com",
      view: {
        value: "",
        label: "",
      },
      sharelink: "",
    },
  });
  const {
    formState: { isDirty, isSubmitting },
    reset,
    getValues,
  } = formMethods;

  return (
    <Form
      form={formMethods}
      handleSubmit={() => {
        console.log("submit");
      }}>
      <div className="flex shrink-0 flex-col justify-center gap-5 bg-white px-[120px] py-8">
        <p className="text-emphasis text-[18px] font-bold leading-7">Add new users to your to your bot</p>
        <div className="flex justify-between">
          <Controller
            name="bot"
            render={({ field: { value, onChange } }) => (
              <Select<{ label: string; value: string }>
                className="w-[660px] capitalize"
                options={botOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-start w-full gap-3 pr-0">
          <div className="flex flex-col self-stretch justify-center mb-2">
            <MinusCircle width="16px" height="16px" />
          </div>
          <Controller
            name="email"
            render={({ field: { value, onChange } }) => (
              <InputField
                className="w-[500px] flex-shrink-0 flex-grow capitalize"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="view"
            render={({ field: { value, onChange } }) => (
              <Select<{ label: string; value: string }>
                className="mb-2 w-[90px] capitalize"
                options={botOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="flex items-start">
          <Button variant="icon" className="flex h-9 items-center justify-center rounded-md !px-5 !py-0">
            <UserPlus width="13.6px" height="13.6px" />
          </Button>
        </div>
        <div className="flex justify-end mt-5">
          <Button className="flex items-center justify-center rounded-md px-8 py-3 text-center text-[14px] leading-5 text-white">
            Share
          </Button>
        </div>
        <hr />
        <p className="text-[18px] font-bold leading-7 text-black">Users with access</p>
        <p className="text-[16px] leading-6 text-[#6B7280]">No User</p>
        <Controller
          name="sharelink"
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center justify-start w-full">
              <Button
                variant="icon"
                color="secondary"
                className="mb-1 flex items-center justify-center !rounded-l-md !rounded-r-none !px-8 !py-3">
                <Link2 />
              </Button>
              <InputField
                className="w-[500px] flex-shrink-0 flex-grow !rounded-l-none capitalize"
                value={value}
                onChange={onChange}
                addOnSuffix={<Copy />}
              />
            </div>
          )}
        />
      </div>
    </Form>
  );
};

export default AddNewUser;
