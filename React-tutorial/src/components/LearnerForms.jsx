import React, { useState, useEffect } from "react";
import "../styles/LearnerForms.css";
import { getAllForms } from "../api/formService";
import FormFillView from "./FormFillView";

export default function LearnerForms() {
  const [activeTab, setActiveTab] = useState("selfService");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
   const [selectedForm, setSelectedForm] = useState(null);

  // ✅ Fetch only published forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await getAllForms(0, 50);
        const formsData = response?.data || [];
        const publishedForms = formsData.filter(
          (f) => f.status === 1 || f.status === "1"
        );
        setForms(publishedForms);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // Dummy submissions for "My Submissions"
  const submissions = [
    {
      id: 1,
      formName: "External Trainings - Skills Development",
      submittedOn: "May 20, 2025 at 4:00 PM",
    },
    {
      id: 2,
      formName: "Advanced Certification Workshop",
      submittedOn: "Feb 14, 2025 at 8:30 AM",
    },
  ];

  const filteredSubmissions = submissions.filter((item) =>
    item.formName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="loading">Loading forms...</p>;
  if (error) return <p className="error">{error}</p>;

    if (selectedForm) {
    return <FormFillView form={selectedForm} onBack={() => setSelectedForm(null)} />;
  }

  return (
    <div className="learner-container">
      {/* Tabs */}
      <div className="learner-tabs">
        <button
          className={`tab ${activeTab === "selfService" ? "active" : ""}`}
          onClick={() => setActiveTab("selfService")}
        >
          Self-Service Forms
        </button>
        <button
          className={`tab ${activeTab === "mySubmissions" ? "active" : ""}`}
          onClick={() => setActiveTab("mySubmissions")}
        >
          My Submissions
        </button>
      </div>

      {/* Info Box */}
      {activeTab === "selfService" && (
        <div className="learner-info-box">
          <span className="info-icon">ℹ️</span>
          <span>
            These forms are optional and can be submitted multiple times if
            needed.
          </span>
        </div>
      )}

      {/* SELF-SERVICE TAB */}
      {activeTab === "selfService" && (
        <div className="learner-forms-grid">
          {forms.length === 0 ? (
            <p>No published forms available.</p>
          ) : (
            forms.map((form) => (
              <div className="learner-form-card" key={form.id}>
                <h3 className="form-title">
                  {form.config?.title || "Untitled Form"}
                </h3>
                <p className="form-description">
                  {form.config?.description || "No description available"}
                </p>
                <p className="form-date">
                  Published Date:{" "}
                  {form.publishedAt
                    ? new Date(form.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                   <button
                  className="start-button"
                  onClick={() => { console.log("Selected form:", form);
                    setSelectedForm(form)}}
                >
                  Start Completion
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY SUBMISSIONS TAB */}
      {activeTab === "mySubmissions" && (
        <div className="submissions-container">
          <div className="filter-bar">
            <div className="left-section">
              <select className="form-dropdown" disabled>
                <option>External Training Completion</option>
              </select>
            </div>

            <div className="right-section">
              <div className="search-box">
                <img
                  src="/icons/search-icon.png"
                  alt="search"
                  className="search-icon"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="filter-btn">
                <img
                  src="/icons/filter-icon.png"
                  alt="filter"
                  className="filter-icon"
                />
                Filter
              </button>
            </div>
          </div>

          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>Training Name</th>
                  <th>Submitted On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.formName}</td>
                      <td>{item.submittedOn}</td>
                      <td>
                        <button className="view-btn">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No matching submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
