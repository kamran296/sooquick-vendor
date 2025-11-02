import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../axios/requests";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResendEmail = async () => {
    try {
      if (!token) {
        toast.error("No token found for verification");
        return;
      }

      const response = await request.emailVerify(token);
      const data = await response.data;

      if (response.status) {
        toast.success(data.message || "Email verified successfully");
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred while resending verification email");
      console.error("Resend verification error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 text-center shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          {/* <p className="mb-6 text-gray-600">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p> */}
          <p className="mb-6 text-gray-600">
            If you didn't receive the email, you can request a new one.
          </p>
          <button
            onClick={handleResendEmail}
            className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
          >
            Verify Email
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-green-600 hover:text-green-500"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
