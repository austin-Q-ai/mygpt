import { useLocale } from "@calcom/lib/hooks/useLocale";
import { TextField } from "@calcom/ui";

type BotDataProps = {
  setBotName: (value: string) => void;
  setUserName: (value: string) => void;
  setToken: (value: string) => void;
};

const BotDataInput = (props: BotDataProps) => {
  const { t } = useLocale();
  const { setBotName, setUserName, setToken } = props;
  return (
    <div className="ms-2 flex flex-col justify-between">
      <TextField
        addOnLeading="Bot Name"
        addOnClassname="w-[70%] md:w-[60%] bg-emphasis text-black"
        onChange={(e) => setBotName(e.target.value)}
      />
      <TextField
        addOnLeading="UserName"
        addOnClassname="w-[70%] md:w-[60%] bg-emphasis text-black"
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        addOnLeading="Token"
        addOnClassname="w-[70%] md:w-[60%] bg-emphasis text-black"
        onChange={(e) => setToken(e.target.value)}
      />
    </div>
  );
};

export default BotDataInput;
