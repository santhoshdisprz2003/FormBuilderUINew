import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/BreadcrumbHeader.css";
import homeIcon from "../assets/home.png";       
import arrowIcon from "../assets/AltArrowRight.png"; 

const BreadcrumbHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  // Dynamic breadcrumb structure
  let crumbs = [
    { label: "Form Builder", path: "/" },
  ];

  if (path === "/create-form") {
    crumbs.push({ label: "Create Form", path: "/create-form" });
  }

  return (
    <div className="breadcrumb-header">
      <div className="breadcrumb-container">
        {/* ✅ Home Icon (acts as a link) */}
        <Link to="/" className="breadcrumb-home-icon">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </Link>

        {crumbs.map((crumb, index) => (
          <span key={index} className="breadcrumb-item">
            {/* ✅ Custom arrow icon */}
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
    </div>
  );
};

export default BreadcrumbHeader;