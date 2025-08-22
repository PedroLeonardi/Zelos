import ProtectedRoute from '../components/ProtectedRoute';

export default function UsuarioLayout({ children }) {
  return (
    // A Sofia só deixará entrar quem tiver o crachá de 'Usuário' ou 'Administrador'
    <ProtectedRoute funcoesPermitidas={['Usuário', 'Administrador']}>
      {children}
    </ProtectedRoute>
  );
}