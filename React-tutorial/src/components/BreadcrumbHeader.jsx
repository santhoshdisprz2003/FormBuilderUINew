import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/BreadcrumbHeader.css";
import homeIcon from "../assets/home.png";
import arrowIcon from "../assets/AltArrowRight.png";

const BreadcrumbHeader = () => {
const location = useLocation();
const path = location.pathname;

// ✅ Default breadcrumbs
let crumbs = [{ label: "Form Builder", path: "/" }];

// ✅ For "Create Form"
if (path === "/create-form") {
crumbs.push({ label: "Create Form", path: "/create-form" });
}

// ✅ For "View Form" (dynamic route)
if (path.startsWith("/form-builder/view/")) {
crumbs.push({ label: "View Form", path });
}

// ✅ For "Edit Form" (dynamic route)
if (path.startsWith("/form-builder/edit/")) {
crumbs.push({ label: "Edit Form", path });
}

return (
<div className="breadcrumb-header">
<div className="breadcrumb-container">
{/* Home Icon */}
<Link to="/" className="breadcrumb-home-icon">
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
</div>


);
};

export default BreadcrumbHeader;