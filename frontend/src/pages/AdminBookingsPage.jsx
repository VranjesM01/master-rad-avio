import { useEffect, useState } from "react";
import api from "../services/api";

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("sr-RS", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getStatusClass(status) {
  if (status === "CANCELLED") {
    return "status-cancelled";
  }

  if (status === "PENDING") {
    return "status-pending";
  }

  return "status-confirmed";
}

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
      try {
        const response = await api.get("/admin/bookings");

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

    loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>Pregled svih rezervacija</h1>
          <p>
            Administrator može da vidi sve rezervacije korisnika, njihov status,
            podatke o putniku i podatke o letu.
          </p>
        </div>
      </section>

      <section className="content-card">
        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Učitavanje rezervacija...</p>
        ) : bookings.length === 0 ? (
          <p>Trenutno nema rezervacija.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Korisnik</th>
                  <th>Email</th>
                  <th>Let</th>
                  <th>Ruta</th>
                  <th>Polazak</th>
                  <th>Putnici</th>
                  <th>Cena</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const user = booking.user;
                  const schedule = booking.schedule;
                  const flight = schedule?.flight;
                  const origin = flight?.originAirport;
                  const destination = flight?.destinationAirport;

                  return (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>

                      <td>
                        {user?.firstName} {user?.lastName}
                      </td>

                      <td>{user?.email}</td>

                      <td>{flight?.code || "-"}</td>

                      <td>
                        {origin?.code || "?"} → {destination?.code || "?"}
                      </td>

                      <td>{formatDateTime(schedule?.departureTime)}</td>

                      <td>{booking.passengerCount}</td>

                      <td>
                        {booking.totalPrice} {booking.currency}
                      </td>

                      <td>
                        <span className={getStatusClass(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBookingsPage;
