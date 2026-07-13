import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function SearchFlightsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const [airports, setAirports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    from: searchParams.get("from") || "BEG",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || getTomorrowDate(),
    passengerCount: "1",
  });

  const [loadingAirports, setLoadingAirports] = useState(true);
  const [searching, setSearching] = useState(false);
  const [bookingScheduleId, setBookingScheduleId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadAirports() {
      try {
        const response = await api.get("/airports");

        if (!ignore) {
          setAirports(response.data.data || response.data || []);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Greška prilikom učitavanja aerodroma.",
          );
        }
      } finally {
        if (!ignore) {
          setLoadingAirports(false);
        }
      }
    }

    loadAirports();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function autoSearchFromRecommendation() {
      const to = searchParams.get("to");

      if (!to) {
        return;
      }

      try {
        setSearching(true);
        setMessage("");
        setError("");

        const response = await api.get("/flights/schedules/search", {
          params: {
            from: searchParams.get("from") || "BEG",
            to,
            date: searchParams.get("date") || getTomorrowDate(),
          },
        });

        if (!ignore) {
          setSchedules(response.data.data || []);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Nema pronađenih letova za preporučenu destinaciju.",
          );
        }
      } finally {
        if (!ignore) {
          setSearching(false);
        }
      }
    }

    autoSearchFromRecommendation();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setSearching(true);
      setMessage("");
      setError("");
      setSchedules([]);

      const response = await api.get("/flights/schedules/search", {
        params: {
          from: formData.from,
          to: formData.to,
          date: formData.date,
        },
      });

      setSchedules(response.data.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Greška prilikom pretrage letova.",
      );
    } finally {
      setSearching(false);
    }
  };

  const handleBooking = async (scheduleId) => {
    if (!isAuthenticated) {
      setError("Morate biti prijavljeni da biste rezervisali let.");
      return;
    }

    try {
      setBookingScheduleId(scheduleId);
      setMessage("");
      setError("");

      const response = await api.post("/bookings", {
        scheduleId,
        passengerCount: Number(formData.passengerCount),
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Greška prilikom rezervacije leta.",
      );
    } finally {
      setBookingScheduleId(null);
    }
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Pretraga letova</h1>
          <p>
            Izaberite polazni aerodrom, dolazni aerodrom i datum putovanja. Ako
            ste došli sa AI preporuke, destinacija je automatski popunjena.
          </p>
        </div>
      </section>

      <section className="content-card">
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSearch}>
          <label>
            Polazni aerodrom
            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              disabled={loadingAirports}
            >
              <option value="">Izaberi polazni aerodrom</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.code}>
                  {airport.code} - {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dolazni aerodrom
            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              disabled={loadingAirports}
            >
              <option value="">Izaberi dolazni aerodrom</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.code}>
                  {airport.code} - {airport.city}, {airport.country}
                </option>
              ))}
            </select>
          </label>

          <label>
            Datum
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>

          <label>
            Broj putnika
            <input
              type="number"
              name="passengerCount"
              value={formData.passengerCount}
              onChange={handleChange}
              min="1"
            />
          </label>

          <button type="submit" disabled={searching}>
            {searching ? "Pretraga..." : "Pretraži letove"}
          </button>
        </form>
      </section>

      <section className="content-card">
        <h2>Rezultati pretrage</h2>

        {searching ? (
          <p>Pretraga letova...</p>
        ) : schedules.length === 0 ? (
          <p>Nema prikazanih letova. Pokrenite pretragu.</p>
        ) : (
          <div className="booking-list">
            {schedules.map((schedule) => {
              const flight = schedule.flight;
              const origin = flight?.originAirport;
              const destination = flight?.destinationAirport;

              return (
                <article className="booking-card" key={schedule.id}>
                  <div>
                    <h2>
                      {flight?.code || "Let"} — {origin?.code || "?"} →{" "}
                      {destination?.code || "?"}
                    </h2>

                    <p>
                      <strong>Avio-kompanija:</strong>{" "}
                      {flight?.airline || "Nije dostupno"}
                    </p>

                    <p>
                      <strong>Ruta:</strong> {origin?.city || "?"},{" "}
                      {origin?.country || "?"} → {destination?.city || "?"},{" "}
                      {destination?.country || "?"}
                    </p>

                    <p>
                      <strong>Polazak:</strong>{" "}
                      {formatDateTime(schedule.departureTime)}
                    </p>

                    <p>
                      <strong>Dolazak:</strong>{" "}
                      {formatDateTime(schedule.arrivalTime)}
                    </p>

                    <p>
                      <strong>Dostupna mesta:</strong> {schedule.availableSeats}
                    </p>

                    <p>
                      <strong>Cena po putniku:</strong> {schedule.basePrice}{" "}
                      {schedule.currency}
                    </p>
                  </div>

                  <div className="booking-actions">
                    <button
                      type="button"
                      className="small-button"
                      onClick={() => handleBooking(schedule.id)}
                      disabled={bookingScheduleId === schedule.id}
                    >
                      {bookingScheduleId === schedule.id
                        ? "Rezervisanje..."
                        : "Rezerviši"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchFlightsPage;
