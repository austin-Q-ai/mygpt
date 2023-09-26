import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { classNames } from "@calcom/lib";

import { Check, Circle, Info, X } from "../../icon";

export function HintsOrErrors<T extends FieldValues = FieldValues>(props: {
  hintErrors?: string[];
  fieldName: string;
  t: (key: string) => string;
}) {
  const methods = useFormContext() as ReturnType<typeof useFormContext> | null;
  /* If there's no methods it means we're using these components outside a React Hook Form context */
  if (!methods) return null;
  const { formState } = methods;
  const { hintErrors, fieldName, t } = props;
  const upperCaseCheck = (item: any) => {
    const pattern = new RegExp("(?=.*[a-z])(?=.*[A-Z])");
    if (item && item.length > 0 && item !== undefined) {
      return pattern.test(item);
    }
    return false;
  };

  const atLeastOneDigit = (item: any) => {
    const pattern = new RegExp(/\d/);
    if (item && item.length > 0 && item !== undefined) {
      return pattern.test(item);
    }
    return false;
  };

  const minimumLength = (item: any) => {
    const pattern = new RegExp(`[A-Za-z0-9#,.\-_]{7,}`);
    if (item && item.length > 0 && item !== undefined) {
      return pattern.test(item);
    }
    return false;
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fieldErrors: FieldErrors<T> | undefined = formState.errors[fieldName];

  if (!hintErrors && fieldErrors && !fieldErrors.message) {
    // no hints passed, field errors exist and they are custom ones
    return (
      <div className="text-gray text-default mt-2 flex items-center text-sm">
        <ul className="ml-2">
          {Object.keys(fieldErrors).map((key: string) => {
            return (
              <li key={key} className="text-blue-700">
                {t(`${fieldName}_hint_${key}`)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (hintErrors && fieldErrors) {
    // hints passed, field errors exist
    return (
      <div className="text-gray text-default mt-2 flex items-center text-sm">
        <ul className="ml-2">
          {hintErrors.map((key: string) => {
            const submitted = formState.isSubmitted;
            const error = fieldErrors[key] || fieldErrors.message;
            return (
              <li
                key={key}
                className={error !== undefined ? (submitted ? "text-red-700" : "") : "text-green-600"}>
                {error !== undefined ? (
                  submitted ? (
                    <X size="12" strokeWidth="3" className="-ml-1 inline-block ltr:mr-2 rtl:ml-2" />
                  ) : (
                    <Circle fill="currentColor" size="5" className="inline-block ltr:mr-2 rtl:ml-2" />
                  )
                ) : (
                  <Check size="12" strokeWidth="3" className="-ml-1 inline-block ltr:mr-2 rtl:ml-2" />
                )}
                {t(`${fieldName}_hint_${key}`)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // errors exist, not custom ones, just show them as is
  if (fieldErrors) {
    return (
      <div className="text-gray mt-2 flex items-center gap-x-2 text-sm text-red-700">
        <div>
          <Info className="h-3 w-3" />
        </div>
        <p>{fieldErrors.message}</p>
      </div>
    );
  }

  if (!hintErrors) return null;

  // hints passed, no errors exist, proceed to just show hints
  return (
    <div className="text-gray text-default mt-2 flex items-center text-sm">
      <ul className="ml-2">
        {hintErrors.map((key: string) => {
          // if field was changed, as no error exist, show checked status and color
          const value = methods.watch(fieldName);
          const upperCaseFlag = upperCaseCheck(value);
          const atLeastOneDigitFlag = atLeastOneDigit(value);
          const minimumLengthFalg = minimumLength(value);
          return (
            <li
              key={key}
              className={classNames(
                upperCaseFlag && key === "caplow" && "text-green-600",
                atLeastOneDigitFlag && key === "num" && "text-green-600",
                minimumLengthFalg && key === "min" && "text-green-600"
              )}>
              {upperCaseFlag && key === "caplow" ? (
                <Check size="12" strokeWidth="3" className="-ml-1 inline-block ltr:mr-2 rtl:ml-2" />
              ) : (
                key === "caplow" && (
                  <Circle fill="currentColor" size="5" className="inline-block ltr:mr-2 rtl:ml-2" />
                )
              )}
              {atLeastOneDigitFlag && key === "num" ? (
                <Check size="12" strokeWidth="3" className="-ml-1 inline-block ltr:mr-2 rtl:ml-2" />
              ) : (
                key === "num" && (
                  <Circle fill="currentColor" size="5" className="inline-block ltr:mr-2 rtl:ml-2" />
                )
              )}
              {minimumLengthFalg && key === "min" ? (
                <Check size="12" strokeWidth="3" className="-ml-1 inline-block ltr:mr-2 rtl:ml-2" />
              ) : (
                key === "min" && (
                  <Circle fill="currentColor" size="5" className="inline-block ltr:mr-2 rtl:ml-2" />
                )
              )}
              {t(`${fieldName}_hint_${key}`)} {key}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
