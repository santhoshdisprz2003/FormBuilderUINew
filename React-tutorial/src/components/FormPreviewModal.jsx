import React from "react";
import "../styles/FormPreviewModal.css";

export default function FormPreviewModal({ show, onClose, formName, description, fields }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="preview-header">
          <h2 className="preview-title">{formName || "Untitled Form"}</h2>
        </div>

        {/* Inner Card */}
        <div className="preview-card">
          <div className="form-header">
            <h3 className="form-title">{formName || "Form Title"}</h3>
            <p className="form-description">
              {description || "Form description here."}
            </p>
          </div>

          {/* Questions */}
          {fields && fields.length > 0 ? (
            <div className="preview-fields">
              {fields.map((q, idx) => (
                <div key={idx} className="preview-question">
                  {/* Question Number */}
                  <div className="question-number">{idx + 1}.</div>

                  {/* Question Content */}
                  <div className="question-content">
                    {/* Label */}
                    <label className="question-label">
                      {q.question || q.label|| "Untitled Question"}
                      {q.required && <span className="required">*</span>}
                    </label>

                    {/* Description */}
                    {q.description && (
                      <p className="question-desc">{q.description}</p>
                    )}

                    {/* Input Fields */}
                    {q.type === "short-text" && (
                      <input
                        type="text"
                        placeholder="Your answer"
                        className="input-field"
                        
                      />
                    )}

                    {q.type === "long-text" && (
                      <textarea
                        placeholder="Your answer"
                        className="textarea-field"
                        
                      />
                    )}

                    {q.type === "date-picker" && (
                      <input type="date" className="input-field"  />
                    )}

                    {q.type === "drop-down" && (
                      <select className="input-field" >
                        <option value="">Select an option</option>
                        {q.options?.map((opt, i) => (
                          <option key={i}>{opt.value || opt}</option>
                        ))}
                      </select>
                    )}

                    {q.type === "file-upload" && (
                      <div className="file-upload-box" >
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
                        className="input-field"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-questions">No questions added yet.</p>
          )}

          {/* Footer */}
          <div className="preview-footer">
            <button className="clear-btn" onClick={onClose}>
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
