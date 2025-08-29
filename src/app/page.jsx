"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CardItem from "./components/CardItem";
import Carrinho from "./components/Carrinho";
import DetalhesProdutoModal from "./components/DetalhesProdutoModal";
import CheckoutModal from "./components/CheckoutModal";
import ContatoModal from "./components/ContatoModal"; // 1. IMPORTAÇÃO ADICIONADA

import { getSupabase } from "./lib/supabaseClient.ts";
import { catalogoCompleto } from "./data/itensLoja";

import {
  lerCarrinho,
  adicionarAoCarrinho,
  diminuirQuantidadeNoCarrinho,
  removerDoCarrinho,
} from "./utils/carrinho";

export default function HomePage() {
  /* ----------------- Estados ----------------- */
  const [aberto, setAberto] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [dadosParaCheckout, setDadosParaCheckout] = useState(null);


  const [isContatoOpen, setIsContatoOpen] = useState(false);

  useEffect(() => {
    setCarrinho(lerCarrinho());
  }, []);

  const refresh = () => setCarrinho(lerCarrinho());
  const cartCount = useMemo(
    () => carrinho.reduce((acc, i) => acc + i.quantidade, 0),
    [carrinho]
  );

  const fonte = catalogoCompleto;
  const flores = useMemo(() => fonte.filter((i) => i.categoria === "Flores"), [fonte]);
  const cestas = useMemo(() => fonte.filter((i) => i.categoria === "Cestas de Presente"), [fonte]);
  const buques = useMemo(() => fonte.filter((i) => i.categoria === "Buquês"), [fonte]);

  const abrirDetalhes = (produto) => setProdutoSelecionado(produto);
  const fecharDetalhes = () => setProdutoSelecionado(null);

  async function handleCheckout(dadosDoCarrinho, dadosDoCliente) {
    const supabase = getSupabase();
    if (!supabase) { alert("Não foi possível conectar ao banco de dados."); return; }
    if (carrinho.length === 0) { alert("Seu carrinho está vazio!"); return; }

    try {
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          valor_subtotal: dadosDoCarrinho.subtotal,
          valor_total: dadosDoCarrinho.total,
          cupom_utilizado: dadosDoCarrinho.cupom,
          percentual_desconto: dadosDoCarrinho.percent,
          valor_desconto: dadosDoCarrinho.desconto,
          nome_cliente: dadosDoCliente.nome,
          endereco_entrega: dadosDoCliente.endereco,
          telefone_contato: dadosDoCliente.telefone,
          forma_pagamento: dadosDoCliente.formaPagamento,
        })
        .select('id')
        .single();
      if (pedidoError) throw pedidoError;
      
      const novoPedidoId = pedidoData.id;
      const itensParaSalvar = carrinho.map(item => ({
        pedido_id: novoPedidoId,
        produto_id: item.id,
        nome_produto: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
      }));
      const { error: itensError } = await supabase.from('itens_do_pedido').insert(itensParaSalvar);
      if (itensError) throw itensError;

      alert('Pedido finalizado com sucesso! Obrigado pela sua compra!');
      setCarrinho([]);
      if (typeof window !== "undefined") { localStorage.removeItem('carrinho-flor'); }
      setAberto(false);
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      alert('Não foi possível processar seu pedido. Por favor, tente novamente.');
    }
  }

  return (
    <>
    
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setAberto(true)} 
        onOpenContato={() => setIsContatoOpen(true)}
      />

      <main>
        <div className="container">
          <section className="titulo-pagina"><h2>Nossas Flores</h2><p>Descubra a beleza e a variedade das flores que selecionamos especialmente para você.</p></section>
          <section id="lista-flores" className="lista-itens">{flores.map((item) => { const itemNoCarrinho = carrinho.find(cartItem => cartItem.id === item.id); const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0; return (<CardItem key={item.id} item={item} quantidadeNoCarrinho={quantidade} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} onMinus={(id) => { diminuirQuantidadeNoCarrinho(id); refresh(); }} onAbrirDetalhes={abrirDetalhes} />); })}</section>
          <section className="titulo-pagina"><h2>Nossas Cestas de Presente</h2><p>Opções variadas para surpreender em qualquer ocasião.</p></section>
          <section id="lista-cestas" className="lista-itens">{cestas.map((item) => { const itemNoCarrinho = carrinho.find(cartItem => cartItem.id === item.id); const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0; return (<CardItem key={item.id} item={item} quantidadeNoCarrinho={quantidade} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} onMinus={(id) => { diminuirQuantidadeNoCarrinho(id); refresh(); }} onAbrirDetalhes={abrirDetalhes} />); })}</section>
          <section className="titulo-pagina"><h2>Nossos Buquês</h2><p>Arranjos cuidadosamente elaborados para emocionar.</p></section>
          <section id="lista-buques" className="lista-itens">{buques.map((item) => { const itemNoCarrinho = carrinho.find(cartItem => cartItem.id === item.id); const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0; return (<CardItem key={item.id} item={item} quantidadeNoCarrinho={quantidade} onAdd={(id) => { adicionarAoCarrinho(id); refresh(); }} onMinus={(id) => { diminuirQuantidadeNoCarrinho(id); refresh(); }} onAbrirDetalhes={abrirDetalhes} />); })}</section>
        </div>
      </main>

      <DetalhesProdutoModal produto={produtoSelecionado} onFechar={fecharDetalhes} onAdicionar={(id) => { adicionarAoCarrinho(id); refresh(); fecharDetalhes(); }} />
      
      <Carrinho
        aberto={aberto}
        itens={carrinho}
        onClose={() => setAberto(false)}
        onDiminuir={(id) => { diminuirQuantidadeNoCarrinho(id); refresh(); }}
        onAdicionar={(id) => { adicionarAoCarrinho(id); refresh(); }}
        onRemover={(id) => { removerDoCarrinho(id); refresh(); }}
        onCheckout={(dados) => {
          setDadosParaCheckout(dados);
          setIsCheckoutOpen(true);
          setAberto(false);
        }}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckout}
        cartTotals={dadosParaCheckout}
      />
      
      <ContatoModal 
        isOpen={isContatoOpen}
        onClose={() => setIsContatoOpen(false)}
      />

      <Footer />
    </>
  );
}