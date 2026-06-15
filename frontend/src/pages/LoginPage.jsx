import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(formData);
      navigate("/profile");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Greška prilikom prijave korisnika.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <span className="hero-label">Prijava</span>

        <h1>Prijava korisnika</h1>

        <p>
          Prijavi se kako bi kasnije mogao da rezervišeš karte i pregledaš svoj
          profil.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email adresa</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="luka@test.com"
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Unesi lozinku"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="primary-button full-width" disabled={submitting}>
            {submitting ? "Prijava..." : "Prijavi se"}
          </button>
        </form>

        <p className="auth-switch">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
