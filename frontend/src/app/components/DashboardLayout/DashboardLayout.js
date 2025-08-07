import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
}