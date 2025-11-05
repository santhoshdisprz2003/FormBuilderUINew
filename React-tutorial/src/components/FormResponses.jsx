// src/components/FormResponses.jsx
import React, { useEffect, useState } from "react";
import "../styles/FormResponses.css";
import SearchIcon from "../assets/SearchIcon.png";
import FilterIcon from "../assets/FilterIcon.png";
import NoResponseIcon from "../assets/NoResponseIcon.png";
import "../styles/ResponseModal.css";
import { useParams } from "react-router-dom";
import { getAllResponsesForForm } from "../api/admin.js";
import { getFormById } from "../api/formService.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function FormResponses() {
  const { id: formId } = useParams();

  const [activeTab, setActiveTab] = useState("summary");
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch form details (title, questions)
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const formData = await getFormById(formId);
        setFormDetails(formData);
      } catch (err) {
        console.error("Error fetching form details:", err);
      }
    };
    if (formId) fetchFormDetails();
  }, [formId]);

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(() => setPageNumber(1), 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // ✅ Fetch paginated + filtered responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        // setLoading(true);
        setError(null);
        const data = await getAllResponsesForForm(formId, pageNumber, pageSize, searchTerm);

        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);

        const formatted = data.items.map((res, index) => ({
          id: res.responseId || index,
          submittedBy: res.submittedUserName || "Unknown",
          userId: res.submittedBy || "-",
          submittedOn: new Date(res.submittedAt).toLocaleString(),
          email: res.submittedUserName + '@gmail.com' || "-",
          answers: res.answers || [],
          files: res.files || [],
        }));

        setResponses(formatted);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setError("Failed to load responses. Please try again later.");
      } finally {
        // setLoading(false);
      }
    };

    if (formId) fetchResponses();
  }, [formId, pageNumber, pageSize, searchTerm]);

  // 🔹 Pagination Handlers
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

  // 🔹 Base64 → Blob for file download
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    if (!b64Data) return null;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  // 🔹 Export to Excel
  const exportToExcel = () => {
    if (!responses || responses.length === 0) {
      alert("No responses available to export.");
      return;
    }

    const exportData = responses.map((res) => {
      const answersObj = {};

      if (res.answers && Array.isArray(res.answers)) {
        res.answers.forEach((a) => {
          const q = formDetails?.layout?.fields?.find(
            (f) => f.questionId === a.questionId
          );
          const label = q?.label || a.questionId;
          let ansText = a.answerText || "-";

          if (
            (q?.type === "drop-down" ||
              q?.type === "radio" ||
              q?.type === "checkbox") &&
            ansText
          ) {
            try {
              const parsed = JSON.parse(ansText);
              if (Array.isArray(parsed)) {
                const matched = parsed
                  .map((id) => q.options?.find((o) => o.optionId === id)?.value)
                  .filter(Boolean);
                ansText = matched.join(", ");
              }
            } catch {}
          }

          answersObj[label] = ansText;
        });
      }

      return {
        "Submitted By": res.submittedBy,
        "User ID": res.userId,
        "Submitted On": res.submittedOn,
        Email: res.email,
        ...answersObj,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `${formDetails?.config?.title || "Form"}_Responses.xlsx`);
  };

  if (loading) return <div className="loading">Loading responses...</div>;
  // if (error) return <div className="error">{error}</div>;

  if (responses.length === 0)
    return (
      <div className="no-responses-container">
        <img src={NoResponseIcon} alt="No Responses" className="no-responses-image" />
        <h2 className="no-responses-title">No Responses Yet</h2>
        <p className="no-responses-subtitle">
          Once learners start submitting the form, their individual responses will appear here.
        </p>
      </div>
    );

  return (
    <div className="responses-container">
      {/* 🔹 Tabs */}
      <div className="responses-tab-buttons">
        <button
          className={`resp-tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Response Summary
        </button>
        <button
          className={`resp-tab ${activeTab === "individual" ? "active" : ""}`}
          onClick={() => setActiveTab("individual")}
        >
          Individual Response
        </button>
      </div>

      {/* 🔹 Search + Actions */}
      <div className="responses-header">
        <div className="response-search-box">
          <img src={SearchIcon} alt="search" className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search by Name/User ID"
            className="response-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button className="filter-btn">
            <img src={FilterIcon} alt="filter" className="btn-icon" />
            Filter
          </button>
          <button className="export-btn" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
      </div>

      {/* 🔹 Table */}
      <table className="responses-table">
        <thead>
          <tr>
            <th>Submitted By</th>
            <th>User Id</th>
            <th>Submitted On</th>
            <th>Email</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody> 
          {responses.map((res) => (
            <tr key={res.id}>
              <td>{res.submittedBy}</td>
              <td>{res.userId}</td>
              <td>{res.submittedOn}</td>
              <td>{res.email}</td>
              <td>
                <button className="view-butn" onClick={() => setSelectedResponse(res)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination */}
      <div className="pagination-container">
        <div className="items-info">
          <label className="page">Items per page</label>
          <select className="items-dropdown" value={pageSize} onChange={handlePageSizeChange}>
            <option value={1}>1</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span className="items-range">
            {(pageNumber - 1) * pageSize + 1}–
            {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} items
          </span>
        </div>

        <div className="pagination-controls">
          <span className="page-info">
            {pageNumber} of {totalPages} pages
          </span>
          <button className="page-btn prev" disabled={pageNumber === 1} onClick={handlePrev}>
            ‹
          </button>
          <button className="page-btn next" disabled={pageNumber === totalPages} onClick={handleNext}>
            ›
          </button>
        </div>
      </div>

      {/* 🔹 Response Modal */}
      {selectedResponse && (
        <div className="response-modal-overlay" onClick={() => setSelectedResponse(null)}>
          <div className="response-modal form-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="form-title">{formDetails?.config?.title || "Response Details"}</h2>
                {formDetails?.config?.description && (
                  <p className="form-description">{formDetails.config.description}</p>
                )}
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedResponse(null)}>
                ✕
              </button>
            </div>

            <div className="form-questions">
              {formDetails?.layout?.fields?.map((q, index) => {
                const ans = selectedResponse.answers.find((a) => a.questionId === q.questionId);
                const file = selectedResponse.files?.find((f) => f.questionId === q.questionId);
                let answerDisplay = ans?.answerText || "";

                if (
                  (q.type === "drop-down" || q.type === "radio" || q.type === "checkbox") &&
                  answerDisplay
                ) {
                  try {
                    const parsed = JSON.parse(answerDisplay);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      const matched = parsed
                        .map((id) =>
                          q.options?.find(
                            (o) =>
                              o.optionId === id ||
                              o.optionId === id.replace(/[\[\]"]/g, "")
                          )?.value
                        )
                        .filter(Boolean);
                      answerDisplay = matched.join(", ");
                    }
                  } catch {}
                }

                if (q.type === "file-upload") {
                  if (file?.base64Content) {
                    const blob = b64toBlob(file.base64Content, file.fileType);
                    const url = URL.createObjectURL(blob);
                    answerDisplay = (
                      <a href={url} download={file.fileName} className="file-answer-link">
                        {file.fileName}
                      </a>
                    );
                  } else {
                    answerDisplay = <span className="no-answer">No file uploaded</span>;
                  }
                }

                return (
                  <div key={q.questionId} className="response-question-card">
                    <div className="question-header">
                      <span className="question-number">{index + 1}</span>
                      <div className="question-content">
                        <h4 className="question-label">{q.label}</h4>
                        {q.descriptionEnabled && q.description && (
                          <p className="question-description">{q.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="answer-section">
                      {typeof answerDisplay === "string" ? (
                        <p className="text-answer">
                          {answerDisplay || <span className="no-answer">No response</span>}
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

      {/* 🔹 Footer */}
      <div className="form-footer">
        <button className="preview-form-btn">Preview Form</button>
        <button className="save-form-btn" disabled>
          Save Form
        </button>
      </div>
    </div>
  );
}
