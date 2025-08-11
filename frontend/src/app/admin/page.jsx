'use client';

import { useState, useMemo } from 'react';
import styles from './admin.module.css';

const mockChamadosInit = [
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
  const [filter, setFilter] = useState('todos');
  const [chamados, setChamados] = useState(mockChamadosInit);
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editTecnico, setEditTecnico] = useState('');

  const filteredChamados = useMemo(() => {
    if (filter === 'todos') return chamados;
    return chamados.filter(c => c.status === filter);
  }, [filter, chamados]);

  const stats = useMemo(() => ({
    total: chamados.length,
    pendente: chamados.filter(c => c.status === 'Pendente').length,
    'Em Andamento': chamados.filter(c => c.status === 'Em Andamento').length,
    concluido: chamados.filter(c => c.status === 'Concluído').length,
  }), [chamados]);

  const atualizarStatus = (id, novoStatus) => {
    setChamados(prev => prev.map(c => c.id === id ? { ...c, status: novoStatus } : c));
  };

  const adicionarChamado = () => {
    const novoId = '#78' + (830 + chamados.length);
    const novoChamado = {
      id: novoId,
      titulo: 'Chamado Novo Exemplo',
      tecnico: 'Carlos Souza',
      status: 'Pendente',
      criado_em: new Date().toISOString().split('T')[0],
    };
    setChamados(prev => [novoChamado, ...prev]);
  };

  const fecharChamado = (id) => {
    if (confirm('Quer fechar mesmo esse chamado?')) {
      atualizarStatus(id, 'Concluído');
      if(editId === id) cancelEdit();
    }
  };

  // Começa edição
  const startEdit = (chamado) => {
    setEditId(chamado.id);
    setEditTitulo(chamado.titulo);
    setEditTecnico(chamado.tecnico);
  };

  // Cancela edição
  const cancelEdit = () => {
    setEditId(null);
    setEditTitulo('');
    setEditTecnico('');
  };

  // Salva edição
  const saveEdit = () => {
    setChamados(prev => prev.map(c => 
      c.id === editId ? { ...c, titulo: editTitulo, tecnico: editTecnico } : c
    ));
    cancelEdit();
  };

  return (
    <div className={styles.dashboardWithSidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle do Administrador</h1>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statsCard}><h4>Total de Chamados</h4><p>{stats.total}</p></div>
        <div className={styles.statsCard}><h4>Pendentes</h4><p>{stats.pendente}</p></div>
        <div className={styles.statsCard}><h4>Em Andamento</h4><p>{stats['Em Andamento']}</p></div>
        <div className={styles.statsCard}><h4>Concluídos</h4><p>{stats.concluido}</p></div>
      </section>

      <div className={styles.mainWithSidebar}>
        <section className={styles.mainContent}>
          <div className={styles.reportHeader}>
            <h2 className={styles.sectionTitle}>Relatório de Chamados</h2>
            <div className={styles.filters}>
              <button onClick={() => setFilter('todos')} className={filter === 'todos' ? styles.activeFilter : ''}>Todos</button>
              <button onClick={() => setFilter('Pendente')} className={filter === 'Pendente' ? styles.activeFilter : ''}>Pendentes</button>
              <button onClick={() => setFilter('Em Andamento')} className={filter === 'Em Andamento' ? styles.activeFilter : ''}>Em Andamento</button>
              <button onClick={() => setFilter('Concluído')} className={filter === 'Concluído' ? styles.activeFilter : ''}>Concluídos</button>
              <button onClick={adicionarChamado} className={styles.addButton}>+ Novo Chamado</button>
            </div>
          </div>

          <div className={styles.reportTable}>
            <div className={`${styles.tableRow} ${styles.headerRow}`}>
              <div>Chamado ID</div>
              <div>Título</div>
              <div>Técnico Responsável</div>
              <div>Data</div>
              <div>Status</div>
              <div>Ações</div>
            </div>

            {filteredChamados.map(chamado => (
              <div key={chamado.id} className={styles.tableRow}>
                <div><strong>{chamado.id}</strong></div>
                
                <div>
                  {editId === chamado.id ? (
                    <input 
                      type="text" 
                      value={editTitulo} 
                      onChange={e => setEditTitulo(e.target.value)} 
                      autoFocus
                    />
                  ) : (
                    chamado.titulo
                  )}
                </div>

                <div>
                  {editId === chamado.id ? (
                    <select value={editTecnico} onChange={e => setEditTecnico(e.target.value)}>
                      {mockUsuarios.filter(u => u.funcao === 'Técnico' && u.status === 'ativo').map(user => (
                        <option key={user.id} value={user.nome}>{user.nome}</option>
                      ))}
                    </select>
                  ) : (
                    chamado.tecnico
                  )}
                </div>

                <div>{chamado.criado_em}</div>

                <div>
                  <span className={`${styles.statusTag} ${styles['status' + chamado.status.replace(' ', '')]}`}>
                    {chamado.status}
                  </span>
                </div>

                <div className={styles.actions}>
                  {editId === chamado.id ? (
                    <>
                      <button onClick={saveEdit}>Salvar</button>
                      <button onClick={cancelEdit} className={styles.danger}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      {chamado.status !== 'Concluído' && (
                        <>
                          <button onClick={() => atualizarStatus(chamado.id, 'Em Andamento')}>Iniciar</button>
                          <button onClick={() => fecharChamado(chamado.id)} className={styles.danger}>Fechar</button>
                          <button onClick={() => startEdit(chamado)}>Editar</button>
                        </>
                      )}
                      {chamado.status === 'Concluído' && <span>✓</span>}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.sidebarContent}>
          <h3>Técnicos Ativos</h3>
          <ul className={styles.userList}>
            {mockUsuarios.filter(u => u.funcao === 'Técnico' && u.status === 'ativo').map(user => (
              <li key={user.id} className={styles.userRow}>
                <span>{user.nome}</span>
                <span className={styles.statusActive}>Ativo</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
