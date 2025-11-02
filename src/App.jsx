import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appRoutes from "./appRoutes";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/user/Dashboard";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Setting from "./pages/user/Setting";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { connectSocket } from "./socket";
import Services from "./pages/user/Services";
import PurchaseMembership from "./pages/user/PurchaseMembership";
import Membership from "./pages/user/Membership";
import OrdersDashboard from "./pages/user/OrdersDashboard";
import Wallet from "./pages/user/Wallet";
import ServiceDetail from "./pages/user/ServiceDetail";
import Support from "./pages/user/Support";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token"); // Or get from cookie
    if (token) {
      connectSocket(token); // Reconnect socket if token exists
    }
  }, []);
  return (
    <>
      {/* <ToastContainer> */}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path={appRoutes.signup} element={<Signup />} />
        <Route exact path={appRoutes.verifyEmail} element={<VerifyEmail />} />
        <Route
          exact
          path={appRoutes.forgetPassword}
          element={<ForgetPassword />}
        />

        {/* app routes */}
        <Route element={<PrivateRoute />}>
          <Route exact path={appRoutes.dashboard} element={<Dashboard />} />
          <Route exact path={appRoutes.setting} element={<Setting />} />
          <Route exact path={appRoutes.services} element={<Services />} />
          <Route
            exact
            path={appRoutes.serviceDetail}
            element={<ServiceDetail />}
          />

          <Route
            exact
            path={appRoutes.membership}
            element={<PurchaseMembership />}
          />
          <Route
            exact
            path={appRoutes.membershipInfo}
            element={<Membership />}
          />
          <Route
            exact
            path={appRoutes.orderDashboard}
            element={<OrdersDashboard />}
          />
          <Route exact path={appRoutes.wallet} element={<Wallet />} />
          <Route exact path={appRoutes.support} element={<Support />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<div>Error Page</div>} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
