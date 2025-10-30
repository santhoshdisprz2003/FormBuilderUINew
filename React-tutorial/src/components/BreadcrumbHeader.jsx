import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/BreadcrumbHeader.css";
import homeIcon from "../assets/home.png";
import arrowIcon from "../assets/AltArrowRight.png";

const BreadcrumbHeader = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname || "/";

  // Role stored in localStorage: "admin" or "learner" (or null)
  const role = localStorage.getItem("role") || null;

  // Optional debug - uncomment while testing
  // console.log("BreadcrumbHeader -> role:", role, "path:", path);

  // We'll build crumbs as an array of { label, path } AFTER the home icon.
  let crumbs = [];

  // --- Learner role breadcrumbs ---
  if (role === "learner") {
    // If at the learner listing page:
    if (path === "/" || path === "/learner-forms") {
      // Show Action Center > Forms (Forms is current if at /learner-forms)
      crumbs = [{ label: "Action Center", path: "/" }, { label: "Forms", path: "/learner-forms" }];
    }
    // If viewing a specific learner form page (e.g. /learner-forms/123 or /learner-forms/view/123)
    else if (path.startsWith("/learner-forms/") || path.startsWith("/learner-forms/view")) {
      crumbs = [
        { label: "Action Center", path: "/" },
        { label: "Forms", path: "/learner-forms" },
        { label: "View", path }, // current
      ];
    }
    // Generic fallback for other learner endpoints
    else {
      crumbs = [{ label: "Action Center", path: "/" }, { label: "Forms", path: "/learner-forms" }];
    }
  }

  // --- Admin role (default) breadcrumbs ---
  else {
    // Default admin landing crumb
    crumbs = [{ label: "Form Builder", path: "/" }];

    // Create Form
    if (path === "/create-form") {
      crumbs.push({ label: "Create Form", path: "/create-form" });
    }

    // Dynamic: View Form (example: /form-builder/view/abc)
    else if (path.startsWith("/form-builder/view/")) {
      crumbs.push({ label: "View Form", path });
    }

    // Dynamic: Edit Form (example: /form-builder/edit/abc)
    else if (path.startsWith("/form-builder/edit/")) {
      crumbs.push({ label: "Edit Form", path });
    }

    // If on some other admin area (like explicit /form-builder)
    else if (path === "/form-builder") {
      crumbs = [{ label: "Form Builder", path: "/form-builder" }];
    }
  }

  // Final safety: ensure crumbs is not empty
  if (!crumbs || crumbs.length === 0) {
    crumbs = [{ label: role === "learner" ? "Action Center" : "Form Builder", path: "/" }];
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (onLogout) onLogout();
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="breadcrumb-header">
      {/* 👇 Left side: breadcrumbs */}
      <div className="breadcrumb-container">
        {/* Home Icon */}
        <Link to="/" className="breadcrumb-home-icon" aria-label="Home">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </Link>

        {/* Render each crumb after the home icon */}
        {crumbs.map((crumb, index) => (
          <span key={index} className="breadcrumb-item">
            <img src={arrowIcon} alt=">" className="arrow-icon" />
            {index < crumbs.length - 1 ? (
              <Link to={crumb.path} className="breadcrumb-link">
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumb-current">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* 👇 Right side: logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

};

export default BreadcrumbHeader;
