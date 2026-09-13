import { CircularProgress, Box } from "@mui/material";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Box display="grid" minHeight="100vh" sx={{ placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
