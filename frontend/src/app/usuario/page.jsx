'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './usuario.module.css';
import Header from '../components/Header'; // <-- IMPORTAÇÃO ATIVADA

// --- ÍCONES ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SpinnerIcon = () => <svg className={styles.spinner} viewBox="0 0 50 50"><circle className={styles.spinnerPath} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle></svg>;


// --- CONFIGURAÇÃO CENTRALIZADA (COMO UM MINI DESIGN SYSTEM) ---
const STATUS_CONFIG = {
  Resolvido:   { label: 'Resolvido', color: '#16a34a' },
  'Em Análise': { label: 'Em Análise', color: '#f59e0b' },
  Aguardando:  { label: 'Aguardando', color: '#f97316' },
  Pendente:    { label: 'Pendente', color: '#3b82f6' }
};

const TYPE_CONFIG = {
  manutencao:     { label: 'Manutenção Corretiva', color: '#0ea5e9' },
  apoio_tecnico:  { label: 'Apoio Técnico', color: '#8b5cf6' },
  limpeza:        { label: 'Limpeza', color: '#14b8a6' },
  externo:        { label: 'Serviço Externo', color: '#ef4444' }
};

const initialTickets = [
  { id: '#7798', title: 'Lâmpada queimada na sala 302', status: 'Resolvido', description: 'A lâmpada principal do teto da sala de aula 302, localizada perto da janela, queimou e precisa ser substituída urgentemente para não atrapalhar a aula noturna.', type: 'externo', createdAt: '2025-08-10T10:30:00Z' },
  { id: '#7815', title: 'Computador não liga no Lab 05', status: 'Em Análise', description: 'O computador da bancada 3, patrimônio #12345, não dá sinal de vídeo ao ser ligado. Já foi testado em outra tomada e com outro cabo de energia.', type: 'manutencao', createdAt: '2025-08-11T09:15:00Z' },
  { id: '#7820', title: 'Solicitação de software', status: 'Aguardando', description: 'É necessária a instalação do software AutoCAD 2024 em todas as 15 estações de trabalho do Laboratório 07 para a nova turma de Desenho Técnico.', type: 'apoio_tecnico', createdAt: '2025-08-12T14:50:00Z' },
];


// --- COMPONENTES INTERNOS ---

const TicketCard = ({ ticket, onViewDetails }) => {
  const statusInfo = STATUS_CONFIG[ticket.status] || { color: '#6b7280' };
  const typeInfo = TYPE_CONFIG[ticket.type] || { color: '#6b7280' };
  
  return (
    <div 
      className={styles.ticketCard} 
      style={{ '--status-color': statusInfo.color }}
      onClick={() => onViewDetails(ticket)}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewDetails(ticket)}
    >
      <div className={styles.ticketHeader}>
        <span className={styles.ticketId}>{ticket.id}</span>
        <span className={styles.ticketTypeBadge} style={{ backgroundColor: typeInfo.color }}>
          {typeInfo.label}
        </span>
      </div>
      <h3 className={styles.ticketTitle}>{ticket.title}</h3>
      <p className={styles.ticketDescription}>{ticket.description}</p>
      <div className={styles.ticketFooter}>
        <div className={styles.ticketStatus}>
          <span className={styles.statusDot} />
          <span>{ticket.status}</span>
        </div>
        <span className={styles.ticketDate}>
          Criado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
};

const TicketModal = ({ modalConfig, onClose, onCreateTicket }) => {
  const [newTicket, setNewTicket] = useState({ title: '', description: '', type: 'manutencao' });
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Foco automático no input ao abrir modal de criação
    if (modalConfig.type === 'new' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [modalConfig.type]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTicket(newTicket);
  };
  
  // Tratamento de tecla ESC para fechar modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!modalConfig.isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {modalConfig.type === 'new' ? (
          <>
            <h2 className={styles.modalTitle}>Abrir Novo Chamado</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Título / Patrimônio</label>
                <input ref={titleInputRef} id="title" type="text" placeholder="Ex: PC-LAB05-01, Projetor do Auditório" value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo de Serviço</label>
                <select id="type" value={newTicket.type} onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}>
                  {Object.entries(TYPE_CONFIG).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Descrição do Problema</label>
                <textarea id="description" rows="5" placeholder="Descreva o problema ou a sua necessidade com o máximo de detalhes." value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onClose}>Cancelar</button>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>Confirmar Abertura</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className={styles.modalHeaderDetails}>
                <h2 className={styles.modalTitle}>{modalConfig.data.title}</h2>
                <span className={styles.ticketTypeBadge} style={{ backgroundColor: TYPE_CONFIG[modalConfig.data.type]?.color }}>
                    {TYPE_CONFIG[modalConfig.data.type]?.label}
                </span>
            </div>
            <p className={styles.modalDescription}>{modalConfig.data.description}</p>
            <div className={styles.modalMeta}>
                <div><strong>Status:</strong> <span className={styles.modalStatus} style={{color: STATUS_CONFIG[modalConfig.data.status]?.color}}>{modalConfig.data.status}</span></div>
                <div><strong>Chamado ID:</strong> {modalConfig.data.id}</div>
                <div><strong>Aberto em:</strong> {new Date(modalConfig.data.createdAt).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</div>
            </div>
            <div className={styles.modalActions}>
                <button type="button" className={`${styles.button} ${styles.buttonPrimary}`} onClick={onClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onOpenModal }) => (
    <div className={styles.emptyState}>
        <h3>Nenhum chamado encontrado</h3>
        <p>Você ainda não abriu nenhum chamado. Clique no botão abaixo para começar.</p>
        <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={onOpenModal}>
            <PlusIcon />
            <span>Criar Primeiro Chamado</span>
        </button>
    </div>
);

// --- PÁGINA PRINCIPAL ---
export default function UsuarioDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null }); // type: 'new' | 'details'
  const [toasters, setToasters] = useState([]);

  // Simulação de carregamento de dados
  useEffect(() => {
    setTimeout(() => {
      setTickets(initialTickets);
      setIsLoading(false);
    }, 800);
  }, []);

  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleOpenModal = (type, data = null) => {
    setModal({ isOpen: true, type, data });
  };
  
  const handleCloseModal = () => {
    setModal({ isOpen: false, type: null, data: null });
  };

  const handleCreateTicket = (newTicketData) => {
    const createdTicket = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
      ...newTicketData
    };
    setTickets([createdTicket, ...tickets]);
    handleCloseModal();
    addToaster(`Chamado ${createdTicket.id} criado com sucesso!`, 'success');
  };

  return (
    <>
      <Header /> {/* <-- HEADER ADICIONADO AQUI */}
      <div className={styles.container}>
        <TicketModal 
          modalConfig={modal}
          onClose={handleCloseModal}
          onCreateTicket={handleCreateTicket}
        />
        
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Meus Chamados</h1>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => handleOpenModal('new')}>
            <PlusIcon />
            <span>Novo Chamado</span>
          </button>
        </header>

        <main>
          {isLoading ? (
            <div className={styles.loadingState}><SpinnerIcon/>Carregando chamados...</div>
          ) : tickets.length > 0 ? (
            <div className={styles.ticketList}>
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onViewDetails={() => handleOpenModal('details', ticket)} />
              ))}
            </div>
          ) : (
            <EmptyState onOpenModal={() => handleOpenModal('new')} />
          )}
        </main>
      </div>
      
      <div className={styles.toasterContainer}>
        {toasters.map(t => (
          <div key={t.id} className={`${styles.toaster} ${styles[`toaster--${t.type}`]}`}>
            {t.message}
            <button className={styles.toasterClose} onClick={() => setToasters(prev => prev.filter(x => x.id !== t.id))}>&times;</button>
          </div>
        ))}
      </div>
    </>
  );
}