import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/my");
        setBookings(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Greška prilikom učitavanja rezervacija.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("sr-RS", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="page">
      <section className="section-header">
        <span className="hero-label">Moje rezervacije</span>
        <h1>Pregled rezervisanih letova</h1>
        <p>
          Na ovoj stranici prikazuju se rezervacije trenutno prijavljenog
          korisnika.
        </p>
      </section>

      {loading && <p>Učitavanje rezervacija...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="muted-text">Još uvek nemaš rezervisanih letova.</p>
      )}

      <div className="flight-grid">
        {bookings.map((booking) => (
          <article className="flight-card" key={booking.id}>
            <div className="flight-card-header">
              <div>
                <h3>{booking.schedule.flight.code}</h3>
                <p>{booking.schedule.flight.airline}</p>
              </div>

              <span className="price-badge">
                {Number(booking.totalPrice).toFixed(2)} {booking.currency}
              </span>
            </div>

            <div className="route-box">
              <div>
                <span>Od</span>
                <strong>
                  {booking.schedule.flight.originAirport.city} (
                  {booking.schedule.flight.originAirport.code})
                </strong>
              </div>

              <div className="route-line">→</div>

              <div>
                <span>Do</span>
                <strong>
                  {booking.schedule.flight.destinationAirport.city} (
                  {booking.schedule.flight.destinationAirport.code})
                </strong>
              </div>
            </div>

            <div className="flight-details">
              <p>
                <strong>Polazak:</strong>{" "}
                {formatDateTime(booking.schedule.departureTime)}
              </p>

              <p>
                <strong>Dolazak:</strong>{" "}
                {formatDateTime(booking.schedule.arrivalTime)}
              </p>

              <p>
                <strong>Broj putnika:</strong> {booking.passengerCount}
              </p>

              <p>
                <strong>Status:</strong> {booking.status}
              </p>

              <p>
                <strong>Datum rezervacije:</strong>{" "}
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default MyBookingsPage;
