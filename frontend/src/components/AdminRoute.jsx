import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <main className="page">
        <p>Provera korisnika...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return (
      <main className="page">
        <div className="auth-card">
          <h1>Pristup odbijen</h1>
          <p>Nemate dozvolu za pristup administratorskom panelu.</p>
        </div>
      </main>
    );
  }

  return children;
}

export default AdminRoute;
