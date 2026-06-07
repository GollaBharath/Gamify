// client/src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./components/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

// ✅ Lazy-loaded route components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile   = lazy(() => import("./pages/Profile"));
const AuthForms = lazy(() => import("./pages/AuthForms"));
const About     = lazy(() => import("./pages/About"));
const Contact   = lazy(() => import("./pages/Contact"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />

        {/* ✅ Wrap all Routes in Suspense with fallback */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/login"   element={<AuthForms />} />
            <Route path="/about"   element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;