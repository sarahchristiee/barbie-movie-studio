import { Navigate } from "react-router-dom";
import { isAdmin } from "../../Auth/Auth";

export default function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/Login" replace />;
}
