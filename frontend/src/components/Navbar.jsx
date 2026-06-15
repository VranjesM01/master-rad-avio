import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Flight AI Recommender</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Početna</Link>
        <Link to="/search-flights">Pretraga letova</Link>

        {isAuthenticated ? (
          <>
            <Link to="/ai-recommendations">AI preporuke</Link>
            <Link to="/my-recommendations">Moje AI preporuke</Link>
            <Link to="/my-bookings">Moje rezervacije</Link>
            <Link to="/profile">Profil</Link>

            <button className="nav-button" onClick={handleLogout}>
              Odjava
            </button>

            <span className="nav-user">{user?.firstName}</span>
          </>
        ) : (
          <>
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
