// Componentes
import LinhaAnimada from '../../components/LinhaAnimada/LinhaAnimada';
import Filtros from '../../components/Filtros/Filtros';
import DisplayFilme from '../../components/DisplayFilme/DisplayFilme';

// Ícones
import { useEffect, useState } from "react";

import './HomeAdm.css';


export default function HomeAdm() {

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

  // ==================== ESTADOS ====================
  const [filmes, setFilmes] = useState([]);
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);

  const [tituloFiltro, setTituloFiltro] = useState("");
  const [generosFiltro, setGenerosFiltro] = useState([]);
  const [anoFiltro, setAnoFiltro] = useState("");

  // ==================== BUSCAR FILMES DO BACKEND ====================
  function carregarFilmes() {
    let url = "http://localhost:8000/filmes";

    const params = new URLSearchParams();

    if (tituloFiltro.trim() !== "") params.append("titulo", tituloFiltro);
    if (generosFiltro.length === 1) params.append("genero", generosFiltro[0]);

    if ([...params].length > 0) url += "?" + params.toString();

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFilmes(data);
      })
      .catch(err => console.log("Erro ao carregar filmes:", err));
  }

  // Recarregar quando filtros do backend mudarem
  useEffect(() => {
    carregarFilmes();
  }, [tituloFiltro, generosFiltro]);

  // ==================== FILTRO DO ANO (FRONTEND) ====================
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
       <article className='gerenciarFilmes'>
        <h1>Gerenciar Filmes</h1>

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
