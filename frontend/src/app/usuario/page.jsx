'use client';

import { useState } from 'react'; // Importa o useState
import styles from './usuario.module.css';

// Ícone de "+" em SVG para o botão
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Dados mocados que viriam do banco de dados no futuro
const initialTickets = [
    { id: '#7798', title: 'Lâmpada queimada na sala 302', status: 'Resolvido' },
    { id: '#7815', title: 'Computador não liga no Lab 05', status: 'Em Análise' },
    { id: '#7820', title: 'Solicitação de software', status: 'Aguardando' },
];

export default function UsuarioDashboard() {
  // --- STATE MANAGEMENT ---
  const [tickets, setTickets] = useState(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', type: 'manutencao' });

  // --- FUNÇÕES ---
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    // Simula a criação de um novo chamado
    const createdTicket = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`, // Gera um ID aleatório
      title: newTicket.title,
      status: 'Pendente',
    };
    setTickets([createdTicket, ...tickets]); // Adiciona o novo ticket no topo da lista
    setIsModalOpen(false); // Fecha o modal
    setNewTicket({ title: '', description: '', type: 'manutencao' }); // Limpa o formulário
  };

  return (
    <div className={styles.container}>
      {/* --- MODAL DE CRIAÇÃO DE CHAMADO --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Abrir Novo Chamado</h2>
            <form onSubmit={handleCreateTicket}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Patrimônio ou Item</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ex: PC-LAB05-01, Impressora 3D"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo de Serviço</label>
                <select id="type" value={newTicket.type} onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}>
                  <option value="manutencao">Manutenção Corretiva</option>
                  <option value="apoio_tecnico">Apoio Técnico</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="externo">Serviço Externo</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Descrição do Problema</label>
                <textarea
                  id="description"
                  rows="4"
                  placeholder="Descreva o problema ou a sua necessidade."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                ></textarea>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.buttonSecondary} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className={styles.newTicketButton}>Confirmar Abertura</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className={styles.header}>
        <h1 className={styles.title}>Meus Chamados</h1>
        <button className={styles.newTicketButton} onClick={() => setIsModalOpen(true)}>
          <PlusIcon />
          <span>Criar Novo Chamado</span>
        </button>
      </div>

      <div className={styles.ticketList}>
        {tickets.map(ticket => (
          <div key={ticket.id} className={styles.ticketItem} data-status={ticket.status.replace(' ', '')}>
            <span className={styles.statusDot}></span>
            <p className={styles.ticketInfo}><strong>{ticket.id}</strong> - {ticket.title}</p>
            <span className={styles.ticketStatus}>{ticket.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}