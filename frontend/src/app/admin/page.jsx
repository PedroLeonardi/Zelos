'use client';

import { useState, useMemo, useEffect } from 'react'; // ✨ Adicionado useEffect
import styles from './admin.module.css';

// 🗑️ mockChamadosInit foi removido daqui.

const mockUsuarios = [
  { id: 1, nome: 'Carlos Souza', funcao: 'Técnico', status: 'ativo' },
  { id: 2, nome: 'Ana Pereira', funcao: 'Técnico', status: 'ativo' },
  { id: 3, nome: 'Maria Silva', funcao: 'Usuário', status: 'inativo' },
];



export default function AdminDashboard() {
  // ... outros useState

  // ✨ --- useEffect CORRIGIDO para buscar dados da API --- ✨


  const [filter, setFilter] = useState('todos');
  // ✨ O estado inicial de 'chamados' agora é um array vazio.
  const [chamados, setChamados] = useState([]); 
  const [loading, setLoading] = useState(true); // ✨ Novo estado para controlar o carregamento
  const [error, setError] = useState(null); // ✨ Novo estado para controlar erros
  
  const [editId, setEditId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editTecnico, setEditTecnico] = useState('');

  // ✨ --- NOVO: useEffect para buscar dados da API --- ✨
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await fetch('http://localhost:8080/relatorio/get');
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados da API');
        }
        const data = await response.json(); // 'data' é o objeto { mensagem: [...] }

        // ✨ AQUI ESTÁ A CORREÇÃO PRINCIPAL ✨
        // Acessamos a propriedade 'mensagem' que contém o array.
        if (data && Array.isArray(data.mensagem)) {
          // Precisamos mapear os campos da sua API para os nomes que o front-end espera
          const chamadosMapeados = data.mensagem.map(item => ({
            id: `#${item.chamado_id}`, // O front espera um ID com '#'
            titulo: item.chamado_titulo,
            // O front espera 'tecnico' e a API envia 'tecnico_id'. Precisamos ajustar isso.
            // Por enquanto, vamos deixar em branco ou usar o ID.
            tecnico: item.tecnico_id ? `Técnico: ${item.tecnico_nome}, ID:${item.tecnico_id}` : '', // Ajuste temporário
            status: item.status || 'Pendente', // Se a API não envia status, definimos um padrão
            criado_em: item.data_criacao ? item.data_criacao.split('T')[0] : new Date().toISOString().split('T')[0], // Ajuste o nome do campo se necessário
          }));
          setChamados(chamadosMapeados); // ✅ Corrigido!
        } else {
          // Medida de segurança caso a API mude a resposta
          console.warn("A resposta da API não continha um array na chave 'mensagem'.");
          setChamados([]);
        }

      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar chamados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const filteredChamados = useMemo(() => {
    if (filter === 'todos') return chamados;
    if (filter === 'semAtribuicao') {
      return chamados.filter(c => !c.tecnico);
    }
    return chamados.filter(c => c.status === filter);
  }, [filter, chamados]);

  const stats = useMemo(() => ({
    total: chamados.length,
    semAtribuicao: chamados.filter(c => !c.tecnico).length,
    pendente: chamados.filter(c => c.status === 'Pendente').length,
    'Em Andamento': chamados.filter(c => c.status === 'Em Andamento').length,
    concluido: chamados.filter(c => c.status === 'Concluído').length,
  }), [chamados]);

  // ... (o resto das suas funções permanece igual)
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

  const startEdit = (chamado) => {
    setEditId(chamado.id);
    setEditTitulo(chamado.titulo);
    setEditTecnico(chamado.tecnico);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitulo('');
    setEditTecnico('');
  };

  const saveEdit = () => {
    setChamados(prev => prev.map(c => 
      c.id === editId ? { ...c, titulo: editTitulo, tecnico: editTecnico } : c
    ));
    cancelEdit();
  };

  // ✨ --- NOVO: Lógica para exibir mensagens de carregamento e erro --- ✨
  if (loading) {
    return <div className={styles.centeredMessage}>⏳ Carregando chamados...</div>;
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.error}`}>🆘 Erro: {error}</div>;
  }

  return (
    <div className={styles.dashboardWithSidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle do Administrador</h1>
      </header>

      {/* ... O resto do seu JSX permanece o mesmo ... */}
      <section className={styles.statsGrid}>
        <div className={styles.statsCard}><h4>Total de Chamados</h4><p>{stats.total}</p></div>
        <div className={styles.statsCard}><h4>Pendentes</h4><p>{stats.pendente}</p></div>
        <div className={styles.statsCard}><h4>Em Andamento</h4><p>{stats['Em Andamento']}</p></div>
        <div className={styles.statsCard}><h4>Concluídos</h4><p>{stats.concluido}</p></div>
        <div className={styles.statsCard}><h4>Sem atribuição</h4><p>{stats.semAtribuicao}</p></div>
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
              <button onClick={() => setFilter('semAtribuicao')} className={filter === 'semAtribuicao' ? styles.activeFilter : ''}>Sem Atribuição</button>
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
                      <option value="">Nenhum</option>
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
            {/* ✨ Mensagem para quando não houver chamados */}
            {chamados.length === 0 && !loading && (
              <div className={styles.centeredMessage}>Nenhum chamado encontrado.</div>
            )}
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

// ✨ Adicione alguns estilos para as mensagens de carregamento e erro no seu CSS (admin.module.css)
/*
.centeredMessage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #555;
}

.error {
  color: #d9534f;
  font-weight: bold;
}
*/