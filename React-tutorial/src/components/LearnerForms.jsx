// src/components/LearnerForms.jsx
import React, { useState, useEffect } from "react";
import "../styles/LearnerForms.css";
import { getAllForms, getFormById } from "../api/formService";
import { getAllResponsesByLearner } from "../api/responses";
import FormFillView from "./FormFillView";

export default function LearnerForms() {
  const [activeTab, setActiveTab] = useState("selfService");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedFormDetails, setSelectedFormDetails] = useState(null);

  // ✅ Fetch published forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await getAllForms(0, 50);
        const formsData = response?.data || [];
        const published = formsData.filter(
          (f) => f.status === 1 || f.status === "1"
        );
        setForms(published);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  // ✅ Fetch learner responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await getAllResponsesByLearner();
        const formatted = data.map((r) => ({
          responseId: r.responseId,
          formId: r.formId,
          formTitle: r.formTitle,
          submittedOn: new Date(r.submittedAt).toLocaleString(),
          answers: r.answers || [],
          files: r.files || [],
        }));
        setResponses(formatted);
      } catch (err) {
        console.error("Error fetching learner responses:", err);
      }
    };

    if (activeTab === "mySubmissions") fetchResponses();
  }, [activeTab]);

  const filteredSubmissions = responses.filter((item) =>
    item.formTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Convert base64 → blob for downloads
  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    if (!b64Data) return null;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  // ✅ Load form details when viewing response
  const handleViewResponse = async (response) => {
    try {
      const formData = await getFormById(response.formId);
      setSelectedFormDetails(formData);
      setSelectedResponse(response);
    } catch (err) {
      console.error("Error loading form details:", err);
    }
  };

  if (loading) return <p className="loading">Loading forms...</p>;
  if (error) return <p className="error">{error}</p>;

  // ✅ Show fill view
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
                  Created Date:{" "}
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

      {/* MY SUBMISSIONS */}
      {activeTab === "mySubmissions" && (
        <div className="submissions-container">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="submissions-table">
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
                  <tr key={item.responseId}>
                    <td>{item.formTitle}</td>
                    <td>{item.submittedOn}</td>
                    <td>
                      <button onClick={() => handleViewResponse(item)}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Response Modal */}
      {selectedResponse && selectedFormDetails && (
        <div
          className="response-modal-overlay"
          onClick={() => {
            setSelectedResponse(null);
            setSelectedFormDetails(null);
          }}
        >
          <div
            className="response-modal form-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedFormDetails?.config?.title || "Form Response"}</h2>
                {selectedFormDetails?.config?.description && (
                  <p>{selectedFormDetails.config.description}</p>
                )}
              </div>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setSelectedResponse(null);
                  setSelectedFormDetails(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="form-questions">
              {selectedFormDetails?.layout?.fields?.map((q, index) => {
                const ans = selectedResponse.answers.find(
                  (a) => a.questionId === q.questionId
                );
                const file = selectedResponse.files.find(
                  (f) => f.questionId === q.questionId
                );
                let answerDisplay = ans?.answerText || "";

                // 🟣 Handle dropdown / checkbox / radio mapping
                if (
                  ["drop-down", "checkbox", "radio"].includes(q.type) &&
                  answerDisplay
                ) {
                  try {
                    const parsed = JSON.parse(answerDisplay);
                    const ids = Array.isArray(parsed)
                      ? parsed
                      : [parsed.toString()];
                    const values = ids
                      .map((id) => {
                        const cleanId = id.replace(/[\[\]"]/g, "");
                        const opt = q.options?.find(
                          (o) =>
                            o.optionId === cleanId ||
                            o.id === cleanId
                        );
                        return opt?.value || opt?.label;
                      })
                      .filter(Boolean);
                    answerDisplay = values.join(", ");
                  } catch {
                    // leave raw text
                  }
                }

                // 🟣 Handle file-upload type
                if (q.type === "file-upload") {
                  if (file?.base64Content) {
                    const blob = b64toBlob(file.base64Content, file.fileType);
                    const url = URL.createObjectURL(blob);
                    answerDisplay = (
                      <a
                        href={url}
                        download={file.fileName}
                        className="file-answer-link"
                      >
                        {file.fileName}
                      </a>
                    );
                  } else {
                    answerDisplay = (
                      <span className="no-answer">No file uploaded</span>
                    );
                  }
                }

                return (
                  <div key={q.questionId} className="response-question-card">
                    <h4 className="question-label">
                      {index + 1}. {q.label}
                    </h4>
                    {q.descriptionEnabled && q.description && (
                      <p className="question-description">{q.description}</p>
                    )}
                    <div className="answer-section">
                      {typeof answerDisplay === "string" ? (
                        <p className="text-answer">
                          {answerDisplay || "No response"}
                        </p>
                      ) : (
                        answerDisplay
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
