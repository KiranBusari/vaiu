import { useMutation } from "@tanstack/react-query";
import { Plan } from "../types";

export const useCreateSubscription = () => {
  const mutation = useMutation({
    mutationFn: async (plan: Plan) => {
      const response = await fetch("/api/payment-gateway/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: plan,
          amount: plan === "Pro" ? 10 : 50,
          transactionId: `${plan}-${Date.now()}`,
          phone: "9999999999", // This should be replaced with the user's phone number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          "error" in errorData && typeof errorData.error === "string"
            ? errorData.error
            : "Failed to create subscription"
        );
      }

      const data = await response.json();
      return data;
    },
  });

  return mutation;
};