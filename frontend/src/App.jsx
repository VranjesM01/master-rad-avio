import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./pages/HomePage";
import SearchFlightsPage from "./pages/SearchFlightsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AIRecommendationPage from "./pages/AIRecommendationPage";
import MyRecommendationsPage from "./pages/MyRecommendationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAirportsPage from "./pages/AdminAirportsPage";
import AdminDestinationsPage from "./pages/AdminDestinationsPage";
import AdminFlightsPage from "./pages/AdminFlightsPage";
import AdminSchedulesPage from "./pages/AdminSchedulesPage";

import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-flights" element={<SearchFlightsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-recommendations"
            element={
              <ProtectedRoute>
                <AIRecommendationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-recommendations"
            element={
              <ProtectedRoute>
                <MyRecommendationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/airports"
            element={
              <AdminRoute>
                <AdminAirportsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/destinations"
            element={
              <AdminRoute>
                <AdminDestinationsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/flights"
            element={
              <AdminRoute>
                <AdminFlightsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/schedules"
            element={
              <AdminRoute>
                <AdminSchedulesPage />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
