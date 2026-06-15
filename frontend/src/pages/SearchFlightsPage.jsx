import { useEffect, useState } from "react";
import api from "../services/api";

function SearchFlightsPage() {
  const [airports, setAirports] = useState([]);
  const [from, setFrom] = useState("BEG");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await api.get("/airports");

        setAirports(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Greška prilikom učitavanja aerodroma.");
      } finally {
        setLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");
    setSchedules([]);
    setLoadingFlights(true);

    try {
      const params = new URLSearchParams();

      if (from) {
        params.append("from", from);
      }

      if (to) {
        params.append("to", to);
      }

      if (date) {
        params.append("date", date);
      }

      const response = await api.get(`/flights/schedules/search?${params}`);

      setSchedules(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Greška prilikom pretrage letova.");
    } finally {
      setLoadingFlights(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("sr-RS", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="page">
      <section className="section-header">
        <span className="hero-label">Pretraga letova</span>
        <h1>Pronađi odgovarajući let</h1>
        <p>
          Izaberi polazni i dolazni aerodrom. Podaci se učitavaju iz PostgreSQL
          baze preko Node.js backend-a.
        </p>
      </section>

      <section className="search-panel">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Polazni aerodrom</label>
            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              disabled={loadingAirports}
            >
              <option value="">Svi polazni aerodromi</option>

              {airports.map((airport) => (
                <option key={airport.id} value={airport.code}>
                  {airport.city} ({airport.code}) - {airport.country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Dolazni aerodrom</label>
            <select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              disabled={loadingAirports}
            >
              <option value="">Sve destinacije</option>

              {airports.map((airport) => (
                <option key={airport.id} value={airport.code}>
                  {airport.city} ({airport.code}) - {airport.country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Datum polaska</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <button className="primary-button" type="submit">
            Pretraži letove
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="results-section">
        <h2>Rezultati pretrage</h2>

        {loadingFlights && <p>Učitavanje letova...</p>}

        {!loadingFlights && schedules.length === 0 && (
          <p className="muted-text">
            Nema prikazanih letova. Izaberi kriterijume i klikni na pretragu.
          </p>
        )}

        <div className="flight-grid">
          {schedules.map((schedule) => (
            <article className="flight-card" key={schedule.id}>
              <div className="flight-card-header">
                <div>
                  <h3>{schedule.flight.code}</h3>
                  <p>{schedule.flight.airline}</p>
                </div>

                <span className="price-badge">
                  {Number(schedule.basePrice).toFixed(2)} {schedule.currency}
                </span>
              </div>

              <div className="route-box">
                <div>
                  <span>Od</span>
                  <strong>
                    {schedule.flight.originAirport.city} (
                    {schedule.flight.originAirport.code})
                  </strong>
                </div>

                <div className="route-line">→</div>

                <div>
                  <span>Do</span>
                  <strong>
                    {schedule.flight.destinationAirport.city} (
                    {schedule.flight.destinationAirport.code})
                  </strong>
                </div>
              </div>

              <div className="flight-details">
                <p>
                  <strong>Polazak:</strong>{" "}
                  {formatDateTime(schedule.departureTime)}
                </p>

                <p>
                  <strong>Dolazak:</strong>{" "}
                  {formatDateTime(schedule.arrivalTime)}
                </p>

                <p>
                  <strong>Trajanje:</strong> {schedule.flight.durationMinutes}{" "}
                  minuta
                </p>

                <p>
                  <strong>Dostupna mesta:</strong> {schedule.availableSeats}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SearchFlightsPage;
