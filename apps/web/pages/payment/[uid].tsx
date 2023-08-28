import TokenPaymentPage from "@calcom/features/ee/payments/components/TokenPaymentPage";

import PageWrapper from "@components/PageWrapper";

type PaymentProps = {
  expertid: string;
  amount: number; // if amount should be number, replace with number
};

export default function Payment(props:PaymentProps) {
  console.log("paragon there------", props);

  // const { expertid, amount } = props;
  return <TokenPaymentPage {...props} />;
}
Payment.PageWrapper = PageWrapper;
export async function getServerSideProps(context: PaymentProps) {
  const { uid, amount } = context.query;
  const expertData = await prisma.user.findFirst({
    where: {
      id:parseInt(uid),
    },
    select: {
      username: true,
      name: true,
      id: true,
    price:true}})
    if (!expertData) return { notFound: true };
  return {
    props: {expertid: uid,
      amount: amount,
    ...{expertData}
    }, // will be passed to the page component as props
  };
}
