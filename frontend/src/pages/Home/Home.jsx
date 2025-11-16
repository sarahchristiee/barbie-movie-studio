// Imagens
import imgFundo from '../../assets/imagens/imgFundo.svg';

// Componentes
import LinhaAnimada from '../../components/LinhaAnimada/LinhaAnimada';
import Filtros from '../../components/Filtros/Filtros';
import DisplayFilme from '../../components/DisplayFilme/DisplayFilme';
import Carrossel from '../../components/Carrossel/Carrossel';

// Ícones
import { Film, Clapperboard, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

import './Home.css';
import '../../components/Style/Variables.css';

export default function Home() {

  const [filmes, setFilmes] = useState([]);
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);

  const [tituloFiltro, setTituloFiltro] = useState("");
  const [generosFiltro, setGenerosFiltro] = useState([]);
  const [anoFiltro, setAnoFiltro] = useState("");

  // Scroll
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

  // Renderiza os filmes
function carregarFilmes() {
  let url = "http://localhost:8000/filmes";

  const params = new URLSearchParams();

  if (tituloFiltro.trim() !== "") params.append("titulo", tituloFiltro);
  if (generosFiltro.length === 1) params.append("genero", generosFiltro[0]);

  if ([...params].length > 0) url += "?" + params.toString();

  console.log("URL QUE ESTÁ SENDO ENVIADA →", url); // <-- ADICIONE ISSO

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("RESPOSTA DO BACKEND →", data); // <-- ADICIONE ISSO
      setFilmes(data);
    })
    .catch(err => console.log("Erro ao carregar filmes:", err));
}

  // Recarrega
  useEffect(() => {
    carregarFilmes();
  }, [tituloFiltro, generosFiltro]);

  useEffect(() => {
    setFilmesFiltrados(filmes);
  }, [filmes]);

  // Filtrar por ano
  useEffect(() => {
    if (!anoFiltro) {
      setFilmesFiltrados(filmes);
    } else {
      setFilmesFiltrados(
        filmes.filter(f => String(f.ano) === String(anoFiltro))
      );
    }
  }, [anoFiltro, filmes]);

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
        <img 
          src={imgFundo} 
          alt="imagem de objetos de cinema seguido por um tapete vermelho"
        />
      </div>

      <section className="destaques scroll-reveal">
        <h1>Destaques</h1>
        <LinhaAnimada className='linhaAnimada' />
        <Carrossel />
      </section>

      <article className="filmes">
        <h1 id='explorar'>Filmes</h1>
        <LinhaAnimada className='linhaAnimada' />

        {/* Filtros 100% funcionais */}
        <Filtros
          onFilterTitulo={setTituloFiltro}
          onFilterGenero={setGenerosFiltro}
          onFilterAno={setAnoFiltro}
        />

        {/* Lista final de filmes filtrados */}
       <DisplayFilme filmes={filmesFiltrados} />
      </article>
    </>
  );
}
