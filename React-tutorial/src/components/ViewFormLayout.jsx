import React from "react";
import "../styles/ViewFormLayout.css";

// ✅ Reuse same icons and colors as FormLayout
import ShortTextIcon from "../assets/ShortTextIcon.png";
import LongTextIcon from "../assets/LongTextIcon.png";
import DatePickerIcon from "../assets/DatePickerIcon.png";
import DropDownIcon from "../assets/DropDownIcon.png";
import FileUploadIcon from "../assets/FileUploadIcon.png";
import NumberIcon from "../assets/NumberIcon.png";

export default function ViewFormLayout({ formData }) {
  const header = formData?.layout?.headerCard || {};
  const fields = formData?.layout?.fields || [];

  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: LongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: DatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: DropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: FileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: NumberIcon, borderColor: "#F3CCE1" },
  ];

  return (
    <div className="form-layout-container">
      {/* ---------- Left Panel ---------- */}
      <div className="form-layout-left">
        <h4 className="input-title">Input Fields</h4>
        <div className="input-field-list">
          {inputFields.map((field) => (
            <div
              key={field.id}
              className="input-field disabled"
              style={{ borderLeft: `4px solid ${field.borderColor}` }}
            >
              <img src={field.icon} alt={field.label} className="input-icon" />
              <span>{field.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Right Panel ---------- */}
      <div className="form-layout-right">
        {/* Header */}
        <div className="form-header-box readonly">
          <div className="form-header-title">Form Header</div>
          <input
            type="text"
            className="header-input"
            value={header.title || formData?.config?.title || ""}
            readOnly
          />
          <textarea
            className="header-textarea"
            value={header.description || formData?.config?.description || ""}
            readOnly
          />
        </div>

        {/* ---------- Questions ---------- */}
        {fields.length === 0 ? (
          <p className="no-questions">No questions found for this form.</p>
        ) : (
          fields.map((q, index) => (
            <div key={index} className="question-card view-mode">
              <div className="question-label">
                {index + 1}. {q.label}
                {q.required && <span className="required">*</span>}
              </div>

              {(q.description_enabled || q.descriptionEnabled) && q.description && (
  <p className="question-description">{q.description}</p>
)}

              {/* ---------- Field Types ---------- */}

              {/* Short Text */}
              {q.type === "short-text" && (
                <input
                  type="text"
                  className="question-input"
                  placeholder={`Short text answer (max ${q.maxChar || 100} chars)`}
                  readOnly
                />
              )}

              {/* Long Text */}
              {q.type === "long-text" && (
                <textarea
                  className="question-input"
                  placeholder={`Long text answer (max ${q.maxChar || 500} chars)`}
                  readOnly
                />
              )}

              {/* Date Picker */}
              {q.type === "date-picker" && (
                <input type="date" className="question-input" readOnly />
              )}

              {/* Dropdown (rendered as radio buttons) */}
              {q.type === "drop-down" && (
                <div className="dropdown-display">
                  {q.options?.length > 0 ? (
                    <div className="dropdown-field" readOnly>
                      {q.options.map((opt, i) => (
                        <div key={i} className="dropdown-option">
                          {opt.value || opt}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-options">No options available</p>
                  )}
                </div>
              )}

              {/* File Upload */}
              {q.type === "file-upload" && (
                <div className="file-upload-display">
                  <div className="file-upload-icon">📁</div>
                  <div className="file-upload-text">
                    <span className="file-upload-title">Upload a file</span>
                    <span className="file-upload-info">
                      Max 25 MB • Formats: PDF, DOCX, JPG
                    </span>
                  </div>
                </div>
              )}

              {/* Number */}
              {q.type === "number" && (
                <input
                  type="number"
                  className="question-input"
                  placeholder="Enter number"
                  readOnly
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
