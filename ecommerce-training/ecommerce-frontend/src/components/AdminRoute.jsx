import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

export default function AdminRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/auth" replace />; // not logged in
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />; // logged in but not admin
  }

  return children;
}
