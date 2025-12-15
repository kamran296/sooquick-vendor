import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function useRazorpayPayment() {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    if (scriptLoadedRef.current) return;

    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay script loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast.error("Payment system failed to load. Please refresh.");
    };

    document.body.appendChild(script);

    return () => {
      // Clean up if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = async ({
    createOrderApi,
    verifyPaymentApi,
    onSuccess,
    onFailure,
    prefill,
  }) => {
    try {
      // Check if Razorpay is available
      if (!razorpayLoaded) {
        toast.error("Payment system is loading. Please try again in a moment.");
        return;
      }

      if (!window.Razorpay) {
        toast.error("Payment gateway not available. Please refresh the page.");
        return;
      }

      setLoading(true);

      // Step 1: Create order from backend
      const response = await createOrderApi();
      const order = response.data.order;

      if (!order?.id) {
        toast.error("Failed to create payment order.");
        return;
      }

      // Step 2: Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SooQuick",
        description: `${order.notes?.purpose?.toUpperCase() || "Payment"}`,
        order_id: order.id,

        handler: async function (paymentResponse) {
          console.log(paymentResponse, "paymentresponse");
          try {
            const verifyResponse = await verifyPaymentApi({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              purpose: order.notes?.purpose,
              referenceId: order.notes?.referenceId,
            });

            setLoading(false);
            toast.success("Payment Successful ✔");
            onSuccess && onSuccess(verifyResponse.data, response.data);
          } catch (e) {
            setLoading(false);
            console.error("Payment verification error:", e);
            toast.error("Payment verification failed ❌");
            onFailure && onFailure(e);
          }
        },

        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.phone || "",
        },

        theme: {
          color: "#0b8263", // Your teal color
        },

        modal: {
          ondismiss: function () {
            console.log("Checkout closed by user");
            setLoading(false);
          },
        },
      };

      // Add notes if they exist
      if (order.notes) {
        options.notes = order.notes;
      }

      // Step 3: Create and open Razorpay instance
      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setLoading(false);
        toast.error(response.error.description || "Payment failed");
        onFailure && onFailure(response.error);
        setLoading(false);
      });

      // Step 4: Open Razorpay popup
      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setLoading(false);
      toast.error(
        error.response?.data?.error || "Payment failed. Please try again.",
      );
      onFailure && onFailure(error);
    }
  };

  return { initiatePayment, loading, razorpayLoaded };
}
