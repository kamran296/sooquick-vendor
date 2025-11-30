import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import request from "../axios/requests";
import { useDispatch } from "react-redux";
import {
  setkycVerified,
  setMembershipInfo,
  setUser,
  setUserName,
} from "../redux/slices/userSlice";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    try {
      const res = await request.checkAuth();

      if (res) {
        setIsAuthenticated(true);
        // dispatch(setUserName(res.data.name));
        // dispatch(setkycVerified(res.data.kycVerified));
        // dispatch(setMembershipInfo(res.data.membership));
        dispatch(setUser(res.data));
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
