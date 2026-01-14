import React, { useEffect, useState } from "react";
import request from "../../axios/requests";
import { Link, useNavigate } from "react-router-dom";
import appRoutes from "../../appRoutes";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TwoFactorModal from "../../components/TwoFactorModal";
import { useDispatch, useSelector } from "react-redux";
import LogoutModal from "../../components/LogoutModal";
import { resetUserState } from "../../redux/slices/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [logoutModal, setLogoutModal] = useState(false);

  const isAuthenticated = !!user.email;

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    console.log("User state:", user);
    if (isAuthenticated) {
      console.log("User is authenticated, showing logout modal");
      setLogoutModal(true);
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      dispatch(resetUserState());
      const res = await request.logout();
      console.log(res.data);
      setLogoutModal(false);
      toast.success("Logged out successfully");
      // Optionally refresh the page to clear redux state
      // window.location.reload();
    } catch (error) {
      dispatch(resetUserState());
      console.error("Logout error:", error);
      setLogoutModal(false);
      // window.location.reload();
    }
  };

  const handleStayLoggedIn = () => {
    setLogoutModal(false);
    // Redirect to dashboard
    navigate(appRoutes.dashboard);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailNotVerified(false);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await request.login({
        email: formData.email,
        password: formData.password,
      });

      const data = await response.data;

      if (response.status === 200) {
        if (data.requires2FA) {
          setTwoFactorData({
            tempToken: data.tempToken,
            userID: data.userId,
            email: formData.email,
          });
          setShowTwoFactorModal(true);
          toast.info("Please enter the OTP sent to your email");
        } else {
          toast.success(data.message || "Login successful");
          // window.localStorage.setItem("token", data.accessToken);
          navigate(appRoutes.dashboard);
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      // Email not verified flow
      if (status === 403 && data?.code === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true);
        toast.warn(data.message || "Please verify your email");
        return;
      }

      toast.error(data?.message || "Invalid email or password");
      console.error("Login error:", error);
      // toast.error(
      //   error.response.data.message || "An error occurred during login",
      // );
      // console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFactorSuccess = (loginData) => {
    toast.success(loginData.message || "Login successful");
    setShowTwoFactorModal(false);
    setTwoFactorData(null);
    navigate(appRoutes.dashboard, { replace: true });
  };
  const handleTwoFactorClose = () => {
    setShowTwoFactorModal(false);
    setTwoFactorData(null);
  };
  const handleResendVerification = async () => {
    try {
      setResending(true);

      await request.resendVerification({
        email: formData.email,
        role: "customer", // or "vendor" if vendor login
      });

      toast.success("Verification email resent successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification email",
      );
    } finally {
      setEmailNotVerified(false);
      setResending(false);
    }
  };

  return (
    <>
      <div className="font-mont flex min-h-screen flex-col justify-center bg-gray-50 py-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log into your account
          </h2>
        </div>

        <div className="mt-8 p-3 sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                  />
                  {!passwordVisible ? (
                    <FaEye
                      className="text-md absolute top-[0px] right-3 translate-y-1/2 bg-none text-gray-500"
                      onClick={() => setPasswordVisible(true)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="text-md absolute top-[0px] right-3 translate-y-1/2 bg-none text-gray-500"
                      onClick={() => setPasswordVisible(false)}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {emailNotVerified && (
                  <div className="mb-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                    <p>Your email is not verified.</p>
                    <button
                      type="button"
                      disabled={resending}
                      onClick={handleResendVerification}
                      className="mt-2 text-sm font-medium text-green-700 hover:underline disabled:opacity-50"
                    >
                      {resending ? "Resending..." : "Resend verification email"}
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#0b8263] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Login..." : "Login"}
                </button>
              </div>
            </form>

            <div className="relative mt-2 flex justify-end text-sm">
              <Link
                to="/forget-password"
                className="bg-white px-2 text-gray-500 hover:text-blue-500"
              >
                Forget Password
              </Link>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>

                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Create an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/signup"
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Factor Authentication Modal */}
      {showTwoFactorModal && twoFactorData && (
        <TwoFactorModal
          email={twoFactorData.email}
          tempToken={twoFactorData.tempToken}
          onSuccess={handleTwoFactorSuccess}
          onClose={handleTwoFactorClose}
        />
      )}
      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <LogoutModal
          isOpen={logoutModal}
          onLogout={handleLogout}
          onCancel={handleStayLoggedIn}
        />
      )}
    </>
  );
};

export default Login;
