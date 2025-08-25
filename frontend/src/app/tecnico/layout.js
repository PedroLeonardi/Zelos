import ProtectedRoute from '../components/ProtectedRoute';

export default function UsuarioLayout({ children }) {
  return (
    <ProtectedRoute funcoesPermitidas={['Técnico', 'Administrador']}>
      {children}
    </ProtectedRoute>
  );
}