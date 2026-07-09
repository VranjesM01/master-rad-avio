import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  city: "",
  country: "",
  description: "",
  climate: "",
  budgetLevel: "",
  travelType: "",
  imageUrl: "",
};

function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/destinations");

      setDestinations(response.data.data);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom učitavanja destinacija.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
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
    setEditingDestinationId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (editingDestinationId) {
        const response = await api.put(
          `/admin/destinations/${editingDestinationId}`,
          formData,
        );

        setMessage(response.data.message);
      } else {
        const response = await api.post("/admin/destinations", formData);

        setMessage(response.data.message);
      }

      resetForm();
      await fetchDestinations();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Greška prilikom čuvanja destinacije.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (destination) => {
    setEditingDestinationId(destination.id);

    setFormData({
      city: destination.city,
      country: destination.country,
      description: destination.description,
      climate: destination.climate,
      budgetLevel: destination.budgetLevel,
      travelType: destination.travelType,
      imageUrl: destination.imageUrl || "",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (destinationId) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da obrišete ovu destinaciju?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/admin/destinations/${destinationId}`);

      setMessage(response.data.message);
      await fetchDestinations();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom brisanja destinacije.",
      );
    }
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Upravljanje destinacijama</h1>
          <p>
            Administrator može da dodaje, menja i briše destinacije koje se
            koriste u AI modulu za preporuku turističkih putovanja.
          </p>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-form-card">
          <h2>
            {editingDestinationId
              ? "Izmena destinacije"
              : "Dodavanje destinacije"}
          </h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Grad
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Barcelona"
              />
            </label>

            <label>
              Država
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Spain"
              />
            </label>

            <label>
              Opis destinacije
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Grad poznat po plažama, kulturi, arhitekturi i dobroj hrani."
                rows="4"
              />
            </label>

            <label>
              Klima
              <select
                name="climate"
                value={formData.climate}
                onChange={handleChange}
              >
                <option value="">Izaberi klimu</option>
                <option value="warm">Topla</option>
                <option value="moderate">Umerena</option>
                <option value="cold">Hladna</option>
                <option value="hot">Veoma topla</option>
              </select>
            </label>

            <label>
              Budžet
              <select
                name="budgetLevel"
                value={formData.budgetLevel}
                onChange={handleChange}
              >
                <option value="">Izaberi budžet</option>
                <option value="low">Nizak</option>
                <option value="medium">Srednji</option>
                <option value="high">Visok</option>
              </select>
            </label>

            <label>
              Tip putovanja
              <input
                type="text"
                name="travelType"
                value={formData.travelType}
                onChange={handleChange}
                placeholder="city_beach_culture"
              />
            </label>

            <label>
              Slika URL, opciono
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving
                ? "Čuvanje..."
                : editingDestinationId
                  ? "Sačuvaj izmene"
                  : "Dodaj destinaciju"}
            </button>

            {editingDestinationId && (
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
          <h2>Lista destinacija</h2>

          {loading ? (
            <p>Učitavanje destinacija...</p>
          ) : destinations.length === 0 ? (
            <p>Nema unetih destinacija.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Grad</th>
                    <th>Država</th>
                    <th>Klima</th>
                    <th>Budžet</th>
                    <th>Tip</th>
                    <th>Akcije</th>
                  </tr>
                </thead>

                <tbody>
                  {destinations.map((destination) => (
                    <tr key={destination.id}>
                      <td>{destination.id}</td>
                      <td>{destination.city}</td>
                      <td>{destination.country}</td>
                      <td>{destination.climate}</td>
                      <td>{destination.budgetLevel}</td>
                      <td>{destination.travelType}</td>
                      <td className="admin-actions">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => handleEdit(destination)}
                        >
                          Izmeni
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(destination.id)}
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

export default AdminDestinationsPage;
