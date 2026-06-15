import { useEffect, useState } from "react";
import api from "../services/api";

function MyRecommendationsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/recommendations/my");

        setSessions(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Greška prilikom učitavanja AI preporuka.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
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
        <span className="hero-label">Istorija AI preporuka</span>

        <h1>Moje AI preporuke destinacija</h1>

        <p>
          Na ovoj stranici prikazane su prethodne sesije preporuka koje je
          generisao trenutno prijavljeni korisnik.
        </p>
      </section>

      {loading && <p>Učitavanje AI preporuka...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && sessions.length === 0 && (
        <p className="muted-text">Još uvek nemaš generisane AI preporuke.</p>
      )}

      <div className="session-list">
        {sessions.map((session) => (
          <section className="session-card" key={session.id}>
            <div className="session-header">
              <div>
                <h2>AI sesija #{session.id}</h2>
                <p>{formatDateTime(session.createdAt)}</p>
              </div>
            </div>

            <p className="recommendation-summary">{session.summary}</p>

            <div className="recommendation-list">
              {session.recommendations.map((recommendation) => (
                <article
                  className="recommendation-card"
                  key={recommendation.id}
                >
                  <div className="recommendation-header">
                    <div>
                      <h3>
                        {recommendation.city}, {recommendation.country}
                      </h3>
                      <p>AI ocena poklapanja</p>
                    </div>

                    <span className="score-badge">
                      {recommendation.score}/100
                    </span>
                  </div>

                  <p>{recommendation.reason}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default MyRecommendationsPage;
