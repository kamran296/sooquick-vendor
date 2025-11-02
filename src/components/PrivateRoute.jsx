import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import request from "../axios/requests";
import { useDispatch } from "react-redux";
import { setMembershipInfo, setUserName } from "../redux/slices/userSlice";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    try {
      const res = await request.checkAuth();

      if (res.status === 200) {
        setIsAuthenticated(true);
        dispatch(setUserName(res.data.name));
        dispatch(setMembershipInfo(res.data.membership));
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
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
