import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

export const PrivateRoute = () => {
  const { token, checkAuthExpiration } = useAuth();

  useEffect(() => {
    checkAuthExpiration()
  }, [checkAuthExpiration])

  return token ? <Outlet/> : <Navigate to="/login" replace/>
};
