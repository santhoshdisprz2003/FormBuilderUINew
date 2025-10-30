// src/components/FormResponses.jsx
import React, { useEffect, useState } from "react";
import "../styles/FormResponses.css";
import SearchIcon from "../assets/SearchIcon.png";
import FilterIcon from "../assets/FilterIcon.png";
import { useParams } from "react-router-dom";
import { getAllResponsesForForm } from "../api/admin.js";
import { getFormById } from "../api/formService.js";
import "../styles/ResponseModal.css";


export default function FormResponses() {
    const { id: formId } = useParams();
    const [activeTab, setActiveTab] = useState("summary");
    const [responses, setResponses] = useState([]);
    const [filteredResponses, setFilteredResponses] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch form details (title, description, questions)
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

    // ✅ Fetch all responses for the form
    useEffect(() => {
        const fetchResponses = async () => {
            try {
                setLoading(true);
                const data = await getAllResponsesForForm(formId);
                console.log("Fetched responses:", data);

                const formatted = data.map((res, index) => ({
                    id: res.responseId || index,
                    submittedBy: res.submittedUserName || "Unknown",
                    userId: res.submittedBy || "-",
                    submittedOn: new Date(res.submittedAt).toLocaleString(),
                    email: res.email || "-",
                    answers: res.answers || [],
                    files: res.files || [],
                }));

                setResponses(formatted);
                setFilteredResponses(formatted);
            } catch (err) {
                console.error("Error fetching responses:", err);
                setError("Failed to load responses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (formId) fetchResponses();
    }, [formId]);

    // ✅ Search filter
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredResponses(responses);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredResponses(
                responses.filter(
                    (r) =>
                        r.submittedBy.toLowerCase().includes(lower) ||
                        r.userId.toLowerCase().includes(lower)
                )
            );
        }
    }, [searchTerm, responses]);

    // ✅ Match question details
    const getQuestionDetails = (questionId) => {
        if (!formDetails?.layout?.fields) return null;
        return formDetails.layout.fields.find(
            (f) => f.questionId === questionId
        );
    };

    // 🔹 Convert Base64 to Blob (for downloadable links)
    function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
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
}




    if (loading) return <div className="loading">Loading responses...</div>;
    if (error) return <div className="error">{error}</div>;
    if (filteredResponses.length === 0)
        return <div className="no-data">No responses found.</div>;

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
                    <button
                        className="export-btn"
                        onClick={() => console.log("Export to Excel clicked")}
                    >
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* 🔹 Table */}
            <table className="responses-table">
                <thead>
                    <tr>
                        <th>Submitted By</th>
                        <th>User ID</th>
                        <th>Submitted On</th>
                        <th>Email</th>
                        <th>Response</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredResponses.map((res) => (
                        <tr key={res.id}>
                            <td>{res.submittedBy}</td>
                            <td>{res.userId}</td>
                            <td>{res.submittedOn}</td>
                            <td>{res.email}</td>
                            <td>
                                <button
                                    className="view-butn"
                                    onClick={() => setSelectedResponse(res)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔹 Response Modal */}
{selectedResponse && (
  <div
    className="response-modal-overlay"
    onClick={() => setSelectedResponse(null)}
  >
    <div
      className="response-modal form-view-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <div>
          <h2 className="form-title">
            {formDetails?.config?.title || "Response Details"}
          </h2>
          {formDetails?.config?.description && (
            <p className="form-description">
              {formDetails.config.description}
            </p>
          )}
        </div>
        <button
          className="close-modal-btn"
          onClick={() => setSelectedResponse(null)}
        >
          ✕
        </button>
      </div>

      <div className="form-questions">
        {formDetails?.layout?.fields?.map((q, index) => {
          const questionNumber = index + 1;

          // Find matching answer
          const ans = selectedResponse.answers.find(
            (a) => a.questionId === q.questionId
          );

          // Find matching file (if any)
          const file = selectedResponse.files?.find(
            (f) => f.questionId === q.questionId
          );

          let answerDisplay = ans?.answerText || "";

          // 🟣 Handle dropdown/option mapping
          if (
            (q.type === "drop-down" ||
              q.type === "radio" ||
              q.type === "checkbox") &&
            answerDisplay
          ) {
            try {
              const parsed = JSON.parse(answerDisplay);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const matchedOptions = parsed
                  .map((id) => {
                    const opt = q.options?.find(
                      (o) => o.optionId === id || o.optionId === id.replace(/[\[\]"]/g, "")
                    );
                    return opt?.value;
                  })
                  .filter(Boolean);
                answerDisplay = matchedOptions.join(", ");
              }
            } catch {
              // leave as text if not JSON
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
              answerDisplay = <span className="no-answer">No file uploaded</span>;
            }
          }

          return (
            <div key={q.questionId} className="response-question-card">
              <div className="question-header">
                <span className="question-number">{questionNumber}</span>
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



        </div>
    );
}
