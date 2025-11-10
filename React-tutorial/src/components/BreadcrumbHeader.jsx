import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/BreadcrumbHeader.css";
import homeIcon from "../assets/home.png";
import arrowIcon from "../assets/AltArrowRight.png";

const BreadcrumbHeader = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname || "/";


  const role = localStorage.getItem("role") || null;


  let crumbs = [];


  if (role === "learner") {

    if (path === "/" || path === "/learner-forms") {
      crumbs = [{ label: "Action Center", path: "/" }, { label: "Forms", path: "/learner-forms" }];
    }

    else if (path.startsWith("/learner-forms/") || path.startsWith("/learner-forms/view")) {
      crumbs = [
        { label: "Action Center", path: "/" },
        { label: "Forms", path: "/learner-forms" },
        { label: "View", path },
      ];
    }

    else {
      crumbs = [{ label: "Action Center", path: "/" }, { label: "Forms", path: "/learner-forms" }];
    }
  }


  else {

    crumbs = [{ label: "Form Builder", path: "/" }];


    if (path === "/create-form") {
      crumbs.push({ label: "Create Form", path: "/create-form" });
    }


    else if (path.startsWith("/form-builder/view/")) {
      crumbs.push({ label: "View Form", path });
    }


    else if (path.startsWith("/form-builder/edit/")) {
      crumbs.push({ label: "Edit Form", path });
    }


    else if (path === "/form-builder") {
      crumbs = [{ label: "Form Builder", path: "/form-builder" }];
    }
  }


  if (!crumbs || crumbs.length === 0) {
    crumbs = [{ label: role === "learner" ? "Action Center" : "Form Builder", path: "/" }];
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="breadcrumb-header">

      <div className="breadcrumb-container">

        <Link to="/" className="breadcrumb-home-icon" aria-label="Home">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </Link>


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


      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

};

export default BreadcrumbHeader;
