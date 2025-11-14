// Imagens
import imgFundo from '../../assets/imagens/imgFundo.svg';

// Componentes
import LinhaAnimada from '../../components/LinhaAnimada/LinhaAnimada';
import Filtros from '../../components/Filtros/Filtros';
import DisplayFilme from '../../components/DisplayFilme/DisplayFilme';
import Carrossel from '../../components/Carrossel/Carrossel';

// Ícones
import { Film, Clapperboard, UserCheck } from "lucide-react";
import { useEffect } from "react";

import './Home.css';
import '../../components/Style/Variables.css'

export default function Home() {

  // Animação scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <article className="textoInicial scroll-reveal">
        <h1>Barbie Movie Studio</h1>
        <h2>Bem-vinda ao Barbie Movie Studio</h2>
        <p>
          Aqui você encontra todos os filmes da Barbie! Explore nossos destaques
          ou envie um filme para participar do nosso catálogo!
        </p>
        <a href="#explorar" className="explorar">Explorar Filmes</a>
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

      <div className="imagens">
        <img src={imgFundo} alt="imagem de objetos de cinema seguido por um tapete vermelho"/>
      </div>

      <section className="destaques scroll-reveal">
        <h1 >Destaques</h1>
        <LinhaAnimada className='linhaAnimada' />
        <Carrossel />
      </section>


      <article className="filmes">
        <h1 id='explorar'>Filmes</h1>
        <LinhaAnimada className='linhaAnimada' />
        <Filtros className='filtros' />
        <DisplayFilme />
      </article>
    </>
  );
}
