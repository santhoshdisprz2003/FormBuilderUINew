import React, { useState, useEffect } from "react";
import "../styles/LearnerForms.css";
import { getAllForms, getFormById } from "../api/formService";
import { getAllResponsesByLearner } from "../api/responses";
import FormFillView from "./FormFillView";
import SearchBar from "./SearchBar";
import ViewResponsesIcon from "../assets/ViewResponsesIcon.png";

export default function LearnerForms() {
  const [activeTab, setActiveTab] = useState("selfService");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedFormDetails, setSelectedFormDetails] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        // setLoading(true);

        if (activeTab === "selfService") {
          const response = await getAllForms(0, 50, search);
          const formsData = response?.data || [];
          const published = formsData.filter(
            (f) => f.status === 1 || f.status === "1"
          );
          setForms(published);
        } else if (activeTab === "mySubmissions") {
          // 🔹 Use pagination parameters here
          const data = await getAllResponsesByLearner(search, pageNumber, pageSize);

          const totalPagesCalc = Math.ceil((data.totalCount || 0) / (data.pageSize || pageSize));

          setTotalPages(totalPagesCalc);
          setTotalCount(data.totalCount || 0);

          const formatted = (data?.items || []).map((r) => ({
            responseId: r.responseId,
            formId: r.formId,
            formTitle: r.formTitle,
            submittedOn: new Date(r.submittedAt).toLocaleString(),
            answers: r.answers || [],
            files: r.files || [],
          }));
          setResponses(formatted);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        // setLoading(false);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(delay);
  }, [search, activeTab, pageNumber, pageSize]); // 🔹 included pagination deps

  // 🔹 Pagination handlers
  const handleNext = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };
  const handlePrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  };

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
          onClick={() => {
            setActiveTab("mySubmissions");
            setPageNumber(1);
          }}
        >
          My Submissions
        </button>
      </div>

      <div className="searchbar-container">
        <SearchBar
          search={search}
          setSearch={setSearch}
          onFilterClick={() => console.log("Open filter popup")}
        />
      </div>

      {/* SELF-SERVICE TAB */}
      {activeTab === "selfService" && (
        <div className="learner-forms-grid">
          {forms.length === 0 ? (
            <p>No published forms available.</p>
          ) : (
            forms.map((form) => (
              <div className="learner-form-card" key={form.id}>
                <h3 className="form-title">{form.config?.title || "Untitled Form"}</h3>
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
                  onClick={() => setSelectedForm(form)}
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
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Training Name</th>
                <th>Submitted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {responses.length > 0 ? (
                responses.map((item) => (
                  <tr key={item.responseId}>
                    <td>{item.formTitle}</td>
                    <td>{item.submittedOn}</td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => handleViewResponse(item)}
                      >
                        <img
                          src={ViewResponsesIcon}
                          alt="View"
                          className="view-response-icon"
                        />
                      </button>
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

          {/* 🔹 Pagination Section */}
          {totalCount > 0 && (
            <div className="pagination-container">
              <div className="items-info">
                <label className="page">Items per page</label>
                <select
                  className="items-dropdown"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={10}>10</option>
                </select>
                <span className="items-range">
                  {(pageNumber - 1) * pageSize + 1}–
                  {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} items
                </span>
              </div>

              <div className="pagination-controls">

                <span className="page-info">
                  Page {pageNumber} of {totalPages}
                </span>
                <button
                  className={`page-btn prev ${pageNumber === 1 ? "disabled" : ""}`}
                  onClick={handlePrev}
                  disabled={pageNumber === 1}
                >
                  ‹ 
                </button>

              
                <button
                  className={`page-btn next ${pageNumber === totalPages ? "disabled" : ""}`}
                  onClick={handleNext}
                  disabled={pageNumber === totalPages}
                >
                   ›
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Response Modal */}
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
                          (o) => o.optionId === cleanId || o.id === cleanId
                        );
                        return opt?.value || opt?.label;
                      })
                      .filter(Boolean);
                    answerDisplay = values.join(", ");
                  } catch { }
                }

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
                    answerDisplay = <span className="no-answer">No file uploaded</span>;
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
