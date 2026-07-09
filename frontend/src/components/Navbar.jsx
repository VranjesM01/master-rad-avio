import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Flight AI Recommender</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Početna</Link>
        <Link to="/search-flights">Pretraga letova</Link>

        {isAuthenticated && (
          <>
            <Link to="/ai-recommendations">AI preporuke</Link>
            <Link to="/my-recommendations">Moje AI preporuke</Link>
            <Link to="/my-bookings">Moje rezervacije</Link>
            <Link to="/profile">Profil</Link>
          </>
        )}

        {isAuthenticated && user?.role === "ADMIN" && (
          <Link to="/admin">Admin panel</Link>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </>
        ) : (
          <>
            <span className="nav-user">
              {user?.firstName} {user?.role === "ADMIN" ? "(admin)" : ""}
            </span>
            <button className="nav-button" onClick={logout}>
              Odjava
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
