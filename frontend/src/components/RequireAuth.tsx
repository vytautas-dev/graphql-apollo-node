import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RequireAuth() {
  const { auth }: any = useAuth();
  const location = useLocation();

  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default RequireAuth;
