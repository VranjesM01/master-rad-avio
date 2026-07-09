import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <main className="page">
      <section className="admin-hero">
        <h1>Admin panel</h1>
        <p>
          Administratorski deo aplikacije omogućava upravljanje osnovnim
          podacima sistema, kao što su aerodromi, destinacije, letovi i termini
          letova.
        </p>
      </section>

      <section className="admin-grid">
        <Link className="admin-card" to="/admin/airports">
          <h2>Aerodromi</h2>
          <p>Dodavanje, izmena i brisanje aerodroma.</p>
        </Link>

        <Link className="admin-card" to="/admin/destinations">
          <h2>Destinacije</h2>
          <p>Upravljanje destinacijama za AI preporuke.</p>
        </Link>

        <Link className="admin-card" to="/admin/flights">
          <h2>Letovi</h2>
          <p>Upravljanje avio-linijama između aerodroma.</p>
        </Link>

        <Link className="admin-card disabled-card" to="/admin/schedules">
          <h2>Termini letova</h2>
          <p>Upravljanje konkretnim terminima letova.</p>
        </Link>
      </section>
    </main>
  );
}

export default AdminDashboardPage;
