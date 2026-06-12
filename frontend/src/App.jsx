import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [backendMessage, setBackendMessage] = useState("Učitavanje...");

  useEffect(() => {
    api
      .get("/health")
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setBackendMessage(
          "Greška: frontend ne može da se poveže sa backendom.",
        );
      });
  }, []);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Flight AI Recommender</h1>
        <p>Web aplikacija za avionske karte i AI preporuku destinacija.</p>

        <div className="backend-box">
          <strong>Status backend-a:</strong>
          <p>{backendMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
