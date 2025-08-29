"use client";
import Image from "next/image";

// 1. Adicionamos a nova prop "onOpenContato"
export default function Header({ cartCount = 0, onOpenCart, onOpenContato }) {
  // Estilo para o botão de contato parecer um link normal
  const navButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    padding: 0,
    textDecoration: 'none', // Garante que não tenha sublinhado de botão
  };
  
  return (
    <header>
      <div className="container">
        <div className="logo">
          {/* Sua imagem, exatamente como estava */}
          <img src="./img/logo-flor.png" alt="Flor" width={40} height={40} />
          <h1>Flor de Mandacaru</h1>
        </div>

        <nav>
          <ul>
            <li><a href="#">Início</a></li>
            <li><a href="#lista-cestas">Cestas</a></li>
            <li><a href="#lista-buques">Buquês</a></li>
            
            {/* 2. AQUI ESTÁ A MUDANÇA PRINCIPAL */}
            <li>
              <button style={navButtonStyle} onClick={onOpenContato}>
                Contato
              </button>
            </li>
          </ul>
        </nav>

        <div className="header-carrinho">
          <button id="btn-abrir-carrinho" onClick={onOpenCart}>
            <svg className="icone-carrinho" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24" aria-hidden>
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Z"/>
            </svg>
            <span id="contador-carrinho">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}