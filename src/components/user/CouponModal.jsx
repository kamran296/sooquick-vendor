// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { FaSpinner, FaTimes } from "react-icons/fa";
// import request from "../../axios/requests";

// const CouponModal = ({
//   plan,
//   duration,
//   onClose,
//   onSuccess,
//   onContinueWithoutCoupon,
// }) => {
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [couponResult, setCouponResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleValidateCoupon = async () => {
//     if (!code.trim()) {
//       setError("Please enter a coupon code");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       // Log the data being sent
//       const requestData = {
//         code: code.trim(),
//         membershipType: plan.id,
//         amount: plan.pricing[duration],
//         category: "membership",
//       };

//       console.log("Sending coupon validation request:", requestData);

//       const response = await request.validateCoupon(requestData);

//       console.log("Coupon validation response:", response.data);

//       if (response.data.success) {
//         setCouponResult(response.data.data);
//         toast.success("Coupon applied successfully!");
//       }
//     } catch (err) {
//       console.error("Full error object:", err);
//       console.error("Error response data:", err.response?.data);
//       console.error("Error status:", err.response?.status);

//       const errorMessage = err.response?.data?.message || "Invalid coupon code";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleApplyCoupon = () => {
//     if (couponResult) {
//       onSuccess({
//         ...couponResult,
//         code: code.trim(),
//       });
//     }
//   };

//   const handleContinueWithoutCoupon = () => {
//     onContinueWithoutCoupon();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b p-4">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Apply Coupon Code
//           </h2>
//           <button
//             onClick={onClose}
//             className="rounded-full p-1 hover:bg-gray-100"
//           >
//             <FaTimes className="h-5 w-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           {/* Plan Summary */}
//           <div className="mb-6 rounded-lg bg-gray-50 p-4">
//             <h3 className="font-medium text-gray-700">Order Summary</h3>
//             <div className="mt-2 flex justify-between">
//               <span className="text-gray-600">
//                 {plan.name} - {duration}
//               </span>
//               <span className="font-semibold">₹{plan.pricing[duration]}</span>
//             </div>
//           </div>

//           {/* Coupon Input */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Enter Coupon Code
//               </label>
//               <div className="mt-1 flex gap-2">
//                 <input
//                   type="text"
//                   value={code}
//                   onChange={(e) => {
//                     setCode(e.target.value.toUpperCase());
//                     setError("");
//                     setCouponResult(null);
//                   }}
//                   placeholder="Enter code"
//                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
//                   disabled={loading || couponResult}
//                 />
//                 <button
//                   onClick={handleValidateCoupon}
//                   disabled={loading || !code.trim() || couponResult}
//                   className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <FaSpinner className="h-5 w-5 animate-spin" />
//                   ) : (
//                     "Apply"
//                   )}
//                 </button>
//               </div>
//               {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//             </div>

//             {/* Coupon Result */}
//             {couponResult && (
//               <div className="rounded-md bg-green-50 p-4">
//                 <p className="text-sm text-green-800">
//                   Coupon applied successfully!
//                 </p>
//                 <div className="mt-2 flex justify-between text-sm">
//                   <span className="text-gray-600">Original Amount:</span>
//                   <span className="font-medium">
//                     ₹{couponResult.originalAmount}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount:</span>
//                   <span className="font-medium text-green-600">
//                     -₹{couponResult.discountAmount}
//                   </span>
//                 </div>
//                 <div className="mt-1 flex justify-between border-t border-green-200 pt-1 font-semibold">
//                   <span>Final Amount:</span>
//                   <span
//                     className={
//                       couponResult.finalAmount === 0 ? "text-green-600" : ""
//                     }
//                   >
//                     ₹{couponResult.finalAmount}
//                     {couponResult.finalAmount === 0 && " (Free)"}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-6 space-y-3">
//             {couponResult ? (
//               <button
//                 onClick={handleApplyCoupon}
//                 className="w-full rounded-md bg-teal-600 py-2 text-white hover:bg-teal-700"
//               >
//                 Continue with Applied Coupon
//               </button>
//             ) : (
//               <button
//                 onClick={handleContinueWithoutCoupon}
//                 className="w-full rounded-md bg-gray-600 py-2 text-white hover:bg-gray-700"
//               >
//                 Continue without Coupon
//               </button>
//             )}

//             <button
//               onClick={onClose}
//               className="w-full rounded-md border border-gray-300 py-2 text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CouponModal;

// demo2
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner, FaTimes } from "react-icons/fa";
import request from "../../axios/requests";

const CouponModal = ({
  plan,
  duration,
  onClose,
  onSuccess,
  onContinueWithoutCoupon,
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false); // New state for payment processing

  const handleValidateCoupon = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const requestData = {
        code: code.trim(),
        membershipType: plan.id,
        amount: plan.pricing[duration],
        category: "membership",
      };

      console.log("Sending coupon validation request:", requestData);

      const response = await request.validateCoupon(requestData);

      console.log("Coupon validation response:", response.data);

      if (response.data.success) {
        setCouponResult(response.data.data);
        toast.success("Coupon applied successfully!");
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage = err.response?.data?.message || "Invalid coupon code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponResult) {
      setProcessingPayment(true); // Show processing state
      try {
        await onSuccess({
          ...couponResult,
          code: code.trim(),
        });
        // Don't close modal here - let the parent component handle it after API response
      } catch (error) {
        // Error is already handled in parent component
        console.error("Error in handleApplyCoupon:", error);
      } finally {
        setProcessingPayment(false);
      }
    }
  };

  const handleContinueWithoutCoupon = async () => {
    setProcessingPayment(true); // Show processing state
    try {
      await onContinueWithoutCoupon();
      // Don't close modal here - let the parent component handle it after API response
    } catch (error) {
      // Error is already handled in parent component
      console.error("Error in handleContinueWithoutCoupon:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Determine if any operation is in progress
  const isProcessing = loading || processingPayment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Apply Coupon Code
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Plan Summary */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Order Summary</h3>
            <div className="mt-2 flex justify-between">
              <span className="text-gray-600">
                {plan.name} - {duration}
              </span>
              <span className="font-semibold">₹{plan.pricing[duration]}</span>
            </div>
          </div>

          {/* Coupon Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter Coupon Code
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError("");
                    setCouponResult(null);
                  }}
                  placeholder="Enter code"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none disabled:bg-gray-100"
                  disabled={isProcessing || couponResult}
                />
                <button
                  onClick={handleValidateCoupon}
                  disabled={isProcessing || !code.trim() || couponResult}
                  className="flex min-w-[80px] items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="h-5 w-5 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            {/* Coupon Result */}
            {couponResult && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  Coupon applied successfully!
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Original Amount:</span>
                  <span className="font-medium">
                    ₹{couponResult.originalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -₹{couponResult.discountAmount}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t border-green-200 pt-1 font-semibold">
                  <span>Final Amount:</span>
                  <span
                    className={
                      couponResult.finalAmount === 0 ? "text-green-600" : ""
                    }
                  >
                    ₹{couponResult.finalAmount}
                    {couponResult.finalAmount === 0 && " (Free)"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {couponResult ? (
              <button
                onClick={handleApplyCoupon}
                disabled={isProcessing}
                className="flex w-full items-center justify-center rounded-md bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue with Applied Coupon"
                )}
              </button>
            ) : (
              <button
                onClick={handleContinueWithoutCoupon}
                disabled={isProcessing}
                className="flex w-full items-center justify-center rounded-md bg-gray-600 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue without Coupon"
                )}
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full rounded-md border border-gray-300 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          {/* Global loading overlay (optional - for better UX) */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/50">
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <FaSpinner className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
