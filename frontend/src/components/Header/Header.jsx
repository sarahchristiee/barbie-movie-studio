import Logo from '../../assets/imagens/logo.svg'
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import './Header.css'
import '../Style/Variables.css'

export default function Header(){
    return(
        <div className='navBar'>
          <nav>
            <img src={Logo} alt="Logo de claquete e nome do site" className='logo'/>
            <Link to="/Home">Filmes</Link>
            <Link to="/Colaborar">Colaborar</Link>
            <Link to="/Login"><UserRound /></Link>
        </nav>  
        </div>
        
    )
};