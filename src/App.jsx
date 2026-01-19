// import { Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import appRoutes from "./appRoutes";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import Dashboard from "./pages/user/Dashboard";
// import VerifyEmail from "./pages/auth/VerifyEmail";
// import ForgetPassword from "./pages/auth/ForgetPassword";
// import Setting from "./pages/user/Setting";
// import PrivateRoute from "./components/PrivateRoute";
// import { useEffect } from "react";
// import { connectSocket } from "./socket";
// import Services from "./pages/user/Services";
// import PurchaseMembership from "./pages/user/PurchaseMembership";
// import Membership from "./pages/user/Membership";
// import OrdersDashboard from "./pages/user/OrdersDashboard";
// import Wallet from "./pages/user/Wallet";
// import ServiceDetail from "./pages/user/ServiceDetail";
// import Support from "./pages/user/Support";
// import CompanyPolicy from "./pages/CompanyPolicy";
// import VendorPolicy from "./pages/VendorPolicy";
// import NotificationPage from "./pages/user/NotificationPage";

// function App() {
//   useEffect(() => {
//     connectSocket();
//   }, []);
//   return (
//     <>
//       {/* <ToastContainer> */}
//       <Routes>
//         <Route exact path="/" element={<Login />} />
//         <Route exact path={appRoutes.signup} element={<Signup />} />
//         <Route exact path={appRoutes.verifyEmail} element={<VerifyEmail />} />
//         <Route
//           exact
//           path={appRoutes.forgetPassword}
//           element={<ForgetPassword />}
//         />
//         <Route exact path={appRoutes.terms} element={<CompanyPolicy />} />
//         <Route
//           exact
//           path={appRoutes.vendor_policy}
//           element={<VendorPolicy />}
//         />

//         {/* app routes */}
//         <Route element={<PrivateRoute />}>
//           <Route exact path={appRoutes.dashboard} element={<Dashboard />} />
//           <Route exact path={appRoutes.setting} element={<Setting />} />
//           <Route exact path={appRoutes.services} element={<Services />} />
//           <Route
//             exact
//             path={appRoutes.serviceDetail}
//             element={<ServiceDetail />}
//           />

//           <Route
//             exact
//             path={appRoutes.membership}
//             element={<PurchaseMembership />}
//           />
//           <Route
//             exact
//             path={appRoutes.membershipInfo}
//             element={<Membership />}
//           />
//           <Route
//             exact
//             path={appRoutes.orderDashboard}
//             element={<OrdersDashboard />}
//           />
//           <Route exact path={appRoutes.wallet} element={<Wallet />} />
//           <Route exact path={appRoutes.support} element={<Support />} />
//           <Route
//             exact
//             path={appRoutes.notification}
//             element={<NotificationPage />}
//           />
//         </Route>

//         {/* Catch-all fallback */}
//         <Route path="*" element={<div>Error Page</div>} />
//       </Routes>
//       <ToastContainer />
//     </>
//   );
// }

// export default App;

// optimized:
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
