import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import appRoutes from "./appRoutes";
import PrivateRoute from "./components/PrivateRoute";
import Spinner from "./components/Spinner";

import { connectSocket } from "./socket";

/* -------------------- Lazy Loaded Pages -------------------- */

// Auth
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));

// Policies
const CompanyPolicy = lazy(() => import("./pages/CompanyPolicy"));
const VendorPolicy = lazy(() => import("./pages/VendorPolicy"));

// Dashboard / User
const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Setting = lazy(() => import("./pages/user/Setting"));
const Services = lazy(() => import("./pages/user/Services"));
const ServiceDetail = lazy(() => import("./pages/user/ServiceDetail"));
const EditService = lazy(() => import("./pages/user/EditService"));
const PurchaseMembership = lazy(
  () => import("./pages/user/PurchaseMembership"),
);
const Membership = lazy(() => import("./pages/user/Membership"));
const OrdersDashboard = lazy(() => import("./pages/user/OrdersDashboard"));
const Wallet = lazy(() => import("./pages/user/Wallet"));
const Support = lazy(() => import("./pages/user/Support"));
const NotificationPage = lazy(() => import("./pages/user/NotificationPage"));

/* -------------------- App -------------------- */

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path={appRoutes.signup} element={<Signup />} />
          <Route path={appRoutes.verifyEmail} element={<VerifyEmail />} />
          <Route path={appRoutes.forgetPassword} element={<ForgetPassword />} />

          {/* Policies */}
          <Route path={appRoutes.terms} element={<CompanyPolicy />} />
          <Route path={appRoutes.vendor_policy} element={<VendorPolicy />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path={appRoutes.dashboard} element={<Dashboard />} />
            <Route path={appRoutes.setting} element={<Setting />} />
            <Route path={appRoutes.services} element={<Services />} />
            <Route path={appRoutes.serviceDetail} element={<ServiceDetail />} />
            <Route path={appRoutes.editService} element={<EditService />} />

            <Route
              path={appRoutes.membership}
              element={<PurchaseMembership />}
            />
            <Route path={appRoutes.membershipInfo} element={<Membership />} />
            <Route
              path={appRoutes.orderDashboard}
              element={<OrdersDashboard />}
            />
            <Route path={appRoutes.wallet} element={<Wallet />} />
            <Route path={appRoutes.support} element={<Support />} />
            <Route
              path={appRoutes.notification}
              element={<NotificationPage />}
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div>Error Page</div>} />
        </Routes>
      </Suspense>

      <ToastContainer />
    </>
  );
}

export default App;
