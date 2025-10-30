import React, { useState } from "react";
import "../styles/FormFillView.css";
import { submitResponse } from "../api/responses";


export default function FormFillView({ form, onBack }) {
  const header = form?.layout?.headerCard || {};
  const fields = form?.layout?.fields || [];
  const [responses, setResponses] = useState({});

  const handleChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // remove the prefix
    reader.onerror = (error) => reject(error);
  });


 const handleSubmit = async () => {
  try {
    const answers = await Promise.all(
      Object.entries(responses).map(async ([questionId, value]) => {
        // If it's a file, encode it in base64 and include file metadata
        if (value instanceof File) {
          const base64 = await toBase64(value);
          return {
            questionId,
            answerText: "", // backend expects empty for file answers
            file: {
              questionId,
              fileName: value.name,
              fileType: value.type,
              fileMaxSize: value.size,
              base64Content: base64,
            },
          };
        }

        // For normal text/number/date/dropdown fields
        return {
          questionId,
          answerText: value || "",
          file: null,
        };
      })
    );

    // ✅ Build full ResponseDTO object
    const responseDto = {
      responseId: 0, // backend will generate
      formId: form.id,
      submittedBy: "", // backend fills from JWT claim
      submittedAt: new Date().toISOString(),
      answers,
    };

    console.log("Submitting payload:", responseDto);

    await submitResponse(form.id, responseDto);

    alert("Form submitted successfully!");
    onBack();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Failed to submit the form. Please try again.");
  }
};


  const handleClear = () => setResponses({});

  return (
    <div className="formfill-container">
      {/* ---------- Header ---------- */}
      <div className="formfill-header">
        <button className="back-button" onClick={onBack}>←</button>
        <h2>{header.title || form.config?.title || "Untitled Form"}</h2>
        <p className="formfill-desc">
          {header.description || form.config?.description || ""}
        </p>
      </div>

      {/* ---------- Form Card ---------- */}
      <div className="formfill-body">
        <div className="formfill-card">
          <h3 className="formfill-section-title">Professional Certificate Training</h3>
          <p className="formfill-section-subtext">
            Help us improve! Share your feedback on your learning experience.
          </p>

          {fields.length === 0 ? (
            <p className="no-questions">No questions found for this form.</p>
          ) : (
            fields.map((q, index) => (
              <div key={q.questionId || index} className="formfield">
                <label className="question-label">
                  {index + 1}. {q.label}
                  {q.required && <span className="required">*</span>}
                </label>

                {q.description && (
                  <p className="question-description">{q.description}</p>
                )}

                {q.type === "short-text" && (
                  <input
                    type="text"
                    placeholder="Your Answer"
                    value={responses[q.questionId] || ""}
                    onChange={(e) =>
                      handleChange(q.questionId, e.target.value)
                    }
                  />
                )}

                {q.type === "long-text" && (
                  <textarea
                    rows="3"
                    placeholder="Your Answer"
                    value={responses[q.questionId] || ""}
                    onChange={(e) =>
                      handleChange(q.questionId, e.target.value)
                    }
                  />
                )}

                {q.type === "number" && (
                  <input
                    type="number"
                    placeholder="Your Answer"
                    value={responses[q.questionId] || ""}
                    onChange={(e) =>
                      handleChange(q.questionId, e.target.value)
                    }
                  />
                )}

                {q.type === "date-picker" && (
                  <input
                    type="date"
                    value={responses[q.questionId] || ""}
                    onChange={(e) =>
                      handleChange(q.questionId, e.target.value)
                    }
                  />
                )}

                {q.type === "drop-down" && (
                  <select
                    value={responses[q.questionId] || ""}
                    onChange={(e) =>
                      handleChange(q.questionId, e.target.value)
                    }
                  >
                    <option value="">Select Answer</option>
                    {q.options?.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                )}

                {q.type === "file-upload" && (
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id={`file-${index}`}
                      className="file-input"
                      onChange={(e) =>
                        handleChange(q.questionId, e.target.files[0])
                      }
                    />
                    <label htmlFor={`file-${index}`} className="file-label">
                      Drop files here or <span>Browse</span>
                    </label>
                    <p className="file-hint">
                      Supported files: PDF, PNG, JPG, JPEG | Max file size: 2 MB | Only one file allowed
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------- Sticky Footer ---------- */}
      <div className="formfill-footer">
        <button className="clear-btn" onClick={handleClear}>
          Clear Form
        </button>
        <div className="info-banner">
          This form cannot be saved temporarily; please submit once completed.
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
