'use client';

import { useState, useMemo } from 'react';
import styles from './admin.module.css';

// Dados mocados que viriam do banco de dados
const mockChamados = [
    { id: '#7821', titulo: 'Reparo Impressora 3D', tecnico: 'Carlos Souza', status: 'Em Andamento', criado_em: '2025-08-01' },
    { id: '#7815', titulo: 'Manutenção Torno CNC', tecnico: 'Carlos Souza', status: 'Concluído', criado_em: '2025-07-30' },
    { id: '#7820', titulo: 'Instalar Software CAD', tecnico: 'Ana Pereira', status: 'Pendente', criado_em: '2025-08-02' },
    { id: '#7809', titulo: 'Troca de Lâmpadas', tecnico: 'Carlos Souza', status: 'Concluído', criado_em: '2025-07-25' },
    { id: '#7822', titulo: 'Verificar Ponto de Rede', tecnico: 'Ana Pereira', status: 'Em Andamento', criado_em: '2025-08-03' },
];
const mockUsuarios = [
    { id: 1, nome: 'Carlos Souza', funcao: 'Técnico', status: 'ativo' },
    { id: 2, nome: 'Ana Pereira', funcao: 'Técnico', status: 'ativo' },
    { id: 3, nome: 'Maria Silva', funcao: 'Usuário', status: 'inativo' },
];

export default function AdminDashboard() {
  const [filter, setFilter] = useState('todos'); // 'todos', 'Pendente', 'Em Andamento', 'Concluído'

  // useMemo para otimizar a filtragem, só re-calcula se 'filter' ou 'mockChamados' mudar
  const filteredChamados = useMemo(() => {
    if (filter === 'todos') return mockChamados;
    return mockChamados.filter(c => c.status === filter);
  }, [filter]);

  // Cálculo para os cards de estatísticas
  const stats = useMemo(() => ({
    total: mockChamados.length,
    pendente: mockChamados.filter(c => c.status === 'Pendente').length,
    emAndamento: mockChamados.filter(c => c.status === 'Em Andamento').length,
    concluido: mockChamados.filter(c => c.status === 'Concluído').length,
  }), []);


  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle do Administrador</h1>
      </header>

      {/* --- SEÇÃO DE ESTATÍSTICAS --- */}
      <section className={styles.statsGrid}>
        <div className={styles.statsCard}><h4>Total de Chamados</h4><p>{stats.total}</p></div>
        <div className={styles.statsCard}><h4>Pendentes</h4><p>{stats.pendente}</p></div>
        <div className={styles.statsCard}><h4>Em Andamento</h4><p>{stats.emAndamento}</p></div>
        <div className={styles.statsCard}><h4>Concluídos</h4><p>{stats.concluido}</p></div>
      </section>

      {/* --- SEÇÃO DE RELATÓRIOS (TABELA DE CHAMADOS) --- */}
      <section className={styles.mainContent}>
        <div className={styles.reportHeader}>
          <h2 className={styles.sectionTitle}>Relatório de Chamados</h2>
          <div className={styles.filters}>
            <button onClick={() => setFilter('todos')} className={filter === 'todos' ? styles.activeFilter : ''}>Todos</button>
            <button onClick={() => setFilter('Pendente')} className={filter === 'Pendente' ? styles.activeFilter : ''}>Pendentes</button>
            <button onClick={() => setFilter('Em Andamento')} className={filter === 'Em Andamento' ? styles.activeFilter : ''}>Em Andamento</button>
            <button onClick={() => setFilter('Concluído')} className={filter === 'Concluído' ? styles.activeFilter : ''}>Concluídos</button>
          </div>
        </div>

        <div className={styles.reportTable}>
          {/* Cabeçalho da tabela */}
          <div className={`${styles.tableRow} ${styles.headerRow}`}>
            <div>Chamado ID</div>
            <div>Título</div>
            <div>Técnico Responsável</div>
            <div>Data</div>
            <div>Status</div>
          </div>
          {/* Corpo da tabela */}
          {filteredChamados.map(chamado => (
            <div key={chamado.id} className={styles.tableRow}>
              <div><strong>{chamado.id}</strong></div>
              <div>{chamado.titulo}</div>
              <div>{chamado.tecnico}</div>
              <div>{chamado.criado_em}</div>
              <div><span className={`${styles.statusTag} ${styles['status' + chamado.status.replace(' ', '')]}`}>{chamado.status}</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}