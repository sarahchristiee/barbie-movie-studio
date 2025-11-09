import React, { useEffect, useRef, useState } from "react";
import "./LinhaAnimada.css";
import '../Style/Variables.css'

export default function LinhaAnimada() {
  const ref = useRef(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAtivo(true);
          }
        });
      },
      { threshold: 0.5 } // ativa quando 50% visível
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className={`linha-animada ${ativo ? "ativo" : ""}`}>
      <span className="estrela esquerda">★</span>
      <div className="linha"></div>
      <span className="estrela direita">★</span>
    </div>
  );
}
