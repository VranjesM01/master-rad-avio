import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  flightId: "",
  departureTime: "",
  arrivalTime: "",
  basePrice: "",
  currency: "EUR",
  availableSeats: "",
};

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [schedulesResponse, flightsResponse] = await Promise.all([
        api.get("/admin/schedules"),
        api.get("/admin/flights"),
      ]);

      setSchedules(schedulesResponse.data.data);
      setFlights(flightsResponse.data.data);
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
    setEditingScheduleId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingScheduleId) {
        const response = await api.put(
          `/admin/schedules/${editingScheduleId}`,
          formData,
        );

        setMessage(response.data.message);
      } else {
        const response = await api.post("/admin/schedules", formData);

        setMessage(response.data.message);
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom čuvanja termina leta.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingScheduleId(schedule.id);

    setFormData({
      flightId: String(schedule.flightId),
      departureTime: toDateTimeLocal(schedule.departureTime),
      arrivalTime: toDateTimeLocal(schedule.arrivalTime),
      basePrice: String(schedule.basePrice),
      currency: schedule.currency,
      availableSeats: String(schedule.availableSeats),
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (scheduleId) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da obrišete ovaj termin leta?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/admin/schedules/${scheduleId}`);

      setMessage(response.data.message);
      await fetchData();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom brisanja termina leta.",
      );
    }
  };

  const formatFlightOption = (flight) => {
    return `${flight.code} - ${flight.originAirport?.code || "?"} → ${
      flight.destinationAirport?.code || "?"
    }`;
  };

  const formatScheduleRoute = (schedule) => {
    const flight = schedule.flight;

    return `${flight?.code || "?"} | ${flight?.originAirport?.code || "?"} → ${
      flight?.destinationAirport?.code || "?"
    }`;
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Upravljanje terminima letova</h1>
          <p>
            Administrator može da dodaje konkretne termine letova, odnosno vreme
            polaska, vreme dolaska, cenu i broj dostupnih mesta.
          </p>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-form-card">
          <h2>
            {editingScheduleId
              ? "Izmena termina leta"
              : "Dodavanje termina leta"}
          </h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Let
              <select
                name="flightId"
                value={formData.flightId}
                onChange={handleChange}
              >
                <option value="">Izaberi let</option>
                {flights.map((flight) => (
                  <option key={flight.id} value={flight.id}>
                    {formatFlightOption(flight)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Vreme polaska
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
              />
            </label>

            <label>
              Vreme dolaska
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
              />
            </label>

            <label>
              Osnovna cena
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="120"
                min="1"
                step="0.01"
              />
            </label>

            <label>
              Valuta
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="EUR"
                maxLength="3"
              />
            </label>

            <label>
              Dostupna mesta
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                placeholder="120"
                min="0"
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Čuvanje..."
                : editingScheduleId
                  ? "Sačuvaj izmene"
                  : "Dodaj termin"}
            </button>

            {editingScheduleId && (
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
          <h2>Lista termina letova</h2>

          {loading ? (
            <p>Učitavanje termina letova...</p>
          ) : schedules.length === 0 ? (
            <p>Nema unetih termina letova.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Let</th>
                    <th>Polazak</th>
                    <th>Dolazak</th>
                    <th>Cena</th>
                    <th>Mesta</th>
                    <th>Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{formatScheduleRoute(schedule)}</td>
                      <td>{formatDateTime(schedule.departureTime)}</td>
                      <td>{formatDateTime(schedule.arrivalTime)}</td>
                      <td>
                        {schedule.basePrice} {schedule.currency}
                      </td>
                      <td>{schedule.availableSeats}</td>
                      <td className="admin-actions">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleEdit(schedule)}
                        >
                          Izmeni
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(schedule.id)}
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

export default AdminSchedulesPage;
