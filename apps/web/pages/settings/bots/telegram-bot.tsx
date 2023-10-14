import { getLayout } from "@calcom/features/settings/layouts/SettingsLayout";
import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Meta } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";

const TelegramBotView = () => {
  const { t } = useLocale();
  return (
    <div className="flex flex-row">
      <div className="flex-1">
        <Meta title={t("telegram_bot")} description={t("telegram_bot_description", { appName: APP_NAME })} />
      </div>
    </div>
  );
};

TelegramBotView.getLayout = getLayout;
TelegramBotView.PageWrapper = PageWrapper;

export default TelegramBotView;
