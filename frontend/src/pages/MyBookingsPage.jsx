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
  const [payingId, setPayingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInitialBookings() {
      try {
        const response = await api.get("/bookings/my");

        if (!ignore) {
          setBookings(response.data.data || []);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Greška prilikom učitavanja rezervacija.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Greška prilikom učitavanja rezervacija.",
      );
    }
  };

  const handlePayBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Da li želite da potvrdite simulirano plaćanje za ovu rezervaciju?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setPayingId(bookingId);
      setMessage("");
      setError("");

      const response = await api.patch(`/bookings/${bookingId}/pay`);

      setMessage(response.data.message);
      await fetchBookings();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Greška prilikom potvrde plaćanja.",
      );
    } finally {
      setPayingId(null);
    }
  };

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

  const getStatusClass = (status) => {
    if (status === "CANCELLED") {
      return "status-cancelled";
    }

    if (status === "PENDING") {
      return "status-pending";
    }

    return "status-confirmed";
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Moje rezervacije</h1>
          <p>
            Ovde možete pogledati svoje rezervacije, potvrditi simulirano
            plaćanje i otkazati aktivne rezervacije.
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

              const isPending = booking.status === "PENDING";
              const isConfirmed = booking.status === "CONFIRMED";
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
                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="booking-actions">
                    {isPending && (
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => handlePayBooking(booking.id)}
                        disabled={payingId === booking.id}
                      >
                        {payingId === booking.id
                          ? "Potvrđivanje..."
                          : "Potvrdi plaćanje"}
                      </button>
                    )}

                    {(isPending || isConfirmed) && !isCancelled && (
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

export default MyBookingsPage;
