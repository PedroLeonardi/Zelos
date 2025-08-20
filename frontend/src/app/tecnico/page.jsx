'use client';

import { useState, useMemo } from 'react';
import styles from './tecnico.module.css';
import Header from '../components/Header'; // <-- HEADER IMPORTADO AQUI

// --- ÍCONES SVG (Para não usar bibliotecas externas) ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>;

// --- DADOS INICIAIS E CONFIGURAÇÕES ---
// Dados MOCK reestruturados conforme a tabela do banco de dados
const initialChamados = [
    { id: 1, titulo: 'Reparo Impressora 3D', descricao: 'A impressora parou no meio da impressão e está exibindo um erro de aquecimento.', patrimonio_id: 101, servicos_id: 1, tecnico_id: null, usuario_id: 4, status: 'pendente', criado_em: '2025-08-17T10:00:00Z' },
    { id: 2, titulo: 'Instalar Software CAD', descricao: 'Instalar a nova versão do AutoCAD no computador do designer.', patrimonio_id: null, servicos_id: 3, tecnico_id: null, usuario_id: 4, status: 'pendente', criado_em: '2025-08-17T09:30:00Z' },
    { id: 3, titulo: 'Verificar Ponto de Rede', descricao: 'Ponto de rede não funciona no Bloco C.', patrimonio_id: null, servicos_id: 3, tecnico_id: null, usuario_id: 6, status: 'pendente', criado_em: '2025-08-17T11:00:00Z' },
    { id: 4, titulo: 'Manutenção Torno CNC', descricao: 'Manutenção preventiva agendada.', patrimonio_id: 105, servicos_id: 2, tecnico_id: 2, usuario_id: 6, status: 'em andamento', criado_em: '2025-08-16T14:00:00Z' },
    { id: 5, titulo: 'Projetor não liga', descricao: 'Projetor do auditório principal não liga.', patrimonio_id: 102, servicos_id: 1, tecnico_id: 1, usuario_id: 4, status: 'em andamento', criado_em: '2025-08-16T15:20:00Z' },
    { id: 6, titulo: 'Troca de Lâmpadas', descricao: 'Trocar lâmpadas da sala 1.', patrimonio_id: null, servicos_id: 2, tecnico_id: 2, usuario_id: 6, status: 'concluído', criado_em: '2025-08-15T08:00:00Z' },
    { id: 7, titulo: 'Formatar PC', descricao: 'Reinstalar sistema operacional no PC da recepção.', patrimonio_id: 104, servicos_id: 3, tecnico_id: 1, usuario_id: 4, status: 'concluído', criado_em: '2025-08-14T13:00:00Z' },
    // Adicione mais chamados de teste para ver a paginação funcionando
    { id: 8, titulo: 'Limpeza de servidor', descricao: 'Remoção de poeira e verificação de hardware.', patrimonio_id: 201, servicos_id: 2, tecnico_id: 1, usuario_id: 5, status: 'em andamento', criado_em: '2025-08-18T10:00:00Z' },
    { id: 9, titulo: 'Ajuste de rede', descricao: 'Cabo de rede solto na sala 3.', patrimonio_id: null, servicos_id: 3, tecnico_id: 1, usuario_id: 5, status: 'em andamento', criado_em: '2025-08-18T11:00:00Z' },
    { id: 10, titulo: 'Computador lento', descricao: 'Computador do setor financeiro muito lento.', patrimonio_id: 106, servicos_id: 1, tecnico_id: 1, usuario_id: 5, status: 'em andamento', criado_em: '2025-08-18T12:00:00Z' },
    { id: 11, titulo: 'Problema com software de ponto', descricao: 'Software de ponto não inicializa.', patrimonio_id: 107, servicos_id: 1, tecnico_id: null, usuario_id: 5, status: 'pendente', criado_em: '2025-08-18T13:00:00Z' },
    { id: 12, titulo: 'Troca de mouse', descricao: 'Mouse da sala 5 quebrou.', patrimonio_id: null, servicos_id: 1, tecnico_id: 1, usuario_id: 5, status: 'concluído', criado_em: '2025-08-18T14:00:00Z' },
    { id: 13, titulo: 'Verificar webcam', descricao: 'Webcam não funciona na sala de reunião.', patrimonio_id: null, servicos_id: 3, tecnico_id: null, usuario_id: 5, status: 'pendente', criado_em: '2025-08-18T15:00:00Z' },
];

// Mapeamento de IDs para nomes (simulando dados de outras tabelas)
const initialServicos = { 1: 'Manutenção Corretiva', 2: 'Manutenção Preventiva', 3: 'Instalação/Configuração' };
const initialUsuarios = { 1: 'Carlos Souza', 2: 'Ana Pereira', 4: 'João Silva', 5: 'Fernanda Martins', 6: 'Roberto Alves' };
const initialPatrimonio = { 101: 'Impressora 3D', 102: 'Projetor', 104: 'PC Recepção', 105: 'Torno CNC', 106: 'PC Financeiro', 107: 'PC Ponto', 201: 'Servidor Principal' };

// O técnico logado. A ID aqui será usada para filtrar os chamados.
const LOGGED_IN_TECNICO = { id: 1, nome: 'Carlos Souza' };

// Mapeamento de status para nomes e cores
const STATUS_CONFIG = {
  'pendente': { title: 'Pendente', color: '#3b82f6' },
  'em andamento': { title: 'Em Andamento', color: '#f97316' },
  'aguardando aprovação': { title: 'Aguardando Aprovação', color: '#f97316' },
  'concluído': { title: 'Concluído', color: '#16a34a' },
};

// --- COMPONENTES INTERNOS ---

const TicketCard = ({ ticket, onOpenModal, onAtribuir, onIniciar }) => {
  const isPending = ticket.status === 'pendente';
  const isOwner = ticket.tecnico_id === LOGGED_IN_TECNICO.id;

  return (
    <article className={styles.ticketCard} tabIndex={0}>
      <header className={styles.ticketCard__header}>
        <span className={styles.ticketCard__id}>#{ticket.id}</span>
        <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[ticket.status]?.color}}>{STATUS_CONFIG[ticket.status]?.title}</span>
      </header>
      <h3 className={styles.ticketCard__title}>{ticket.titulo}</h3>
      <p className={styles.ticketCard__info}><strong>Serviço:</strong> {initialServicos[ticket.servicos_id]}</p>
      <p className={styles.ticketCard__info}><strong>Usuário:</strong> {initialUsuarios[ticket.usuario_id]}</p>
      <p className={styles.ticketCard__info}><strong>Patrimônio:</strong> {initialPatrimonio[ticket.patrimonio_id] || 'N/A'}</p>

      <footer className={styles.ticketCard__actions}>
        {isPending && !isOwner && (
          <button className={`${styles.button} ${styles['button--primary']}`} onClick={() => onAtribuir(ticket.id)}>
            Atribuir a Mim
          </button>
        )}
        {isPending && isOwner && (
           <button className={`${styles.button} ${styles['button--action']}`} onClick={() => onIniciar(ticket.id)}>
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

const ModalContent = ({ ticket, handleFinalizarChamado, handleSaveRelatorioParcial, relatorioForm, handleRelatorioChange }) => {
  if (!ticket) return null;

  const isOwner = ticket.tecnico_id === LOGGED_IN_TECNICO.id;
  const isFinished = ticket.status === 'concluído';
  const isInProgress = ticket.status === 'em andamento';

  if (isFinished) {
    return (
      <section className={styles.reportDetails}>
        <h4>Relatório de Atendimento</h4>
        <p><strong>Descrição:</strong> {ticket.relatorio?.descricao || 'N/A'}</p>
      </section>
    );
  }

  if (isOwner && isInProgress) {
    return (
      <form onSubmit={handleFinalizarChamado} className={styles.reportForm}>
        <h4>Preencher Relatório</h4>
        <p className={styles.reportNotice}>Você pode salvar um rascunho e finalizar depois.</p>
        <div className={styles.formGroup}>
          <label htmlFor="descricao">Descrição do Atendimento</label>
          <textarea id="descricao" value={relatorioForm.descricao} onChange={handleRelatorioChange} required rows={5} placeholder="Descreva em detalhes o serviço executado..."/>
        </div>
        <div className={styles.reportButtons}>
            <button type="button" className={`${styles.button} ${styles['button--secondary']}`} onClick={handleSaveRelatorioParcial}>
                Salvar Rascunho
            </button>
            <button type="submit" className={`${styles.button} ${styles['button--primary']}`}>
                Finalizar Chamado
            </button>
        </div>
      </form>
    );
  }

  return (
    <p className={styles.modalNotice}>
      <em>
        Este chamado não está atribuído a você ou não está em andamento.
      </em>
    </p>
  );
};


// --- PÁGINA PRINCIPAL ---
export default function TecnicoDashboard() {
  const [chamados, setChamados] = useState(initialChamados);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [relatorioForm, setRelatorioForm] = useState({ descricao: '' });
  const [toasters, setToasters] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recentes');
  
  // Estados para controlar a paginação
  const [pendenteLimit, setPendenteLimit] = useState(5);
  const [emAndamentoLimit, setEmAndamentoLimit] = useState(5);
  const [concluidoLimit, setConcluidoLimit] = useState(5);

  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    const sortLabel = newSortBy === 'status' ? 'Status' : 'Mais Recentes';
    addToaster(`Chamados ordenados por: ${sortLabel}`, 'info');
  };

  const handleSelfAssign = (ticketId) => {
    setChamados(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, tecnico_id: LOGGED_IN_TECNICO.id, status: 'em andamento' } : t
      )
    );
    addToaster(`Chamado #${ticketId} atribuído e iniciado com sucesso!`, 'success');
  };
  
  const handleStartProgress = (ticketId) => {
    setChamados(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status: 'em andamento' } : t
      )
    );
    addToaster(`Chamado #${ticketId} iniciado com sucesso!`, 'info');
  };

  const handleFinalizarChamado = (e) => {
    e.preventDefault();
    const { descricao } = relatorioForm;
    if (!descricao.trim()) {
      addToaster('Preencha a descrição do relatório.', 'error');
      return;
    }

    setChamados(prev =>
      prev.map(t =>
        t.id === selectedTicket.id ? { ...t, status: 'concluído', relatorio: { descricao } } : t
      )
    );
    addToaster(`Chamado #${selectedTicket.id} finalizado com sucesso!`, 'success');
    handleCloseModal();
  };

  const handleSaveRelatorioParcial = () => {
      if (!selectedTicket || !relatorioForm.descricao.trim()) {
          addToaster('A descrição do relatório não pode estar vazia.', 'error');
          return;
      }
      setChamados(prev =>
          prev.map(t =>
              t.id === selectedTicket.id ? { ...t, relatorio: relatorioForm } : t
          )
      );
      addToaster(`Rascunho do chamado #${selectedTicket.id} salvo com sucesso!`, 'success');
      handleCloseModal();
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setRelatorioForm(ticket.relatorio || { descricao: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTicket(null), 300);
  };

  const handleRelatorioChange = (e) => {
    const { id, value } = e.target;
    setRelatorioForm(prev => ({ ...prev, [id]: value }));
  };

  const filteredAndSortedChamados = useMemo(() => {
    let result = [...chamados];
    
    // Filtra para mostrar APENAS os chamados do técnico logado
    result = result.filter(t => t.tecnico_id === LOGGED_IN_TECNICO.id || t.tecnico_id === null);

    if (statusFilter !== 'todos') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(
        t =>
          t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
        if (sortBy === 'status') {
            const statusOrder = ['em andamento', 'pendente', 'concluído', 'aguardando aprovação'];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        // Ordena por data de criação de forma decrescente (mais recente primeiro)
        return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
    });
    return result;
  }, [chamados, searchTerm, statusFilter, sortBy]);


  return (
    <>
      <Header />
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Painel do Técnico</h1>
            <p className={styles.pageSubtitle}>Bem-vindo, <strong>{LOGGED_IN_TECNICO.nome}</strong>. Gerencie seus chamados aqui.</p>
          </div>
        </header>

        <div className={styles.filtersBar}>
            <div className={styles.searchBox}>
                <SearchIcon />
                <input 
                    type="text" 
                    placeholder="Buscar por título ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className={styles.filterGroup}>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="aguardando aprovação">Aguardando Aprovação</option>
                    <option value="concluído">Concluído</option>
                </select>
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="recentes">Ordenar por Mais Recentes</option>
                    <option value="status">Ordenar por Status</option>
                </select>
            </div>
        </div>

        <main className={styles.kanban}>
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const columnTickets = filteredAndSortedChamados.filter((c) => c.status === statusKey);
            const columnConfig = STATUS_CONFIG[statusKey];
            
            // Lógica para Paginação
            let limit;
            let setLimit;
            if (statusKey === 'pendente') { limit = pendenteLimit; setLimit = setPendenteLimit; }
            else if (statusKey === 'em andamento') { limit = emAndamentoLimit; setLimit = setEmAndamentoLimit; }
            else if (statusKey === 'concluído') { limit = concluidoLimit; setLimit = setConcluidoLimit; }
            
            const ticketsToDisplay = columnTickets.slice(0, limit);
            const hasMoreTickets = columnTickets.length > limit;

            return (
              <section key={statusKey} className={styles.kanbanColumn} aria-labelledby={`column-title-${statusKey}`}>
                <header className={styles.kanbanColumn__header} style={{'--status-color': columnConfig.color}}>
                  <h2 id={`column-title-${statusKey}`} className={styles.kanbanColumn__title}>{columnConfig.title}</h2>
                  <span className={styles.kanbanColumn__count}>{columnTickets.length}</span>
                </header>
                <div className={styles.kanbanColumn__ticketsList}>
                  {ticketsToDisplay.length > 0 ? (
                    ticketsToDisplay.map((ticket) => (
                      <TicketCard 
                        key={ticket.id} ticket={ticket} 
                        onOpenModal={handleOpenModal} onAtribuir={handleSelfAssign} onIniciar={handleStartProgress}
                      />
                    ))
                  ) : (
                    <div className={styles.kanbanColumn__empty}><p>Nenhum chamado aqui.</p></div>
                  )}
                  {hasMoreTickets && (
                    <button onClick={() => setLimit(prev => prev + 5)} className={styles.loadMoreButton}>
                      Ver mais ({columnTickets.length - limit})
                    </button>
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
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <header className={styles.modalHeader}>
                <div>
                  <span className={styles.modal__id}>#{selectedTicket.id}</span>
                  <h2 id="modal-title" className={styles.modalTitle}>{selectedTicket.titulo}</h2>
                </div>
              <button className={styles.modalCloseButton} onClick={handleCloseModal} aria-label="Fechar modal">&times;</button>
            </header>
            <main className={styles.modalBody}>
                <div className={styles.modalInfoGrid}>
                    <p><strong>Serviço:</strong> {initialServicos[selectedTicket.servicos_id]}</p>
                    <p><strong>Usuário:</strong> {initialUsuarios[selectedTicket.usuario_id]}</p>
                    <p><strong>Patrimônio:</strong> {initialPatrimonio[selectedTicket.patrimonio_id] || 'N/A'}</p>
                    <p><strong>Descrição:</strong> {selectedTicket.descricao}</p>
                    <p><strong>Status:</strong> <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[selectedTicket.status]?.color}}>{STATUS_CONFIG[selectedTicket.status]?.title}</span></p>
                </div>
              <hr className={styles.modalSeparator}/>
              <ModalContent 
                ticket={selectedTicket} 
                handleFinalizarChamado={handleFinalizarChamado} 
                handleSaveRelatorioParcial={handleSaveRelatorioParcial}
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