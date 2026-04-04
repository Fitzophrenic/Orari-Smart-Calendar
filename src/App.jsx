import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import pages
import Calendar from "./pages/Calendar";
import Categories from "./pages/Categories";
import Suggestions from "./pages/Suggestions";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-black text-white flex justify-between items-center p-4">
          <h1 className="text-lg font-bold">Orari</h1>
          <div>🔔</div> {/* Bell icon placeholder */}
        </header>

        <div className="flex flex-1">
          {/* Sidebar (desktop) */}
          <nav className="hidden md:flex flex-col bg-gray-100 w-48 p-4">
            <Link className="mb-2" to="/">Calendar</Link>
            <Link className="mb-2" to="/categories">Categories</Link>
            <Link className="mb-2" to="/suggestions">Suggestions</Link>
            <Link className="mb-2" to="/alerts">Alerts</Link>
            <Link className="mb-2" to="/profile">Profile</Link>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Calendar />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>

        {/* Bottom Nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-100 flex justify-around p-2">
          <Link to="/">Cal</Link>
          <Link to="/categories">Cat</Link>
          <Link to="/suggestions">Sug</Link>
          <Link to="/alerts">Alrt</Link>
          <Link to="/profile">Prof</Link>
        </nav>
      </div>
    </Router>
  );
}