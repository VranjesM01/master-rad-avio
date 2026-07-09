import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  city: "",
  country: "",
  code: "",
};

function AdminAirportsPage() {
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingAirportId, setEditingAirportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAirports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/airports");

      setAirports(response.data.data);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom učitavanja aerodroma.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAirportId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingAirportId) {
        const response = await api.put(
          `/admin/airports/${editingAirportId}`,
          formData,
        );

        setMessage(response.data.message);
      } else {
        const response = await api.post("/admin/airports", formData);

        setMessage(response.data.message);
      }

      resetForm();
      await fetchAirports();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom čuvanja aerodroma.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (airport) => {
    setEditingAirportId(airport.id);

    setFormData({
      name: airport.name,
      city: airport.city,
      country: airport.country,
      code: airport.code,
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (airportId) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj aerodrom?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/admin/airports/${airportId}`);

      setMessage(response.data.message);
      await fetchAirports();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom brisanja aerodroma.",
      );
    }
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Upravljanje aerodromima</h1>
          <p>
            Administrator može da dodaje nove aerodrome, menja postojeće i briše
            aerodrome koji nisu povezani sa letovima.
          </p>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-form-card">
          <h2>
            {editingAirportId ? "Izmena aerodroma" : "Dodavanje aerodroma"}
          </h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Naziv aerodroma
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Belgrade Nikola Tesla Airport"
              />
            </label>

            <label>
              Grad
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Belgrade"
              />
            </label>

            <label>
              Država
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Serbia"
              />
            </label>

            <label>
              Oznaka aerodroma
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="BEG"
                maxLength="3"
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Čuvanje..."
                : editingAirportId
                  ? "Sačuvaj izmene"
                  : "Dodaj aerodrom"}
            </button>

            {editingAirportId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Otkaži izmenu
              </button>
            )}
          </form>
        </div>

        <div className="admin-table-card">
          <h2>Lista aerodroma</h2>

          {loading ? (
            <p>Učitavanje aerodroma...</p>
          ) : airports.length === 0 ? (
            <p>Nema unetih aerodroma.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Oznaka</th>
                    <th>Naziv</th>
                    <th>Grad</th>
                    <th>Država</th>
                    <th>Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {airports.map((airport) => (
                    <tr key={airport.id}>
                      <td>{airport.id}</td>
                      <td>{airport.code}</td>
                      <td>{airport.name}</td>
                      <td>{airport.city}</td>
                      <td>{airport.country}</td>
                      <td className="admin-actions">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleEdit(airport)}
                        >
                          Izmeni
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(airport.id)}
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminAirportsPage;
