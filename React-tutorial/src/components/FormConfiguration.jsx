// src/components/FormConfiguration.jsx
import React from "react";
import "../styles/FormConfiguration.css";

export default function FormConfiguration({
  formName,
  description,
  visibility,
  setFormName,
  setDescription,
  setVisibility,
}) {
  return (
    <div className="form-section">
      <h3 className="section-title">Form Details</h3>

      <div className="form-group">
        <label htmlFor="formName">
          Form Name<span className="required">*</span>
        </label>
        <input
          id="formName"
          type="text"
          className="input-config"
          placeholder="Enter Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          maxLength={80}
        />
        <span className="char-count">{formName.length}/80</span>
      </div>

      <div className="form-group">
        <label htmlFor="formDesc">Form Description</label>
        <textarea
          id="formDesc"
          className="input-config"
          placeholder="Summarize the form's purpose for internal reference."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        <span className="char-count">{description.length}/200</span>
      </div>

      <div className="form-group visibility">
        <label>Form Visibility</label>
        <label className="switch">
          <input
          className="input-config"
            type="checkbox"
            checked={visibility}
            onChange={() => setVisibility((v) => !v)}
          />
          <span className="slider round" />
        </label>
        <p className="help-text">
          Turn on to allow new workflows to use this form. Turn off to hide it,
          but existing workflows will keep working.
        </p>
      </div>
    </div>
  );
}
