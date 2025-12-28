import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaWallet,
  FaRupeeSign,
  FaGift,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaFilter,
  FaSearch,
  FaDownload,
  FaShare,
  FaPlus,
  FaShoppingCart,
  FaUndo,
  FaStar,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import UserLayout from "../../layouts/user/UserLayout";
import request from "../../axios/requests";
import { toast } from "react-toastify";
import { setSidebarTab } from "../../redux/slices/sidebarSlice";

const Wallet = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState("");
  const [cashoutLoading, setCashoutLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSidebarTab(3));
  }, []);
  // Filter transactions based on active tab and search term
  const filteredTransactions =
    walletData?.transactions?.filter((transaction) => {
      const matchesTab = activeTab === "all" || transaction.type === activeTab;
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    }) || [];

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case "membership_purchase":
        return <FaShoppingCart className="text-purple-500" />;
      case "service_payment":
        return <FaCreditCard className="text-blue-500" />;
      case "refund":
        return <FaUndo className="text-green-500" />;
      case "reward_points":
        return <FaStar className="text-yellow-500" />;
      case "cashout":
        return <FaMoneyBillWave className="text-red-500" />;
      default:
        return <FaWallet className="text-gray-500" />;
    }
  };

  // Get transaction color based on type and amount
  const getTransactionColor = (type, amount) => {
    if (type === "cashout") return "text-red-600";
    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type) => {
    const labels = {
      refund: "Refund",
      reward_points: "Reward Points",
      cashout: "Cashout",
    };
    return labels[type] || type;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount with currency
  const formatAmount = (amount) => {
    const currency = walletData?.currency || "INR";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch wallet data from API
  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await request.getWallet();
      setWalletData(response.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setError("Failed to load wallet data. Please try again.");
      // Set fallback data for demo
      setWalletData({
        balance: 0,
        rewardPoints: 0,
        currency: "INR",
        transactions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cashout request
  const handleCashout = async () => {
    if (!cashoutAmount || cashoutAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (cashoutAmount > walletData.balance) {
      setError("Insufficient balance");
      return;
    }

    try {
      setCashoutLoading(true);
      const response = await request.cashoutWallet({
        amount: parseFloat(cashoutAmount),
      });

      if (response.success) {
        setShowCashoutModal(false);
        setCashoutAmount("");
        setError(null);
        // Refresh wallet data
        await fetchWallet();
      } else {
        setError(response.message || "Cashout failed");
      }
    } catch (error) {
      console.error("Cashout error:", error);
      setError("Cashout failed. Please try again.");
    } finally {
      setCashoutLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!walletData?.transactions)
      return { totalCredit: 0, totalDebit: 0, totalTransactions: 0 };

    const transactions = walletData.transactions;
    const totalCredit = transactions
      .filter(
        (t) =>
          t.amount > 0 &&
          t.type !== "reward_points" &&
          t.type !== "cashout" &&
          t.type !== "purchase",
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter((t) => t.amount < 0 || t.type === "cashout")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalCredit,
      totalDebit,
      totalTransactions: transactions.length,
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    fetchWallet();
  }, []);

  const [cashoutStep, setCashoutStep] = useState(1); // 1: Amount, 2: Bank Details, 3: Confirmation
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("bank"); // 'bank' or 'upi'
  const [savedBankAccounts, setSavedBankAccounts] = useState([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  // Add these new functions for the cashout modal
  const handleCashoutSubmit = async () => {
    if (!cashoutAmount || cashoutAmount <= 0) {
      toast.error("Please enter a valid amount");
      setError("Please enter a valid amount");
      return;
    }

    if (cashoutAmount > walletData.balance) {
      toast.error("Insufficient balance");
      setError("Insufficient balance");
      return;
    }

    if (cashoutStep === 1) {
      setCashoutStep(2);
      return;
    }

    if (cashoutStep === 2) {
      if (paymentMethod === "bank") {
        if (
          !bankDetails.accountHolderName ||
          !bankDetails.accountNumber ||
          !bankDetails.ifscCode
        ) {
          toast.error("Please fill all required bank details");
          setError("Please fill all required bank details");
          return;
        }
      } else {
        if (!bankDetails.upiId) {
          toast.error("Please enter UPI ID");
          setError("Please enter UPI ID");
          return;
        }
      }
      setCashoutStep(3);
      return;
    }

    // Final submission
    try {
      setCashoutLoading(true);

      const cashoutData = {
        amount: parseFloat(cashoutAmount),
        type: "Vendor", // or "user"
        bankDetails:
          paymentMethod === "bank"
            ? {
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                ifscCode: bankDetails.ifscCode,
                bankName: bankDetails.bankName,
              }
            : { upiId: bankDetails.upiId },
      };

      const response = await request.cashoutWallet(cashoutData);

      //  Handle backend response properly
      if (response.data.success) {
        toast.success(
          response.message || "Cashout request submitted successfully!",
        );
        setShowCashoutModal(false);

        // Reset states
        setCashoutAmount("");
        setBankDetails({
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          upiId: "",
        });
        setCashoutStep(1);
        setPaymentMethod("bank");
        setError(null);

        // Refresh wallet data
        await fetchWallet();
      } else {
        //  Show backend message
        console.log(response.data, "ee");
        toast.error(response.data.message || "Cashout failed");
        setError(response.data.message || "Cashout failed");
      }
    } catch (error) {
      console.error("Cashout error:", error);
      setShowCashoutModal(false);
      toast.error(
        error.response.data.message || "Cashout failed. Please try again.",
      );
      setError(
        error.response.data.message || "Cashout failed. Please try again.",
      );
    } finally {
      setCashoutLoading(false);
    }
  };

  const handleBankDetailChange = (field, value) => {
    setBankDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchBankDetails = async () => {
    try {
      // You might want to implement this to fetch saved bank accounts
      // const response = await request.getBankAccounts();
      // setSavedBankAccounts(response.data);
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#0b8263]"></div>
            <p className="mt-4 text-gray-600">Loading wallet...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-600">
              Manage your balance and track transactions
            </p>
          </div>

          {/* Wallet Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Balance Card */}
            <div className="rounded-2xl border-l-4 border-l-[#0b8263] bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Current Balance
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {formatAmount(walletData?.balance || 0)}
                  </p>
                </div>
                <div className="rounded-full bg-[#0b8263] p-3">
                  <FaWallet className="text-2xl text-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCashoutModal(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0b8263] px-4 py-2 font-medium text-white transition-colors hover:bg-[#096b52]"
                >
                  <FaMoneyBillWave className="text-sm" />
                  Cash Out
                </button>
              </div>
            </div>

            {/* Rewards Card */}
            {/* <div className="rounded-2xl border-l-4 border-l-amber-500 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Reward Points
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {walletData?.rewardPoints || 0} pts
                  </p>
                </div>
                <div className="rounded-full bg-amber-500 p-3">
                  <FaGift className="text-2xl text-white" />
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  💎 Premium members earn 2x reward points on every booking
                </p>
              </div>
            </div> */}
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <FaArrowDown className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="font-semibold text-gray-900">
                    {formatAmount(stats.totalCredit)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <FaArrowUp className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="font-semibold text-gray-900">
                    {formatAmount(stats.totalDebit)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <FaHistory className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="font-semibold text-gray-900">
                    {stats.totalTransactions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            {/* Transactions Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Transaction History
                  </h2>
                  <p className="text-gray-600">
                    All your wallet transactions in one place
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      className="rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-[#0b8263] focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-6 pt-4">
              <div className="flex space-x-1 overflow-x-auto">
                {[
                  {
                    id: "all",
                    label: "All",
                    count: walletData?.transactions?.length || 0,
                  },

                  {
                    id: "refund",
                    label: "Refunds",
                    count:
                      walletData?.transactions?.filter(
                        (t) => t.type === "refund",
                      ).length || 0,
                  },
                  {
                    id: "reward_points",
                    label: "Rewards",
                    count:
                      walletData?.transactions?.filter(
                        (t) => t.type === "reward_points",
                      ).length || 0,
                  },
                  {
                    id: "cashout",
                    label: "Cashout",
                    count:
                      walletData?.transactions?.filter(
                        (t) => t.type === "cashout",
                      ).length || 0,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-shrink-0 rounded-t-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#0b8263] text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#0b8263]"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-gray-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-gray-100 p-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {transaction.description}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.createdAt)} • Balance:{" "}
                            {formatAmount(transaction.balanceAfter)}
                          </p>
                          {transaction.referenceId && (
                            <p className="text-xs text-gray-500">
                              Ref: {transaction.referenceId}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-semibold ${getTransactionColor(transaction.type, transaction.amount)}`}
                        >
                          {transaction.amount > 0 &&
                          transaction.type !== "cashout"
                            ? "+"
                            : ""}
                          {formatAmount(transaction.amount)}
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.type === "membership_purchase"
                              ? "bg-purple-100 text-purple-800"
                              : transaction.type === "service_payment"
                                ? "bg-blue-100 text-blue-800"
                                : transaction.type === "refund"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.type === "reward_points"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <FaWallet className="mx-auto mb-4 text-4xl text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    No transactions found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || activeTab !== "all"
                      ? "Try changing your filters or search term"
                      : "Your transaction history will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0b8263] to-[#096b52] p-6 text-white">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Need help with your wallet?
                </h3>
                <p className="opacity-90">
                  Contact our support team for any wallet-related queries
                </p>
              </div>
              <button className="mt-4 rounded-lg bg-white px-6 py-2 font-semibold text-[#0b8263] transition-colors hover:bg-gray-100 md:mt-0">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cashout Modal */}
      {showCashoutModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {cashoutStep === 1 && "Cash Out Amount"}
                {cashoutStep === 2 && "Bank Details"}
                {cashoutStep === 3 && "Confirm Cashout"}
              </h3>
              <button
                onClick={() => {
                  setShowCashoutModal(false);
                  setCashoutStep(1);
                  setCashoutAmount("");
                  setBankDetails({
                    accountHolderName: "",
                    accountNumber: "",
                    ifscCode: "",
                    bankName: "",
                    upiId: "",
                  });
                  setPaymentMethod("bank");
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        cashoutStep >= step
                          ? "border-[#0b8263] bg-[#0b8263] text-white"
                          : "border-gray-300 text-gray-300"
                      }`}
                    >
                      {step}
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        cashoutStep >= step ? "text-[#0b8263]" : "text-gray-400"
                      }`}
                    >
                      {step === 1
                        ? "Amount"
                        : step === 2
                          ? "Details"
                          : "Confirm"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative -top-4 -z-10 mx-auto h-0.5 w-3/4 bg-gray-200">
                <div
                  className="h-full bg-[#0b8263] transition-all duration-300"
                  style={{ width: `${((cashoutStep - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Amount Selection */}
            {cashoutStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount to Cash Out
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="number"
                      value={cashoutAmount}
                      onChange={(e) => setCashoutAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                      max={walletData?.balance}
                      min="1"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Available balance: {formatAmount(walletData?.balance || 0)}
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000, 5000, 10000, walletData?.balance].map(
                    (amount) => (
                      <button
                        key={amount}
                        disabled={amount > walletData?.balance}
                        onClick={() =>
                          setCashoutAmount(
                            amount === walletData?.balance
                              ? walletData.balance
                              : amount,
                          )
                        }
                        className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                          cashoutAmount == amount
                            ? "border-[#0b8263] bg-[#0b8263] text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {amount === walletData?.balance
                          ? "Max"
                          : formatAmount(amount)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Bank Details */}
            {cashoutStep === 2 && (
              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("bank")}
                      className={`rounded-lg border p-3 text-center transition-colors ${
                        paymentMethod === "bank"
                          ? "border-[#0b8263] bg-[#0b8263] text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaCreditCard className="mx-auto mb-1" />
                      <span className="text-sm">Bank Transfer</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`rounded-lg border p-3 text-center transition-colors ${
                        paymentMethod === "upi"
                          ? "border-[#0b8263] bg-[#0b8263] text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaMoneyBillWave className="mx-auto mb-1" />
                      <span className="text-sm">UPI</span>
                    </button>
                  </div>
                </div>

                {/* Bank Transfer Form */}
                {paymentMethod === "bank" && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountHolderName}
                        onChange={(e) =>
                          handleBankDetailChange(
                            "accountHolderName",
                            e.target.value,
                          )
                        }
                        placeholder="Enter account holder name"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountNumber}
                        onChange={(e) =>
                          handleBankDetailChange(
                            "accountNumber",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        placeholder="Enter account number"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                        maxLength={18}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          value={bankDetails.ifscCode}
                          onChange={(e) =>
                            handleBankDetailChange(
                              "ifscCode",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="IFSC Code"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                          maxLength={11}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            handleBankDetailChange("bankName", e.target.value)
                          }
                          placeholder="Bank name"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === "upi" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      value={bankDetails.upiId}
                      onChange={(e) =>
                        handleBankDetailChange("upiId", e.target.value)
                      }
                      placeholder="yourname@upi"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[#0b8263]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your UPI ID for instant transfer
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {cashoutStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2">
                      <FaMoneyBillWave className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-green-800">
                        Cashout Summary
                      </h4>
                      <p className="text-sm text-green-700">
                        Review your cashout details before confirming
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">
                      {formatAmount(cashoutAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold capitalize">
                      {paymentMethod} Transfer
                    </span>
                  </div>
                  {paymentMethod === "bank" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Holder:</span>
                        <span className="font-semibold">
                          {bankDetails.accountHolderName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-semibold">
                          ****{bankDetails.accountNumber.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IFSC Code:</span>
                        <span className="font-semibold">
                          {bankDetails.ifscCode}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI ID:</span>
                      <span className="font-semibold">{bankDetails.upiId}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatAmount(cashoutAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-3">
                  <p className="text-xs text-yellow-800">
                    ⏰ Cashout requests are processed within 24-48 hours. You'll
                    receive a confirmation once processed.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              {cashoutStep > 1 && (
                <button
                  onClick={() => setCashoutStep(cashoutStep - 1)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={cashoutLoading}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleCashoutSubmit}
                disabled={
                  cashoutLoading || (cashoutStep === 1 && !cashoutAmount)
                }
                className="flex-1 rounded-lg bg-[#0b8263] px-4 py-3 font-medium text-white transition-colors hover:bg-[#096b52] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cashoutLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : cashoutStep === 3 ? (
                  "Confirm Cashout"
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default Wallet;
