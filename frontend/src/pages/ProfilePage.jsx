import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="page">
      <section className="profile-card">
        <span className="hero-label">Korisnički profil</span>

        <h1>Profil korisnika</h1>

        <p>
          Ova stranica je zaštićena i dostupna je samo korisnicima koji imaju
          validan JWT token.
        </p>

        <div className="profile-grid">
          <div>
            <span>Ime</span>
            <strong>{user?.firstName}</strong>
          </div>

          <div>
            <span>Prezime</span>
            <strong>{user?.lastName}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div>
            <span>Uloga</span>
            <strong>{user?.role}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
