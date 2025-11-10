import React from "react";
import "../styles/ViewFormLayout.css";


import ViewShortTextIcon from "../assets/ViewShortTextIcon.png";
import ViewLongTextIcon from "../assets/ViewLongTextIcon.png";
import ViewDatePickerIcon from "../assets/ViewDatePickerIcon.png";
import ViewDropDownIcon from "../assets/ViewDropDownIcon.png";
import ViewFileUploadIcon from "../assets/ViewFileUploadIcon.png";
import ViewNumberIcon from "../assets/ViewNumberIcon.png";
import FileSizeIcon from "../assets/FileSizeIcon.png";


export default function ViewFormLayout({ formData }) {
  const header = formData?.layout?.headerCard || {};
  const fields = formData?.layout?.fields || [];

  console.log(formData);

  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ViewShortTextIcon, borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: ViewLongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: ViewDatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: ViewDropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: ViewFileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: ViewNumberIcon, borderColor: "#F3CCE1" },
  ];

  return (
    <div className="form-layout-container">
      
      <div className="form-layout-left">
        <h4 className="input-title">Input Fields</h4>
        <div className="input-field-list">
          {inputFields.map((field) => (
            <div
              key={field.id}
              className="input-field disabled"
            
            >
              <img src={field.icon} alt={field.label} className="input-icon" />
              <span>{field.label}</span>
            </div>
          ))}
        </div>
      </div>

      
      <div className="form-layout-right">
        
        <div className="form-header-box1">
          <div className="form-header-title">Form Header</div>
          <h3 className="header-input1">{header.title || formData?.config?.title || ""}</h3>
          <h4
            className="header-textarea1">
          {header.description || formData?.config?.description || ""}</h4>
        </div>

        
        {fields.length === 0 ? (
          <p className="no-questions">No questions found for this form.</p>
        ) : (
          fields.map((q, index) => (
            <div key={index} className="question-card view-mode">
              <div className="question-label">
                {index + 1}. {q.label}
                
              </div>

              {q.description && (
  <p className="question-description1">{q.description}</p>
)}

              
              {q.type === "short-text" && (
                <input
                  type="text"
                  className="question-input1"
                  placeholder={`Short text answer (max ${q.maxChar || 100} chars)`}
                  readOnly
                />
              )}

              
              {q.type === "long-text" && (
                <textarea
                  className="question-input1"
                  placeholder={`Long text answer (max ${q.maxChar || 500} chars)`}
                  readOnly
                />
              )}

              
              {q.type === "date-picker" && (
                <input type="date" className="question-input1" readOnly />
              )}

             
              {q.type === "drop-down" && (
                <div className="dropdown-display">
                  {q.options?.length > 0 ? (
                    <div className="dropdown-field" readOnly>
                      {q.options.map((opt, i) => (
                        <div key={i} className="question-input1">
                          {opt.value || opt}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-options">No options available</p>
                  )}
                </div>
              )}

              
              {q.type === "file-upload" && (
                <div className="question-input1">
                  <div className="file-upload-icon">
                     <img src={FileSizeIcon} className="file-icon"></img>
                  </div>
                  
                    <p className="file-upload-title">File Upload </p>
                    <p className="file-upload-info">
                      Supported files:PDF,PNG,JPG |Max file 2 MB
                    </p>
                  
                </div>
              )}

              
              {q.type === "number" && (
                <input
                  type="number"
                  className="question-input1"
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
