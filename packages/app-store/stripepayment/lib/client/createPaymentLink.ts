import { stringify } from "querystring";

import { WEBSITE_URL } from "@calcom/lib/constants";

export type Maybe<T> = T | undefined | null;

export function createPaymentLink(opts: {
  expertid: string;
  amount?: Maybe<number>;
  absolute?: boolean;
}): string {
  const { expertid, amount, absolute = true } = opts;
  let link = "";
  if (absolute) link = WEBSITE_URL;
  const query = stringify({ amount });
  return link + `/payment/${expertid}?${query}`;
}

export function createTokenPaymentLink(opts: { paymentUid: string }): string {
  const { paymentUid } = opts;
  const link = WEBSITE_URL;
  return link + `/payment/${paymentUid}`;
}
