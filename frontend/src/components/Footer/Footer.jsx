import './Footer.css';
import '../Style/Variables.css';
import { Instagram, X, Mail, Twitch } from 'lucide-react'; // Importa os ícones do Lucide

export default function Footer(){
    return(

        <div className="rodape">
          <footer>
            <div className="footerContent">

                <div className="siga">
                    <p className="footerHeading">Siga a gente!</p>
                    <div className="socialIcons">
                        <a href="" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={36} className="icon" />
                        </a>
                       
                        <a href="" target="_blank" rel="noopener noreferrer" aria-label="X (antigo Twitter)">
                            <Twitch size={36} className="icon" /> 
                        </a>
                       
                        <a href="" target="_blank" rel="noopener noreferrer" aria-label="Reddit">
                            <X size={36} className="icon" /> 
                        </a>
                    </div>
                </div>

                
                <div className="verticalSeparator"></div>


                <div className="entreEmContato">
                    <p className="footerHeading">Entre em contato!</p>
                    <div className="contactInfo">
                        <Mail size={24} className="icon mailIcon" />
                        <a href="">contato@barbiemoviestudio.com</a>
                    </div>
                </div>
            </div>

          </footer> 
        </div>
    );
};
