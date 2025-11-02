import React, { useState } from "react";
import {
  FaCheck,
  FaCrown,
  FaSpinner,
  FaTimesCircle,
  FaCheckCircle,
  FaStar,
  FaPercent,
  FaWallet,
  FaHeadset,
  FaShieldAlt,
  FaCreditCard,
  FaChartLine,
  FaBullhorn,
  FaUsers,
  FaMedal,
} from "react-icons/fa";
import request from "../../axios/requests";
import { useNavigate } from "react-router-dom";

// Card components for better structure
const Card = ({ children, className, onClick }) => (
  <div
    className={`rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-gray-600 ${className}`}>{children}</p>
);

const CardContent = ({ children, className }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const Button = ({
  children,
  className,
  variant = "default",
  onClick,
  disabled = false,
}) => {
  const baseClasses = "py-2 px-4 rounded-md font-medium transition-colors";
  const variantClasses = {
    default: "bg-gray-800 text-white hover:bg-gray-900",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    silver: "bg-gray-600 text-white hover:bg-gray-700",
    gold: "bg-amber-600 text-white hover:bg-amber-700",
    platinum: "bg-purple-600 text-white hover:bg-purple-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Main component
const VendorMembershipPurchase = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("Monthly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSelectPlan = (planId, duration) => {
    setSelectedPlan(planId);
    setSelectedDuration(duration);
    setMessage({ text: "", type: "" });
  };

  const handleBuyNow = async (plan) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const requestData = {
        membershipType: plan.id,
        paymentMode: "card", // Default, can be made dynamic
        transactionId: `txn_${Date.now()}`, // This should come from your payment gateway
      };

      const response = await request.purchaseMembership(requestData);

      if (response.status === 200) {
        setMessage({
          text: "Vendor membership purchased successfully!",
          type: "success",
        });

        // Redirect to vendor dashboard after a delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Purchase error:", error);

      let errorMessage = "Failed to purchase membership";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Features comparison
  const features = [
    {
      name: "Service Posts",
      freeVendor: "Max 3",
      paidVendor: "Unlimited",
      icon: <FaBullhorn className="text-blue-500" />,
    },
    {
      name: "Commission",
      freeVendor: "20%",
      paidVendor: "15% (tiered)",
      icon: <FaPercent className="text-blue-500" />,
    },
    {
      name: "Search Visibility",
      freeVendor: "Low",
      paidVendor: "Priority / Featured",
      icon: <FaStar className="text-blue-500" />,
    },
    {
      name: "Badge",
      freeVendor: "None",
      paidVendor: "Verified / Premium",
      icon: <FaMedal className="text-blue-500" />,
    },
    {
      name: "Payout",
      freeVendor: "5-7 days",
      paidVendor: "1–3 days",
      icon: <FaWallet className="text-blue-500" />,
    },
    {
      name: "Dispute Handling",
      freeVendor: "Standard",
      paidVendor: "Priority",
      icon: <FaShieldAlt className="text-blue-500" />,
    },
    {
      name: "Ad Credits",
      freeVendor: "None",
      paidVendor: "₹500–₹2000 free/month",
      icon: <FaCreditCard className="text-blue-500" />,
    },
    {
      name: "Customer Insights",
      freeVendor: "None",
      paidVendor: "Basic to Advanced",
      icon: <FaChartLine className="text-blue-500" />,
    },
    {
      name: "Leads Access",
      freeVendor: "General",
      paidVendor: "Guaranteed / Corporate / HNI",
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      name: "Support",
      freeVendor: "Email only",
      paidVendor: "Dedicated Manager (Platinum)",
      icon: <FaHeadset className="text-blue-500" />,
    },
  ];

  const plans = [
    {
      id: "none",
      name: "Free",
      description: "Perfect for growing your vendor business",
      icon: <FaMedal className="h-6 w-6" />,
      color: "text-gray-600",
      borderColor: "border-gray-200",
      bgColor: "bg-white",
      popular: false,
      pricing: {
        Monthly: 0,
        // Quarterly: 2499,
        // Yearly: 7999,
      },
      features: [
        "20% commission rate",
        "Up to 3 service posts",
        "Low priority listing in search",
        "Verified badge",
        "Payout (5-7 days)",
        "Standard dispute handling",
        "No monthly ad credits",
        "No customer insights",
        "Less access to premium leads",
        "Email support",
      ],
      commission: "20%",
      servicePosts: "3",
    },
    {
      id: "premium",
      name: "Premium",
      description: "For established vendors with high demand",
      icon: <FaStar className="h-6 w-6" />,
      color: "text-amber-600",
      borderColor: "border-amber-200",
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      popular: true,
      pricing: {
        Monthly: 999,
        // Quarterly: 2499,
        Yearly: 9999,
      },
      features: [
        "15% commission rate",
        "Unlimited service posts",
        "Featured in search results",
        "Premium badge",
        "Fast payout (2-3 days)",
        "Highest priority dispute handling",
        "₹500-2000 monthly ad credits",
        "Advanced customer insights",
        "Access to corporate/HNI leads",
        "Priority phone support",
      ],
      commission: "15%",
      servicePosts: "Unlimited",
    },
    // {
    //   id: "platinum",
    //   name: "Platinum",
    //   description: "Elite package for top-performing vendors",
    //   icon: <FaCrown className="h-6 w-6" />,
    //   color: "text-purple-600",
    //   borderColor: "border-purple-200",
    //   bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
    //   popular: false,
    //   pricing: {
    //     // Monthly: 4999,
    //     // Quarterly: 2499,
    //     Yearly: 9999,
    //   },
    //   features: [
    //     "3-5% commission rate (performance-based)",
    //     "Unlimited service posts",
    //     "Top featured placement in search",
    //     "Elite platinum badge",
    //     "Instant payout (1-2 days)",
    //     "Executive dispute resolution",
    //     "₹2000 monthly ad credits",
    //     "Comprehensive analytics dashboard",
    //     "Exclusive access to premium clients",
    //     "Dedicated account manager",
    //     "Custom business solutions",
    //   ],
    //   commission: "3-5%",
    //   servicePosts: "Unlimited",
    // },
  ];

  const durations = ["Monthly", "Quarterly", "Yearly"];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Upgrade Your Vendor Account
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Reduce your commission rates, get more visibility, and grow your
          business with our premium vendor plans.
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-6 rounded-lg p-4 text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Free vs Paid Comparison */}
      <div className="mb-12 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-center text-white">
          <h2 className="text-xl font-bold">Free vs Paid Vendor Accounts</h2>
          <p className="opacity-90">
            Upgrade to unlock premium features and higher earnings
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Free Vendor
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Paid Vendor
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="mr-2">{feature.icon}</span>
                        <span>{feature.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <FaTimesCircle className="mr-1 text-red-500" />
                        <span>{feature.freeVendor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <FaCheckCircle className="mr-1 text-green-500" />
                        <span>{feature.paidVendor}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Vendor Subscription Plans
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.bgColor} border-2 ${plan.borderColor} transition-all duration-300 hover:shadow-lg ${
                selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform bg-amber-500 text-white">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="pb-4 text-center">
                <div
                  className={`mx-auto mb-4 w-fit rounded-full bg-gray-100 p-3 ${plan.color}`}
                >
                  {plan.icon}
                </div>
                <CardTitle className={`text-2xl font-bold ${plan.color}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>

                {/* Commission and Service Posts Highlights */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <div className="text-sm text-blue-700">Commission</div>
                    <div className="font-bold text-blue-900">
                      {plan.commission}
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2 text-center">
                    <div className="text-sm text-green-700">Service Posts</div>
                    <div className="font-bold text-green-900">
                      {plan.servicePosts}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Duration Selector */}
                {/* <div className="mb-6 grid grid-cols-3 gap-2"> */}
                <div className="mb-6 flex items-center justify-center gap-4">
                  {durations.map((duration) => {
                    // Only render if this duration has a price for the current plan
                    if (plan.pricing[duration]) {
                      return (
                        <button
                          key={duration}
                          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            selectedPlan === plan.id &&
                            selectedDuration === duration
                              ? plan.id === "silver"
                                ? "bg-gray-600 text-white"
                                : plan.id === "gold"
                                  ? "bg-amber-600 text-white"
                                  : "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => handleSelectPlan(plan.id, duration)}
                        >
                          <div>{duration}</div>
                          <div className="font-bold">
                            ₹{plan.pricing[duration]}
                          </div>
                        </button>
                      );
                    }
                    return null; // Don't render anything if no price for this duration
                  })}
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <FaCheck className="mt-1 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-amber-200 hover:bg-amber-300"
                  variant={plan.id}
                  onClick={() => handleBuyNow(plan)}
                  disabled={loading || selectedPlan !== plan.id}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : selectedPlan === plan.id ? (
                    `Subscribe - ₹${plan.pricing[selectedDuration]}`
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Bonus Note */}
      <div className="mb-6 rounded-lg bg-green-50 p-6">
        <div className="flex items-start">
          <FaChartLine className="mt-1 mr-4 text-xl text-green-500" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              Performance Bonus
            </h3>
            <p className="text-green-700">
              Maintain high ratings to qualify for reduced commission rates.
              Top-performing vendors can earn up to 2% additional commission
              reduction.
            </p>
          </div>
        </div>
      </div>

      {/* Trial Discount Note */}
      <div className="rounded-lg bg-blue-50 p-6">
        <div className="flex items-start">
          <FaStar className="mt-1 mr-4 text-xl text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              New Vendor Offer
            </h3>
            <p className="text-blue-700">
              First month free for new vendors or reduced commission rates
              during trial period. Contact our sales team for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMembershipPurchase;
