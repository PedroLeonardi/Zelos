'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiChevronUp, FiChevronDown, FiX, FiUsers, FiClipboard, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import styles from './admin.module.css';
import Header from '../components/Header'; // Mantém o Header como um componente externo

// --- DADOS GLOBAIS ---

// MODIFICADO: Lista de serviços atualizada para corresponder ao seu banco de dados
const servicosDisponiveis = [
    { id: 1, nome: 'Manutenção' },
    { id: 2, nome: 'Apoio Técnico' },
    { id: 3, nome: 'Limpeza' },
    { id: 4, nome: 'Externo' },
];

const STATUS_OPCOES = ['pendente', 'em andamento', 'aguardando aprovação', 'concluído', 'inativo'];
const ITEMS_PER_PAGE = 5;
const FUNCOES = ['Administrador', 'Técnico', 'Usuário'];

// --- FUNÇÕES E COMPONENTES AUXILIARES ---
function usePagination(items, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }
  }, [items.length, totalPages, currentPage]);

  return { paginatedItems, currentPage, setCurrentPage, totalPages };
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={currentPage === page ? styles.activePage : ''}>
          {page}
        </button>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, type = 'default' }) => (
  <div className={`${styles.statsCard} ${styles[type]}`}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('chamados');
  const [chamados, setChamados] = useState([]); 
  const [usuarios, setUsuarios] = useState([]);

  const TABS = {
    chamados: <GerenciamentoChamados chamados={chamados} setChamados={setChamados} usuarios={usuarios} />,
    usuarios: <GerenciamentoUsuarios usuarios={usuarios} setUsuarios={setUsuarios} />,
    relatorios: <RelatoriosView chamados={chamados} setChamados={setChamados} />,
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ className: styles.toast, style: { background: '#333', color: '#fff' } }}/>
      
      <div className={styles.dashboardContainer}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Painel Administrativo</h1>
            <p className={styles.pageSubtitle}>Gerencie chamados, usuários e visualize relatórios de desempenho.</p>
          </div>
        </header>

        <nav className={styles.tabs}>
          <button onClick={() => setActiveTab('chamados')} className={activeTab === 'chamados' ? styles.activeTab : ''}><FiClipboard/> Gerenciar Chamados</button>
          <button onClick={() => setActiveTab('usuarios')} className={activeTab === 'usuarios' ? styles.activeTab : ''}><FiUsers/> Gerenciar Usuários</button>
          <button onClick={() => setActiveTab('relatorios')} className={activeTab === 'relatorios' ? styles.activeTab : ''}><FiBarChart2/> Relatórios</button>
        </nav>

        <main className={styles.mainContent}>
          {TABS[activeTab]}
        </main>
      </div>
    </>
  );
}

// --- 1. GERENCIAMENTO DE CHAMADOS ---
const ChamadoStats = ({ chamados }) => {
    const stats = useMemo(() => ({
        total: chamados.filter(c => c.status !== 'inativo').length,
        pendente: chamados.filter(c => c.status === 'pendente').length,
        emAndamento: chamados.filter(c => c.status === 'em andamento').length,
        concluido: chamados.filter(c => c.status === 'concluído').length,
        aguardandoAprovacao: chamados.filter(c => c.status === 'aguardando aprovação').length,
    }), [chamados]);

    return (
        <section className={styles.statsGrid}>
            <StatCard title="Total de Chamados" value={stats.total} />
            <StatCard title="Pendentes" value={stats.pendente} type="pending" />
            <StatCard title="Em Andamento" value={stats.emAndamento} type="inProgress" />
            <StatCard title="Aguardando Aprovação" value={stats.aguardandoAprovacao} type="approved" />
            <StatCard title="Concluídos" value={stats.concluido} type="completed" />
        </section>
    );
};

const ChamadoHeader = ({ searchTerm, setSearchTerm, openModal }) => (
    <div className={styles.reportHeader}>
        <h2>Relatório de Chamados</h2>
        <div className={styles.controlsContainer}>
            <div className={styles.searchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Buscar por ID, Título, Técnico, Solicitante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <button onClick={() => openModal()} className={styles.addButton}>
                <FiPlus /> Adicionar Chamado
            </button>
        </div>
    </div>
);

const ChamadoFilters = ({ statusFilter, setStatusFilter }) => (
    <div className={styles.filters}>
        {['todos', ...STATUS_OPCOES].map(f => (
            <button 
                key={f} 
                onClick={() => setStatusFilter(f)} 
                className={statusFilter === f ? styles.activeFilter : ''}
            >
                {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
        ))}
    </div>
);

const ChamadoTable = ({ 
    paginatedChamados, 
    handleSort, 
    sortConfig, 
    openModal, 
    handleDeleteChamado 
}) => (
    <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.headerRow}`}>
            <span onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('titulo')}>Título {sortConfig.key === 'titulo' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('numero_patrimonio')}>Patrimônio {sortConfig.key === 'numero_patrimonio' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('tecnico_nome')}>Técnico {sortConfig.key === 'tecnico_nome' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('solicitante_nome')}>Solicitante {sortConfig.key === 'solicitante_nome' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span>Ações</span>
        </div>
        {paginatedChamados.map(c => {
            const statusClassName = c.status
                .replace(/\s+/g, '')
                .replace('çã', 'ca');

            return (
                <div className={styles.tableRow} key={c.id}>
                    <span data-label="ID" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <strong>#{c.id}</strong>
                        <small>{new Date(c.criado_em).toLocaleDateString()}</small>
                    </span>
                    <span data-label="Título">{c.titulo}</span>
                    <span data-label="Patrimônio">{c.numero_patrimonio || 'Não Associado'}</span>
                    <span data-label="Técnico">{c.tecnico_nome || 'Não Atribuído'}</span>
                    <span data-label="Solicitante">{c.solicitante_nome}</span>
                    <span data-label="Status">
                        <div className={`${styles.statusTag} ${styles[statusClassName]}`}>
                            {c.status}
                        </div>
                    </span>
                    <div data-label="Ações" className={styles.actions}>
                        <button onClick={() => openModal(c)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                        <button onClick={() => handleDeleteChamado(c.id)} className={styles.closeButton} aria-label="Inativar"><FiTrash2 /></button>
                    </div>
                </div>
            );
        })}
    </div>
);

function GerenciamentoChamados({ chamados, setChamados, usuarios }) {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'criado_em', direction: 'descending' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState(null);
  const [chamadoParaInativar, setChamadoParaInativar] = useState(null);

  const fetchChamados = useCallback(async () => {
    try {
        const response = await fetch('http://localhost:8080/relatorio/get');
        if (!response.ok) throw new Error('Falha ao buscar os chamados.');
        
        const data = await response.json();
        const chamadosDaApi = data.mensagem || [];

        const chamadosMapeados = chamadosDaApi.map(chamado => ({
            id: chamado.chamado_id,
            titulo: chamado.chamado_titulo,
            descricao: chamado.descricao,
            patrimonio_id: chamado.patrimonio_id,
            numero_patrimonio: chamado.numero_patrimonio,
            servicos_id: chamado.servicos_id,
            tecnico_id: chamado.tecnico_id,
            tecnico_nome: chamado.tecnico_nome,
            usuario_id: chamado.solicitante_id,
            solicitante_nome: chamado.solicitante_nome,
            status: chamado.chamado_status,
            criado_em: chamado.data_criacao,
          }));

        setChamados(chamadosMapeados);
    } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        toast.error(error.message);
    }
  }, [setChamados]);

  useEffect(() => {
    fetchChamados().then(() => toast.success("Relatório de chamados carregado!"));
  }, [fetchChamados]);

  // CORRIGIDO: Filtro de técnicos agora é case-insensitive
  const tecnicos = useMemo(() => 
    usuarios.filter(u => 
        u.funcao.toLowerCase().includes('técnico') || 
        u.funcao.toLowerCase().includes('administrador')
    ), [usuarios]);

  const filteredAndSortedChamados = useMemo(() => {
    let items = [...chamados];
    if (statusFilter !== 'todos') {
      items = items.filter(c => c.status === statusFilter);
    }
    if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        items = items.filter(c => 
            c.titulo.toLowerCase().includes(lowercasedFilter) || 
            String(c.id).toLowerCase().includes(lowercasedFilter) || 
            (c.solicitante_nome || '').toLowerCase().includes(lowercasedFilter) ||
            (c.tecnico_nome || '').toLowerCase().includes(lowercasedFilter) ||
            (c.numero_patrimonio || '').toLowerCase().includes(lowercasedFilter)
        );
    }
    if (sortConfig.key) { /* ... (código de ordenação) ... */ }
    return items;
  }, [chamados, statusFilter, searchTerm, sortConfig]);

  const { paginatedItems: paginatedChamados, currentPage, setCurrentPage, totalPages } = usePagination(filteredAndSortedChamados, ITEMS_PER_PAGE);

  const handleSort = (key) => { /* ... */ };
  
  const openModal = (chamado = null) => { setEditingChamado(chamado); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingChamado(null); };

  const handleSaveChamado = async (formData) => {
    // Validação do ID de patrimônio
    if (formData.patrimonio_id) {
        const patrimonioEmUso = chamados.find(c => 
            c.patrimonio_id === parseInt(formData.patrimonio_id) && 
            c.id !== editingChamado?.id && // Ignora o próprio chamado que está sendo editado
            c.status !== 'concluído' && 
            c.status !== 'inativo'
        );

        if (patrimonioEmUso) {
            toast.error(`Patrimônio já está em uso no chamado #${patrimonioEmUso.id}.`);
            return;
        }
    }

    if (editingChamado) {
        const dadosParaAtualizar = { ...editingChamado, ...formData };
        
        try {
            const response = await fetch(`http://localhost:8080/chamados/put`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaAtualizar),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Falha ao atualizar o chamado.');
            }
            toast.success('Chamado atualizado com sucesso!');
            closeModal();
            fetchChamados();
        } catch (error) {
            console.error("Erro ao atualizar chamado:", error);
            toast.error(`Erro: ${error.message}`);
        }
    } else {
        toast.error("Funcionalidade de adicionar novo chamado ainda não conectada à API.");
        closeModal();
    }
  };
  
  const handleInativarClick = (id) => {
    const chamado = chamados.find(c => c.id === id);
    setChamadoParaInativar(chamado);
  };
  
  const confirmInativar = async () => {
    if (!chamadoParaInativar) return;

    const dadosParaAtualizar = {
      ...chamadoParaInativar,
      status: 'inativo'
    };

    try {
      const response = await fetch(`http://localhost:8080/chamados/put`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaAtualizar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Falha ao inativar o chamado.');
      }
      
      toast.success('Chamado inativado com sucesso!');
      setChamadoParaInativar(null);
      fetchChamados();

    } catch (error) {
      console.error("Erro ao inativar chamado:", error);
      toast.error(`Erro: ${error.message}`);
      setChamadoParaInativar(null);
    }
  };

  return (
    <>
      <ChamadoStats chamados={chamados} />
      <section className={styles.reportSection}>
        <ChamadoHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openModal={openModal}
        />
        <ChamadoFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
        />
        <ChamadoTable
            paginatedChamados={paginatedChamados}
            handleSort={handleSort}
            sortConfig={sortConfig}
            openModal={openModal}
            handleDeleteChamado={handleInativarClick}
        />
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        
        {isModalOpen && <ChamadoModal 
          chamado={editingChamado} 
          onClose={closeModal} 
          onSave={handleSaveChamado} 
          tecnicos={tecnicos} 
          usuarios={usuarios} 
          servicos={servicosDisponiveis} // MODIFICADO: Passando a nova lista de serviços
        />}

        {chamadoParaInativar && (
          <ConfirmModal
            title="Inativar Chamado"
            message={`Tem certeza que deseja inativar o chamado #${chamadoParaInativar.id}?`}
            onConfirm={confirmInativar}
            onCancel={() => setChamadoParaInativar(null)}
          />
        )}
      </section>
    </>
  );
}

// --- 2. GERENCIAMENTO DE USUÁRIOS ---
function GerenciamentoUsuarios({ usuarios, setUsuarios }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/user/get');
            if (!response.ok) throw new Error('Erro ao buscar dados dos usuários');
            const data = await response.json();
            setUsuarios(data || []);
        } catch (error) {
            console.error("Falha na busca por usuários: ", error);
            toast.error("Não foi possível carregar os usuários.");
        }
    }, [setUsuarios]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const filteredUsuarios = useMemo(() => {
        if (!Array.isArray(usuarios)) return [];
        return usuarios.filter(u => 
            u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [usuarios, searchTerm]);
    
    const { paginatedItems: paginatedUsuarios, currentPage, setCurrentPage, totalPages } = usePagination(filteredUsuarios, ITEMS_PER_PAGE);

    const openModal = (usuario) => { 
        setEditingUsuario(usuario); 
        setIsModalOpen(true); 
    };
    const closeModal = () => { 
        setIsModalOpen(false); 
        setEditingUsuario(null); 
    };

    const handleSaveUsuario = async (formData) => {
        if (editingUsuario) {
            try {
                const response = await fetch('http://localhost:8080/user/put', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                console.log(formData)
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensagem || 'Falha ao atualizar o usuário.');
                }
                toast.success("Usuário atualizado com sucesso!");
                closeModal();
                fetchUsuarios();
            } catch (error) {
                console.error("Erro ao atualizar usuário:", error);
                toast.error(`Erro: ${error.message}`);
            }
        }
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}>
                <h2>Todos os Usuários ({usuarios.length})</h2> 
                 <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input type="text" placeholder="Buscar por Nome ou Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
                    </div>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}>
                    <span>Nome</span><span>Email</span><span>Função</span><span>Status</span><span>Ações</span>
                </div>
                {paginatedUsuarios.map(u => (
                    <div className={styles.tableRow} key={u.id}>
                        <span data-label="Nome"><strong>{u.nome}</strong></span>
                        <span data-label="Email">{u.email}</span>
                        <span data-label="Função">{u.funcao}</span>
                        <span data-label="Status"><div className={u.status === 'ativo' ? styles.statusActive : styles.statusInactive}>{u.status}</div></span>
                        <div data-label="Ações" className={styles.actions}>
                            <button onClick={() => openModal(u)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {isModalOpen && <UsuarioModal usuario={editingUsuario} onClose={closeModal} onSave={handleSaveUsuario}/>}
        </section>
    );
}
//-----------------------------------------------------------------------------------------------------------------------------------------
// --- 3. GERENCIAMENTO DE RELATÓRIOS (ANOTAÇÕES) ---
function RelatoriosView({ chamados, setChamados }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChamado, setEditingChamado] = useState(null);

    const filteredChamados = useMemo(() => {
        return chamados.filter(c =>
            (c.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(c.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [chamados, searchTerm]);

    const { paginatedItems: paginatedChamados, currentPage, setCurrentPage, totalPages } = usePagination(filteredChamados, ITEMS_PER_PAGE);

    const handleOpenModal = (chamado = null) => {
        setEditingChamado(chamado);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingChamado(null);
    };

    const handleSaveAnotacao = (formData) => {
      setChamados(prevChamados => prevChamados.map(chamado => 
        chamado.id === parseInt(formData.chamado_id)
          ? { ...chamado, descricao: formData.conteudo }
          : chamado
      ));
      toast.success('Anotação salva com sucesso!');
      handleCloseModal();
    };

    const handleDeleteAnotacao = (chamadoId) => {
        if (window.confirm('Tem certeza que deseja limpar a descrição deste chamado? A ação não pode ser desfeita.')) {
            setChamados(prevChamados => prevChamados.map(chamado => 
                chamado.id === chamadoId
                  ? { ...chamado, descricao: '' }
                  : chamado
            ));
            toast('Anotação excluída!', { icon: '🗑️' });
        }
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}>
                <h2>Anotações dos Chamados</h2>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por Título, ID ou Conteúdo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className={styles.addButton}>
                        <FiPlus /> Adicionar Anotação
                    </button>
                </div>
            </div>
            
            <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}>
                    <span>ID do Chamado</span>
                    <span>Título do Chamado</span>
                    <span>Conteúdo (Descrição)</span>
                    <span>Ações</span>
                </div>
                {paginatedChamados.map(chamado => (
                    <div className={styles.tableRow} key={chamado.id}>
                        <span data-label="ID do Chamado"><strong>#{chamado.id}</strong></span>
                        <span data-label="Título do Chamado">{chamado.titulo}</span>
                        <span data-label="Conteúdo" className={styles.relatorioContent}>{chamado.descricao}</span>
                        <div data-label="Ações" className={styles.actions}>
                            <button onClick={() => handleOpenModal(chamado)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                            <button onClick={() => handleDeleteAnotacao(chamado.id)} className={styles.closeButton} aria-label="Excluir"><FiTrash2 /></button>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            
            {isModalOpen && <RelatorioModal relatorio={editingChamado} onClose={handleCloseModal} onSave={handleSaveAnotacao} chamados={chamados} />}
        </section>
    );
}

// --- MODAIS ---
function ChamadoModal({ chamado, onClose, onSave, tecnicos, usuarios, servicos }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    patrimonio_id: '',
    servicos_id: '',
    tecnico_id: '',
    usuario_id: '',
    status: 'pendente',
  });

  useEffect(() => {
    if (chamado) {
      setFormData({
        titulo: chamado.titulo || '',
        descricao: chamado.descricao || '',
        patrimonio_id: chamado.patrimonio_id || '',
        servicos_id: chamado.servicos_id || '',
        tecnico_id: chamado.tecnico_id || '',
        usuario_id: chamado.usuario_id || '',
        status: chamado.status || 'pendente',
      });
    }
  }, [chamado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.servicos_id || !formData.usuario_id) {
      toast.error('Título, Tipo de Serviço e Usuário Solicitante são obrigatórios!');
      return;
    }
    onSave(formData);
  };
  
  useEffect(() => {
    const handleEsc = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}><h2>{chamado ? 'Editar Chamado' : 'Criar Novo Chamado'}</h2><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}><label htmlFor="titulo">Título do Chamado</label><input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required autoFocus /></div>
            <div className={styles.formGroup}><label htmlFor="descricao">Descrição do Problema</label><textarea id="descricao" name="descricao" rows="4" value={formData.descricao} onChange={handleChange}></textarea></div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}><label htmlFor="patrimonio_id">ID do Patrimônio (Opcional)</label><input type="text" id="patrimonio_id" name="patrimonio_id" value={formData.patrimonio_id || ''} onChange={handleChange} /></div>
              <div className={styles.formGroup}><label htmlFor="servicos_id">Tipo de Serviço</label><select id="servicos_id" name="servicos_id" value={formData.servicos_id} onChange={handleChange} required><option value="">Selecione...</option>{servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                  <label htmlFor="usuario_id">Usuário Solicitante</label>
                  <select 
                      id="usuario_id" 
                      name="usuario_id" 
                      value={formData.usuario_id} 
                      onChange={handleChange} 
                      required
                      disabled={!!chamado}
                  >
                      <option value="">Selecione...</option>
                      {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                  </select>
              </div>
              <div className={styles.formGroup}>
                  <label htmlFor="tecnico_id">Atribuir a</label>
                  <select id="tecnico_id" name="tecnico_id" value={formData.tecnico_id || ''} onChange={handleChange}>
                      <option value="">Não Atribuído</option>
                      {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
              </div>
            </div>
            {chamado && (
              <div className={styles.formGroup}><label htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange}>{STATUS_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            )}
          </div>
          <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button><button type="submit" className={styles.saveButton}>Salvar Chamado</button></div>
        </form>
      </div>
    </div>
  );
}

function UsuarioModal({ usuario, onClose, onSave }) {
    const [formData, setFormData] = useState({
        id_login: usuario?.id_login || '',
        nome: usuario?.nome || '',
        email: usuario?.email || '',
        funcao: usuario?.funcao || 'Usuário',
        status: usuario?.status || 'ativo',
    });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    useEffect(() => {
      const handleEsc = (event) => { if (event.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}><h2>Editar Usuário</h2><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div>
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="id_login">ID</label>
                    <input type="text" id="id_login" name="id_login" value={formData.id_login} disabled />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="nome">Nome Completo</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} disabled />
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} disabled />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="funcao">Função</label>
                    <select id="funcao" name="funcao" value={formData.funcao} onChange={handleChange} autoFocus>
                        {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
            </div>
            <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                 </div>
            </div>
          </div>
          <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button><button type="submit" className={styles.saveButton}>Salvar Alterações</button></div>
        </form>
      </div>
    </div>
    );
}

function RelatorioModal({ relatorio, onClose, onSave, chamados }) {
    const [formData, setFormData] = useState({
        chamado_id: relatorio?.id || '',
        conteudo: relatorio?.descricao || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.chamado_id || !formData.conteudo) {
            toast.error('É necessário selecionar um chamado e preencher o conteúdo!');
            return;
        }
        onSave(formData);
    };

    useEffect(() => {
        const handleEsc = (event) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalHeader}>
                        <h2>{relatorio ? 'Editar Anotação' : 'Adicionar Anotação'}</h2>
                        <button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}>
                            <label htmlFor="chamado_id">Chamado</label>
                            <select 
                                id="chamado_id" 
                                name="chamado_id" 
                                value={formData.chamado_id} 
                                onChange={handleChange} 
                                required
                                disabled={!!relatorio}
                            >
                                <option value="">Selecione um Chamado</option>
                                {chamados.map(c => <option key={c.id} value={c.id}>#{c.id} - {c.titulo}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="conteudo">Conteúdo da Anotação (Descrição)</label>
                            <textarea id="conteudo" name="conteudo" rows="6" value={formData.conteudo} onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                        <button type="submit" className={styles.saveButton}>Salvar Anotação</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent} style={{ maxWidth: '450px' }}>
                <div className={styles.modalHeader}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FiAlertTriangle style={{ color: 'var(--color-urgent)' }}/> {title}
                    </h2>
                    <button type="button" className={styles.closeModalButton} onClick={onCancel}><FiX /></button>
                </div>
                <div className={styles.modalBody}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
                    <button type="button" className={styles.closeButton} onClick={onConfirm} style={{ background: 'var(--color-urgent)'}}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}