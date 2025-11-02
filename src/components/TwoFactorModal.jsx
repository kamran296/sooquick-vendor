// components/TwoFactorModal.js
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import request from "../axios/requests";

const TwoFactorModal = ({ email, tempToken, onSuccess, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    // Focus first input when modal opens
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleOtpChange = (value, index) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const numbers = pasteData.replace(/\D/g, "").slice(0, 4); // Get only numbers, max 4 digits

    if (numbers.length === 4) {
      const newOtp = numbers.split("");
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setIsSubmitting(true);

    try {
      const otpString = otp.join("");

      const response = await request.verifyTwoFactor({
        otp: otpString,
        tempToken: tempToken,
      });

      const data = await response.data;

      if (response.status === 200) {
        onSuccess(data);
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during OTP verification",
      );
      console.error("OTP verification error:", error);

      // Clear OTP on error for security
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      // You might need to implement a resend endpoint
      // For now, we'll show a message
      toast.info("Please try logging in again to receive a new OTP");
      onClose(); // Close modal and let user retry login
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Two-Factor Authentication
          </h2>
          <button
            onClick={onClose}
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

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            We've sent a 4-digit verification code to
          </p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Enter verification code
          </label>
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            ))}
          </div>
        </div>

        <div className="mb-6 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Code expires in{" "}
              <span className="font-medium">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Resend code
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpComplete || isSubmitting}
            className="flex-1 rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            For security reasons, this code will expire in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
