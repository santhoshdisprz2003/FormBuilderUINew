import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import FormBuilderHome from "./components/FormBuilderHome";
import CreateForm from "./components/CreateForm";
import BreadcrumbHeader from "./components/BreadcrumbHeader"; // ✅ new import

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* ✅ Always show breadcrumb header above content */}
      {isLoggedIn && <BreadcrumbHeader />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <FormBuilderHome onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/create-form"
          element={
            isLoggedIn ? (
              <CreateForm />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
