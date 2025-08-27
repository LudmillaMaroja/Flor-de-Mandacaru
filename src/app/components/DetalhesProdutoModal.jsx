"use client";

export default function DetalhesProdutoModal({ produto, onFechar, onAdicionar }) {
  if (!produto) return null;

  return (
    <div className="overlay-modal" role="dialog" aria-modal="true" onClick={onFechar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="btn-fechar-modal" onClick={onFechar}>×</button>

        <div className="modal-conteudo">
          <div className="modal-col-esq">
            <img src={produto.imagemURL} alt={produto.nome} className="modal-imagem" />
          </div>

          <div className="modal-col-dir">
            <h2>{produto.nome}</h2>

            {produto.descricao && (
              <p className="modal-descricao">{produto.descricao}</p>
            )}

            <div className="modal-detalhes-extras">
              {produto.nomeCientifico && (
                <p><strong>Nome Científico:</strong> {produto.nomeCientifico}</p>
              )}
              {produto.origem && (
                <p><strong>Origem:</strong> {produto.origem}</p>
              )}
              {produto.cuidados && (
                <p><strong>Cuidados:</strong> {produto.cuidados}</p>
              )}
            </div>

            <p className="modal-preco">
              {produto.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>

            <button
              className="btn btn--green"
              style={{ width: "100%" }}
              onClick={() => onAdicionar?.(produto.id)}
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
