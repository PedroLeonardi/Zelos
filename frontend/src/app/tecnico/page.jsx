'use client';

import styles from './tecnico.module.css';

// Dados de exemplo para popular o painel. Em um app real, isso viria de uma API.
const chamados = [
  { id: '#7821', title: 'Reparo Impressora 3D', sector: 'Mecatrônica', priority: 'high', status: 'A Fazer' },
  { id: '#7820', title: 'Instalar Software CAD', sector: 'Design Gráfico', priority: 'medium', status: 'A Fazer' },
  { id: '#7822', title: 'Verificar Ponto de Rede', sector: 'Logística', priority: 'low', status: 'A Fazer' },
  { id: '#7815', title: 'Manutenção Preventiva Torno CNC', sector: 'Usinagem', priority: 'high', status: 'Em Andamento' },
  { id: '#7809', title: 'Troca de Lâmpadas Auditório', sector: 'Elétrica', priority: 'low', status: 'Concluído' },
  { id: '#7811', title: 'Formatar PC Secretaria', sector: 'Administrativo', priority: 'medium', status: 'Concluído' },
];

// Componente de Card para reutilização interna na página
const TicketCard = ({ ticket }) => (
  <div className={`${styles.ticketCard} ${styles[ticket.priority]}`}>
    <div className={styles.cardHeader}>
      <span className={styles.ticketId}>{ticket.id}</span>
      <span className={styles.priorityTag}>{ticket.priority.replace('high', 'Alta').replace('medium', 'Média').replace('low', 'Baixa')}</span>
    </div>
    <h3 className={styles.cardTitle}>{ticket.title}</h3>
    <p className={styles.cardSector}>{ticket.sector}</p>
    <button className={styles.detailsButton}>Ver Detalhes</button>
  </div>
);


export default function TecnicoDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kanban de Chamados</h1>
        <p className={styles.subtitle}>Gerencie seu fluxo de trabalho de forma visual e eficiente.</p>
      </header>

      <div className={styles.kanbanBoard}>
        {/* Coluna "A Fazer" */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnTitle}>
            <h2>A FAZER</h2>
            <span className={styles.ticketCount}>{chamados.filter(c => c.status === 'A Fazer').length}</span>
          </div>
          {chamados
            .filter(c => c.status === 'A Fazer')
            .map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          }
        </div>

        {/* Coluna "Em Andamento" */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnTitle}>
            <h2>EM ANDAMENTO</h2>
            <span className={styles.ticketCount}>{chamados.filter(c => c.status === 'Em Andamento').length}</span>
          </div>
          {chamados
            .filter(c => c.status === 'Em Andamento')
            .map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          }
        </div>

        {/* Coluna "Concluído" */}
        <div className={styles.kanbanColumn}>
          <div className={styles.columnTitle}>
            <h2>CONCLUÍDO</h2>
            <span className={styles.ticketCount}>{chamados.filter(c => c.status === 'Concluído').length}</span>
          </div>
          {chamados
            .filter(c => c.status === 'Concluído')
            .map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          }
        </div>
      </div>
    </div>
  );
}