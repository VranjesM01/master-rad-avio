import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchFlightsPage from "./pages/SearchFlightsPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-flights" element={<SearchFlightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
