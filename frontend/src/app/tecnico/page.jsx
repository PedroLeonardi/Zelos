'use client';

import { useState } from 'react';
import styles from './tecnico.module.css';
import Header from '../components/Header'; // ajusta o caminho conforme sua estrutura

// Dados iniciais dos chamados (mantive igual)
const initialChamados = [
  { id: '#7821', titulo: 'Reparo Impressora 3D', setor: 'Laboratório de Manufatura', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'high', relatorio: null },
  { id: '#7820', titulo: 'Instalar Software CAD', setor: 'Sala de Desenho Técnico', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'medium', relatorio: null },
  { id: '#7822', titulo: 'Verificar Ponto de Rede', setor: 'Bloco C, Ponto 5', status: 'pendente', atribuido: false, tecnico_id: null, prioridade: 'low', relatorio: null },
  { id: '#7815', titulo: 'Manutenção Torno CNC', setor: 'Oficina Mecânica', status: 'em andamento', atribuido: true, tecnico_id: 2, prioridade: 'high', relatorio: null },
  { id: '#7818', titulo: 'Projetor não liga', setor: 'Auditório Principal', status: 'em andamento', atribuido: true, tecnico_id: 1, prioridade: 'medium', relatorio: null },
  { id: '#7809', titulo: 'Troca de Lâmpadas', setor: 'Secretaria Geral', status: 'concluído', atribuido: true, tecnico_id: 2, prioridade: 'low', relatorio: { descricao: 'Lâmpadas trocadas com sucesso.', comeco: '2025-08-11T10:00', fim: '2025-08-11T10:30' } },
  { id: '#7811', titulo: 'Formatar PC', setor: 'Recepção', status: 'concluído', atribuido: true, tecnico_id: 1, prioridade: 'medium', relatorio: { descricao: 'Sistema operacional reinstalado e drivers atualizados.', comeco: '2025-08-10T14:00', fim: '2025-08-10T16:00' } },
];

const LOGGED_IN_TECNICO = { id: 1, nome: 'Carlos Souza' };

const priorityCardModifier = {
  high: 'ticket-card--priority-high',
  medium: 'ticket-card--priority-medium',
  low: 'ticket-card--priority-low',
};

const priorityTagModifier = {
  high: 'priority-tag--high',
  medium: 'priority-tag--medium',
  low: 'priority-tag--low',
};

const TicketCard = ({ ticket, onOpenModal, onAutoAtribuir }) => {
  const cardClasses = `${styles['ticket-card']} ${styles[priorityCardModifier[ticket.prioridade]] || ''}`;
  const tagClasses = `${styles['priority-tag']} ${styles[priorityTagModifier[ticket.prioridade]] || ''}`;
  const canSelfAssign = !ticket.atribuido && ticket.status === 'pendente';

  return (
    <article className={cardClasses} aria-labelledby={`ticket-title-${ticket.id}`} tabIndex={0}>
      <div className={styles['ticket-card__header']}>
        <span className={styles['ticket-card__id']}>{ticket.id}</span>
        <span className={tagClasses}>{ticket.prioridade}</span>
      </div>
      <h3 id={`ticket-title-${ticket.id}`} className={styles['ticket-card__title']}>{ticket.titulo}</h3>
      <p className={styles['ticket-card__sector']}>{ticket.setor}</p>
      <div className={styles['ticket-card__actions']}>
        {canSelfAssign && (
          <button className={`${styles.button} ${styles['button--primary']}`} onClick={() => onAutoAtribuir(ticket.id)}>
            Se Atribuir
          </button>
        )}
        <button className={`${styles.button} ${styles['button--secondary']}`} onClick={() => onOpenModal(ticket)}>
          Ver Detalhes
        </button>
      </div>
    </article>
  );
};

export default function TecnicoDashboard() {
  const [chamados, setChamados] = useState(initialChamados);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [relatorioForm, setRelatorioForm] = useState({ descricao: '', comeco: '', fim: '' });

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setRelatorioForm(ticket.relatorio || { descricao: '', comeco: '', fim: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
  };

  const handleRelatorioChange = (e) => {
    const { id, value } = e.target;
    setRelatorioForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleAutoAtribuir = (ticketId) => {
    setChamados((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: 'em andamento', atribuido: true, tecnico_id: LOGGED_IN_TECNICO.id } : t
      )
    );
  };

  const handleFinalizarChamado = (e) => {
    e.preventDefault();
    const { descricao, comeco, fim } = relatorioForm;
    if (!descricao.trim() || !comeco || !fim) {
      alert('Preenche tudo aí, caralho: Descrição, Começo e Fim.');
      return;
    }
    setChamados((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, status: 'concluído', relatorio: relatorioForm } : t
      )
    );
    alert(`Chamado ${selectedTicket.id} finalizado na moral!`);
    handleCloseModal();
  };

  const statuses = ['pendente', 'em andamento', 'concluído'];

  const ModalContent = () => {
    if (!selectedTicket) return null;

    const isOwner = selectedTicket.tecnico_id === LOGGED_IN_TECNICO.id;
    const isFinished = selectedTicket.status === 'concluído';
    const isInProgress = selectedTicket.status === 'em andamento';

    if (isFinished) {
      return (
        <section>
          <h4>Relatório de Atendimento</h4>
          <p><strong>Descrição:</strong> {selectedTicket.relatorio?.descricao || 'N/A'}</p>
          <p><strong>Início:</strong> {selectedTicket.relatorio?.comeco ? new Date(selectedTicket.relatorio.comeco).toLocaleString('pt-BR') : 'N/A'}</p>
          <p><strong>Fim:</strong> {selectedTicket.relatorio?.fim ? new Date(selectedTicket.relatorio.fim).toLocaleString('pt-BR') : 'N/A'}</p>
        </section>
      );
    }

    if (isOwner && isInProgress) {
      return (
        <form onSubmit={handleFinalizarChamado}>
          <div className={styles['form-group']}>
            <label htmlFor="descricao" className={styles['form-label']}>Descrição do Atendimento (Obrigatório)</label>
            <textarea
              id="descricao"
              className={styles['form-textarea']}
              value={relatorioForm.descricao}
              onChange={handleRelatorioChange}
              required
              rows={5}
              placeholder="Descreva em detalhes o serviço executado..."
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="comeco" className={styles['form-label']}>Começo (Obrigatório)</label>
            <input
              type="datetime-local"
              id="comeco"
              className={styles['form-textarea']}
              value={relatorioForm.comeco}
              onChange={handleRelatorioChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="fim" className={styles['form-label']}>Fim (Obrigatório)</label>
            <input
              type="datetime-local"
              id="fim"
              className={styles['form-textarea']}
              value={relatorioForm.fim}
              onChange={handleRelatorioChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles['button--primary']} ${styles['apontamento-form__button']}`}
          >
            Finalizar Chamado
          </button>
        </form>
      );
    }

    return (
      <p><em>
        {selectedTicket.atribuido ? 'Este chamado está atribuído a outro técnico.' : 'Pra finalizar, primeiro se atribua ao chamado.'}
      </em></p>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>Kanban de Chamados</h1>
          <p className={styles.header__subtitle}>Olá, <strong>{LOGGED_IN_TECNICO.nome}</strong>. Gerencie seu fluxo de trabalho.</p>
        </header>

        <main className={styles.kanban}>
          {statuses.map((status) => {
            const filteredTickets = chamados.filter((c) => c.status === status);
            return (
              <section key={status} className={styles['kanban__column']} aria-labelledby={`column-title-${status}`}>
                <header className={styles['kanban__column-header']}>
                  <h2 id={`column-title-${status}`} className={styles['kanban__column-title']}>{status}</h2>
                  <span className={styles['kanban__ticket-count']}>{filteredTickets.length}</span>
                </header>
                <div className={styles['kanban__tickets-list']}>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} onOpenModal={handleOpenModal} onAutoAtribuir={handleAutoAtribuir} />
                    ))
                  ) : (
                    <p className={styles['kanban__empty-message']}>Nenhum chamado aqui.</p>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Modal fora do container pra não limitar largura */}
      {modalOpen && selectedTicket && (
        <div className={styles.modal__overlay} onClick={handleCloseModal}>
          <div
            className={styles.modal__content}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            <header className={styles.modal__header}>
              <h2 id="modal-title" className={styles.modal__title}>{selectedTicket.titulo}</h2>
              <button
                className={styles['modal__close-button']}
                onClick={handleCloseModal}
                aria-label="Fechar modal"
              >
                &times;
              </button>
            </header>
            <main className={styles.modal__body}>
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Setor:</strong> {selectedTicket.setor}</p>
              <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedTicket.status}</span></p>
              <hr />
              <ModalContent />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
