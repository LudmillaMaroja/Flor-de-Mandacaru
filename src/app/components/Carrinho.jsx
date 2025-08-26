"use client";
import { useEffect, useMemo, useState } from "react";

const CUPOM_KEY = "cupom-flor";

export default function Carrinho({
  aberto,
  itens = [],
  onClose,
  onDiminuir,
  onAdicionar,
  onRemover,
  onCheckout,
}) {
  // subtotal baseado nos itens
  const subtotal = useMemo(
    () => itens.reduce((acc, it) => acc + it.preco * it.quantidade, 0),
    [itens]
  );

  // estado do cupom
  const [cupom, setCupom] = useState("");
  const [percent, setPercent] = useState(0);
  const [erroCupom, setErroCupom] = useState("");

  // carrega cupom salvo
  useEffect(() => {
    const salvo = typeof window !== "undefined" ? localStorage.getItem(CUPOM_KEY) : null;
    if (salvo) {
      setCupom(salvo);
      validarEAplicar(salvo, { silenciarErro: true });
    }
  }, []);

  // aplica regex e define desconto
  function validarEAplicar(valor, opts = {}) {
    const v = (valor || "").trim().toUpperCase();
    const re = /^FLOR(10|15|20|25)$/i; 
    const ok = re.exec(v);

    if (ok) {
      const p = Number(ok[1]);
      setPercent(p);
      setErroCupom("");
      setCupom(v);
      if (typeof window !== "undefined") localStorage.setItem(CUPOM_KEY, v);
    } else {
      setPercent(0);
      setCupom(v);
      if (!opts.silenciarErro) setErroCupom("Cupom inválido.");
      if (typeof window !== "undefined") localStorage.removeItem(CUPOM_KEY);
    }
  }

  function limparCupom() {
    setCupom("");
    setPercent(0);
    setErroCupom("");
    if (typeof window !== "undefined") localStorage.removeItem(CUPOM_KEY);
  }

  const desconto = useMemo(() => (subtotal * percent) / 100, [subtotal, percent]);
  const total = useMemo(() => Math.max(subtotal - desconto, 0), [subtotal, desconto]);

  return (
    <>
      <div id="overlay-carrinho" className={aberto ? "overlay aberto" : "overlay"} onClick={onClose} />

      <aside id="sidebar-carrinho" className={`carrinho-container ${aberto ? "aberto" : ""}`}>
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
                    {(it.preco * it.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>

                  <div className="acoes">
                    <button className="qty-btn" onClick={() => onDiminuir?.(it.id)} aria-label="Diminuir">−</button>
                    <button className="qty-btn" onClick={() => onAdicionar?.(it.id)} aria-label="Adicionar">+</button>
                    <button className="icon-btn" onClick={() => onRemover?.(it.id)} aria-label="Remover item" title="Remover item">
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
          {/* CUPOM */}
          <div className="cupom-area">
            <label htmlFor="input-cupom">Digite seu cupom:</label>
            <div className="cupom-row">
              <input
                id="input-cupom"
                type="text"
                placeholder="ex.: FLOR10"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && validarEAplicar(cupom)}
              />
              <button className="btn btn--green" onClick={() => validarEAplicar(cupom)}>Aplicar</button>
              {percent > 0 && (
                <button className="btn btn--ghost" onClick={limparCupom} title="Remover cupom">Remover</button>
              )}
            </div>
            {erroCupom && <p className="cupom-erro">{erroCupom}</p>}
            {percent > 0 && (
              <p className="cupom-ok">Cupom aplicado: <strong>{percent}% OFF</strong></p>
            )}
          </div>

          {/* TOTAIS */}
          <div className="totais">
            <div className="linha">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
            {percent > 0 && (
              <div className="linha desconto">
                <span>Desconto ({percent}%)</span>
                <span>-{desconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            )}
            <div id="total-carrinho" className="linha totalzão">
              <strong>Total</strong>
              <strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
            </div>
          </div>

          <button
            id="btn-finalizar-compra"
            className="btn btn--green"
            onClick={() => onCheckout?.({ subtotal, percent, desconto, total, cupom })}
            disabled={!itens.length}
          >
            Finalizar Compra
          </button>
        </footer>
      </aside>
    </>
  );
}
