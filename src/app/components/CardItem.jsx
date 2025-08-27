"use client";

export default function CardItem({ item, onAdd, onMinus, onAbrirDetalhes }) {
  return (
    <article className="card-item">
      <img
        src={item.imagemURL}
        alt={item.nome}
        loading="lazy"
        onClick={() => onAbrirDetalhes?.(item)}
        style={{ cursor: "pointer" }}
      />
      <div className="card-body">
        <h3 style={{ cursor: "pointer" }} onClick={() => onAbrirDetalhes?.(item)}>
          {item.nome}
        </h3>
        {item.descricao && <p className="descricao-item">{item.descricao}</p>}

        <span className="preco-item">
          {item.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>

        <div className="botoes-card" style={{ gap: 12 }}>
          <button className="qty-btn" onClick={() => onMinus?.(item.id)} aria-label="Diminuir">−</button>
          <button className="qty-btn" onClick={() => onAdd?.(item.id)} aria-label="Adicionar">+</button>
          <button className="btn-detalhes" onClick={() => onAbrirDetalhes?.(item)}>
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
