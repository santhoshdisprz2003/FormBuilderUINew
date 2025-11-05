import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import FormBuilderHome from "./components/FormBuilderHome";
import CreateForm from "./components/CreateForm";
import BreadcrumbHeader from "./components/BreadcrumbHeader";
import ViewForm from "./components/ViewForm";
import LearnerForms from "./components/LearnerForms";
import "./App.css"

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation(); // 👈 access current route

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role")?.toLowerCase();
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <>
      {/* ✅ Show breadcrumb only when logged in and not on login page */}
      {isLoggedIn && location.pathname !== "/login" && (
        <BreadcrumbHeader onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : role === "learner" ? (
              <Navigate to="/learner-forms" replace />
            ) : role === "admin" ? (
              <Navigate to="/admin-forms" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/learner-forms"
          element={
            isLoggedIn && role === "learner" ? (
              <LearnerForms />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin-forms"
          element={
            isLoggedIn && role === "admin" ? (
              <FormBuilderHome />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/form-builder/view/:id"
          element={isLoggedIn ? <ViewForm /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/form-builder/edit/:formId"
          element={isLoggedIn ? <CreateForm mode="edit" /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/create-form"
          element={isLoggedIn ? <CreateForm /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
