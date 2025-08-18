'use client';

import { useState, useMemo } from 'react';
import styles from './tecnico.module.css';
// import Header from '../components/Header'; // Removido conforme solicitado para manter tudo em um arquivo

// --- ÍCONES SVG (Para não usar bibliotecas externas) ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11 20.5v-17a1 1 0 0 1 2 0v17a1 1 0 0 1-2 0zM6.293 6.207a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L13 3.914V10a1 1 0 0 1-2 0V3.914l-2.293 2.293a1 1 0 0 1-1.414 0z"/></svg>;


// --- DADOS INICIAIS E CONFIGURAÇÕES ---
const initialChamados = [
  { id: '#7821', titulo: 'Reparo Impressora 3D', setor: 'Laboratório de Manufatura', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'alta', relatorio: null, criado_em: '2025-08-17T10:00:00Z' },
  { id: '#7820', titulo: 'Instalar Software CAD', setor: 'Sala de Desenho Técnico', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'media', relatorio: null, criado_em: '2025-08-17T09:30:00Z' },
  { id: '#7822', titulo: 'Verificar Ponto de Rede', setor: 'Bloco C, Ponto 5', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'baixa', relatorio: null, criado_em: '2025-08-17T11:00:00Z' },
  { id: '#7815', titulo: 'Manutenção Torno CNC', setor: 'Oficina Mecânica', status: 'em_andamento', atribuido: true, tecnico_id: 2, prioridade: 'alta', relatorio: null, criado_em: '2025-08-16T14:00:00Z' },
  { id: '#7818', titulo: 'Projetor não liga', setor: 'Auditório Principal', status: 'em_andamento', atribuido: true, tecnico_id: 1, prioridade: 'media', relatorio: null, criado_em: '2025-08-16T15:20:00Z' },
  { id: '#7809', titulo: 'Troca de Lâmpadas', setor: 'Secretaria Geral', status: 'concluido', atribuido: true, tecnico_id: 2, prioridade: 'baixa', relatorio: { descricao: 'Lâmpadas trocadas com sucesso.', comeco: '2025-08-11T10:00', fim: '2025-08-11T10:30' }, criado_em: '2025-08-15T08:00:00Z' },
  { id: '#7811', titulo: 'Formatar PC', setor: 'Recepção', status: 'concluido', atribuido: true, tecnico_id: 1, prioridade: 'media', relatorio: { descricao: 'Sistema operacional reinstalado e drivers atualizados.', comeco: '2025-08-10T14:00', fim: '2025-08-10T16:00' }, criado_em: '2025-08-14T13:00:00Z' },
];

const LOGGED_IN_TECNICO = { id: 1, nome: 'Carlos Souza' };

const STATUS_CONFIG = {
  pendente: { title: 'Pendente', color: '#3b82f6' },
  em_andamento: { title: 'Em Andamento', color: '#f97316' },
  concluido: { title: 'Concluído', color: '#16a34a' },
};

const PRIORIDADE_CONFIG = {
  alta: { label: 'Alta', color: '#ef4444', level: 3 },
  media: { label: 'Média', color: '#eab308', level: 2 },
  baixa: { label: 'Baixa', color: '#06b6d4', level: 1 },
};

// --- COMPONENTES INTERNOS ---

const TicketCard = ({ ticket, onOpenModal, onAtribuir, onIniciar }) => {
  const prioridade = PRIORIDADE_CONFIG[ticket.prioridade];
  const canSelfAssign = !ticket.atribuido && ticket.status === 'pendente';
  const canStart = ticket.atribuido && ticket.tecnico_id === LOGGED_IN_TECNICO.id && ticket.status === 'pendente';

  return (
    <article className={styles.ticketCard} style={{ '--priority-color': prioridade.color }} tabIndex={0}>
      <header className={styles.ticketCard__header}>
        <span className={styles.ticketCard__id}>{ticket.id}</span>
        <span className={styles.priorityTag} style={{ backgroundColor: prioridade.color }}>
          {prioridade.label}
        </span>
      </header>
      <h3 className={styles.ticketCard__title}>{ticket.titulo}</h3>
      <p className={styles.ticketCard__sector}>{ticket.setor}</p>
      <footer className={styles.ticketCard__actions}>
        {canSelfAssign && (
          <button className={`${styles.button} ${styles['button--primary']}`} onClick={() => onAtribuir(ticket.id)}>
            Atribuir a Mim
          </button>
        )}
        {canStart && (
           <button className={`${styles.button} ${styles['button--primary']}`} onClick={() => onIniciar(ticket.id)}>
            Iniciar Atendimento
          </button>
        )}
        <button className={`${styles.button} ${styles['button--secondary']}`} onClick={() => onOpenModal(ticket)}>
          Detalhes
        </button>
      </footer>
    </article>
  );
};

const ModalContent = ({ ticket, handleFinalizarChamado, relatorioForm, handleRelatorioChange }) => {
  if (!ticket) return null;

  const isOwner = ticket.tecnico_id === LOGGED_IN_TECNICO.id;
  const isFinished = ticket.status === 'concluido';
  const isInProgress = ticket.status === 'em_andamento';

  if (isFinished) {
    return (
      <section className={styles.reportDetails}>
        <h4>Relatório de Atendimento</h4>
        <p><strong>Descrição:</strong> {ticket.relatorio?.descricao || 'N/A'}</p>
        <p><strong>Início:</strong> {ticket.relatorio?.comeco ? new Date(ticket.relatorio.comeco).toLocaleString('pt-BR') : 'N/A'}</p>
        <p><strong>Fim:</strong> {ticket.relatorio?.fim ? new Date(ticket.relatorio.fim).toLocaleString('pt-BR') : 'N/A'}</p>
      </section>
    );
  }

  if (isOwner && isInProgress) {
    return (
      <form onSubmit={handleFinalizarChamado} className={styles.reportForm}>
        <h4>Preencher Relatório Final</h4>
        <div className={styles.formGroup}>
          <label htmlFor="descricao">Descrição do Atendimento</label>
          <textarea id="descricao" value={relatorioForm.descricao} onChange={handleRelatorioChange} required rows={5} placeholder="Descreva em detalhes o serviço executado..."/>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="comeco">Início do Atendimento</label>
            <input type="datetime-local" id="comeco" value={relatorioForm.comeco} onChange={handleRelatorioChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fim">Fim do Atendimento</label>
            <input type="datetime-local" id="fim" value={relatorioForm.fim} onChange={handleRelatorioChange} required/>
          </div>
        </div>
        <button type="submit" className={`${styles.button} ${styles['button--primary']} ${styles['button--fullWidth']}`}>
          Finalizar Chamado
        </button>
      </form>
    );
  }

  return (
    <p className={styles.modalNotice}>
      <em>
        {ticket.atribuido ? 'Este chamado está atribuído a outro técnico.' : 'Para finalizar, primeiro atribua este chamado a você.'}
      </em>
    </p>
  );
};


// --- PÁGINA PRINCIPAL ---
export default function TecnicoDashboard() {
  const [chamados, setChamados] = useState(initialChamados);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [relatorioForm, setRelatorioForm] = useState({ descricao: '', comeco: '', fim: '' });
  const [toasters, setToasters] = useState([]);

  // --- Estados para filtros e busca ---
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('todos');
  const [showOnlyMyTickets, setShowOnlyMyTickets] = useState(false);
  const [sortBy, setSortBy] = useState('prioridade');

  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // --- LÓGICA DE MANIPULAÇÃO DE DADOS ---

  const handleSelfAssign = (ticketId) => {
    setChamados(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, atribuido: true, tecnico_id: LOGGED_IN_TECNICO.id } : t
      )
    );
    addToaster(`Chamado ${ticketId} atribuído a você!`, 'success');
  };
  
  const handleStartProgress = (ticketId) => {
    setChamados(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status: 'em_andamento' } : t
      )
    );
    addToaster(`Chamado ${ticketId} movido para "Em Andamento".`, 'info');
  };

  const handleFinalizarChamado = (e) => {
    e.preventDefault();
    const { descricao, comeco, fim } = relatorioForm;
    if (!descricao.trim() || !comeco || !fim) {
      addToaster('Preencha todos os campos do relatório.', 'error');
      return;
    }
    if (new Date(fim) < new Date(comeco)) {
      addToaster('A data de fim não pode ser anterior à data de início.', 'error');
      return;
    }

    setChamados(prev =>
      prev.map(t =>
        t.id === selectedTicket.id ? { ...t, status: 'concluido', relatorio: relatorioForm } : t
      )
    );
    addToaster(`Chamado ${selectedTicket.id} finalizado com sucesso!`, 'success');
    handleCloseModal();
  };

  // --- LÓGICA DO MODAL ---

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setRelatorioForm(ticket.relatorio || { descricao: '', comeco: '', fim: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Adiciona um pequeno delay para a animação de saída do modal antes de limpar os dados
    setTimeout(() => {
        setSelectedTicket(null);
    }, 300);
  };

  const handleRelatorioChange = (e) => {
    const { id, value } = e.target;
    setRelatorioForm(prev => ({ ...prev, [id]: value }));
  };

  // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO (Otimizada com useMemo) ---

  const filteredAndSortedChamados = useMemo(() => {
    let result = [...chamados];

    if (showOnlyMyTickets) {
      result = result.filter(t => t.tecnico_id === LOGGED_IN_TECNICO.id);
    }
    
    if (priorityFilter !== 'todos') {
      result = result.filter(t => t.prioridade === priorityFilter);
    }

    if (searchTerm) {
      result = result.filter(
        t =>
          t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenação
    result.sort((a, b) => {
        if (sortBy === 'prioridade') {
            return (PRIORIDADE_CONFIG[b.prioridade]?.level ?? 0) - (PRIORIDADE_CONFIG[a.prioridade]?.level ?? 0);
        }
        // Por padrão (ou 'recentes'), ordena pelo ID
        return b.id.localeCompare(a.id);
    });

    return result;
  }, [chamados, searchTerm, priorityFilter, showOnlyMyTickets, sortBy]);


  return (
    <>
      {/* <Header /> */}
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Painel de Chamados</h1>
            <p className={styles.pageSubtitle}>Bem-vindo, <strong>{LOGGED_IN_TECNICO.nome}</strong>. Aqui estão suas tarefas.</p>
          </div>
           <div className={styles.userSwitch}>
            <label htmlFor="my-tickets-switch">Mostrar apenas meus chamados</label>
            <div className={styles.switchWrapper}>
              <input 
                id="my-tickets-switch" 
                type="checkbox" 
                className={styles.switch}
                checked={showOnlyMyTickets}
                onChange={() => setShowOnlyMyTickets(!showOnlyMyTickets)}
              />
              <span className={styles.switchSlider}></span>
            </div>
          </div>
        </header>

        <div className={styles.filtersBar}>
            <div className={styles.searchBox}>
                <SearchIcon />
                <input 
                    type="text" 
                    placeholder="Buscar por título, ID, setor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className={styles.filterGroup}>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                    <option value="todos">Todas as Prioridades</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="prioridade">Ordenar por Prioridade</option>
                    <option value="recentes">Ordenar por Mais Recentes</option>
                </select>
            </div>
        </div>

        <main className={styles.kanban}>
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const columnTickets = filteredAndSortedChamados.filter((c) => c.status === statusKey);
            const columnConfig = STATUS_CONFIG[statusKey];

            return (
              <section key={statusKey} className={styles.kanbanColumn} aria-labelledby={`column-title-${statusKey}`}>
                <header className={styles.kanbanColumn__header} style={{'--status-color': columnConfig.color}}>
                  <h2 id={`column-title-${statusKey}`} className={styles.kanbanColumn__title}>{columnConfig.title}</h2>
                  <span className={styles.kanbanColumn__count}>{columnTickets.length}</span>
                </header>
                <div className={styles.kanbanColumn__ticketsList}>
                  {columnTickets.length > 0 ? (
                    columnTickets.map((ticket) => (
                      <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        onOpenModal={handleOpenModal}
                        onAtribuir={handleSelfAssign}
                        onIniciar={handleStartProgress}
                      />
                    ))
                  ) : (
                    <div className={styles.kanbanColumn__empty}>
                        <p>Nenhum chamado nesta coluna.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* --- MODAL --- */}
      {modalOpen && selectedTicket && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <header className={styles.modalHeader}>
                <div>
                    <span className={styles.modal__id}>{selectedTicket.id}</span>
                    <h2 id="modal-title" className={styles.modalTitle}>{selectedTicket.titulo}</h2>
                </div>
              <button className={styles.modalCloseButton} onClick={handleCloseModal} aria-label="Fechar modal">&times;</button>
            </header>
            <main className={styles.modalBody}>
                <div className={styles.modalInfoGrid}>
                    <p><strong>Setor:</strong> {selectedTicket.setor}</p>
                    <p><strong>Status:</strong> <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[selectedTicket.status]?.color}}>{STATUS_CONFIG[selectedTicket.status]?.title}</span></p>
                    <p><strong>Prioridade:</strong> <span className={styles.priorityTag} style={{ backgroundColor: PRIORIDADE_CONFIG[selectedTicket.prioridade]?.color }}>{PRIORIDADE_CONFIG[selectedTicket.prioridade]?.label}</span></p>
                </div>
              <hr className={styles.modalSeparator}/>
              <ModalContent 
                ticket={selectedTicket} 
                handleFinalizarChamado={handleFinalizarChamado}
                relatorioForm={relatorioForm}
                handleRelatorioChange={handleRelatorioChange}
              />
            </main>
          </div>
        </div>
      )}

      {/* --- TOASTER CONTAINER --- */}
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