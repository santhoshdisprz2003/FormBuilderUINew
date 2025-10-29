import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import FormBuilderHome from "./components/FormBuilderHome";
import CreateForm from "./components/CreateForm";
import BreadcrumbHeader from "./components/BreadcrumbHeader";
import ViewForm from "./components/ViewForm";
import LearnerForms from "./components/LearnerForms"; // ✅ new import

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role")?.toLowerCase(); // "admin" or "learner"
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <Router>
      {/* ✅ Show breadcrumb when logged in */}
      {isLoggedIn && <BreadcrumbHeader />}

      <Routes>
        {/* ✅ Public login route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Root route — redirect based on role */}
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

        {/* ✅ Learner route */}
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

        {/* ✅ Admin route */}
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

        {/* ✅ Shared routes (available for logged-in users) */}
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
    </Router>
  );
}
