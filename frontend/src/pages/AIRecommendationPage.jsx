import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AIRecommendationPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadQuestions() {
      try {
        const response = await api.get("/recommendations/questions");

        if (!ignore) {
          setQuestions(response.data.data || []);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Greška prilikom učitavanja AI pitanja.",
          );
        }
      } finally {
        if (!ignore) {
          setLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSingleAnswer = (questionId, value) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  };

  const handleMultipleAnswer = (questionId, option) => {
    setAnswers((currentAnswers) => {
      const currentValues = currentAnswers[questionId] || [];

      if (currentValues.includes(option)) {
        return {
          ...currentAnswers,
          [questionId]: currentValues.filter((item) => item !== option),
        };
      }

      return {
        ...currentAnswers,
        [questionId]: [...currentValues, option],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");
      setResult(null);

      const response = await api.post("/recommendations", {
        answers,
      });

      setResult(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Greška prilikom generisanja AI preporuka.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowFlights = (airportCode) => {
    if (!airportCode) {
      setError(
        "Za ovu destinaciju trenutno nije povezan aerodrom, pa pretraga letova nije dostupna.",
      );
      return;
    }

    navigate(`/search-flights?from=BEG&to=${airportCode}`);
  };

  const renderQuestion = (question) => {
    const selectedValue = answers[question.id];

    if (question.type === "multiple") {
      const selectedValues = selectedValue || [];

      return (
        <div className="question-options">
          {question.options.map((option) => (
            <label className="checkbox-option" key={option}>
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleMultipleAnswer(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    return (
      <select
        value={selectedValue || ""}
        onChange={(event) =>
          handleSingleAnswer(question.id, event.target.value)
        }
      >
        <option value="">Izaberite odgovor</option>
        {question.options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  return (
    <main className="page">
      <section className="admin-page-header">
        <div>
          <h1>AI preporuke destinacija</h1>
          <p>
            Odgovorite na nekoliko pitanja, a sistem će predložiti destinacije
            koje najviše odgovaraju vašim preferencijama.
          </p>
        </div>
      </section>

      <section className="content-card">
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {loadingQuestions ? (
          <p>Učitavanje pitanja...</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="question-card" key={question.id}>
                <label>
                  {question.text}
                  {renderQuestion(question)}
                </label>
              </div>
            ))}

            <button type="submit" disabled={submitting}>
              {submitting ? "Generisanje..." : "Generiši preporuke"}
            </button>
          </form>
        )}
      </section>

      {result?.recommendations?.length > 0 && (
        <section className="content-card">
          <h2>Preporučene destinacije</h2>

          <div className="recommendation-grid">
            {result.recommendations.map((recommendation) => (
              <article
                className="recommendation-card"
                key={`${recommendation.city}-${recommendation.country}`}
              >
                <h3>
                  {recommendation.city}, {recommendation.country}
                </h3>

                <p>
                  <strong>Poklapanje:</strong> {recommendation.score}%
                </p>

                <p>{recommendation.reason}</p>

                {recommendation.airportCode ? (
                  <p>
                    <strong>Aerodrom:</strong> {recommendation.airportCode}
                  </p>
                ) : (
                  <p>
                    <strong>Aerodrom:</strong> nije povezan
                  </p>
                )}

                <button
                  type="button"
                  className="small-button"
                  onClick={() => handleShowFlights(recommendation.airportCode)}
                >
                  Prikaži letove
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default AIRecommendationPage;
