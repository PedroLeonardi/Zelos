'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import styles from './tecnico.module.css';
import Header from '../components/Header';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24" fill="currentColor" width="18" height="18"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>;

const STATUS_CONFIG = {
  'pendente': { title: 'Pendente', color: '#3b82f6' },
  'em andamento': { title: 'Em Andamento', color: '#f97316' },
  'aguardando aprovação': { title: 'Aguardando Aprovação', color: '#8b5cf6' }, // Novo status
  'concluído': { title: 'Concluído', color: '#16a34a' },
};

const TicketCard = ({ ticket, onOpenModal, onAtribuir, onIniciar, tecnicoId, servicos, usuarios, patrimonios }) => {
    const isPending = ticket.status === 'pendente';
    const isOwner = ticket.tecnico_id === tecnicoId;
    const isAwaitingApproval = ticket.status === 'aguardando aprovação';
  
    return (
      <article className={styles.ticketCard} tabIndex={0}>
        <header className={styles.ticketCard__header}>
          <span className={styles.ticketCard__id}>#{ticket.id}</span>
          <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[ticket.status]?.color}}>{STATUS_CONFIG[ticket.status]?.title}</span>
        </header>
        <h3 className={styles.ticketCard__title}>{ticket.titulo}</h3>
        <p className={styles.ticketCard__info}><strong>Serviço:</strong> {servicos[ticket.servicos_id] || 'Não encontrado'}</p>
        <p className={styles.ticketCard__info}><strong>Usuário:</strong> {usuarios[ticket.usuario_id] || 'Não encontrado'}</p>
        <p className={styles.ticketCard__info}><strong>Patrimônio:</strong> {patrimonios[ticket.patrimonio_id] || 'N/A'}</p>
  
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
          {!isAwaitingApproval && (
            <button className={`${styles.button} ${styles['button--secondary']}`} onClick={() => onOpenModal(ticket)}>
              Detalhes
            </button>
          )}
          {isAwaitingApproval && (
            <button className={`${styles.button} ${styles['button--secondary']}`} onClick={() => onOpenModal(ticket)}>
              Visualizar
            </button>
          )}
        </footer>
      </article>
    );
};
  
const ModalContent = ({ ticket, handleFinalizarChamado, handleCreateApontamento, apontamentoForm, handleApontamentoChange, apontamentos, tecnicoId }) => {
    if (!ticket) return null;
  
    const isOwner = ticket.tecnico_id === tecnicoId;
    const isInProgress = ticket.status === 'em andamento';
    const isAwaitingApproval = ticket.status === 'aguardando aprovação';

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    const formatDuration = (seconds) => {
        if (seconds === null || isNaN(seconds) || seconds < 0) return '';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [ h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : '' ].filter(Boolean).join(' ').trim();
    }
  
    if (isOwner && isInProgress) {
      return (
        <>
          <div className={styles.apontamentosList}>
            <h4>Histórico de Apontamentos</h4>
            {apontamentos.length > 0 ? (
              <ul>
                {apontamentos.map(ap => (
                  <li key={ap.id}>
                    <div className={styles.apontamentoHeader}>
                        <strong>{formatDateTime(ap.comeco)} - {formatDateTime(ap.fim)}</strong>
                        <span className={styles.durationBadge}>{formatDuration(ap.duracao)}</span>
                    </div>
                    <p>{ap.descricao}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.modalNotice}>Nenhum apontamento registrado para este chamado.</p>
            )}
          </div>
          <hr className={styles.modalSeparator}/>
          <form onSubmit={(e) => handleFinalizarChamado(e, ticket.id)} className={styles.reportForm}>
            <h4>Registrar Novo Trabalho / Finalizar</h4>
            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição do Serviço Realizado</label>
              <textarea name="descricao" value={apontamentoForm.descricao} onChange={handleApontamentoChange} required rows={4} placeholder="Descreva a atividade executada..."/>
            </div>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="comeco">Início do Trabalho</label>
                    <input type="datetime-local" name="comeco" value={apontamentoForm.comeco} onChange={handleApontamentoChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="fim">Fim do Trabalho</label>
                    <input type="datetime-local" name="fim" value={apontamentoForm.fim} onChange={handleApontamentoChange} required />
                </div>
            </div>
            <div className={styles.reportButtons}>
                <button type="button" className={`${styles.button} ${styles['button--secondary']}`} onClick={() => handleCreateApontamento(ticket.id)}>
                    Adicionar Apontamento
                </button>
                <button type="submit" className={`${styles.button} ${styles['button--primary']}`}>
                    Finalizar Chamado
                </button>
            </div>
            <p className={styles.reportNotice}>Para finalizar, a descrição acima será usada como relatório final.</p>
          </form>
        </>
      );
    }
    
    return (
      <section className={styles.reportDetails}>
        <h4>Relatório Final</h4>
        <p><strong>Descrição:</strong> {ticket.relatorio?.descricao || 'Nenhum relatório final preenchido.'}</p>
        <p className={styles.modalNotice}>
          <em>Este chamado está <strong>{ticket.status}</strong> e não pode mais receber apontamentos.</em>
        </p>
      </section>
    );
};

export default function TecnicoDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasters, setToasters] = useState([]);
  
  const [chamados, setChamados] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [apontamentos, setApontamentos] = useState([]);
  const [servicos, setServicos] = useState({});
  const [usuarios, setUsuarios] = useState({});
  const [patrimonios, setPatrimonios] = useState({});
  const [tecnicoInfo, setTecnicoInfo] = useState({ id: null, nome: 'Carregando...' });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recentes');
  const [apontamentoForm, setApontamentoForm] = useState({ descricao: '', comeco: '', fim: '' });

  const [pendenteLimit, setPendenteLimit] = useState(5);
  const [emAndamentoLimit, setEmAndamentoLimit] = useState(5);
  const [aguardandoAprovacaoLimit, setAguardandoAprovacaoLimit] = useState(5); // Novo limite
  const [concluidoLimit, setConcluidoLimit] = useState(5);

  const addToaster = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const fetchTecnicoData = async () => {
        const id = localStorage.getItem('id_usuario');
        if (!id) {
            setTecnicoInfo({ id: null, nome: 'Não logado' });
            addToaster('ID do usuário não encontrado. Faça login novamente.', 'error');
            setIsLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8080/user/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar dados dos usuários.');
            const usersData = await response.json();
            const tecnicoLogado = usersData.find(user => user.id === parseInt(id, 10));
            if (tecnicoLogado) {
                setTecnicoInfo({ id: tecnicoLogado.id, nome: tecnicoLogado.nome });
            } else {
                setTecnicoInfo({ id: null, nome: 'ID não encontrado' });
                addToaster('Técnico com o ID fornecido não foi encontrado.', 'error');
            }
        } catch (error) {
            console.error("Erro ao carregar dados do técnico:", error);
            addToaster(error.message, 'error');
            setTecnicoInfo({ id: null, nome: 'Erro ao carregar' });
        }
    };
    fetchTecnicoData();
  }, [addToaster]);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const [usersRes, servicesRes, patrimonioRes] = await Promise.all([
          fetch('http://localhost:8080/user/get'),
          fetch('http://localhost:8080/servico/get'),
          fetch('http://localhost:8080/patrimonio/get')
        ]);

        if (!usersRes.ok || !servicesRes.ok || !patrimonioRes.ok) {
          throw new Error('Falha ao carregar dados de suporte.');
        }

        const usersData = await usersRes.json();
        setUsuarios(usersData.reduce((acc, user) => ({ ...acc, [user.id]: user.nome }), {}));

        const servicesData = await servicesRes.json();
        setServicos(servicesData.mensagem.reduce((acc, service) => ({ ...acc, [service.id]: service.titulo }), {}));
        
        const patrimonioData = await patrimonioRes.json();
        setPatrimonios(patrimonioData.reduce((acc, item) => ({ ...acc, [item.id]: `${item.n_patrimonio} - ${item.categoria}` }), {}));

      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        addToaster(error.message, 'error');
      }
    };
    fetchSupportData();
  }, [addToaster]);

  useEffect(() => {
    if (!tecnicoInfo.id) return;

    const fetchChamados = async () => {
      setIsLoading(true);
      const postRequest = (body) => fetch('http://localhost:8080/chamados/getFilter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
      }).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
      });

      try {
        const [pendentes, meusChamados, aguardandoAprovacao] = await Promise.all([ // Adicionado
          postRequest({ key: "status", value: "pendente" }),
          postRequest({ key: "tecnico_id", value: String(tecnicoInfo.id) }),
          postRequest({ key: "status", value: "aguardando aprovação" }), // Chamados aguardando aprovação
        ]);
        const allChamados = [...(pendentes || []), ...(meusChamados || []), ...(aguardandoAprovacao || [])]; // Concatenar
        const uniqueChamados = Array.from(new Map(allChamados.map(c => [c.id, c])).values());
        setChamados(uniqueChamados);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        addToaster('Não foi possível carregar os chamados.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchChamados();
  }, [tecnicoInfo.id, addToaster]);

  const updateChamadoStatus = async (ticketId, newStatus, extraData = {}) => {
    try {
        const response = await fetch(`http://localhost:8080/chamados/respond/${tecnicoInfo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chamado_id: ticketId, status: newStatus, ...extraData }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erro do servidor: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error(`Erro ao atualizar status do chamado #${ticketId}:`, error);
        addToaster(error.message || 'Falha na comunicação com o servidor.', 'error');
        return false;
    }
  };

  const handleSelfAssign = async (ticketId) => {
    try {
      const assignResponse = await fetch(`http://localhost:8080/chamados/atribuir/${tecnicoInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chamado_id: ticketId }),
      });
      if (!assignResponse.ok) {
        const errorData = await assignResponse.json().catch(() => ({ message: 'Falha ao atribuir o chamado.' }));
        throw new Error(errorData.message);
      }
      const statusUpdateSuccessful = await updateChamadoStatus(ticketId, 'em andamento');
      if (statusUpdateSuccessful) {
        setChamados(prev => prev.map(t => t.id === ticketId ? { ...t, tecnico_id: tecnicoInfo.id, status: 'em andamento' } : t));
        addToaster(`Chamado #${ticketId} atribuído e iniciado!`, 'success');
      } else {
        throw new Error('Chamado atribuído, mas falha ao iniciar o atendimento.');
      }
    } catch (error) {
      console.error("Erro no processo de auto-atribuição:", error);
      addToaster(error.message, 'error');
    }
  };
  
  const handleStartProgress = async (ticketId) => {
    const success = await updateChamadoStatus(ticketId, 'em andamento');
    if (success) {
        setChamados(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'em andamento' } : t));
        addToaster(`Chamado #${ticketId} iniciado com sucesso!`, 'info');
    }
  };

  const fetchApontamentos = async (ticketId) => {
    try {
        const response = await fetch('http://localhost:8080/apontamentos/getFilter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: "chamado_id", value: String(ticketId) }),
        });
        if (!response.ok) throw new Error('Falha ao buscar apontamentos.');
        const data = await response.json();
        setApontamentos(data || []);
    } catch (error) {
        console.error("Erro ao buscar apontamentos:", error);
        addToaster(error.message, 'error');
    }
  };

  const handleCreateApontamento = async (ticketId) => {
    const { descricao, comeco, fim } = apontamentoForm;
    if (!descricao.trim() || !comeco || !fim) {
        addToaster('Preencha descrição, início e fim para criar um apontamento.', 'error');
        return;
    }
    if (new Date(fim) <= new Date(comeco)) {
        addToaster('A data de fim deve ser posterior à data de início.', 'error');
        return;
    }
    try {
        const response = await fetch('http://localhost:8080/apontamentos/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chamado_id: ticketId, tecnico_id: tecnicoInfo.id, descricao, comeco, fim }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.mensagem || 'Falha ao criar apontamento.');
        }
        addToaster('Apontamento adicionado com sucesso!', 'success');
        setApontamentoForm({ descricao: '', comeco: '', fim: '' });
        fetchApontamentos(ticketId);
    } catch (error) {
        console.error("Erro ao criar apontamento:", error);
        addToaster(error.message, 'error');
    }
  };

  const handleFinalizarChamado = async (e, ticketId) => {
    e.preventDefault();
    if (!apontamentoForm.descricao.trim()) {
      addToaster('A descrição é obrigatória para finalizar o chamado.', 'error');
      return;
    }
    const relatorioData = { relatorio: { descricao: apontamentoForm.descricao } };
    const success = await updateChamadoStatus(ticketId, 'aguardando aprovação', relatorioData); // Novo status aqui
    if (success) {
        setChamados(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'aguardando aprovação', ...relatorioData } : t)); // Atualiza para "aguardando aprovação"
        addToaster(`Chamado #${ticketId} enviado para aprovação!`, 'success');
        handleCloseModal();
    }
  };

  const handleApontamentoChange = (e) => {
    setApontamentoForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    if (ticket.status === 'em andamento') {
        fetchApontamentos(ticket.id);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setApontamentos([]);
    setApontamentoForm({ descricao: '', comeco: '', fim: '' });
    setTimeout(() => setSelectedTicket(null), 300);
  };

  const filteredAndSortedChamados = useMemo(() => {
    if (!tecnicoInfo.id) return [];
    
    let result = chamados.filter(t => t.tecnico_id === tecnicoInfo.id || t.tecnico_id === null || t.status === 'aguardando aprovação'); // Incluir 'aguardando aprovação' para todos os técnicos
    
    if (statusFilter !== 'todos') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(t => 
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.id.toString().includes(searchTerm)
      );
    }
    result.sort((a, b) => {
        const statusOrder = ['em andamento', 'pendente', 'aguardando aprovação', 'concluído']; // Atualiza a ordem de status
        if (sortBy === 'status') {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        return new Date(b.criado_em) - new Date(a.criado_em);
    });
    return result;
  }, [chamados, searchTerm, statusFilter, sortBy, tecnicoInfo.id]);


  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingState}><h2>Carregando...</h2></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Painel do Técnico</h1>
            <p className={styles.pageSubtitle}>Bem-vindo, <strong>{tecnicoInfo.nome}</strong>. Gerencie seus chamados aqui.</p>
          </div>
        </header>

        <div className={styles.filtersBar}>
            <div className={styles.searchBox}>
                <SearchIcon />
                <input type="text" placeholder="Buscar por título ou ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className={styles.filterGroup}>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="aguardando aprovação">Aguardando Aprovação</option> {/* Novo filtro */}
                    <option value="concluído">Concluído</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="recentes">Ordenar por Mais Recentes</option>
                    <option value="status">Ordenar por Status</option>
                </select>
            </div>
        </div>

        <main className={styles.kanban}>
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const columnTickets = filteredAndSortedChamados.filter((c) => c.status === statusKey);
            const columnConfig = STATUS_CONFIG[statusKey];
            let limit, setLimit;
            if (statusKey === 'pendente') { limit = pendenteLimit; setLimit = setPendenteLimit; }
            else if (statusKey === 'em andamento') { limit = emAndamentoLimit; setLimit = setEmAndamentoLimit; }
            else if (statusKey === 'aguardando aprovação') { limit = aguardandoAprovacaoLimit; setLimit = setAguardandoAprovacaoLimit; } // Novo limite
            else if (statusKey === 'concluído') { limit = concluidoLimit; setLimit = setConcluidoLimit; }
            const ticketsToDisplay = limit ? columnTickets.slice(0, limit) : columnTickets;
            const hasMoreTickets = limit && columnTickets.length > limit;

            if (statusFilter !== 'todos' && statusFilter !== statusKey) return null;

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
                        key={ticket.id} 
                        ticket={ticket} 
                        onOpenModal={handleOpenModal} 
                        onAtribuir={handleSelfAssign} 
                        onIniciar={handleStartProgress} 
                        tecnicoId={tecnicoInfo.id}
                        servicos={servicos}
                        usuarios={usuarios}
                        patrimonios={patrimonios}
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
                    <p><strong>Serviço:</strong> {servicos[selectedTicket.servicos_id] || 'N/A'}</p>
                    <p><strong>Usuário:</strong> {usuarios[selectedTicket.usuario_id] || 'N/A'}</p>
                    <p><strong>Patrimônio:</strong> {patrimonios[selectedTicket.patrimonio_id] || 'N/A'}</p>
                    <p><strong>Descrição Inicial:</strong> {selectedTicket.descricao}</p>
                    <p><strong>Status:</strong> <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[selectedTicket.status]?.color}}>{STATUS_CONFIG[selectedTicket.status]?.title}</span></p>
                </div>
              <hr className={styles.modalSeparator}/>
              <ModalContent 
                ticket={selectedTicket} 
                handleFinalizarChamado={handleFinalizarChamado} 
                handleCreateApontamento={handleCreateApontamento}
                apontamentoForm={apontamentoForm} 
                handleApontamentoChange={handleApontamentoChange}
                apontamentos={apontamentos}
                tecnicoId={tecnicoInfo.id}
              />
            </main>
          </div>
        </div>
      )}

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