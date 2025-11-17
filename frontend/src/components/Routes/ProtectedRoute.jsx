import { Navigate } from "react-router-dom";
import { isLogged } from "../../Auth/Auth";

// vai proteger as página que precisa ta logado
export default function ProtectedRoute({ children }) {
  return isLogged() ? children : <Navigate to="/Login" replace />;
}
