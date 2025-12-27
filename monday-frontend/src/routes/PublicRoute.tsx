import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router";

const PublicRoute = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
