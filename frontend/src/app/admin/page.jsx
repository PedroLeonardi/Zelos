'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    FiPlus, FiSearch, FiEdit, FiTrash2, FiChevronUp, FiChevronDown,
    FiX, FiUsers, FiClipboard, FiBarChart2, FiAlertTriangle,
    FiArchive, FiList, FiArrowLeft
} from 'react-icons/fi';
import styles from './admin.module.css';
import Header from '../components/Header';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';


// --- ÍCONES AUXILIARES ---
const SpinnerIcon = () => <svg className={styles.spinner} viewBox="0 0 50 50"><circle className={styles.spinnerPath} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle></svg>;

// --- DADOS GLOBAIS ---
const servicosDisponiveis = [
    { id: 1, nome: 'Manutenção' },
    { id: 2, nome: 'Apoio Técnico' },
    { id: 3, nome: 'Limpeza' },
    { id: 4, nome: 'Serviço Externo' },
];

const STATUS_OPCOES = ['pendente', 'em andamento', 'aguardando aprovação', 'concluído', 'inativo'];

const ITEMS_PER_PAGE = 5;
const FUNCOES = ['Administrador', 'Técnico', 'Usuário'];

// --- FUNÇÕES E COMPONENTES AUXILIARES ---

const normalizeStatusForClassName = (status = '') => {
    return status
        .toLowerCase()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, ''); 
};

// Hook customizado para gerenciar a lógica de paginação
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

// Componente para renderizar os controles da paginação
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

// Componente para os cards de estatísticas
const StatCard = ({ title, value, type = 'default' }) => (
    <div className={`${styles.statsCard} ${styles[type]}`}>
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);


// --- COMPONENTE PRINCIPAL ---
export default function AdminPage() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        RadialLinearScale,
        PointElement,
        LineElement
    );

    const [activeTab, setActiveTab] = useState('chamados');
    const [chamados, setChamados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/user/get');
            if (!response.ok) throw new Error('Erro ao buscar usuários');
            setUsuarios(await response.json() || []);
        } catch (error) {
            toast.error("Não foi possível carregar os usuários.");
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);


    const TABS = {
        chamados: <GerenciamentoChamados chamados={chamados} setChamados={setChamados} usuarios={usuarios} />,
        usuarios: <GerenciamentoUsuarios usuarios={usuarios} setUsuarios={setUsuarios} fetchUsuarios={fetchUsuarios} />,
        patrimonios: <GerenciamentoPatrimonios />,
        relatorios: <GraficosView chamados={chamados} />,
    };

    return (
        <>
            <Header />
            <Toaster position="top-right" toastOptions={{ className: styles.toast, style: { background: '#333', color: '#fff' } }} />
            <div className={styles.dashboardContainer}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Painel Administrativo</h1>
                        <p className={styles.pageSubtitle}>Gerencie chamados, usuários, patrimônios e visualize relatórios.</p>
                    </div>
                </header>

                <nav className={styles.tabs}>
                    <button onClick={() => setActiveTab('chamados')} className={activeTab === 'chamados' ? styles.activeTab : ''}><FiClipboard /> Gerenciar Chamados</button>
                    <button onClick={() => setActiveTab('usuarios')} className={activeTab === 'usuarios' ? styles.activeTab : ''}><FiUsers /> Gerenciar Usuários</button>
                    <button onClick={() => setActiveTab('patrimonios')} className={activeTab === 'patrimonios' ? styles.activeTab : ''}><FiArchive /> Gerenciar Patrimônios</button>
                    <button onClick={() => setActiveTab('relatorios')} className={activeTab === 'relatorios' ? styles.activeTab : ''}><FiBarChart2 /> Relatórios</button>
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
        aguardando: chamados.filter(c => c.status === 'aguardando aprovação').length,
    }), [chamados]);

    return (
        <section className={styles.statsGrid}>
            <StatCard title="Total de Chamados" value={stats.total} />
            <StatCard title="Pendentes" value={stats.pendente} type="pending" />
            <StatCard title="Em Andamento" value={stats.emAndamento} type="inProgress" />
            <StatCard title="Aguardando Aprovação" value={stats.aguardando} type="approved" />
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
                <input type="text" placeholder="Buscar por ID, Título, Técnico, Solicitante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
            </div>
            <button onClick={() => openModal(null)} className={styles.addButton}><FiPlus /> Novo Chamado</button>
        </div>
    </div>
);

const ChamadoFilters = ({ statusFilter, setStatusFilter }) => (
    <div className={styles.filters}>
        {['todos', ...STATUS_OPCOES].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={statusFilter === f ? styles.activeFilter : ''}>
                {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
        ))}
    </div>
);

const ChamadoTable = ({ paginatedChamados, handleSort, sortConfig, openModal, handleDeleteChamado }) => (
    <div className={styles.tableContainer}>
        <div className={`${styles.tableRow} ${styles.headerRow}`}>
            <span onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span onClick={() => handleSort('titulo')}>Título {sortConfig.key === 'titulo' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span onClick={() => handleSort('numero_patrimonio')}>Patrimônio {sortConfig.key === 'numero_patrimonio' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span onClick={() => handleSort('tecnico_nome')}>Técnico {sortConfig.key === 'tecnico_nome' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span onClick={() => handleSort('solicitante_nome')}>Solicitante {sortConfig.key === 'solicitante_nome' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <FiChevronUp /> : <FiChevronDown />)}</span>
            <span>Ações</span>
        </div>
        {paginatedChamados.map(c => {
            const statusClassName = normalizeStatusForClassName(c.status);
            return (
                <div className={styles.tableRow} key={c.id}>
                    <span data-label="ID"><strong>#{c.id}</strong><small>{new Date(c.criado_em).toLocaleDateString()}</small></span>
                    <span data-label="Título">{c.titulo}</span>
                    <span data-label="Patrimônio">{c.numero_patrimonio || 'N/A'}</span>
                    <span data-label="Técnico">{c.tecnico_nome || 'N/A'}</span>
                    <span data-label="Solicitante">{c.solicitante_nome}</span>
                    <span data-label="Status"><div className={`${styles.statusTag} ${styles[statusClassName]}`}>{c.status}</div></span>
                    <div data-label="Ações" className={styles.actions}>
                        <button onClick={() => openModal(c)} className={styles.actionButton}><FiEdit /></button>
                        <button onClick={() => handleDeleteChamado(c.id)} className={styles.closeButton}><FiTrash2 /></button>
                    </div>
                </div>
            );
        })}
    </div>
);

function GerenciamentoChamados({ chamados, setChamados, usuarios }) {
    const [statusFilter, setStatusFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'descending' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChamado, setEditingChamado] = useState(null);
    const [chamadoParaInativar, setChamadoParaInativar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adminUserId, setAdminUserId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('id');
        setAdminUserId(id);
    }, []);

    const fetchChamados = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8080/relatorio/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar os chamados.');
            const data = await response.json();
            setChamados((data.mensagem || []).map(c => ({
                id: c.chamado_id,
                titulo: c.chamado_titulo,
                descricao: c.descricao,
                patrimonio_id: c.patrimonio_id,
                numero_patrimonio: c.numero_patrimonio,
                servicos_id: c.servicos_id,
                tipo_chamado: c.tipo_chamado,
                tecnico_id: c.tecnico_id,
                tecnico_nome: c.tecnico_nome,
                usuario_id: c.solicitante_id,
                solicitante_nome: c.solicitante_nome,
                status: c.chamado_status,
                criado_em: c.data_criacao,
            })));
        } catch (error) {
            toast.error(error.message);
        }
    }, [setChamados]);

    useEffect(() => { fetchChamados(); }, [fetchChamados]);

    const tecnicos = useMemo(() => usuarios.filter(u => ['Técnico', 'Administrador'].includes(u.funcao)), [usuarios]);

    const filteredAndSortedChamados = useMemo(() => {
        let items = chamados
            .filter(c => statusFilter === 'todos' || c.status === statusFilter)
            .filter(c => !searchTerm || Object.values(c).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
        items.sort((a, b) => {
            if (!sortConfig.key) return 0;
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return items;
    }, [chamados, statusFilter, searchTerm, sortConfig]);

    const { paginatedItems: paginatedChamados, currentPage, setCurrentPage, totalPages } = usePagination(filteredAndSortedChamados, ITEMS_PER_PAGE);

    const handleSort = (key) => setSortConfig(p => ({ key, direction: p.key === key && p.direction === 'ascending' ? 'descending' : 'ascending' }));
    const openModal = (chamado = null) => { setEditingChamado(chamado); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingChamado(null); };

    const handleSaveChamado = async (formData) => {
        setIsSubmitting(true);
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const isCreating = !editingChamado;
        
        if (isCreating && !adminUserId) {
            toast.error("ID do administrador não encontrado. Recarregue a página.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (formData.patrimonio_id) {
                if (!/^\d+$/.test(formData.patrimonio_id)) {
                    throw new Error('O número do patrimônio é inválido. Digite apenas números.');
                }
                const patrimonioEmUso = chamados.some(c =>
                    c.patrimonio_id === parseInt(formData.patrimonio_id) &&
                    c.id !== editingChamado?.id &&
                    c.status !== 'concluído' && c.status !== 'inativo'
                );
                if (patrimonioEmUso) {
                    throw new Error('Já existe um chamado ativo para este patrimônio.');
                }
            }
            
            const endpoint = isCreating ? 'http://localhost:8080/chamados/post' : 'http://localhost:8080/chamados/put';
            const method = isCreating ? 'POST' : 'PUT';
            
            // ============================================================================
            // --- ALTERAÇÃO APLICADA AQUI ---
            // Adiciona o campo 'status' ao corpo da requisição de CRIAÇÃO.
            // ============================================================================
            const body = isCreating 
              ? {
                  titulo: formData.titulo,
                  descricao: formData.descricao,
                  patrimonio_id: formData.patrimonio_id || null,
                  servicos_id: formData.servicos_id,
                  usuario_id: adminUserId, 
                  tecnico_id: formData.tecnico_id || null,
                  status: 'em andamento' // <-- STATUS DEFINIDO AQUI
                }
              : { 
                  ...formData,
                  id: editingChamado.id, 
                  patrimonio_id: formData.patrimonio_id || null,
                  tecnico_id: formData.tecnico_id || null,
              };
            // ============================================================================

            const response = await fetch(endpoint, { method, headers, body: JSON.stringify(body) });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.mensagem || 'Falha na operação com o chamado.');
            }

            toast.success(`Chamado ${isCreating ? 'criado' : 'atualizado'} com sucesso!`);
            closeModal();
            fetchChamados();
        } catch (error) {
            console.error("Erro ao salvar chamado:", error);
            toast.error(error.message || "Não foi possível salvar o chamado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInativarClick = (id) => setChamadoParaInativar(chamados.find(c => c.id === id));

    const confirmInativar = async () => {
        if (!chamadoParaInativar) return;
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:8080/chamados/put', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...chamadoParaInativar, status: 'inativo' }),
            });
            if (!response.ok) throw new Error((await response.json()).mensagem || 'Falha ao inativar.');
            toast.success('Chamado inativado com sucesso!');
            setChamadoParaInativar(null);
            fetchChamados();
        } catch (error) {
            toast.error(`Erro: ${error.message}`);
            setChamadoParaInativar(null);
        }
    };

    return (
        <>
            <ChamadoStats chamados={chamados} />
            <section className={styles.reportSection}>
                <ChamadoHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} openModal={openModal} />
                <ChamadoFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
                <ChamadoTable paginatedChamados={paginatedChamados} handleSort={handleSort} sortConfig={sortConfig} openModal={openModal} handleDeleteChamado={handleInativarClick} />
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                {isModalOpen && <ChamadoModal chamado={editingChamado} onClose={closeModal} onSave={handleSaveChamado} tecnicos={tecnicos} usuarios={usuarios} servicos={servicosDisponiveis} isSubmitting={isSubmitting} />}
                {chamadoParaInativar && <ConfirmModal title="Inativar Chamado" message={`Deseja inativar o chamado #${chamadoParaInativar.id}?`} onConfirm={confirmInativar} onCancel={() => setChamadoParaInativar(null)} />}
            </section>
        </>
    );
}

// --- 2. GERENCIAMENTO DE USUÁRIOS ---
function GerenciamentoUsuarios({ usuarios, setUsuarios, fetchUsuarios }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);

    const filteredUsuarios = useMemo(() => Array.isArray(usuarios) ? usuarios.filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) : [], [usuarios, searchTerm]);
    const { paginatedItems: paginatedUsuarios, currentPage, setCurrentPage, totalPages } = usePagination(filteredUsuarios, ITEMS_PER_PAGE);

    const openModal = (usuario) => { setEditingUsuario(usuario); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingUsuario(null); };

    const handleSaveUsuario = async (formData) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:8080/user/put', {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error((await response.json()).mensagem || 'Falha ao atualizar.');
            toast.success("Usuário atualizado!");
            closeModal();
            fetchUsuarios();
        } catch (error) {
            toast.error(`Erro: ${error.message}`);
        }
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}><h2>Usuários ({usuarios.length})</h2><div className={styles.searchContainer}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Buscar por Nome ou Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} /></div></div>
            <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}><span>Nome</span><span>Email</span><span>Função</span><span>Status</span><span>Ações</span></div>
                {paginatedUsuarios.map(u => (
                    <div className={styles.tableRow} key={u.id}>
                        <span data-label="Nome"><strong>{u.nome}</strong></span><span data-label="Email">{u.email}</span><span data-label="Função">{u.funcao}</span>
                        <span data-label="Status"><div className={u.status === 'ativo' ? styles.statusActive : styles.statusInactive}>{u.status}</div></span>
                        <div data-label="Ações" className={styles.actions}><button onClick={() => openModal(u)} className={styles.actionButton}><FiEdit /></button></div>
                    </div>
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {isModalOpen && <UsuarioModal usuario={editingUsuario} onClose={closeModal} onSave={handleSaveUsuario} />}
        </section>
    );
}

// --- 3. GERENCIAMENTO DE PATRIMÔNIOS ---
function GerenciamentoPatrimonios() {
    const [patrimonios, setPatrimonios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPatrimonios = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:8080/patrimonio/get', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar patrimônios.');
            setPatrimonios(await response.json() || []);
        } catch (error) {
            toast.error(error.message);
        }
    }, []);

    useEffect(() => { fetchPatrimonios(); }, [fetchPatrimonios]);

    const filteredPatrimonios = useMemo(() => patrimonios.filter(p => Object.values(p).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))), [patrimonios, searchTerm]);
    const { paginatedItems: paginatedPatrimonios, currentPage, setCurrentPage, totalPages } = usePagination(filteredPatrimonios, ITEMS_PER_PAGE);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSavePatrimonio = async (formData) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:8080/patrimonio/post', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error((await response.json()).mensagem || 'Falha ao criar patrimônio.');
            toast.success('Patrimônio criado com sucesso!');
            fetchPatrimonios();
            return true;
        } catch (error) {
            toast.error(`Erro: ${error.message}`);
            return false;
        }
    };

    return (
        <section className={styles.reportSection}>
            <div className={styles.reportHeader}><h2>Patrimônios ({patrimonios.length})</h2><div className={styles.controlsContainer}><div className={styles.searchContainer}><FiSearch className={styles.searchIcon} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} /></div><button onClick={openModal} className={styles.addButton}><FiPlus /> Adicionar Patrimônio</button></div></div>
            <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}><span>N° Patrimônio</span><span>Categoria</span><span>Descrição</span><span>Data de Aquisição</span></div>
                {paginatedPatrimonios.map(p => (
                    <div className={styles.tableRow} key={p.id}>
                        <span data-label="N° Patrimônio"><strong>{p.n_patrimonio}</strong></span><span data-label="Categoria">{p.categoria}</span><span data-label="Descrição">{p.descricao}</span><span data-label="Aquisição">{new Date(p.aquisicao).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {isModalOpen && <PatrimonioModal onClose={closeModal} onSave={handleSavePatrimonio} patrimonios={patrimonios} />}
        </section>
    );
}


// --- 4. GRÁFICOS E RELATÓRIOS ---
function GraficosView({ chamados }) {
  const [activeChart, setActiveChart] = useState('chamadosPorMes');

  const STATUS_COLORS = {
    'pendente': '#ffc107',
    'em andamento': '#0d6efd',
    'aguardando aprovação': '#6f42c1',
    'concluído': '#198754',
    'inativo': '#6c757d',
  };

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      title: { display: true, font: { size: 16, weight: 'bold' }, padding: { top: 10, bottom: 20 } }
    },
  };

  const chamadosPorMesData = useMemo(() => {
    const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const datasets = {};
    const statusesToInclude = STATUS_OPCOES.filter(s => s !== 'inativo');

    statusesToInclude.forEach(status => {
      datasets[status] = {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        data: Array(12).fill(0),
        backgroundColor: STATUS_COLORS[status],
      };
    });

    chamados.forEach(c => {
      if (statusesToInclude.includes(c.status)) {
        const month = new Date(c.criado_em).getMonth();
        datasets[c.status].data[month]++;
      }
    });

    return { labels: monthLabels, datasets: Object.values(datasets) };
  }, [chamados]);

  const statusChamadosData = useMemo(() => {
    const statusCounts = {};
    const statusesToInclude = STATUS_OPCOES.filter(s => s !== 'inativo');
    statusesToInclude.forEach(s => statusCounts[s] = 0);

    chamados.forEach(c => {
      if (statusesToInclude.includes(c.status)) {
        statusCounts[c.status]++;
      }
    });
    return {
      labels: statusesToInclude.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: statusesToInclude.map(s => STATUS_COLORS[s]),
        borderColor: '#ffffff',
        borderWidth: 2,
      }],
    };
  }, [chamados]);
  
  const doughnutTextCenter = {
    id: 'doughnutTextCenter',
    beforeDraw: (chart) => {
      if (chart.config.type !== 'doughnut') return;
      const { ctx, data } = chart;
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
      ctx.save();
      const x = chart.getDatasetMeta(0).data[0].x;
      const y = chart.getDatasetMeta(0).data[0].y;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#333';
      ctx.fillText(total, x, y);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('Ativos', x, y + 25);
      ctx.restore();
    }
  };

  const charts = {
    chamadosPorMes: {
      label: 'Chamados por Mês',
      component: <Bar options={{...defaultChartOptions, plugins: { ...defaultChartOptions.plugins, title: { ...defaultChartOptions.plugins.title, text: 'Volume de Chamados por Mês e Status' }}, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }}} data={chamadosPorMesData} />
    },
    statusChamados: {
      label: 'Status dos Chamados',
      component: <Doughnut options={{...defaultChartOptions, plugins: { ...defaultChartOptions.plugins, title: { ...defaultChartOptions.plugins.title, text: 'Distribuição por Status (Ativos)' }}, cutout: '60%'}} data={statusChamadosData} plugins={[doughnutTextCenter]} />
    }
  };

  return (
    <section className={styles.reportSection}>
      <div className={styles.reportHeader}>
        <h2>Visualização de Dados</h2>
        <div className={styles.filters}>
          {Object.keys(charts).map(key => (
            <button key={key} onClick={() => setActiveChart(key)} className={activeChart === key ? styles.activeFilter : ''}>
              {charts[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartContainer}>
        {charts[activeChart].component}
      </div>
    </section>
  );
}


// --- MODAIS ---

function ChamadoModal({ chamado, onClose, onSave, tecnicos, usuarios, servicos, isSubmitting }) {
    const isCreating = !chamado;
    const [formData, setFormData] = useState({
        titulo: '', descricao: '', patrimonio_id: '', servicos_id: '',
        tecnico_id: '', usuario_id: '', status: 'pendente'
    });

    useEffect(() => {
        if (chamado) {
            setFormData({
                titulo: chamado.titulo || '',
                descricao: chamado.descricao || '',
                patrimonio_id: (chamado.patrimonio_id || '').toString(),
                servicos_id: (chamado.servicos_id || '').toString(),
                tecnico_id: (chamado.tecnico_id || '').toString(),
                usuario_id: (chamado.usuario_id || '').toString(),
                status: chamado.status || 'pendente',
            });
        } else {
            setFormData({
                titulo: '', descricao: '', patrimonio_id: '', servicos_id: '1',
                tecnico_id: '', usuario_id: '', status: 'pendente'
            });
        }
    }, [chamado]);

    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.titulo || !formData.servicos_id) {
            toast.error('Título e Tipo de Serviço são obrigatórios!');
            return;
        }
        onSave(formData);
    };

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalHeader}><h2>{isCreating ? 'Abrir Novo Chamado' : 'Editar Chamado'}</h2><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}><label>Título do Chamado</label><input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required autoFocus maxLength="27" /></div>
                        <div className={styles.formGroup}><label>Descrição do Problema</label><textarea name="descricao" rows="4" value={formData.descricao} onChange={handleChange} required maxLength="148"></textarea></div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}><label>Nº do Patrimônio (Opcional)</label><input type="text" name="patrimonio_id" value={formData.patrimonio_id} onChange={handleChange} maxLength="15" /></div>
                            <div className={styles.formGroup}><label>Tipo de Serviço</label><select name="servicos_id" value={formData.servicos_id} onChange={handleChange} required><option value="" disabled>Selecione...</option>{servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></div>
                        </div>
                        
                        <div className={styles.formRow}>
                            {isCreating ? (
                                <div className={styles.formGroup} style={{ flexBasis: '100%' }}>
                                    <label>Atribuir Técnico</label>
                                    <select name="tecnico_id" value={formData.tecnico_id} onChange={handleChange}>
                                        <option value="">Não atribuído</option>
                                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Solicitante</label>
                                        <select name="usuario_id" value={formData.usuario_id} disabled>
                                            {<option value={chamado.usuario_id}>{chamado.solicitante_nome}</option>}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Atribuir Técnico</label>
                                        <select name="tecnico_id" value={formData.tecnico_id} onChange={handleChange}>
                                            <option value="">Não atribuído</option>
                                            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {!isCreating && <div className={styles.formGroup}><label>Status</label><select name="status" value={formData.status} onChange={handleChange}>{STATUS_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>}
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onClose} disabled={isSubmitting}>Cancelar</button>
                        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
                            {isSubmitting ? <SpinnerIcon /> : isCreating ? 'Confirmar Abertura' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UsuarioModal({ usuario, onClose, onSave }) {
    const [formData, setFormData] = useState({ id: '', nome: '', email: '', funcao: 'Usuário', status: 'ativo' });
    useEffect(() => { if (usuario) setFormData({ ...usuario }); }, [usuario]);
    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    useEffect(() => { const handleEsc = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalHeader}><h2>Editar Usuário</h2><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div>
                    <div className={styles.modalBody}>
                        <div className={styles.formRow}><div className={styles.formGroup}><label>ID</label><input type="text" value={formData.id} disabled /></div><div className={styles.formGroup}><label>Nome</label><input type="text" value={formData.nome} disabled /></div></div>
                        <div className={styles.formRow}><div className={styles.formGroup}><label>Email</label><input type="email" value={formData.email} disabled /></div><div className={styles.formGroup}><label>Função</label><select name="funcao" value={formData.funcao} onChange={handleChange} autoFocus>{FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}</select></div></div>
                        <div className={styles.formRow}><div className={styles.formGroup}><label>Status</label><select name="status" value={formData.status} onChange={handleChange}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div></div>
                    </div>
                    <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button><button type="submit" className={styles.saveButton}>Salvar</button></div>
                </form>
            </div>
        </div>
    );
}

function PatrimonioModal({ onClose, onSave, patrimonios }) {
    const [view, setView] = useState('create');
    const [formData, setFormData] = useState({ categoria: '', descricao: '', aquisicao: '', n_patrimonio: '' });
    const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.n_patrimonio || !formData.aquisicao) { toast.error('Nº do Patrimônio e Data de Aquisição são obrigatórios!'); return; }
        if (await onSave(formData)) { setFormData({ categoria: '', descricao: '', aquisicao: '', n_patrimonio: '' }); setView('list'); }
    };
    useEffect(() => { const handleEsc = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);

    return (
        <div className={styles.modalBackdrop} onClick={onClose}><div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {view === 'create' ? (
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalHeader}><h2>Adicionar Patrimônio</h2><div className={styles.headerActions}><button type="button" className={styles.switchViewButton} onClick={() => setView('list')}><FiList /> Ver Lista</button><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div></div>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}><label>N° do Patrimônio</label><input type="text" name="n_patrimonio" value={formData.n_patrimonio} onChange={handleChange} required autoFocus /></div>
                        <div className={styles.formGroup}><label>Categoria</label><input type="text" name="categoria" value={formData.categoria} onChange={handleChange} /></div>
                        <div className={styles.formGroup}><label>Descrição</label><textarea name="descricao" rows="3" value={formData.descricao} onChange={handleChange}></textarea></div>
                        <div className={styles.formGroup}><label>Data de Aquisição</label><input type="date" name="aquisicao" value={formData.aquisicao} onChange={handleChange} required /></div>
                    </div>
                    <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button><button type="submit" className={styles.saveButton}>Salvar</button></div>
                </form>
            ) : (
                <>
                    <div className={styles.modalHeader}><h2>Lista de Patrimônios</h2><div className={styles.headerActions}><button type="button" className={styles.switchViewButton} onClick={() => setView('create')}><FiPlus /> Adicionar</button><button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button></div></div>
                    <div className={`${styles.modalBody} ${styles.listBody}`}>
                        <div className={styles.patrimonioList}>{patrimonios.map(p => (<div key={p.id} className={styles.patrimonioListItem}><span><strong>N°:</strong> {p.n_patrimonio}</span><span><strong>Cat:</strong> {p.categoria}</span></div>))}</div>
                    </div>
                    <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={() => setView('create')}><FiArrowLeft /> Voltar</button></div>
                </>
            )}
        </div></div>
    );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className={styles.modalBackdrop}><div className={styles.modalContent} style={{ maxWidth: '450px' }}>
            <div className={styles.modalHeader}><h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiAlertTriangle style={{ color: 'var(--color-urgent)' }} /> {title}</h2><button type="button" className={styles.closeModalButton} onClick={onCancel}><FiX /></button></div>
            <div className={styles.modalBody}><p>{message}</p></div>
            <div className={styles.modalFooter}><button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button><button type="button" className={styles.closeButton} onClick={onConfirm} style={{ background: 'var(--color-urgent)' }}>Confirmar</button></div>
        </div></div>
    );
}