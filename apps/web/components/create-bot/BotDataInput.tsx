import { useLocale } from "@calcom/lib/hooks/useLocale";
import { TextField } from "@calcom/ui";

const BotDataInput = (props) => {
  const { t } = useLocale();
  const { setBotName, setUserName, setToken } = props;
  return (
    <div className="mt-4">
        <TextField
          addOnLeading="Bot Name"
          addOnClassname="w-32"
          className="w-48"
          containerClassName="w-80 m-auto"
          onChange={(e) => setBotName(e.target.value)}
        />
        <TextField addOnLeading="UserName" addOnClassname="w-32 flex justfy-center items-center" containerClassName="w-80 m-auto"
          className="w-48" onChange={(e) => setUserName(e.target.value)} />
        <TextField addOnLeading="Token" addOnClassname="w-32" containerClassName="w-80 m-auto"
          className="w-48" onChange={(e) => setToken(e.target.value)} />
    </div>
  );
};

export default BotDataInput;
