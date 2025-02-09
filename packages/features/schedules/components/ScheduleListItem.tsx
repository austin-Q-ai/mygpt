import Link from "next/link";
import { Fragment } from "react";

import { availabilityAsString } from "@calcom/lib/availability";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { RouterOutputs } from "@calcom/trpc/react";
import { trpc } from "@calcom/trpc/react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownItem,
  DropdownMenuTrigger,
  showToast,
} from "@calcom/ui";
import { Globe, MoreHorizontal, Trash, Star, Copy } from "@calcom/ui/components/icon";

export function ScheduleListItem({
  schedule,
  deleteFunction,
  displayOptions,
  updateDefault,
  isDeletable,
  duplicateFunction,
}: {
  schedule: RouterOutputs["viewer"]["availability"]["list"]["schedules"][number];
  deleteFunction: ({ scheduleId }: { scheduleId: number }) => void;
  displayOptions?: {
    timeZone?: string;
    hour12?: boolean;
  };
  isDeletable: boolean;
  updateDefault: ({ scheduleId, isDefault }: { scheduleId: number; isDefault: boolean }) => void;
  duplicateFunction: ({ scheduleId }: { scheduleId: number }) => void;
}) {
  const { t, i18n } = useLocale();

  const { data, isLoading } = trpc.viewer.availability.schedule.get.useQuery({ scheduleId: schedule.id });

  return (
    <li key={schedule.id}>
      <div className="hover:bg-muted flex items-center justify-between py-5 ltr:pl-4 rtl:pr-4 sm:ltr:pl-0 sm:rtl:pr-0">
        <div className="group flex w-full items-center justify-between sm:px-6">
          <Link
            href={"/availability/" + schedule.id}
            className="flex-grow truncate text-sm"
            title={schedule.name}>
            <div className="space-x-2 rtl:space-x-reverse">
              <span className="text-emphasis truncate font-medium">{schedule.name}</span>
              {schedule.isDefault && (
                <Badge variant="success" className="bg-badge text-badge text-xs">
                  {t("default")}
                </Badge>
              )}
            </div>
            <p className="text-subtle mt-1">
              {schedule.availability
                .filter((availability) => !!availability.days.length)
                .map((availability) => (
                  <Fragment key={availability.id}>
                    {availabilityAsString(availability, {
                      locale: i18n.language,
                      hour12: displayOptions?.hour12,
                    })}
                    <br />
                  </Fragment>
                ))}
              {(schedule.timeZone || displayOptions?.timeZone) && (
                <p className="my-1 flex items-center first-letter:text-xs">
                  <Globe className="h-3.5 w-3.5" />
                  &nbsp;{schedule.timeZone ?? displayOptions?.timeZone}
                </p>
              )}
            </p>
          </Link>
        </div>
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="schedule-more"
              className="mx-5"
              type="button"
              variant="icon"
              color="secondary"
              StartIcon={MoreHorizontal}
            />
          </DropdownMenuTrigger>
          {!isLoading && data && (
            <DropdownMenuContent>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                {!schedule.isDefault && (
                  <DropdownItem
                    type="button"
                    StartIcon={Star}
                    onClick={() => {
                      updateDefault({
                        scheduleId: schedule.id,
                        isDefault: true,
                      });
                    }}>
                    {t("set_as_default")}
                  </DropdownItem>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  type="button"
                  data-testid={"schedule-duplicate" + schedule.id}
                  StartIcon={Copy}
                  onClick={() => {
                    duplicateFunction({
                      scheduleId: schedule.id,
                    });
                  }}>
                  {t("duplicate")}
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="min-w-40 focus:ring-muted">
                <DropdownItem
                  type="button"
                  color="destructive"
                  StartIcon={Trash}
                  data-testid="delete-schedule"
                  onClick={() => {
                    if (!isDeletable) {
                      showToast(t("requires_at_least_one_schedule"), "error");
                    } else {
                      deleteFunction({
                        scheduleId: schedule.id,
                      });
                    }
                  }}>
                  {t("delete")}
                </DropdownItem>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </Dropdown>
      </div>
    </li>
  );
}
