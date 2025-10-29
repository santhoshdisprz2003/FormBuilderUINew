import React, { useState, useEffect } from "react";
import "../styles/QuestionCard.css";
import CopyIcon from "../assets/CopyIcon.png";
import DeleteIcon from "../assets/DeleteIcon.png";
import CalendarIcon from "../assets/CalendarIcon.png";
import FileSizeIcon from "../assets/FileSizeIcon.png";

export default function QuestionCard({ field, index, onDelete, onCopy, onUpdate }) {
  const [question, setQuestion] = useState(field.question || "");
  const [description, setDescription] = useState(field.description || "");
  const [showDescription, setShowDescription] = useState(field.showDescription || false);
  const [required, setRequired] = useState(field.required || false);
  const [dateFormat, setDateFormat] = useState(field.dateFormat || "DD/MM/YYYY");
  const [selectedDate, setSelectedDate] = useState(field.selectedDate || "");
  const [selectionType, setSelectionType] = useState(field.selectionType || "single");
  const [options, setOptions] = useState(field.options || [{ id: 1, value: "Option 1" }]);

  // 🔄 Keep parent in sync
  useEffect(() => {
    onUpdate(index, {
      ...field,
      label: question,
      description,
     descriptionEnabled: showDescription,
      required,
      dateFormat,
      selectedDate,
      selectionType,
      options,
    });
  }, [question, description, showDescription, required, dateFormat, selectedDate, selectionType, options]);

  const handleAddOption = () => {
    const newId = options.length + 1;
    setOptions([...options, { id: newId, value: `Option ${newId}` }]);
  };

  const handleOptionChange = (id, value) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, value } : opt)));
  };

  const handleDeleteOption = (id) => {
    if (options.length > 1) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const formatDateToDisplay = (date, format) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return format === "DD/MM/YYYY" ? `${day}/${month}/${year}` : `${month}-${day}-${year}`;
  };

  return (
    <div className="question-card">
      {/* Question Input */}
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

      {/* Description Input */}
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

      {/* Field-Specific UI */}
      {field.maxChar && (
        <input
          type="text"
          value={`${field.label} (Up to ${field.maxChar} characters)`}
          disabled
          className="field-type-display"
        />
      )}

      {field.type === "date-picker" && (
        <div className="date-picker-container">
          <div className="date-input-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker-input"
            />
            <span className="date-placeholder">
              {selectedDate
                ? formatDateToDisplay(selectedDate, dateFormat)
                : dateFormat}
            </span>
            <img
              src={CalendarIcon}  // <-- use your own icon here
              alt="calendar"
              className="calendar-icon"
            />
          </div>


          <div className="date-format-section">
            <label className="date-format-label">Date Format</label>
            <div className="date-format-options">
              {["DD/MM/YYYY", "MM-DD-YYYY"].map((fmt) => (
                <label key={fmt} className="radio-option">
                  <input
                    type="radio"
                    name={`dateFormat-${index}`}
                    value={fmt}
                    checked={dateFormat === fmt}
                    onChange={(e) => setDateFormat(e.target.value)}
                  />
                  <span className="radio-text">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {field.type === "drop-down" && (
        <div className="dropdown-container">
          <div className="options-list">
            {options.map((opt, i) => (
              <div key={opt.id} className="option-item">
                <span className="option-number">{i + 1}</span>
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  className="option-input"
                />
                {options.length > 1 && (
                  <button
                    onClick={() => handleDeleteOption(opt.id)}
                    className="option-delete-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleAddOption} className="add-option-btn">+ Add option</button>
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
            <img
        src={FileSizeIcon}
        alt="file upload"
        className="file-upload-icon"
      />
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


      {/* Actions */}
      <div className="question-actions">
        <div className="action-buttons">
          <button onClick={() => onCopy(index)} className="action-btn">
            <img src={CopyIcon} alt="copy" className="action-icon" />
          </button>
          <button onClick={() => onDelete(index)} className="action-btn">
            <img src={DeleteIcon} alt="delete" className="action-icon" />
          </button>
        </div>

        <div className="toggle-options">
          <div className="toggle-item">
            <span>Description</span>
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
            <span>Required</span>
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

      {required && <span className="required-indicator">* Required</span>}
    </div>
  );
}
