import ProtectedRoute from '../components/ProtectedRoute';

export default function UsuarioLayout({ children }) {
  return (
    <ProtectedRoute funcoesPermitidas={['Técnico']}>
      {children}
    </ProtectedRoute>
  );
}