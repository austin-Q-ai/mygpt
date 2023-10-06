import UpgradePaymentPage from "@calcom/features/ee/payments/components/UpgradePaymentPage";
import { getServerSideProps } from "@calcom/features/ee/payments/pages/u/payment";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import PageWrapper from "@components/PageWrapper";

export default function Payment(props: inferSSRProps<typeof getServerSideProps>) {
  return <UpgradePaymentPage {...props} />;
}
Payment.PageWrapper = PageWrapper;
export { getServerSideProps };
