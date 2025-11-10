import React, { useState, useEffect } from "react";
import "../styles/FormPreviewModal.css";
import FileSizeIcon from "../assets/FileSizeIcon.png";

export default function FormPreviewModal({ show, onClose, formName, description, fields }) {
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialValues = {};
      fields.forEach((q, idx) => {
        initialValues[idx] = "";
      });
      setInputValues(initialValues);
    }
  }, [fields, show]);

  if (!show) return null;

  const handleClearForm = () => {
    const cleared = {};
    Object.keys(inputValues).forEach((key) => {
      cleared[key] = "";
    });
    setInputValues(cleared);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="preview-header">
          <button className="back-btn" onClick={onClose}>
            <span className="arrow">←</span> 
          </button>
        </div>

        
        <div className="preview-card">
          <div className="form-header">
            <h3 className="form-title">{formName || "Form Title"}</h3>
            <p className="form-description">
              {description || "Form description here."}
            </p>
          </div>

          
          {fields && fields.length > 0 ? (
            <div className="preview-fields">
              {fields.map((q, idx) => (
                <div key={idx} className="preview-question">
                  <div className="question-number">{idx + 1}.</div>

                  <div className="question-content">
                    <label className="question-label">
                      {q.question || q.label || "Untitled Question"}
                      {q.required && <span className="required">*</span>}
                    </label>

                    {q.description && (
                      <p className="question-desc">{q.description}</p>
                    )}

                    {q.type === "short-text" && (
                      <input
                        type="text"
                        placeholder="Your answer"
                        className="input-fields"
                        value={inputValues[idx] || ""}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                      />
                    )}

                    {q.type === "long-text" && (
                      <textarea
                        placeholder="Your answer"
                        className="textarea-field"
                        value={inputValues[idx] || ""}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                      />
                    )}

                    {q.type === "date-picker" && (
                      <input
                        type="date"
                        className="input-fields"
                        value={inputValues[idx] || ""}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                      />
                    )}

                    {q.type === "drop-down" && (
                      <select
                        className="input-fields"
                        value={inputValues[idx] || ""}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select an option</option>
                        {q.options?.map((opt, i) => (
                          <option key={i}>{opt.value || opt}</option>
                        ))}
                      </select>
                    )}

                    {q.type === "file-upload" && (
                      <div className="file-upload-box">
                        <img
                          src={FileSizeIcon}
                          alt="Upload"
                          className="upload-icon"
                        />
                        <p>
                          Drop files here or <span className="browse">Browse</span>
                        </p>
                        <small>
                          Supported files: PDF, PNG, JPG | Max size: 2MB | One file only
                        </small>
                      </div>
                    )}

                    {q.type === "number" && (
                      <input
                        type="number"
                        placeholder="Your answer"
                        className="input-fields"
                        value={inputValues[idx] || ""}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-questions">No questions added yet.</p>
          )}

          
          <div className="preview-footer">
            <button className="clear-btn" onClick={handleClearForm}>
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
