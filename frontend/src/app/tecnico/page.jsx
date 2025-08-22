'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './tecnico.module.css';
import Header from '../components/Header'; // <-- Lembre-se de ter este componente

// --- ÍCONES SVG (sem alterações) ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24" fill="currentColor" width="18" height="18"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>;

// --- CONFIGURAÇÕES VISUAIS (sem alterações) ---
const STATUS_CONFIG = {
  'pendente': { title: 'Pendente', color: '#3b82f6' },
  'em andamento': { title: 'Em Andamento', color: '#f97316' },
  'concluído': { title: 'Concluído', color: '#16a34a' },
};


// --- COMPONENTES INTERNOS ---
const TicketCard = ({ ticket, onOpenModal, onAtribuir, onIniciar, servicos, usuarios, patrimonios, loggedInTecnico }) => {
    const isPending = ticket.status === 'pendente';
    const isOwner = ticket.tecnico_id === loggedInTecnico.id;
  
    return (
      <article className={styles.ticketCard} tabIndex={0}>
        <header className={styles.ticketCard__header}>
          <span className={styles.ticketCard__id}>#{ticket.id}</span>
          <span className={styles.statusBadge} style={{'--status-color': STATUS_CONFIG[ticket.status]?.color}}>{STATUS_CONFIG[ticket.status]?.title}</span>
        </header>
        <h3 className={styles.ticketCard__title}>{ticket.titulo}</h3>
        {/* DADOS DINÂMICOS */}
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
          <button className={`${styles.button} ${styles['button--secondary']}`} onClick={() => onOpenModal(ticket)}>
            Detalhes
          </button>
        </footer>
      </article>
    );
};
  
const ModalContent = ({ ticket, handleFinalizarChamado, handleCreateApontamento, apontamentoForm, handleApontamentoChange, apontamentos, loggedInTecnico }) => {
    if (!ticket) return null;
  
    const isOwner = ticket.tecnico_id === loggedInTecnico.id;
    const isInProgress = ticket.status === 'em andamento';

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

// --- PÁGINA PRINCIPAL ---
export default function TecnicoDashboard() {
  // --- ESTADOS DO COMPONENTE ---
  const [chamados, setChamados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toasters, setToasters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recentes');
  const [pendenteLimit, setPendenteLimit] = useState(5);
  const [emAndamentoLimit, setEmAndamentoLimit] = useState(5);
  const [concluidoLimit, setConcluidoLimit] = useState(5);
  const [apontamentos, setApontamentos] = useState([]);
  const [apontamentoForm, setApontamentoForm] = useState({ descricao: '', comeco: '', fim: '' });
  
  // --- MUDANÇA 1: ESTADOS PARA DADOS DA API ---
  const [servicos, setServicos] = useState({});
  const [usuarios, setUsuarios] = useState({});
  const [patrimonios, setPatrimonios] = useState({});

  // --- MUDANÇA 2: LÓGICA DE AUTENTICAÇÃO SIMPLIFICADA ---
  // Lê os dados do técnico diretamente do localStorage (salvos no login)
  const [loggedInTecnico, setLoggedInTecnico] = useState({ id: null, nome: 'Carregando...' });

  useEffect(() => {
    // Esta função roda apenas no navegador
    const id = localStorage.getItem('id');
    const nome = localStorage.getItem('username'); // Nome formatado salvo pelo Header
    if (id && nome) {
      setLoggedInTecnico({ id: parseInt(id, 10), nome });
    } else {
      addToaster('Falha ao verificar autenticação. Faça login novamente.', 'error');
    }
  }, []);

  // --- MUDANÇA 3: BUSCANDO DADOS DE USUÁRIOS, SERVIÇOS E PATRIMÔNIOS ---
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

        // Processa usuários: [{id, nome}] -> {id: nome}
        const usersData = await usersRes.json();
        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user.nome;
          return acc;
        }, {});
        setUsuarios(usersMap);

        // Processa serviços: {mensagem: [{id, titulo}]} -> {id: titulo}
        const servicesData = await servicesRes.json();
        const servicesMap = servicesData.mensagem.reduce((acc, service) => {
          acc[service.id] = service.titulo;
          return acc;
        }, {});
        setServicos(servicesMap);

        // Processa patrimônios: [{id, categoria, descricao}] -> {id: "categoria - descricao"}
        const patrimonioData = await patrimonioRes.json();
        const patrimonioMap = patrimonioData.reduce((acc, item) => {
          acc[item.id] = `${item.categoria} - ${item.descricao}`;
          return acc;
        }, {});
        setPatrimonios(patrimonioMap);

      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        addToaster(error.message, 'error');
      }
    };
    fetchSupportData();
  }, []);


  // --- MUDANÇA 4: BUSCAR CHAMADOS APENAS QUANDO O ID DO TÉCNICO ESTIVER DISPONÍVEL ---
  useEffect(() => {
    if (!loggedInTecnico.id) return; // Não faz nada se o ID ainda não foi carregado

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
        const [pendentes, meusChamados] = await Promise.all([
          postRequest({ key: "status", value: "pendente" }),
          postRequest({ key: "tecnico_id", value: String(loggedInTecnico.id) }) // Usa o ID do estado
        ]);
        const allChamados = [...pendentes, ...meusChamados];
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
  }, [loggedInTecnico.id]); // Dependência: Roda de novo se o ID do técnico mudar

  
  // --- FUNÇÕES DE LÓGICA (maioria sem alterações, apenas usando loggedInTecnico do estado) ---
  const addToaster = (message, type = 'success') => {
    const id = Date.now();
    setToasters(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasters(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const updateChamadoStatus = async (ticketId, newStatus, extraData = {}) => {
    try {
        const response = await fetch(`http://localhost:8080/chamados/respond/${loggedInTecnico.id}`, {
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
      const assignResponse = await fetch(`http://localhost:8080/chamados/atribuir/${loggedInTecnico.id}`, {
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
        setChamados(prev => prev.map(t => t.id === ticketId ? { ...t, tecnico_id: loggedInTecnico.id, status: 'em andamento' } : t));
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
        setApontamentos(data);
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
            body: JSON.stringify({ chamado_id: ticketId, tecnico_id: loggedInTecnico.id, descricao, comeco, fim }),
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

  const handleApontamentoChange = (e) => {
    const { name, value } = e.target;
    setApontamentoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalizarChamado = async (e, ticketId) => {
    e.preventDefault();
    if (!apontamentoForm.descricao.trim()) {
      addToaster('A descrição é obrigatória para finalizar o chamado.', 'error');
      return;
    }

    const relatorioData = { relatorio: { descricao: apontamentoForm.descricao } };
    const success = await updateChamadoStatus(ticketId, 'concluído', relatorioData);

    if (success) {
        setChamados(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'concluído', ...relatorioData } : t));
        addToaster(`Chamado #${ticketId} finalizado!`, 'success');
        handleCloseModal();
    }
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
    if (!loggedInTecnico.id) return [];
    
    let result = chamados.filter(t => t.tecnico_id === loggedInTecnico.id || t.tecnico_id === null);

    if (statusFilter !== 'todos') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(t => t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    }
    result.sort((a, b) => {
        if (sortBy === 'status') {
            const statusOrder = ['em andamento', 'pendente', 'concluído'];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        return new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
    });
    return result;
  }, [chamados, searchTerm, statusFilter, sortBy, loggedInTecnico.id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingState}><h2>Carregando chamados...</h2></div>
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
            <p className={styles.pageSubtitle}>Bem-vindo, <strong>{loggedInTecnico.nome}</strong>. Gerencie seus chamados aqui.</p>
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
                      <TicketCard key={ticket.id} ticket={ticket} onOpenModal={handleOpenModal} onAtribuir={handleSelfAssign} onIniciar={handleStartProgress} servicos={servicos} usuarios={usuarios} patrimonios={patrimonios} loggedInTecnico={loggedInTecnico} />
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
                    <p><strong>Serviço:</strong> {servicos[selectedTicket.servicos_id]}</p>
                    <p><strong>Usuário:</strong> {usuarios[selectedTicket.usuario_id]}</p>
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
                loggedInTecnico={loggedInTecnico}
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