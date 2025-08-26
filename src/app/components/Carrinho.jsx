"use client";

export default function Carrinho({
  aberto,
  itens = [],
  onClose,
  onDiminuir,
  onAdicionar,
  onRemover,
  onCheckout,
}) {
  const total = itens.reduce((acc, it) => acc + it.preco * it.quantidade, 0);

  return (
    <>
      <div
        id="overlay-carrinho"
        className={aberto ? "overlay aberto" : "overlay"}
        onClick={onClose}
      />

      <aside
        id="sidebar-carrinho"
        className={`carrinho-container ${aberto ? "aberto" : ""}`}
      >
        <header className="carrinho-header">
          <h3>Meu Carrinho</h3>
          <button id="btn-fechar-carrinho" onClick={onClose}>X</button>
        </header>

        <div id="itens-do-carrinho-container">
          {itens.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="lista-carrinho">
              {itens.map((it) => (
                <li key={it.id} className="item-carrinho">
                  <span>
                    {it.nome} <span className="badge-qtd">x{it.quantidade}</span>{" "}
                    {(it.preco * it.quantidade).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>

                  {/* controles lado a lado */}
                  <div className="acoes">
                    <button
                      className="qty-btn"
                      onClick={() => onDiminuir?.(it.id)}
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <button
                      className="qty-btn"
                      onClick={() => onAdicionar?.(it.id)}
                      aria-label="Adicionar"
                    >
                      +
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => onRemover?.(it.id)}
                      aria-label="Remover item"
                      title="Remover item"
                    >
                      {/* ícone de lixeira */}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1Zm2 0v1h2V3h-2ZM6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z"/>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="carrinho-footer">
          <div id="total-carrinho">
            <strong>Total: </strong>
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
          <button
            id="btn-finalizar-compra"
            className="btn btn--green"
            onClick={onCheckout}
            disabled={!itens.length}
          >
            Finalizar Compra
          </button>
        </footer>
      </aside>
    </>
  );
}
