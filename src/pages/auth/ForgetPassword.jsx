import React from "react";
import appRoutes from "../../appRoutes";
import { useState, useEffect } from "react";
import { FiMail, FiLock } from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../axios/requests";

const ForgetPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      //   await dispatch(sendOtpThunk({ email })).unwrap();
      const response = await request.requestOtp({ email });
      console.log(response, "Otp request response");
      setStep("otp");
      setTimer(59);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleResend = async () => {
    if (timer === 0 && email) {
      try {
        setOtp(["", "", "", ""]);
        setTimer(59);
        const response = await request.requestOtp({ email });
        console.log(response, "resend otp response");
        // await dispatch(sendOtpThunk({ email })).unwrap();
      } catch (err) {
        console.error("Resend OTP failed:", err);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (!email || code.length !== 4) return;

    try {
      //   await dispatch(verifyOtpThunk({ email, otp: code })).unwrap();
      const response = await request.verifyOtp({ email, otp: code });
      console.log(response, "verify otp response");
      toast.success("OTP verified, proceed to reset password");
      setStep("reset");
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      //   await dispatch(
      //     changePasswordThunk({ email, password: newPassword }),
      //   ).unwrap();
      const response = await request.changePassword({
        email,
        password: newPassword,
      });
      console.log(response, "password changes");
      toast.success("Password has been reset successfully");
      navigate(appRoutes.login);
      // optionally reset state or navigate
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Something went wrong");
    }
  };

  const isOtpComplete = otp.every((d) => d.length === 1);
  return (
    <div className="font-mont flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {step === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-1 mb-6 text-sm text-gray-500">
              Enter your email to reset your password
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-[#808080]">
                <FiMail size={18} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  required
                  className="w-full bg-transparent text-[#808080] placeholder-[#808080] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0b8263] py-3 font-semibold text-white transition hover:bg-teal-800"
              >
                Verify Your Email
              </button>
            </form>
            <div className="mt-3 flex w-full items-end justify-end">
              <Link
                to={appRoutes.login}
                className="font-medium text-blue-600 underline"
              >
                Back
              </Link>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900">
              Verification Code
            </h2>
            <p className="mt-1 mb-6 w-[90%] text-sm text-gray-500">
              We have sent the OTP to{" "}
              <span className="font-medium">{email}</span> for the verification
              process.
            </p>

            <div className="mx-auto mb-4 flex w-fit justify-between gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="h-12 w-12 rounded-[16px] border border-gray-300 text-center text-xl focus:outline-blue-500"
                />
              ))}
            </div>

            <p className="mb-4 text-center text-sm text-gray-500">
              {timer > 0 ? (
                <>Resend in 00:{timer.toString().padStart(2, "0")}</>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 underline"
                >
                  Resend
                </button>
              )}
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete}
              className={`w-full rounded-full py-3 font-semibold text-white transition ${
                isOtpComplete
                  ? "bg-[#0b8263] hover:bg-teal-800"
                  : "cursor-not-allowed bg-gray-200"
              }`}
            >
              Verify Email
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900">
              Set New Password
            </h2>
            <p className="mt-1 mb-6 text-sm text-gray-500">
              Enter your new password below.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-[#808080]">
                <FiLock size={18} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full bg-transparent text-[#808080] placeholder-[#808080] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-[#808080]">
                <FiLock size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full bg-transparent text-[#808080] placeholder-[#808080] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#0b8263] py-3 font-semibold text-white transition hover:bg-teal-800"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
