import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeError } from "@stripe/stripe-js";
import { useState } from "react";

interface CheckoutFormProps {
  onPaymentSuccess: (tokenCount: number) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement as StripeCardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await fetch("/api/purchase-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const { tokenCount } = await response.json();

      setIsProcessing(false);
      onPaymentSuccess(tokenCount);
    } catch (error: any) {
      setIsProcessing(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      {errorMessage && <p>{errorMessage}</p>}

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Purchase Tokens"}
      </button>
    </form>
  );
};

export default CheckoutForm;
