"use client";
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CardItem from "./components/CardItem";
import Carrinho from "./components/Carrinho";
import { catalogoCompleto } from "./data/itensLoja";
import {
  lerCarrinho,
  adicionarAoCarrinho,
  diminuirQuantidadeNoCarrinho,
  removerDoCarrinho,
  contarItens,
} from "./utils/carrinho";

export default function HomePage() {
  const [aberto, setAberto] = useState(false);
  const [carrinho, setCarrinho] = useState([]);

  // carregar carrinho do localStorage
  useEffect(() => {
    setCarrinho(lerCarrinho());
  }, []);

  // atualiza state após uma ação
  const refresh = () => setCarrinho(lerCarrinho());

  const cartCount = useMemo(() => carrinho.reduce((acc, i) => acc + i.quantidade, 0), [carrinho]);

  const flores = useMemo(() => catalogoCompleto.filter(i => i.categoria === "Flores"), []);
  const cestas = useMemo(() => catalogoCompleto.filter(i => i.categoria === "Cestas de Presente"), []);
  const buques = useMemo(() => catalogoCompleto.filter(i => i.categoria === "Buquês"), []);

  return (
    <>
      <Header cartCount={cartCount} onOpenCart={() => setAberto(true)} />

      <main>
        <div className="container">
          <section className="titulo-pagina">
            <h2>Nossas Flores</h2>
            <p>Descubra a beleza e a variedade das flores que selecionamos especialmente para você.</p>
          </section>
          <section id="lista-flores" className="lista-itens">
            {flores.map((item) => (
              <CardItem key={item.id} item={item} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} />
            ))}
          </section>

          <section className="titulo-pagina">
            <h2>Nossas Cestas de Presente</h2>
            <p>Opções variadas para surpreender em qualquer ocasião.</p>
          </section>
          <section id="lista-cestas" className="lista-itens">
            {cestas.map((item) => (
              <CardItem key={item.id} item={item} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} />
            ))}
          </section>

          <section className="titulo-pagina">
            <h2>Nossos Buquês</h2>
            <p>Arranjos cuidadosamente elaborados para emocionar.</p>
          </section>
          <section id="lista-buques" className="lista-itens">
            {buques.map((item) => (
              <CardItem key={item.id} item={item} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} />
            ))}
          </section>
        </div>
      </main>

      <Carrinho
        aberto={aberto}
        itens={carrinho}
        onClose={() => setAberto(false)}
        onDiminuir={(id) => { diminuirQuantidadeNoCarrinho(id); refresh(); }}
        onRemover={(id) => { removerDoCarrinho(id); refresh(); }}
        onCheckout={() => { alert("Compra finalizada!"); }}
      />

      <Footer />
    </>
  );
}
