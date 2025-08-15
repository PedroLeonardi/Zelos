'use client';

import { useState } from 'react';
import styles from './usuario.module.css';
import Header from '../components/Header';

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const initialTickets = [
  { id: '#7798', title: 'Lâmpada queimada na sala 302', status: 'Resolvido', description: 'Lâmpada substituída com sucesso, sala ficou totalmente iluminada.', type: 'limpeza', createdAt: '2025-08-10T10:30' },
  { id: '#7815', title: 'Computador não liga no Lab 05', status: 'Em Análise', description: 'Verificando problema de hardware e possíveis substituições de peças.', type: 'manutencao', createdAt: '2025-08-11T09:15' },
  { id: '#7820', title: 'Solicitação de software', status: 'Aguardando', description: 'Instalar software CAD em todas as estações do Lab 07.', type: 'apoio_tecnico', createdAt: '2025-08-12T14:50' },
];

export default function UsuarioDashboard() {
  const [tickets, setTickets] = useState(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', type: 'manutencao' });
  const [toasters, setToasters] = useState([]);

  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      addToaster('Preenche todos os campos, mano.', 'error');
      return;
    }
    const createdTicket = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title.trim(),
      status: 'Pendente',
      description: newTicket.description.trim(),
      type: newTicket.type,
      createdAt: new Date().toISOString(),
    };
    setTickets([createdTicket, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ title: '', description: '', type: 'manutencao' });
    addToaster(`Chamado ${createdTicket.id} criado na moral!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolvido': return '#28a745';
      case 'Em Análise': return '#ffc107';
      case 'Aguardando': return '#fd7e14';
      case 'Pendente': return '#007bff';
      default: return '#ccc';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'manutencao': return '#1976d2';
      case 'apoio_tecnico': return '#6f42c1';
      case 'limpeza': return '#20c997';
      case 'externo': return '#fd7e14';
      default: return '#888';
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
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
                  <select
                    id="type"
                    value={newTicket.type}
                    onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                  >
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
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.newTicketButton}>
                    Confirmar Abertura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>Meus Chamados</h1>
          <button className={styles.newTicketButton} onClick={() => setIsModalOpen(true)}>
            <PlusIcon />
            <span>Criar Novo Chamado</span>
          </button>
        </div>

        <div className={styles.ticketList}>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={styles.ticketCard}
              style={{ borderLeftColor: getStatusColor(ticket.status) }}
            >
              <div className={styles.ticketHeader}>
                <div className={styles.ticketId}>{ticket.id}</div>
                <div className={styles.ticketTypeBadge} style={{ backgroundColor: getTypeColor(ticket.type) }}>
                  {ticket.type.replace('_',' ')}
                </div>
              </div>
              <h3 className={styles.ticketTitle}>{ticket.title}</h3>
              <p className={styles.ticketDescription}>{ticket.description}</p>
              <div className={styles.ticketFooter}>
                <span className={styles.ticketStatus} style={{ color: getStatusColor(ticket.status) }}>
                  {ticket.status}
                </span>
                <span className={styles.ticketDate}>
                  {new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toasts */}
      <div className={styles.toasterContainer}>
        {toasters.map(t => (
          <div key={t.id} className={`${styles.toaster} ${styles[`toaster-${t.type}`]}`}>
            {t.message}
            <span className={styles['toaster-close']} onClick={() => setToasters(prev => prev.filter(x => x.id !== t.id))}>
              &times;
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
