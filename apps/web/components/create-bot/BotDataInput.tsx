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
    <div className="flex flex-col justify-between">
      <TextField
        addOnLeading="Bot Name"
        addOnClassname="md:w-32 w-24 bg-emphasis font-light"
        className="w-48"
        containerClassName="md:w-80 w-72"
        onChange={(e) => setBotName(e.target.value)}
      />
      <TextField
        addOnLeading="UserName"
        addOnClassname="md:w-32 w-24 bg-emphasis font-light"
        containerClassName="md:w-80 w-72"
        className="w-48"
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        addOnLeading="Token"
        addOnClassname="md:w-32 w-24 bg-emphasis font-light"
        containerClassName="md:w-80 w-72"
        className="w-48"
        onChange={(e) => setToken(e.target.value)}
      />
    </div>
  );
};

export default BotDataInput;
