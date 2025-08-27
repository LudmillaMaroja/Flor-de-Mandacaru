"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CardItem from "./components/CardItem";
import Carrinho from "./components/Carrinho";
import DetalhesProdutoModal from "./components/DetalhesProdutoModal";

import { supabase } from "./lib/supabaseClient";
import { catalogoCompleto } from "./data/itensLoja";

import {
  lerCarrinho,
  adicionarAoCarrinho,
  diminuirQuantidadeNoCarrinho,
  removerDoCarrinho,
} from "./utils/carrinho";

export default function HomePage() {
  /* ----------------- Estado do Carrinho ----------------- */
  const [aberto, setAberto] = useState(false);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    setCarrinho(lerCarrinho());
  }, []);

  const refresh = () => setCarrinho(lerCarrinho());
  const cartCount = useMemo(
    () => carrinho.reduce((acc, i) => acc + i.quantidade, 0),
    [carrinho]
  );

  /* ----------------- Produtos (Supabase + fallback) ----------------- */
  const [produtosDB, setProdutosDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .order("nome");
        if (error) throw error;
        if (ativo) setProdutosDB(data ?? []);
      } catch (e) {
        setErro("Falha ao carregar produtos.");
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const produtosNormalizados = useMemo(
    () =>
      produtosDB.map((p) => ({
        ...p,
        imagemURL: p.imagem_url,
        nomeCientifico: p.nome_cientifico,
      })),
    [produtosDB]
  );

  const fonte = produtosNormalizados.length
    ? produtosNormalizados
    : catalogoCompleto;

  const flores = useMemo(() => fonte.filter((i) => i.categoria === "Flores"), [fonte]);
  const cestas = useMemo(
    () => fonte.filter((i) => i.categoria === "Cestas de Presente"),
    [fonte]
  );
  const buques = useMemo(() => fonte.filter((i) => i.categoria === "Buquês"), [fonte]);

  /* ----------------- Modal de Detalhes ----------------- */
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const abrirDetalhes = (produto) => setProdutoSelecionado(produto);
  const fecharDetalhes = () => setProdutoSelecionado(null);

  /* ----------------- Render ----------------- */
  return (
    <>
      <Header cartCount={cartCount} onOpenCart={() => setAberto(true)} />

      <main>
        <div className="container">
          {loading && <p>Carregando...</p>}
          {erro && <p style={{ color: "#8b1e1e" }}>{erro}</p>}

          {/* FLORES */}
          <section className="titulo-pagina">
            <h2>Nossas Flores</h2>
            <p>
              Descubra a beleza e a variedade das flores que selecionamos
              especialmente para você.
            </p>
          </section>
          <section id="lista-flores" className="lista-itens">
            {flores.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onAdd={(id) => {
                  adicionarAoCarrinho(id);
                  refresh();
                }}
                onMinus={(id) => {
                  diminuirQuantidadeNoCarrinho(id);
                  refresh();
                }}
                onAbrirDetalhes={abrirDetalhes}
              />
            ))}
          </section>

          {/* CESTAS */}
          <section className="titulo-pagina">
            <h2>Nossas Cestas de Presente</h2>
            <p>Opções variadas para surpreender em qualquer ocasião.</p>
          </section>
          <section id="lista-cestas" className="lista-itens">
            {cestas.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onAdd={(id) => {
                  adicionarAoCarrinho(id);
                  refresh();
                }}
                onMinus={(id) => {
                  diminuirQuantidadeNoCarrinho(id);
                  refresh();
                }}
                onAbrirDetalhes={abrirDetalhes}
              />
            ))}
          </section>

          {/* BUQUÊS */}
          <section className="titulo-pagina">
            <h2>Nossos Buquês</h2>
            <p>Arranjos cuidadosamente elaborados para emocionar.</p>
          </section>
          <section id="lista-buques" className="lista-itens">
            {buques.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onAdd={(id) => {
                  adicionarAoCarrinho(id);
                  refresh();
                }}
                onMinus={(id) => {
                  diminuirQuantidadeNoCarrinho(id);
                  refresh();
                }}
                onAbrirDetalhes={abrirDetalhes}
              />
            ))}
          </section>
        </div>
      </main>

      {/* Modal de detalhes */}
      <DetalhesProdutoModal
        produto={produtoSelecionado}
        onFechar={fecharDetalhes}
        onAdicionar={(id) => {
          adicionarAoCarrinho(id);
          refresh();
          fecharDetalhes();
        }}
      />

      <Carrinho
        aberto={aberto}
        itens={carrinho}
        onClose={() => setAberto(false)}
        onDiminuir={(id) => {
          diminuirQuantidadeNoCarrinho(id);
          refresh();
        }}
        onAdicionar={(id) => {
          adicionarAoCarrinho(id);
          refresh();
        }}
        onRemover={(id) => {
          removerDoCarrinho(id);
          refresh();
        }}
        onCheckout={() => {
          alert("Compra finalizada!");
        }}
      />

      <Footer />
    </>
  );
}
