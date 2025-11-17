import { Navigate } from "react-router-dom";
import { isAdmin } from "../../Auth/Auth";

// vai proteger as páginas que são pro adm
export default function AdminRoute({ children }) {
  return isAdmin() ? children : <Navigate to="/Login" replace />;
}
