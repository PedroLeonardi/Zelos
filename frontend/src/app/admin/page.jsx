'use client';

import { useState, useMemo, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
// Para os ícones, instale a biblioteca com: npm install react-icons
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import styles from './admin.module.css';
import Header from '../components/Header';

// --- DADOS INICIAIS (MOCK DATA) APRIMORADOS ---
const initialChamados = [
  { id: '#7821', titulo: 'Reparo Impressora 3D', tecnico: 'Carlos Souza', status: 'Em Andamento', criado_em: '2025-08-01', prioridade: 'Alta', departamento: 'Engenharia' },
  { id: '#7815', titulo: 'Manutenção Torno CNC', tecnico: 'Carlos Souza', status: 'Concluído', criado_em: '2025-07-30', prioridade: 'Média', departamento: 'Oficina' },
  { id: '#7820', titulo: 'Instalar Software CAD', tecnico: 'Ana Pereira', status: 'Pendente', criado_em: '2025-08-02', prioridade: 'Baixa', departamento: 'TI' },
  { id: '#7809', titulo: 'Troca de Lâmpadas', tecnico: 'Carlos Souza', status: 'Concluído', criado_em: '2025-07-25', prioridade: 'Baixa', departamento: 'Manutenção' },
  { id: '#7822', titulo: 'Verificar Ponto de Rede', tecnico: 'Ana Pereira', status: 'Em Andamento', criado_em: '2025-08-03', prioridade: 'Alta', departamento: 'TI' },
  { id: '#7823', titulo: 'Conserto Ar Condicionado', tecnico: 'Carlos Souza', status: 'Pendente', criado_em: '2025-08-04', prioridade: 'Urgente', departamento: 'Administrativo' },
  { id: '#7824', titulo: 'Atualização Sistema Moodle', tecnico: 'Ana Pereira', status: 'Pendente', criado_em: '2025-08-05', prioridade: 'Média', departamento: 'TI' },
];

const usuarios = [
  { id: 1, nome: 'Carlos Souza', funcao: 'Técnico', status: 'ativo' },
  { id: 2, nome: 'Ana Pereira', funcao: 'Técnico', status: 'ativo' },
  { id: 3, nome: 'Mariana Costa', funcao: 'Técnico', status: 'ativo' },
  { id: 4, nome: 'João Silva', funcao: 'Usuário', status: 'inativo' },
];

const ITEMS_PER_PAGE = 5;

// --- SUBCOMPONENTES ---
const StatCard = ({ title, value, type = 'default' }) => (
  <div className={`${styles.statsCard} ${styles[type]}`}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const TechnicianList = ({ technicians }) => (
  <div className={styles.sidebarCard}>
    <h3>Técnicos Ativos</h3>
    <ul className={styles.userList}>
      {technicians.map(t => (
        <li key={t.id}>
          <span>{t.nome}</span>
          <span className={styles.statusActive}>Ativo</span>
        </li>
      ))}
    </ul>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function AdminDashboard() {
  const [chamados, setChamados] = useState(initialChamados);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'criado_em', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  
  // State para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState(null);

  // --- LÓGICA MEMOIZADA PARA PERFORMANCE ---
  const filteredAndSortedChamados = useMemo(() => {
    let items = [...chamados];

    // 1. Filtragem por Status
    if (statusFilter !== 'todos') {
      items = items.filter(c => c.status === statusFilter);
    }

    // 2. Filtragem por Busca
    if (searchTerm) {
      items = items.filter(c =>
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Ordenação
    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return items;
  }, [chamados, statusFilter, searchTerm, sortConfig]);
  
  // --- PAGINAÇÃO ---
  const paginatedChamados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedChamados.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedChamados, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedChamados.length / ITEMS_PER_PAGE);

  // --- ESTATÍSTICAS ---
  const stats = useMemo(() => ({
    total: chamados.length,
    pendente: chamados.filter(c => c.status === 'Pendente').length,
    emAndamento: chamados.filter(c => c.status === 'Em Andamento').length,
    concluido: chamados.filter(c => c.status === 'Concluído').length,
  }), [chamados]);

  // --- HANDLERS ---
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const openModal = (chamado = null) => {
    setEditingChamado(chamado);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingChamado(null);
  };
  
  const handleSaveChamado = (formData) => {
    if(editingChamado) { // Editando
      setChamados(prev => prev.map(c => c.id === editingChamado.id ? { ...c, ...formData } : c));
      toast.success('Chamado atualizado com sucesso!');
    } else { // Criando
      const novoChamado = {
        ...formData,
        id: '#78' + Math.floor(Math.random() * 100),
        status: 'Pendente',
        criado_em: new Date().toISOString().split('T')[0],
      };
      setChamados(prev => [novoChamado, ...prev]);
      toast.success('Novo chamado criado com sucesso!');
    }
    closeModal();
  };
  
  const handleDeleteChamado = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado? Esta ação é irreversível.')) {
      setChamados(prev => prev.filter(c => c.id !== id));
      toast.error('Chamado excluído!');
    }
  };

  // Reseta a página para 1 quando os filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // --- RENDER ---
  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ className: styles.toast, style: { background: '#333', color: '#fff' } }}/>

      <div className={styles.dashboardContainer}>
        <main className={styles.mainGrid}>
          <header className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Painel Administrativo</h1>
              <p className={styles.pageSubtitle}>Visão geral e gerenciamento de chamados técnicos.</p>
            </div>
            <button onClick={() => openModal()} className={styles.addButton}>
              <FiPlus /> Adicionar Chamado
            </button>
          </header>

          <section className={styles.statsGrid}>
            <StatCard title="Total de Chamados" value={stats.total} />
            <StatCard title="Pendentes" value={stats.pendente} type="pending" />
            <StatCard title="Em Andamento" value={stats.emAndamento} type="inProgress" />
            <StatCard title="Concluídos" value={stats.concluido} type="completed" />
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.reportSection}>
              <div className={styles.reportHeader}>
                <h2>Relatório de Chamados</h2>
                <div className={styles.searchContainer}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar por ID ou Título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div className={styles.filters}>
                {['todos', 'Pendente', 'Em Andamento', 'Concluído'].map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)} className={statusFilter === f ? styles.activeFilter : ''}>
                    {f === 'todos' ? 'Todos' : f}
                  </button>
                ))}
              </div>

              <div className={styles.tableContainer}>
                <div className={`${styles.tableRow} ${styles.headerRow}`}>
                  <span onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
                  <span onClick={() => handleSort('titulo')}>Título {sortConfig.key === 'titulo' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
                  <span onClick={() => handleSort('tecnico')}>Técnico {sortConfig.key === 'tecnico' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
                  <span onClick={() => handleSort('prioridade')}>Prioridade {sortConfig.key === 'prioridade' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
                  <span onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <FiChevronUp/> : <FiChevronDown/>)}</span>
                  <span>Ações</span>
                </div>

                {paginatedChamados.map(c => (
                  <div className={styles.tableRow} key={c.id}>
                    <span data-label="ID"><strong>{c.id}</strong><small>{c.criado_em}</small></span>
                    <span data-label="Título">{c.titulo}</span>
                    <span data-label="Técnico">{c.tecnico}</span>
                    <span data-label="Prioridade"><div className={`${styles.priorityTag} ${styles[c.prioridade]}`}>{c.prioridade}</div></span>
                    <span data-label="Status"><div className={`${styles.statusTag} ${styles[c.status.replace(/\s+/g, '')]}`}>{c.status}</div></span>
                    <div data-label="Ações" className={styles.actions}>
                      <button onClick={() => openModal(c)} className={styles.actionButton} aria-label="Editar"><FiEdit /></button>
                      <button onClick={() => handleDeleteChamado(c.id)} className={styles.closeButton} aria-label="Excluir"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? styles.activePage : ''}>
                      {page}
                    </button>
                  ))}
                </div>
              )}

            </section>

            <aside className={styles.sidebar}>
              <TechnicianList technicians={usuarios.filter(u => u.funcao === 'Técnico' && u.status === 'ativo')} />
            </aside>
          </div>
        </main>
      </div>
      
      {isModalOpen && <ChamadoModal chamado={editingChamado} onClose={closeModal} onSave={handleSaveChamado} tecnicos={usuarios.filter(u => u.funcao === 'Técnico')} />}
    </>
  );
}

// --- COMPONENTE MODAL ---
function ChamadoModal({ chamado, onClose, onSave, tecnicos }) {
  const [formData, setFormData] = useState({
    titulo: chamado?.titulo || '',
    departamento: chamado?.departamento || '',
    tecnico: chamado?.tecnico || tecnicos[0]?.nome,
    prioridade: chamado?.prioridade || 'Média',
    descricao: chamado?.descricao || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.titulo || !formData.departamento) {
      toast.error('Título e Departamento são obrigatórios!');
      return;
    }
    onSave(formData);
  };
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalHeader}>
            <h2>{chamado ? 'Editar Chamado' : 'Criar Novo Chamado'}</h2>
            <button type="button" className={styles.closeModalButton} onClick={onClose}><FiX /></button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="titulo">Título do Chamado</label>
              <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required autoFocus />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="departamento">Departamento</label>
                <input type="text" id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tecnico">Técnico Responsável</label>
                <select id="tecnico" name="tecnico" value={formData.tecnico} onChange={handleChange}>
                  {tecnicos.map(t => <option key={t.id} value={t.nome}>{t.nome}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Prioridade</label>
              <div className={styles.priorityOptions}>
                {['Baixa', 'Média', 'Alta', 'Urgente'].map(p => (
                   <label key={p}>
                     <input type="radio" name="prioridade" value={p} checked={formData.prioridade === p} onChange={handleChange} />
                     <span className={`${styles.priorityTag} ${styles[p]}`}>{p}</span>
                   </label>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" name="descricao" rows="4" value={formData.descricao} onChange={handleChange}></textarea>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveButton}>Salvar Chamado</button>
          </div>
        </form>
      </div>
    </div>
  );
}