import PaymentPage from "@calcom/features/ee/payments/components/PaymentPage";
import TokenPaymentPage from "@calcom/features/ee/payments/components/TokenPaymentPage";
import { getServerSideProps } from "@calcom/features/ee/payments/pages/payment";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";

import PageWrapper from "@components/PageWrapper";

export default function Payment(props: inferSSRProps<typeof getServerSideProps>) {
  return props.buyToken ? <TokenPaymentPage {...props} /> : <PaymentPage {...props} />;
}

Payment.PageWrapper = PageWrapper;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { uid, amount } = z.object({ uid: z.string(), amount: z.string() }).parse(context.query);

  const expertData = await prisma.user.findFirst({
    where: {
      id: parseInt(uid),
    },
    select: {
      username: true,
      name: true,
      id: true,
      price: true,
    },
  });

  if (!expertData) return { notFound: true };

  return {
    props: {
      expertId: expertData.id,
      amount: parseInt(amount),
      ...expertData,
      renderUrl: `${process.env.NEXT_PUBLIC_WEBAPP_URL}/timetokens-wallet`,
    }, // will be passed to the page component as props
  };
}
