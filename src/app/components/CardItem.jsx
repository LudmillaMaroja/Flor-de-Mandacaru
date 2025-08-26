"use client";

export default function CardItem({ item, onAdd, onMinus }) {
  return (
    <article className="card-item">
      <img src={item.imagemURL} alt={item.nome} loading="lazy" />
      <div className="card-body">
        <h3>{item.nome}</h3>
        {item.descricao && <p>{item.descricao}</p>}

        {/* preço destacado */}
        <span className="preco">
          {item.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>

        {/* controles de quantidade */}
        <div className="card-actions">
          <button className="qty-btn" onClick={() => onMinus?.(item.id)} aria-label="Diminuir">−</button>
          <button className="qty-btn" onClick={() => onAdd?.(item.id)} aria-label="Adicionar">+</button>
        </div>
      </div>
    </article>
  );
}
