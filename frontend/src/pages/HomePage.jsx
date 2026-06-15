import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">Master rad projekat</span>

          <h1>Web aplikacija za avionske karte i AI preporuku destinacija</h1>

          <p>
            Aplikacija omogućava korisnicima pretragu avionskih letova, pregled
            dostupnih termina i kasnije dobijanje preporuka za destinacije na
            osnovu korisničkih preferencija.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/search-flights">
              Pretraži letove
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h3>Funkcionalnosti sistema</h3>

          <ul>
            <li>Pretraga avionskih letova</li>
            <li>Pregled aerodroma i destinacija</li>
            <li>Rezervacija karata</li>
            <li>AI preporuka destinacija</li>
            <li>Korisnički i admin deo</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
