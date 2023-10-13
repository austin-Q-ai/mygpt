import TokenPaymentPage from "@calcom/features/ee/payments/components/TokenPaymentPage";
import { getServerSideProps } from "@calcom/features/ee/payments/pages/b/payment";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import PageWrapper from "@components/PageWrapper";

export default function Payment(props: inferSSRProps<typeof getServerSideProps>) {
  return <TokenPaymentPage {...props} />;
}
Payment.PageWrapper = PageWrapper;
export { getServerSideProps };
