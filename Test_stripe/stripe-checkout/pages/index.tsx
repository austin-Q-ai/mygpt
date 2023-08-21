import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

import CheckoutForm from "../components/CheckoutForm";

interface CheckoutProps {
  session: any; // Modify the type according to your authentication provider
}

const Checkout: NextPage<CheckoutProps> = ({ session }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const handlePaymentSuccess = (tokenCount: number) => {
    alert("Tokens purchased: " + tokenCount);
    // Update user's token balance or perform any necessary actions
    // You can use your own logic and update the balance in your database
  };

  return (
    <>
      <Elements stripe={stripePromise}>
        <h1>Timed Token Checkout</h1>
        <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
      </Elements>
    </>
  );
};

export default Checkout;
