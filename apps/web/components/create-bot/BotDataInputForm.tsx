import {
  Button,
  Tooltip,
  Input,
  Form,
  TextField
} from "@calcom/ui";
import { useLocale } from "@calcom/lib/hooks/useLocale";

const BotDataInputForm = () => {
    const { t } = useLocale();
    return(
        <Form>
           <Input label={t("Bot Name")}/>
           <Input label={t("Bot Name")}/>
           <Input label={t("Bot Name")}/>
           <Button />
        </Form>
    )
}

export default BotDataInputForm