import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { Home } from "./components/Home.jsx";
import { About } from "./pages/About.jsx";
import { Contact } from "./pages/Contact.jsx";
import { LoginForm, RegisterForm } from "./pages/AuthForms.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Profile } from "./pages/Profile.jsx";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Chatbot from "./components/chatbot.jsx";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop /> {/* Always keep this inside Router */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Protected section */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
        <Chatbot />
      </div>
    </AuthProvider>
  );
}
