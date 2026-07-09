import { useEffect, useState } from "react";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data.data || []);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom učitavanja rezervacija.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da otkažete ovu rezervaciju?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setMessage("");
      setError("");

      const response = await api.patch(`/bookings/${bookingId}/cancel`);

      setMessage(response.data.message);
      await fetchBookings();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Greška prilikom otkazivanja rezervacije.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Moje rezervacije</h1>
          <p>
            Ovde možete pogledati svoje rezervacije i otkazati aktivne
            rezervacije.
          </p>
        </div>
      </section>

      <section className="content-card">
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Učitavanje rezervacija...</p>
        ) : bookings.length === 0 ? (
          <p>Nemate nijednu rezervaciju.</p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => {
              const schedule = booking.schedule;
              const flight = schedule?.flight;
              const origin = flight?.originAirport;
              const destination = flight?.destinationAirport;
              const isCancelled = booking.status === "CANCELLED";

              return (
                <article className="booking-card" key={booking.id}>
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
                      {formatDateTime(schedule?.departureTime)}
                    </p>

                    <p>
                      <strong>Dolazak:</strong>{" "}
                      {formatDateTime(schedule?.arrivalTime)}
                    </p>

                    <p>
                      <strong>Broj putnika:</strong> {booking.passengerCount}
                    </p>

                    <p>
                      <strong>Ukupna cena:</strong> {booking.totalPrice}{" "}
                      {booking.currency}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          isCancelled ? "status-cancelled" : "status-confirmed"
                        }
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  {!isCancelled && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id
                        ? "Otkazivanje..."
                        : "Otkaži rezervaciju"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyBookingsPage;
