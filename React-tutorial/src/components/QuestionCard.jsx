import React, { useState } from "react";
import "../styles/QuestionCard.css";
import CopyIcon from "../assets/CopyIcon.png";
import DeleteIcon from "../assets/DeleteIcon.png";


export default function QuestionCard({ field, index, onDelete, onCopy }) {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [required, setRequired] = useState(false);
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectionType, setSelectionType] = useState("single");
  const [options, setOptions] = useState([
    { id: 1, value: "Option 1" }
  ]);

  const formatDateToDisplay = (date, format) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    if (format === "DD/MM/YYYY") {
      return `${day}/${month}/${year}`;
    } else {
      return `${month}-${day}-${year}`;
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleAddOption = () => {
    const newId = options.length + 1;
    setOptions([...options, { id: newId, value: `Option ${newId}` }]);
  };

  const handleOptionChange = (id, value) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, value } : opt));
  };

  const handleDeleteOption = (id) => {
    if (options.length > 1) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  return (
    <div className="question-card">
      {/* Question Input */}
      {/* Question Input with Char Count */}
      <div className="question-input-wrapper">
        <input
          type="text"
          placeholder="Untitled Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={150}
          className="question-input"
        />
        <span className="char-count">{question.length}/150</span>
      </div>

      {/* Description Input with Char Count */}
      {showDescription && (
        <div className="description-input-wrapper">
          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={150}
            className="description-input"
          />
          <span className="char-count">{description.length}/150</span>
        </div>
      )}

      {/* Field Type Display for Short Text and Long Text */}
      {field.maxChar && (
        <input
          type="text"
          value={`${field.label} (Up to ${field.maxChar} characters)`}
          disabled
          className="field-type-display"
        />
      )}

      {/* Date Picker Field */}
      {field.type === "date-picker" && (
        <div className="date-picker-container">
          <div className="date-input-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-picker-input"
            />
            <span className="date-placeholder">
              {selectedDate ? formatDateToDisplay(selectedDate, dateFormat) : dateFormat}
            </span>
            <span className="calendar-icon">📅</span>
          </div>

          <div className="date-format-section">
            <label className="date-format-label">Date Format</label>
            <div className="date-format-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name={`dateFormat-${index}`}
                  value="DD/MM/YYYY"
                  checked={dateFormat === "DD/MM/YYYY"}
                  onChange={(e) => setDateFormat(e.target.value)}
                />
                <span className="radio-text">DD/MM/YYYY</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`dateFormat-${index}`}
                  value="MM-DD-YYYY"
                  checked={dateFormat === "MM-DD-YYYY"}
                  onChange={(e) => setDateFormat(e.target.value)}
                />
                <span className="radio-text">MM-DD-YYYY</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Field */}
      {field.type === "dropdown" && (
        <div className="dropdown-container">
          <div className="options-list">
            {options.map((option, idx) => (
              <div key={option.id} className="option-item">
                <span className="option-number">{idx + 1}</span>
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="option-input"
                  placeholder={`Option ${idx + 1}`}
                />
                {options.length > 1 && (
                  <button
                    onClick={() => handleDeleteOption(option.id)}
                    className="option-delete-btn"
                    title="Delete option"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={handleAddOption} className="add-option-btn">
            + Add option
          </button>

          <div className="selection-type-section">
            <label className="selection-type-label">Selection Type</label>
            <div className="selection-type-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name={`selectionType-${index}`}
                  value="single"
                  checked={selectionType === "single"}
                  onChange={(e) => setSelectionType(e.target.value)}
                />
                <span className="radio-text">Single select</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`selectionType-${index}`}
                  value="multi"
                  checked={selectionType === "multi"}
                  onChange={(e) => setSelectionType(e.target.value)}
                />
                <span className="radio-text">Multi select</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Field */}
      {field.type === "file-upload" && (
        <div className="file-upload-container">
          <div className="file-upload-display">
            <span className="file-upload-icon">📎</span>
            <div className="file-upload-text">
              <div className="file-upload-title">File upload (only one file allowed)</div>
              <div className="file-upload-info">Supported files: PDF, JPG, PNG | Max file size 2 MB</div>
            </div>
          </div>
        </div>
      )}

      {/* Number Field */}
      {field.type === "number" && (
        <div className="number-field-container">
          <input
            type="text"
            value="Numeric value"
            disabled
            className="number-field-display"
          />
        </div>
      )}

      {/* Actions Row */}
      <div className="question-actions">
        <div className="action-buttons">
          <button
            onClick={() => onCopy(index)}
            className="action-btn copy-btn"
            title="Copy"
          >
            <img
              src={CopyIcon}
              alt="Copy"
              className="action-icon"
            />
          </button>

          <button
            onClick={() => onDelete(index)}
            className="action-btn delete-btn"
            title="Delete"
          >
            <img
              src={DeleteIcon}
              alt="Delete"
              className="action-icon"
            />
          </button>
        </div>

        <div className="toggle-options">
          <div className="toggle-item">
            <span className="toggle-text">Description</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={showDescription}
                onChange={() => setShowDescription((v) => !v)}
              />
              <span className="slider round" />
            </label>
          </div>

          <div className="toggle-item">
            <span className="toggle-text">Required</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={required}
                onChange={() => setRequired((v) => !v)}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
      </div>

      {/* Required Indicator */}
      {required && <span className="required-indicator">* Required</span>}
    </div>
  );
}
