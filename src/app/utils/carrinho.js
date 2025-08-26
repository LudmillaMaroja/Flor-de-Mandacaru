import { catalogoCompleto } from "../data/itensLoja.js";

const NOME_CHAVE_CARRINHO = "carrinho-flor-de-mandacaru";

export function lerCarrinho() {
  const s = typeof window !== "undefined" ? localStorage.getItem(NOME_CHAVE_CARRINHO) : null;
  return s ? JSON.parse(s) : [];
}

function salvarCarrinho(carrinho) {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOME_CHAVE_CARRINHO, JSON.stringify(carrinho));
  }
}

export function adicionarAoCarrinho(idDoItem) {
  const carrinho = lerCarrinho();
  const itemNoCarrinho = carrinho.find((i) => i.id === idDoItem);

  if (itemNoCarrinho) {
    itemNoCarrinho.quantidade++;
  } else {
    const itemDoCatalogo = catalogoCompleto.find((i) => i.id === idDoItem);
    if (itemDoCatalogo) carrinho.push({ ...itemDoCatalogo, quantidade: 1 });
  }
  salvarCarrinho(carrinho);
}

export function diminuirQuantidadeNoCarrinho(idDoItem) {
  const carrinho = lerCarrinho();
  const idx = carrinho.findIndex((i) => i.id === idDoItem);
  if (idx > -1) {
    carrinho[idx].quantidade--;
    if (carrinho[idx].quantidade <= 0) carrinho.splice(idx, 1);
    salvarCarrinho(carrinho);
  }
}

export function removerDoCarrinho(idDoItem) {
  const carrinho = lerCarrinho();
  salvarCarrinho(carrinho.filter((i) => i.id !== idDoItem));
}

export function limparCarrinho() {
  salvarCarrinho([]);
}

export function contarItens() {
  return lerCarrinho().reduce((acc, i) => acc + i.quantidade, 0);
}

export function totalCarrinho() {
  return lerCarrinho().reduce((acc, i) => acc + i.preco * i.quantidade, 0);
}
