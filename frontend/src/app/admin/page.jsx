'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiChevronUp, FiChevronDown, FiX, FiUsers, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import styles from './admin.module.css';
import Header from '../components/Header'; // Mantém o Header como um componente externo

// --- MOCK DATA ---
const initialChamados = [
    { id: '#7821', titulo: 'Reparo Impressora 3D', descricao: 'A impressora parou no meio da impressão e está exibindo um erro de aquecimento.', patrimonio_id: '101', servicos_id: 1, tecnico_id: 1, usuario_id: 4, status: 'em andamento', criado_em: '2025-08-01' },
    { id: '#7815', titulo: 'Manutenção Torno CNC', descricao: 'Manutenção preventiva agendada.', patrimonio_id: '105', servicos_id: 2, tecnico_id: 1, usuario_id: 6, status: 'concluído', criado_em: '2025-07-30' },
    { id: '#7820', titulo: 'Instalar Software CAD', descricao: 'Instalar a nova versão do AutoCAD no computador do designer.', patrimonio_id: null, servicos_id: 3, tecnico_id: 2, usuario_id: 4, status: 'pendente', criado_em: '2025-08-02' },
    { id: '#7822', titulo: 'Formatar PC da recepção', descricao: 'Formatação e reinstalação de programas básicos.', patrimonio_id: '102', servicos_id: 3, tecnico_id: null, usuario_id: 6, status: 'aguardando aprovação', criado_em: '2025-08-03' },
    { id: '#7823', titulo: 'Limpeza de monitor', descricao: 'Monitor com manchas na tela.', patrimonio_id: '104', servicos_id: 1, tecnico_id: 1, usuario_id: 4, status: 'pendente', criado_em: '2025-08-04' },
];

const initialUsuarios = [
  { id: 1, nome: 'Carlos Souza', funcao: 'Técnico', status: 'ativo', email: 'carlos.s@empresa.com' },
  { id: 2, nome: 'Ana Pereira', funcao: 'Técnico', status: 'ativo', email: 'ana.p@empresa.com' },
  { id: 3, nome: 'Mariana Costa', funcao: 'Técnico', status: 'inativo', email: 'mariana.c@empresa.com' },
  { id: 4, nome: 'João Silva', funcao: 'Usuário', status: 'ativo', email: 'joao.s@empresa.com' },
  { id: 5, nome: 'Admin Master', funcao: 'Administrador', status: 'ativo', email: 'admin@empresa.com' },
  { id: 6, nome: 'Roberto Alves', funcao: 'Usuário', status: 'ativo', email: 'roberto.a@empresa.com' },
  { id: 7, nome: 'Beatriz Lima', funcao: 'Técnico', status: 'ativo', email: 'beatriz.l@empresa.com' },
];

const initialServicos = [
    { id: 1, nome: 'Manutenção Corretiva' },
    { id: 2, nome: 'Manutenção Preventiva' },
    { id: 3, nome: 'Instalação/Configuração' },
    { id: 4, nome: 'Outro' },
];

const initialRelatorios = [
    { id: 'rel1', chamado_id: '#7821', conteudo: 'O problema de aquecimento da impressora 3D foi resolvido com a substituição do termistor. O equipamento está funcionando corretamente.', criado_em: '2025-08-01' },
    { id: 'rel2', chamado_id: '#7815', conteudo: 'Realizada a manutenção preventiva do Torno CNC, com limpeza dos componentes internos e calibração dos eixos.', criado_em: '2025-07-30' },
    { id: 'rel3', chamado_id: '#7820', conteudo: 'Instalação do software AutoCAD e configuração das licenças. O usuário confirmou o funcionamento do programa.', criado_em: '2025-08-02' },
];

const STATUS_OPCOES = ['pendente', 'em andamento', 'aguardando aprovação', 'concluído'];
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
  const [chamados, setChamados] = useState(initialChamados);
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [relatorios, setRelatorios] = useState(initialRelatorios);

  const TABS = {
    chamados: <GerenciamentoChamados chamados={chamados} setChamados={setChamados} usuarios={usuarios} />,
    usuarios: <GerenciamentoUsuarios usuarios={usuarios} setUsuarios={setUsuarios} />,
    relatorios: <RelatoriosView chamados={chamados} usuarios={usuarios} relatorios={relatorios} setRelatorios={setRelatorios} />,
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
        total: chamados.length,
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
                    placeholder="Buscar por ID, Título ou Patrimônio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            <button onClick={openModal} className={styles.addButton}>
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
    usuariosMap, 
    tecnicosMap, 
    openModal, 
    handleDeleteChamado 
}) => (
    <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.headerRow}`}>
            <span onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('titulo')}>Título {sortConfig.key === 'titulo' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('patrimonio_id')}>Patrimônio {sortConfig.key === 'patrimonio_id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('tecnico_id')}>Técnico {sortConfig.key === 'tecnico_id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('usuario_id')}>Usuário {sortConfig.key === 'usuario_id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
            <span>Ações</span>
        </div>
        {paginatedChamados.map(c => (
            <div className={styles.tableRow} key={c.id}>
                <span data-label="ID"><strong>{c.id}</strong><small>{c.criado_em}</small></span>
                <span data-label="Título">{c.titulo}</span>
                <span data-label="Patrimônio">{c.patrimonio_id || 'Não Associado'}</span>
                <span data-label="Técnico">{tecnicosMap.get(c.tecnico_id) || 'Não Atribuído'}</span>
                <span data-label="Usuário">{usuariosMap.get(c.usuario_id)}</span>
                <span data-label="Status"><div className={`${styles.statusTag} ${styles[c.status.replace(/\s+/g, '')]}`}>{c.status}</div></span>
                <div data-label="Ações" className={styles.actions}>
                    <button onClick={() => openModal(c)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                    <button onClick={() => handleDeleteChamado(c.id)} className={styles.closeButton} aria-label="Excluir"><FiTrash2 /></button>
                </div>
            </div>
        ))}
    </div>
);

function GerenciamentoChamados({ chamados, setChamados, usuarios }) {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'criado_em', direction: 'descending' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState(null);
  
  const tecnicos = useMemo(() => usuarios.filter(u => u.funcao.includes('Técnico') || u.funcao.includes('Administrador')), [usuarios]);
  const usuariosMap = useMemo(() => new Map(usuarios.map(u => [u.id, u.nome])), [usuarios]);
  const tecnicosMap = useMemo(() => new Map(tecnicos.map(t => [t.id, t.nome])), [tecnicos]);
  const servicosMap = useMemo(() => new Map(initialServicos.map(s => [s.id, s.nome])), []);

  const filteredAndSortedChamados = useMemo(() => {
    let items = [...chamados];
    if (statusFilter !== 'todos') items = items.filter(c => c.status === statusFilter);
    if (searchTerm) items = items.filter(c => 
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.patrimonio_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [chamados, statusFilter, searchTerm, sortConfig]);

  const { paginatedItems: paginatedChamados, currentPage, setCurrentPage, totalPages } = usePagination(filteredAndSortedChamados, ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [statusFilter, searchTerm, setCurrentPage]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };
  
  const openModal = (chamado = null) => { setEditingChamado(chamado); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingChamado(null); };

  const handleSaveChamado = (formData) => {
    if (editingChamado) {
      setChamados(prev => prev.map(c => c.id === editingChamado.id ? { ...c, ...formData } : c));
      toast.success('Chamado atualizado com sucesso!');
    } else {
      const novoChamado = { ...formData, id: '#78' + Math.floor(Math.random() * 900 + 100), status: 'pendente', criado_em: new Date().toISOString().split('T')[0] };
      setChamados(prev => [novoChamado, ...prev]);
      toast.success('Novo chamado criado com sucesso!');
    }
    closeModal();
  };
  
  const handleDeleteChamado = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      setChamados(prev => prev.filter(c => c.id !== id));
      toast.error('Chamado excluído!');
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
            usuariosMap={usuariosMap}
            tecnicosMap={tecnicosMap}
            openModal={openModal}
            handleDeleteChamado={handleDeleteChamado}
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
          servicos={initialServicos}
        />}
      </section>
    </>
  );
}

// --- 2. GERENCIAMENTO DE USUÁRIOS ---
function GerenciamentoUsuarios({ usuarios, setUsuarios }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter(u => 
            u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [usuarios, searchTerm]);
    
    const { paginatedItems: paginatedUsuarios, currentPage, setCurrentPage, totalPages } = usePagination(filteredUsuarios, ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, setCurrentPage]);

    const openModal = (usuario = null) => { setEditingUsuario(usuario); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingUsuario(null); };

    const handleSaveUsuario = (formData) => {
        if (editingUsuario) {
            setUsuarios(prev => prev.map(u => u.id === editingUsuario.id ? { ...u, ...formData } : u));
            toast.success("Usuário atualizado com sucesso!");
        } else {
            const novoUsuario = { ...formData, id: Math.max(...usuarios.map(u => u.id)) + 1 };
            setUsuarios(prev => [novoUsuario, ...prev]);
            toast.success("Novo usuário criado!");
        }
        closeModal();
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}>
                <h2>Todos os Usuários ({usuarios.length})</h2>
                 <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Buscar por Nome ou Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} /></div>
                    <button onClick={() => openModal()} className={styles.addButton}><FiPlus/> Adicionar Usuário</button>
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

// --- 3. GERENCIAMENTO DE RELATÓRIOS ---
function RelatoriosView({ chamados, relatorios, setRelatorios }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRelatorio, setEditingRelatorio] = useState(null);

    const chamadosMap = useMemo(() => new Map(chamados.map(c => [c.id, c])), [chamados]);

    const filteredRelatorios = useMemo(() => {
        return relatorios.filter(r =>
            (chamadosMap.get(r.chamado_id)?.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.chamado_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [relatorios, searchTerm, chamadosMap]);

    const { paginatedItems: paginatedRelatorios, currentPage, setCurrentPage, totalPages } = usePagination(filteredRelatorios, ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, setCurrentPage]);

    const handleOpenModal = (relatorio = null) => {
        setEditingRelatorio(relatorio);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRelatorio(null);
    };

    const handleSaveRelatorio = (formData) => {
        if (editingRelatorio) {
            setRelatorios(prev => prev.map(r => r.id === editingRelatorio.id ? { ...r, ...formData } : r));
            toast.success('Relatório atualizado com sucesso!');
        } else {
            const novoRelatorio = { ...formData, id: 'rel' + Date.now(), criado_em: new Date().toISOString().split('T')[0] };
            setRelatorios(prev => [novoRelatorio, ...prev]);
            toast.success('Relatório adicionado com sucesso!');
        }
        handleCloseModal();
    };

    const handleDeleteRelatorio = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
            setRelatorios(prev => prev.filter(r => r.id !== id));
            toast.error('Relatório excluído!');
        }
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}>
                <h2>Relatórios de Chamados</h2>
                <div className={styles.controlsContainer}>
                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por Título do Chamado ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} className={styles.addButton}>
                        <FiPlus /> Adicionar Relatório
                    </button>
                </div>
            </div>
            
            <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}>
                    <span>ID do Chamado</span>
                    <span>Título do Chamado</span>
                    <span>Conteúdo</span>
                    <span>Ações</span>
                </div>
                {paginatedRelatorios.map(r => (
                    <div className={styles.tableRow} key={r.id}>
                        <span data-label="ID do Chamado">{r.chamado_id}</span>
                        <span data-label="Título do Chamado">{chamadosMap.get(r.chamado_id)?.titulo || 'Chamado não encontrado'}</span>
                        <span data-label="Conteúdo" className={styles.relatorioContent}>{r.conteudo}</span>
                        <div data-label="Ações" className={styles.actions}>
                            <button onClick={() => handleOpenModal(r)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                            <button onClick={() => handleDeleteRelatorio(r.id)} className={styles.closeButton} aria-label="Excluir"><FiTrash2 /></button>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            
            {isModalOpen && <RelatorioModal relatorio={editingRelatorio} onClose={handleCloseModal} onSave={handleSaveRelatorio} chamados={chamados} />}
        </section>
    );
}

// --- MODAIS ---
function ChamadoModal({ chamado, onClose, onSave, tecnicos, usuarios, servicos }) {
  const [formData, setFormData] = useState({
    titulo: chamado?.titulo || '',
    descricao: chamado?.descricao || '',
    patrimonio_id: chamado?.patrimonio_id || '',
    servicos_id: chamado?.servicos_id || 1,
    tecnico_id: chamado?.tecnico_id || '',
    usuario_id: chamado?.usuario_id || '',
    status: chamado?.status || 'pendente',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.servicos_id || !formData.usuario_id) {
      toast.error('Título, Tipo de Serviço e Usuário são obrigatórios!');
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
            <div className={styles.formGroup}><label htmlFor="patrimonio_id">Nº do Patrimônio (Opcional)</label><input type="text" id="patrimonio_id" name="patrimonio_id" value={formData.patrimonio_id || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="servicos_id">Tipo de Serviço</label><select id="servicos_id" name="servicos_id" value={formData.servicos_id} onChange={handleChange} required>{servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
            <div className={styles.formGroup}><label htmlFor="usuario_id">Usuário Solicitante</label><select id="usuario_id" name="usuario_id" value={formData.usuario_id} onChange={handleChange} required>{usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}</select></div>

            {chamado && (
              <>
                <div className={styles.formGroup}><label htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange}><option value="pendente">Pendente</option><option value="em andamento">Em Andamento</option><option value="aguardando aprovação">Aguardando Aprovação</option><option value="concluído">Concluído</option></select></div>
                <div className={styles.formGroup}><label htmlFor="tecnico_id">Atribuir a</label><select id="tecnico_id" name="tecnico_id" value={formData.tecnico_id || ''} onChange={handleChange}><option value="">Não Atribuído</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
              </>
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
        nome: usuario?.nome || '',
        email: usuario?.email || '',
        funcao: usuario?.funcao || 'Usuário',
        status: usuario?.status || 'ativo',
    });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); if (!formData.nome || !formData.email) { toast.error("Nome e Email são obrigatórios!"); return; } onSave(formData); };
    useEffect(() => {
      const handleEsc = (event) => { if (event.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}><h2>{usuario ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div>
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}><label htmlFor="nome">Nome Completo</label><input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required autoFocus /></div>
                <div className={styles.formGroup}><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            </div>
            <div className={styles.formRow}>
                 <div className={styles.formGroup}><label htmlFor="funcao">Função</label><select id="funcao" name="funcao" value={formData.funcao} onChange={handleChange}>{FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                 <div className={styles.formGroup}><label htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>
            </div>
          </div>
          <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button><button type="submit" className={styles.saveButton}>Salvar Usuário</button></div>
        </form>
      </div>
    </div>
    );
}

function RelatorioModal({ relatorio, onClose, onSave, chamados }) {
    const [formData, setFormData] = useState({
        chamado_id: relatorio?.chamado_id || '',
        conteudo: relatorio?.conteudo || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.chamado_id || !formData.conteudo) {
            toast.error('O ID do chamado e o conteúdo são obrigatórios!');
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
                        <h2>{relatorio ? 'Editar Relatório' : 'Adicionar Relatório'}</h2>
                        <button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}>
                            <label htmlFor="chamado_id">ID do Chamado</label>
                            <select id="chamado_id" name="chamado_id" value={formData.chamado_id} onChange={handleChange} required>
                                <option value="">Selecione um Chamado</option>
                                {chamados.map(c => <option key={c.id} value={c.id}>{c.id} - {c.titulo}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="conteudo">Conteúdo do Relatório</label>
                            <textarea id="conteudo" name="conteudo" rows="6" value={formData.conteudo} onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                        <button type="submit" className={styles.saveButton}>Salvar Relatório</button>
                    </div>
                </form>
            </div>
        </div>
    );
}