"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CardItem from "./components/CardItem";
import Carrinho from "./components/Carrinho";
import DetalhesProdutoModal from "./components/DetalhesProdutoModal";

import { getSupabase } from "./lib/supabaseClient.ts";
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
        const supabase = getSupabase();

        if (!supabase) {
          // O novo client vai logar um warn, então não precisamos de outro erro aqui.
          // Apenas retornamos para não continuar a execução.
          return;
        }

        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .order("nome");

        if (error) throw error;
        if (ativo) setProdutosDB(data ?? []);
      } catch (e) {
        setErro("Falha ao carregar produtos.");
        console.error(e);
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

  // ========================================================================
  // FUNÇÃO PARA FINALIZAR A COMPRA E SALVAR NO SUPABASE
  // ========================================================================
  async function handleCheckout(dadosDoCheckout) {
    const supabase = getSupabase(); // <-- A CORREÇÃO ESTÁ AQUI!

    if (!supabase) {
        alert("Não foi possível conectar ao banco de dados.");
        return;
    }

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    try {
      //Insere o pedido principal na tabela 'pedidos'
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          valor_subtotal: dadosDoCheckout.subtotal,
          valor_total: dadosDoCheckout.total,
          cupom_utilizado: dadosDoCheckout.cupom,
          percentual_desconto: dadosDoCheckout.percent,
          valor_desconto: dadosDoCheckout.desconto,
        })
        .select('id')
        .single();

      if (pedidoError) throw pedidoError;
      console.log('DADOS DO PEDIDO CRIADO:', pedidoData);
      const novoPedidoId = pedidoData.id;

      // Prepara os itens para salvar na tabela 'itens_do_pedido'
      const itensParaSalvar = carrinho.map(item => ({
        pedido_id: novoPedidoId,
        produto_id: item.id,
        nome_produto: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
      }));

      // Insere os itens na tabela 'itens_do_pedido'
      const { error: itensError } = await supabase
        .from('itens_do_pedido')
        .insert(itensParaSalvar);
      
      if (itensError) throw itensError;

      // Limpa o carrinho e avisa o usuário.
      alert('Pedido finalizado com sucesso! Obrigado pela sua compra!');
      // Limpa o carrinho no estado e no localStorage
      setCarrinho([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem('carrinho-flor'); // <-- Use a chave correta do seu localStorage!
      }
      setAberto(false);

    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      alert('Não foi possível processar seu pedido. Por favor, tente novamente.');
    }
  }

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
        onCheckout={handleCheckout}
      />

      <Footer />
    </>
  );
}