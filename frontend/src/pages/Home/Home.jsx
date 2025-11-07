// Imagens
import Camera from '../../assets/imagens/camera.svg';
import Claquete from '../../assets/imagens/claquete.svg';
import Cadeira from "../../assets/imagens/cadeira.svg";
import Holofote from '../../assets/imagens/holofote.svg';
import Tapete from '../../assets/imagens/tapete.svg';
import fimTapete from '../../assets/imagens/fimTapete.svg';
import Carrossel from '../../components/Carrossel/Carrossel';

// Componentes
import LinhaAnimada from '../../components/LinhaAnimada/LinhaAnimada';
import Filtros from '../../components/Filtros/Filtros';
import DisplayFilme from '../../components/DisplayFilme/DisplayFilme';

// Icones
import { Film, Clapperboard, UserCheck } from "lucide-react";
import { useEffect } from "react";

import './Home.css';


export default function Home(){

  // animação scroll
    useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // remove observador pra não ficar reanimando
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // quando 20% do elemento aparece, ativa
      }
    );

    elements.forEach((el) => observer.observe(el));

    // limpeza (boa prática)
    return () => observer.disconnect();
  }, []);

    return(
            <>
              <article className="textoInicial scroll-reveal">
                <h1>Barbie Movie Studio</h1>
                <h2>Bem-vinda ao Barbie Movie Studio</h2>
                <p>Aqui você encontra todos os filmes da Barbie! Explore nossos destques ou envie um filme para participar do nosso catalogo!</p>
                <a href="#explorar" className="explorar" >Explorar Filmes</a>
              </article>

              <section className="cards scroll-reveal">

              <article>
                <Film size={40} className="icon" />
                <h3>Filmes</h3>
                <p>Encontre seus filmes favoritos da Barbie aqui!</p>
              </article>

              <article>
                <Clapperboard size={40} className="icon" />
                <h3>Descrição</h3>
                <p>Todas as informações mais importantes sobre o filme</p>
              </article>

              <article>
                <UserCheck size={40} className="icon" />
                <h3>Colabore</h3>
                <p>Lembrou de um filme que não está aqui? Envie para a gente!</p>
              </article>
              
              </section>

              <section className="destaques scroll-reveal">
                <h1>Destaques</h1>
                <LinhaAnimada />
                <Carrossel />
                <div className="filmesDestaque">
                  
                 
                </div>

              </section>

                <div className="imagens">
                 <img src={Camera} alt="Camera de cinema rosa 2d" className="camera" />
                <img src={Claquete} alt="Claquete de cinema 2d"className="claquete" />
                <img src={Cadeira} alt="Cadeira de estudio de cinema rosa 2d" className="cadeira" />
                <img src={Holofote} alt="Holofote 2d" className="holofote" /> 
                </div>
                

                <img src={Tapete} alt="" className="tapete" />
                <img src={fimTapete} alt="" className="fimTapete" />
                
                <article className="filmes">
                  <h1 id='explorar'>Catalogo de</h1>
                  <LinhaAnimada />
                  <h1 className='textoFilmes'>Filmes</h1>
                  <Filtros />

                  <DisplayFilme/>
                </article>

                
            </>
    );
};