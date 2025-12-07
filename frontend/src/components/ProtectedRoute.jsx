export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
