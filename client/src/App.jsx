import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Recruiters from "./pages/Recruiters";
import CompanyDetails from "./components/CompanyDetails";
import Blogs from "./pages/blogs/Blogs";
import BlogPost from "./pages/blogs/BlogPost";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PlacementCalendar from "./pages/PlacementCalendar";
import TrendingSkills from "./pages/TrendingSkills";
import EventsSection from "./components/EventsSection";
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/recruiters" element={<Recruiters />} />
              <Route path="/recruiters/:id" element={<CompanyDetails />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogPost />} />
              <Route path="/events" element={<EventsSection />} />
              <Route path="/calendar" element={<PlacementCalendar />} />
              <Route path="/skills" element={<TrendingSkills />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
