import { useAppContextWithSchema } from "@calcom/app-store/EventTypeAppContext";
import AppCard from "@calcom/app-store/_components/AppCard";
import useIsAppEnabled from "@calcom/app-store/_utils/useIsAppEnabled";
import type { EventTypeAppCardComponent } from "@calcom/app-store/types";
import { TextField } from "@calcom/ui";

import type { appDataSchema } from "../zod";

const EventTypeAppCard: EventTypeAppCardComponent = function EventTypeAppCard({ app, eventType }) {
  const [getAppData, setAppData, LockedIcon, disabled] = useAppContextWithSchema<typeof appDataSchema>();
  const trackingId = getAppData("trackingId");
  const { enabled, updateEnabled } = useIsAppEnabled(app);

  return (
    <AppCard
      setAppData={setAppData}
      app={app}
      disableSwitch={disabled}
      LockedIcon={LockedIcon}
      switchOnClick={(e: any) => {
        updateEnabled(e);
      }}
      switchChecked={enabled}
      teamId={eventType.team?.id || undefined}>
      <TextField
        name="Tracking ID"
        value={trackingId}
        disabled={disabled}
        onChange={(e) => {
          setAppData("trackingId", e.target.value);
        }}
      />
    </AppCard>
  );
};

export default EventTypeAppCard;
