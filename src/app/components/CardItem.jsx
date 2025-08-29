"use client";

import { useState } from "react"; 

export default function CardItem({ item, onAdd, onMinus, onAbrirDetalhes, quantidadeNoCarrinho = 0 }) {
  
  const [isHovered, setIsHovered] = useState(false);

  // --- OBJETOS DE ESTILO ---

  const cardBodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  };

  const cardActionsStyle = {
    marginTop: 'auto',
    paddingTop: '1rem',
  };

  const cardFooterStyle = {
    textAlign: 'center',
    paddingTop: '0.5rem',
  };

  const btnLinkDetalhesStyle = {
    background: 'none',
    border: 'none',
    color: isHovered ? '#000' : '#666', 
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '0.85em',
    fontFamily: 'inherit',
  };

  const controleQuantidadeStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  };

  const quantidadeDisplayStyle = {
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center',
  };

  return (
    <article className="card-item">
      <img
        src={item.imagemURL}
        alt={item.nome}
        loading="lazy"
        onClick={() => onAbrirDetalhes?.(item)}
        style={{ cursor: "pointer" }}
      />
      <div className="card-body" style={cardBodyStyle}>
        <h3 style={{ cursor: "pointer" }} onClick={() => onAbrirDetalhes?.(item)}>
          {item.nome}
        </h3>

        <span className="preco-item">
          {item.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>

        {/* --- Área de Ações de Compra --- */}
        <div className="card-actions" style={cardActionsStyle}>
          {quantidadeNoCarrinho > 0 ? (
            <div className="controle-quantidade" style={controleQuantidadeStyle}>
              <button className="qty-btn" onClick={() => onMinus?.(item.id)} aria-label="Diminuir">−</button>
              <span className="quantidade-display" style={quantidadeDisplayStyle}>{quantidadeNoCarrinho}</span>
              <button className="qty-btn" onClick={() => onAdd?.(item.id)} aria-label="Adicionar">+</button>
            </div>
          ) : (
            <button className="btn btn--green btn-adicionar-principal" onClick={() => onAdd?.(item.id)}>
              Adicionar ao Carrinho
            </button>
          )}
        </div>
        
        {/* --- Área do Botão de Detalhes --- */}
        <div className="card-footer" style={cardFooterStyle}>
          <button 
            style={btnLinkDetalhesStyle}
            onClick={() => onAbrirDetalhes?.(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}