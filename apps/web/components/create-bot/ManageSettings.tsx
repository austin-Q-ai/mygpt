import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, Form, Select, Label, InputField, TextArea, Group, RadioField } from "@calcom/ui";
import { Plus } from "@calcom/ui/components/icon";

const ManageSettings = () => {
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
      botName: "lazybot",
      description: "bot description",
      extraversion: "low-extraverted",
      conscientiousness: "high-inconscientious",
      neuroticism: "low-inneurotic",
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
          <Button className="flex h-9 items-center gap-2 rounded-md bg-[rgba(109,39,142,0.2)] py-2 pl-3 pr-4 opacity-80">
            <Plus width="16px" className="self-stretch" stroke="#6D278E" />
            <p className="max-h-4 text-center text-[14px] leading-5 text-[#6D278E]">Add</p>
          </Button>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start self-stretch">
              <Controller
                name="bot2"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Label className="text-emphasis">Name</Label>
                    <InputField className="capitalize" value={value} onChange={onChange} />
                  </>
                )}
              />
            </div>
            <div className="flex flex-col self-stretch justify-end">
              <Button
                color="secondary"
                className="rounded-md border border-dashed border-[#6D278E] px-4 py-2 text-[16px] leading-6 text-[#6D278E]">
                Default Bot
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Controller
              name="description"
              render={({ field: { value, onChange } }) => (
                <>
                  <Label className="text-emphasis">Description</Label>
                  <TextArea
                    className="w-full capitalize"
                    value={value}
                    onChange={onChange}
                    cols={4}
                    placeholder="My new bot is about..."
                  />
                </>
              )}
            />
          </div>
          <div className="flex w-[275px] items-center justify-center gap-5 px-12 py-0">
            <hr className="w-[20px] border-[#6B7280]" />
            <p className="text-[16px] leading-6 text-[#6B7280]">Personality</p>
            <hr className="w-[20px] border-[#6B7280]" />
          </div>
          <div className="flex flex-col items-start ">
            <Controller
              name="extraversion"
              render={({ field: { value, onChange } }) => (
                <>
                  <Label className="text-emphasis py-2 text-[14px] font-bold leading-5">Extraversion</Label>
                  <Group
                    className="flex gap-4 capitalize text-black/50"
                    value={value}
                    onValueChange={onChange}>
                    <RadioField id="high-extraverted" value="high-extraverted" label="High extraverted" />
                    <RadioField id="low-extraverted" value="low-extraverted" label="Low extraverted" />
                    <RadioField id="high-intraverted" value="high-intraverted" label="High intraverted" />
                    <RadioField id="low-intraverted" value="low-intraverted" label="Low intraverted" />
                  </Group>
                </>
              )}
            />
          </div>
          <div className="flex flex-col items-start ">
            <Controller
              name="conscientiousness"
              render={({ field: { value, onChange } }) => (
                <>
                  <Label className="text-emphasis py-2 text-[14px] font-bold leading-5">
                    Conscientiousness
                  </Label>
                  <Group
                    className="flex gap-4 capitalize text-black/50"
                    value={value}
                    onValueChange={onChange}>
                    <RadioField
                      id="high-conscientious"
                      value="high-conscientious"
                      label="High conscientious"
                    />
                    <RadioField id="low-conscientious" value="low-conscientious" label="Low conscientious" />
                    <RadioField
                      id="high-inconscientious"
                      value="high-inconscientious"
                      label="High inconscientious"
                    />
                    <RadioField
                      id="low-inconscientious"
                      value="low-inconscientious"
                      label="Low inconscientious"
                    />
                  </Group>
                </>
              )}
            />
          </div>
          <div className="flex flex-col items-start ">
            <Controller
              name="neuroticism"
              render={({ field: { value, onChange } }) => (
                <>
                  <Label className="text-emphasis py-2 text-[14px] font-bold leading-5">Neuroticism</Label>
                  <Group
                    className="flex gap-4 capitalize text-black/50"
                    value={value}
                    onValueChange={onChange}>
                    <RadioField id="high-neurotic" value="high-neurotic" label="High neurotic" />
                    <RadioField id="low-neurotic" value="low-neurotic" label="Low neurotic" />
                    <RadioField id="high-inneurotic" value="high-inneurotic" label="High inneurotic" />
                    <RadioField id="low-inneurotic" value="low-inneurotic" label="Low inneurotic" />
                  </Group>
                </>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end mt-14">
          <Button className="flex items-center justify-center rounded-md px-8 py-3 text-center text-[14px] leading-5 text-white">
            Update
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ManageSettings;
