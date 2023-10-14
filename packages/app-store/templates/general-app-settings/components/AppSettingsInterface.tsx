import type { ChangeEvent } from "react";
import { useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button, TextField } from "@calcom/ui";

export default function AppSettings() {
  const { t } = useLocale();
  const [input, setInput] = useState("");

  return (
    <div className="space-y-4 px-4 pb-4 pt-4 text-sm">
      <TextField
        placeholder="Some Input"
        value={input}
        name="Enter Input"
        onChange={async (e: ChangeEvent<HTMLInputElement>) => {
          setInput(e.target.value);
        }}
      />
      <Button>{t("submit")}</Button>
    </div>
  );
}
