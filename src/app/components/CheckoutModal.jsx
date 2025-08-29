"use client";

import { useState } from "react";

export default function CheckoutModal({ isOpen, onClose, onSubmit, cartTotals }) {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  
  if (!isOpen) {
    return null;
  }

  function handleFinalSubmit(event) {
    event.preventDefault();
    const dadosCliente = { nome, endereco, telefone, formaPagamento };
    onSubmit(cartTotals, dadosCliente);
  }

  // ===== OBJETOS DE ESTILO PARA O EFEITO POP-UP =====

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Garante que o fundo fique por cima de tudo
  };

  const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px 30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    position: 'relative', // Necessário para posicionar o botão de fechar
    color: '#333', // Cor do texto dentro do modal
  };
  
  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#333',
  };

  return (
    // O overlay ocupa a tela inteira e escurece o fundo
    <div style={overlayStyle} onClick={onClose}>
      {/* Clicar no conteúdo do modal NÃO o fecha, graças ao e.stopPropagation() */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Finalizar Pedido</h3>
          <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleFinalSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="endereco">Endereço de Entrega</label>
              <input id="endereco" type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone (WhatsApp)</label>
              <input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="formaPagamento">Forma de Pagamento</label>
              <select id="formaPagamento" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Dinheiro na Entrega">Dinheiro na Entrega</option>
              </select>
            </div>
            <div className="modal-footer">
                <p style={{ fontWeight: 'bold' }}>
                  Total: {cartTotals.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <button type="submit" className="btn btn--green">Confirmar Pedido</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}