"use client";

import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient.ts";

export default function ContatoModal({ isOpen, onClose }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso(false);

    const supabase = getSupabase();
    const { error } = await supabase
      .from('mensagem_contato')
      .insert({ nome, email, mensagem });

    setEnviando(false);

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErro('Ocorreu um erro. Por favor, tente novamente.');
    } else {
      setSucesso(true);
      setNome('');
      setEmail('');
      setMensagem('');
    }
  }
  
  // --- Estilos para o Modal ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#fff', padding: '20px 30px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', position: 'relative', color: '#333' };
  const closeButtonStyle = { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#333' };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Fale Conosco</h3>
          <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {!sucesso ? (
            <form onSubmit={handleSubmit}>
              <p>Tem alguma dúvida ou sugestão? Mande uma mensagem!</p>
              <div className="form-group"><label htmlFor="contato-nome">Nome</label><input id="contato-nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
              <div className="form-group"><label htmlFor="contato-email">E-mail</label><input id="contato-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="form-group"><label htmlFor="contato-mensagem">Mensagem</label><textarea id="contato-mensagem" rows="5" value={mensagem} onChange={(e) => setMensagem(e.target.value)} required ></textarea></div>
              <div className="modal-footer">
                <button type="submit" className="btn btn--green" disabled={enviando}>{enviando ? "Enviando..." : "Enviar Mensagem"}</button>
                {erro && <p className="form-error" style={{marginTop: '10px'}}>{erro}</p>}
              </div>
            </form>
          ) : (
            <div className="form-success" style={{textAlign: 'center', padding: '20px 0'}}>
              <h4>Mensagem enviada com sucesso!</h4>
              <p>Obrigado pelo seu contato. Responderemos em breve.</p>
              <button className="btn btn--green" style={{marginTop: '20px'}} onClick={() => { setSucesso(false); onClose(); }}>Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}