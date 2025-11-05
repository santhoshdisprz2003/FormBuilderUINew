import React, { useState } from "react";
import "../styles/FormFillView.css";
import { submitResponse } from "../api/responses";
import SubmitResponseIcon from "../assets/SubmitResponseIcon.png";
import FileSizeIcon from "../assets/FileSizeIcon.png";

export default function FormFillView({ form, onBack }) {
  const header = form?.layout?.headerCard || {};
  const fields = form?.layout?.fields || [];
  const [responses, setResponses] = useState({});
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [errors, setErrors] = useState({}); // 🆕 stores missing field messages

  const handleChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: "" })); // 🆕 clear error when user types
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    // 🆕 Validation before submitting
    const newErrors = {};
    fields.forEach((q) => {
      if (q.required) {
        const value = responses[q.questionId];
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (q.type === "file-upload" && !(value instanceof File))
        ) {
          newErrors[q.questionId] = "Please fill this field.";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" }); // 🆕 scroll to show first error
      return;
    }

    try {
      const answers = await Promise.all(
        Object.entries(responses).map(async ([questionId, value]) => {
          if (value instanceof File) {
            const base64 = await toBase64(value);
            return {
              questionId,
              answerText: "",
              file: {
                questionId,
                fileName: value.name,
                fileType: value.type,
                fileMaxSize: value.size,
                base64Content: base64,
              },
            };
          }
          return { questionId, answerText: value || "", file: null };
        })
      );

      const responseDto = {
        responseId: 0,
        formId: form.id,
        submittedBy: "",
        submittedAt: new Date().toISOString(),
        answers,
      };

      console.log("Submitting payload:", responseDto);
      await submitResponse(form.id, responseDto);
      setShowSubmitModal(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  const handleClear = () => {
    setResponses({});
    setErrors({});
  };

  return (
    <div className="formfill-container">
      <div className="formfill-body">
        <div className="formfill-card">
          <div className="form-header">
            <h3 className="formfill-section-title">
              {header.title || form.config?.title || "Untitled Form"}
            </h3>
            <p className="formfill-section-subtext">
              {header.description || form.config?.description || ""}
            </p>
          </div>

          {fields.length === 0 ? (
            <p className="no-questions">No questions found for this form.</p>
          ) : (
            fields.map((q, index) => (
              <div key={q.questionId || index} className="formfield">
                <label className="question-label">
                  <span className="question-no">{index + 1}</span> {q.label}
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
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
                  />
                )}

                {q.type === "long-text" && (
                  <textarea
                    rows="3"
                    placeholder="Your Answer"
                    value={responses[q.questionId] || ""}
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
                  />
                )}

                {q.type === "number" && (
                  <input
                    type="number"
                    placeholder="Your Answer"
                    value={responses[q.questionId] || ""}
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
                  />
                )}

                {q.type === "date-picker" && (
                  <input
                    type="date"
                    value={responses[q.questionId] || ""}
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
                  />
                )}

                {q.type === "drop-down" && (
                  <select
                    value={responses[q.questionId] || ""}
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
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
                    {!responses[q.questionId] ? (
                      <>
                        <input
                          type="file"
                          id={`file-${index}`}
                          className="file-input"
                          onChange={(e) =>
                            handleChange(q.questionId, e.target.files[0])
                          }
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className="file-label"
                        >
                          <img
                            src={FileSizeIcon}
                            alt="Upload Icon"
                            className="file-size-icon"
                          />
                          <p>
                            Drop files here or <b>Browse</b>
                          </p>
                        </label>
                        <p className="file-hint">
                          Supported files: PDF, PNG, JPG, JPEG | Max file size: 2
                          MB | Only one file allowed
                        </p>
                      </>
                    ) : (
                      <div className="uploaded-file-display">
                        <div className="file-info">
                          <span className="file-name">
                            {responses[q.questionId].name}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleChange(q.questionId, null)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 🆕 Show validation error */}
                {errors[q.questionId] && (
                  <p className="error-text">{errors[q.questionId]}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="formfill-footer">
        <button className="clear-btn" onClick={() => setShowClearModal(true)}>
          Clear Form
        </button>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Clear Modal */}
      {showClearModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Clear Form</h3>
            <p className="modal-message">
              Are you sure you want to clear all the information you’ve entered?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-confirm"
                onClick={() => {
                  handleClear();
                  setShowClearModal(false);
                }}
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="submit-modal-overlay">
          <div className="submit-modal-card">
            <div className="submit-modal-icon">
              <img src={SubmitResponseIcon} alt="Submit response Icon" />
            </div>
            <h4 className="submit-modal-title">
              External Training Request Form Has Been Submitted!
            </h4>
            <p className="submit-modal-message">
              Your submission has been successfully recorded. You can view it
              anytime under My Submission.
            </p>
            <button
              className="submit-modal-btn"
              onClick={() => {
                setShowSubmitModal(false);
                onBack();
              }}
            >
              Go to My Submission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
