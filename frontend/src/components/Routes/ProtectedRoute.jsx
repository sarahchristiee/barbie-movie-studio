import { Navigate } from "react-router-dom";
import { isLogged } from "../../Auth/Auth";

export default function ProtectedRoute({ children }) {
  return isLogged() ? children : <Navigate to="/Login" replace />;
}
