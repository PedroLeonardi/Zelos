'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './usuario.module.css';
import Header from '../components/Header';

// --- ÍCONES ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SpinnerIcon = () => <svg className={styles.spinner} viewBox="0 0 50 50"><circle className={styles.spinnerPath} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle></svg>;

// --- CONFIGURAÇÃO CENTRALIZADA ---
const STATUS_CONFIG = {
  Resolvido:   { label: 'Resolvido', color: '#16a34a' },
  'Em Análise': { label: 'Em Análise', color: '#f59e0b' },
  Aguardando:  { label: 'Aguardando', color: '#f97316' },
  Pendente:    { label: 'Pendente', color: '#3b82f6' }
};

const TYPE_CONFIG = {
  manutencao:     { label: 'Manutenção', color: '#0ea5e9' },
  apoio_tecnico:  { label: 'Apoio Técnico', color: '#8b5cf6' },
  limpeza:        { label: 'Limpeza', color: '#14b8a6' },
  externo:        { label: 'Serviço Externo', color: '#ef4444' }
};

const TYPE_TO_ID_MAP = {
  manutencao: "1",
  apoio_tecnico: "2",
  limpeza: "3",
  externo: "4"
};

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
          {ticket.serviceTitle}
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

const TicketModal = ({ modalConfig, onClose, onCreateTicket, isSubmitting }) => {
  const [newTicket, setNewTicket] = useState({ 
    title: '', 
    description: '', 
    type: 'manutencao',
    patrimony: '' 
  });
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (modalConfig.type === 'new' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [modalConfig.type]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTicket(newTicket);
  };
  
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
                <label htmlFor="title">Título do Chamado</label>
                <input 
                  ref={titleInputRef} 
                  id="title" 
                  type="text" 
                  placeholder="Ex: Projetor do auditório não liga" 
                  value={newTicket.title} 
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} 
                  required 
                  maxLength="27" 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="patrimony">Número do Patrimônio (Opcional)</label>
                <input 
                  id="patrimony" 
                  type="text" 
                  placeholder="Ex: 12345678" 
                  value={newTicket.patrimony} 
                  onChange={(e) => setNewTicket({ ...newTicket, patrimony: e.target.value })} 
                  maxLength="15" 
                />
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
                <textarea 
                  id="description" 
                  rows="5" 
                  placeholder="Descreva o problema ou a sua necessidade com o máximo de detalhes." 
                  value={newTicket.description} 
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} 
                  required 
                  maxLength="148" 
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
                  {isSubmitting ? <SpinnerIcon /> : 'Confirmar Abertura'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
           <div className={styles.modalHeaderDetails}>
                <h2 className={styles.modalTitle}>{modalConfig.data.title}</h2>
                <span className={styles.ticketTypeBadge} style={{ backgroundColor: TYPE_CONFIG[modalConfig.data.type]?.color }}>
                    {modalConfig.data.serviceTitle}
                </span>
            </div>
            <p className={styles.modalDescription}>{modalConfig.data.description}</p>
            <div className={styles.modalMeta}>
                <div><strong>Tipo de Serviço:</strong> {modalConfig.data.serviceTitle}</div>
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
  const [LOGGED_IN_USER_ID, setLoggedInUserId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [toasters, setToasters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // --- BANNER: CORREÇÃO APLICADA ---
  // A lógica agora FORÇA a definição do ID para '1' toda vez que a página carrega,
  // garantindo consistência no ambiente de desenvolvimento.
  // ============================================================================
  useEffect(() => {
    localStorage.setItem('id', "2"); // Força o ID a ser '1'
    const id = localStorage.getItem('id'); // Lê o ID que acabamos de definir
    setLoggedInUserId(id); // Armazena o ID no estado do componente
  }, []);

  const fetchTickets = useCallback(async () => {
    if (!LOGGED_IN_USER_ID) return [];
    
    const apiUrl = 'http://localhost:8080/chamados/getFilter';
    const headers = { 'Content-Type': 'application/json' };
    const body = { "key": "usuario_id", "value": LOGGED_IN_USER_ID };
    const response = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(body) });
    if (!response.ok) throw new Error('Falha ao buscar os chamados da API');
    return response.json();
  }, [LOGGED_IN_USER_ID]);

  const fetchServiceById = async (id) => {
    const apiUrl = `http://localhost:8080/servico/getFilter/`;
    const headers = { 'Content-Type': 'application/json' };
    const body = { "key": "id", "value": `${id}` };
    const response = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(body) });
    if (!response.ok) {
      console.error(`Falha ao buscar o serviço com ID: ${id}`);
      return { id: null, titulo: 'Serviço Desconhecido' };
    }
    const responseData = await response.json();
    return responseData[0] || { id: null, titulo: 'Serviço Desconhecido' };
  };

  const createTicketApi = async (payload) => {
    const apiUrl = 'http://localhost:8080/chamados/post';
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.mensagem || `Falha ao criar chamado: ${response.statusText}`);
    }
    return response.json();
  };
  
  const mapApiStatusToDisplayStatus = (apiStatus) => {
    const mapping = { 'concluído': 'Resolvido', 'em análise': 'Em Análise', 'aguardando': 'Aguardando', 'pendente': 'Pendente' };
    return mapping[apiStatus.toLowerCase()] || 'Pendente';
  };

  const mapServiceTitleToTypeKey = (title) => {
    for (const [key, config] of Object.entries(TYPE_CONFIG)) {
      if (config.label === title) return key;
    }
    return 'manutencao';
  };

  const loadTicketData = useCallback(async () => {
    if (!LOGGED_IN_USER_ID) return; // Guarda de segurança adicional
    setIsLoading(true);
    try {
      const apiTickets = await fetchTickets();
      const enrichedTicketsPromises = apiTickets.map(async (ticket) => {
        const service = await fetchServiceById(ticket.servicos_id);
        return {
          id: `#${ticket.id}`, title: ticket.titulo, description: ticket.descricao,
          patrimony: ticket.patrimonio_id, status: mapApiStatusToDisplayStatus(ticket.status),
          type: mapServiceTitleToTypeKey(service.titulo), serviceTitle: service.titulo,
          createdAt: ticket.criado_em, updatedAt: ticket.atualizado_em,
        };
      });
      const finalTicketsData = await Promise.all(enrichedTicketsPromises);
      setTickets(finalTicketsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      addToaster("Não foi possível carregar os chamados.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [LOGGED_IN_USER_ID, fetchTickets]);

  useEffect(() => {
    if (LOGGED_IN_USER_ID) {
      loadTicketData();
    }
  }, [LOGGED_IN_USER_ID, loadTicketData]);

  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleOpenModal = (type, data = null) => setModal({ isOpen: true, type, data });
  const handleCloseModal = () => setModal({ isOpen: false, type: null, data: null });

  const handleCreateTicket = async (formData) => {
    setIsSubmitting(true);
    try {
      if (formData.patrimony && !/^\d+$/.test(formData.patrimony)) {
          throw new Error('O número do patrimônio é inválido. Digite apenas números.');
      }
      const payload = {
        titulo: formData.title,
        descricao: formData.description,
        patrimonio_id: formData.patrimony || null, 
        servicos_id: TYPE_TO_ID_MAP[formData.type], 
        usuario_id: LOGGED_IN_USER_ID
      };
      const newTicketFromApi = await createTicketApi(payload);
      addToaster(`Chamado #${newTicketFromApi.id || ''} criado com sucesso!`, 'success');
      handleCloseModal();
      await loadTicketData();
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      if (error.message && error.message.includes('chamado com numero de patrimonio já aberto')) {
        addToaster("Já existe um chamado aberto para este número de patrimônio.", "error");
      } else {
        addToaster(error.message || "Não foi possível criar o chamado.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <TicketModal 
          modalConfig={modal}
          onClose={handleCloseModal}
          onCreateTicket={handleCreateTicket}
          isSubmitting={isSubmitting}
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