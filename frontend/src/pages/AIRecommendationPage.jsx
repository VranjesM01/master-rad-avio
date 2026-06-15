import { useEffect, useState } from "react";
import api from "../services/api";

function AIRecommendationPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [questionsSource, setQuestionsSource] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/recommendations/questions");

        setQuestions(response.data.data);
        setQuestionsSource(response.data.source);
      } catch (error) {
        console.error(error);
        setError("Greška prilikom učitavanja AI pitanja.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSingleChoice = (questionId, value) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));
  };

  const handleMultipleChoice = (questionId, option) => {
    setAnswers((previousAnswers) => {
      const currentValues = previousAnswers[questionId] || [];

      const alreadySelected = currentValues.includes(option);

      const updatedValues = alreadySelected
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option];

      return {
        ...previousAnswers,
        [questionId]: updatedValues,
      };
    });
  };

  const isFormValid = () => {
    return questions.every((question) => {
      const answer = answers[question.id];

      if (question.type === "multiple_choice") {
        return Array.isArray(answer) && answer.length > 0;
      }

      return Boolean(answer);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!isFormValid()) {
      setError("Odgovori na sva pitanja pre generisanja preporuke.");
      return;
    }

    setGenerating(true);

    try {
      const response = await api.post("/recommendations", {
        answers,
      });

      setResult(response.data.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Greška prilikom generisanja AI preporuke.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="page">
      <section className="section-header">
        <span className="hero-label">AI preporuka destinacija</span>

        <h1>Pronađi destinaciju prema svojim preferencijama</h1>

        <p>
          Sistem postavlja pitanja o načinu putovanja, budžetu, klimi i
          aktivnostima, a zatim na osnovu odgovora preporučuje najbolje
          destinacije iz baze podataka.
        </p>
      </section>

      <section className="ai-layout">
        <div className="ai-card">
          <div className="ai-card-header">
            <div>
              <h2>Upitnik za preporuku</h2>
              <p>
                Izvor pitanja:{" "}
                <strong>
                  {questionsSource === "openai"
                    ? "OpenAI API"
                    : "lokalni fallback"}
                </strong>
              </p>
            </div>
          </div>

          {loadingQuestions && <p>Učitavanje pitanja...</p>}

          {!loadingQuestions && (
            <form className="ai-form" onSubmit={handleSubmit}>
              {questions.map((question, index) => (
                <div className="question-card" key={question.id}>
                  <h3>
                    {index + 1}. {question.question}
                  </h3>

                  <div className="options-list">
                    {question.options.map((option) => {
                      const isMultiple = question.type === "multiple_choice";

                      const checked = isMultiple
                        ? (answers[question.id] || []).includes(option)
                        : answers[question.id] === option;

                      return (
                        <label className="option-item" key={option}>
                          <input
                            type={isMultiple ? "checkbox" : "radio"}
                            name={question.id}
                            value={option}
                            checked={checked}
                            onChange={() =>
                              isMultiple
                                ? handleMultipleChoice(question.id, option)
                                : handleSingleChoice(question.id, option)
                            }
                          />

                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {error && <p className="error-message">{error}</p>}

              <button
                className="primary-button full-width"
                disabled={generating}
              >
                {generating ? "Generisanje preporuke..." : "Generiši preporuku"}
              </button>
            </form>
          )}
        </div>

        <div className="ai-card">
          <h2>Rezultat preporuke</h2>

          {!result && (
            <p className="muted-text">
              Nakon popunjavanja upitnika, ovde će se prikazati preporučene
              destinacije.
            </p>
          )}

          {result && (
            <div className="recommendation-result">
              <p className="recommendation-summary">{result.summary}</p>

              <div className="recommendation-list">
                {result.recommendations.map((recommendation) => (
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
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AIRecommendationPage;
