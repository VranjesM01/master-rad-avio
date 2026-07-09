import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  code: "",
  airline: "",
  durationMinutes: "",
  originAirportId: "",
  destinationAirportId: "",
};

function AdminFlightsPage() {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [flightsResponse, airportsResponse] = await Promise.all([
        api.get("/admin/flights"),
        api.get("/admin/airports"),
      ]);

      setFlights(flightsResponse.data.data);
      setAirports(airportsResponse.data.data);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom učitavanja podataka.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    setEditingFlightId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingFlightId) {
        const response = await api.put(
          `/admin/flights/${editingFlightId}`,
          formData,
        );

        setMessage(response.data.message);
      } else {
        const response = await api.post("/admin/flights", formData);

        setMessage(response.data.message);
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom čuvanja leta.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlightId(flight.id);

    setFormData({
      code: flight.code,
      airline: flight.airline,
      durationMinutes: String(flight.durationMinutes),
      originAirportId: String(flight.originAirportId),
      destinationAirportId: String(flight.destinationAirportId),
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (flightId) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj let?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/admin/flights/${flightId}`);

      setMessage(response.data.message);
      await fetchData();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom brisanja leta.",
      );
    }
  };

  const formatRoute = (flight) => {
    return `${flight.originAirport?.code || "?"} → ${
      flight.destinationAirport?.code || "?"
    }`;
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Upravljanje letovima</h1>
          <p>
            Administrator može da dodaje, menja i briše avio-linije između
            polaznog i dolaznog aerodroma. Konkretni datumi i vremena letova
            dodaju se posebno kroz termine letova.
          </p>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-form-card">
          <h2>{editingFlightId ? "Izmena leta" : "Dodavanje leta"}</h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Šifra leta
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="JU900"
              />
            </label>

            <label>
              Avio-kompanija
              <input
                type="text"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                placeholder="Air Serbia"
              />
            </label>

            <label>
              Trajanje leta u minutima
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                placeholder="120"
                min="1"
              />
            </label>

            <label>
              Polazni aerodrom
              <select
                name="originAirportId"
                value={formData.originAirportId}
                onChange={handleChange}
              >
                <option value="">Izaberi polazni aerodrom</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.city}, {airport.country}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Dolazni aerodrom
              <select
                name="destinationAirportId"
                value={formData.destinationAirportId}
                onChange={handleChange}
              >
                <option value="">Izaberi dolazni aerodrom</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.city}, {airport.country}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Čuvanje..."
                : editingFlightId
                  ? "Sačuvaj izmene"
                  : "Dodaj let"}
            </button>

            {editingFlightId && (
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
          <h2>Lista letova</h2>

          {loading ? (
            <p>Učitavanje letova...</p>
          ) : flights.length === 0 ? (
            <p>Nema unetih letova.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Šifra</th>
                    <th>Kompanija</th>
                    <th>Ruta</th>
                    <th>Trajanje</th>
                    <th>Termini</th>
                    <th>Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.id}>
                      <td>{flight.id}</td>
                      <td>{flight.code}</td>
                      <td>{flight.airline}</td>
                      <td>{formatRoute(flight)}</td>
                      <td>{flight.durationMinutes} min</td>
                      <td>{flight.schedules?.length || 0}</td>
                      <td className="admin-actions">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleEdit(flight)}
                        >
                          Izmeni
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(flight.id)}
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

export default AdminFlightsPage;
