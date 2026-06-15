import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Flight AI Recommender</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Početna</Link>
        <Link to="/search-flights">Pretraga letova</Link>
      </div>
    </nav>
  );
}

export default Navbar;
