import { stringify } from "querystring";

import { WEBSITE_URL } from "@calcom/lib/constants";

export type Maybe<T> = T | undefined | null;

export function createPaymentLink(opts: {
  paymentUid: string;
  name?: Maybe<string>;
  date?: Maybe<string>;
  email?: Maybe<string>;
  absolute?: boolean;
}): string {
  const { paymentUid, name, email, date, absolute = true } = opts;
  let link = "";
  if (absolute) link = WEBSITE_URL;
  const query = stringify({ date, name, email });
  return link + `/payment/${paymentUid}?${query}`;
}

export function createTokenPaymentLink(opts: { paymentUid: string }): string {
  const { paymentUid } = opts;
  const link = WEBSITE_URL;
  return link + `/payment/${paymentUid}`;
}

export function createUpgradePaymentLink(opts: { paymentUid: string }): string {
  const { paymentUid } = opts;
  const link = WEBSITE_URL;
  return link + `/payment/${paymentUid}`;
}
