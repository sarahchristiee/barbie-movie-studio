import { useState, useEffect } from "react";
import Logo from '../../assets/imagens/logo.svg';
import { UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import '../Style/Variables.css';
import { getUser, logout } from "../../Auth/Auth";

export default function Header() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setUser(getUser());
    window.addEventListener("login", updateUser);
    window.addEventListener("logout", updateUser);
    updateUser();
    return () => {
      window.removeEventListener("login", updateUser);
      window.removeEventListener("logout", updateUser);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/Login");
  };

  // Home normal e de adm
  const homeLink = user?.role === "admin" ? "/HomeAdm" : "/Home";

  return (
    <div className='navBar'>
      <nav>
        <img src={Logo} alt="Logo de claquete e nome do site" className='logo'/>
        <Link to={homeLink}>Filmes</Link>
        <Link to="/Colaborar">Colaborar</Link>

        <div className="userDropdownWrapper">
          <UserRound className="userIcon" onClick={() => setDropdownOpen(!isDropdownOpen)} />

          {isDropdownOpen && (
            <div className="dropdownMenu">
              {!user && (
                <Link to="/Login" className="dropdownItem">Login</Link>
              )}

              {user && (
                <>
                  <Link to="/Perfil" className="dropdownItem">Perfil</Link>
                  
                  {/* Opcional para admin */}
                  {user.role === "admin" && (
                    <Link to="/Solicitacoes" className="dropdownItem">Solicitações</Link>
                  )}

                  <button className="dropdownItem logoutButton" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
