import type { GetServerSidePropsContext } from "next";
import { z } from "zod";

import TokenPaymentPage from "@calcom/features/ee/payments/components/TokenPaymentPage";
import type { PaymentPageProps } from "@calcom/features/ee/payments/components/TokenPaymentPage";
import prisma from "@calcom/prisma";

import PageWrapper from "@components/PageWrapper";

// type PaymentProps = {
//   expertid: string;
//   amount: number; // if amount should be number, replace with number
// };

export default function Payment(props: PaymentPageProps) {
  // const { expertid, amount } = props;
  return <TokenPaymentPage {...props} />;
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
