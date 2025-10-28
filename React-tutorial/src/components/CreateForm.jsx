// src/components/CreateForm.jsx
import React, { useState } from "react";
import "../styles/CreateForm.css";
import EyeIcon from "../assets/Eye.png";
import FormConfiguration from "./FormConfiguration";
import FormLayout from "./FormLayout";
import FormPreviewModal from "./FormPreviewModal";

import ShortTextIcon from "../assets/ShortTextIcon.png";
import LongTextIcon from "../assets/LongTextIcon.png";
import DatePickerIcon from "../assets/DatePickerIcon.png";
import DropDownIcon from "../assets/DropDownIcon.png";
import FileUploadIcon from "../assets/FileUploadIcon.png";
import NumberIcon from "../assets/NumberIcon.png";

export default function CreateForm() {
  const [activeTab, setActiveTab] = useState("configuration");
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [fields, setFields] = useState([]);

   const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => setShowPreview(true);

  const inputFields = [
  { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#4F46E5" },
  { id: 2, label: "Long Text",  type: "long-text",  maxChar: 500, icon:LongTextIcon ,  borderColor: "#7B61FF40" },
  { id: 3, label: "Date Picker",type: "date-picker",      icon:DatePickerIcon ,         borderColor: "#BBE9E4" },
  { id: 4, label: "Dropdown",   type: "dropdown",  icon:DropDownIcon ,     borderColor: "#DBF3CC" },
  { id: 5, label: "File Upload",type: "file-upload",      icon: FileUploadIcon,         borderColor: "#E7CCF3" },
  { id: 6, label: "Number",     type: "number",    icon:NumberIcon ,       borderColor: "#F3CCE1" },
];

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const field = JSON.parse(data);
      setFields([...fields, { ...field, id: Date.now() }]);
    } catch (err) {}
  };

  const handleDelete = (index) => setFields(fields.filter((_, i) => i !== index));
  const handleCopy = (index) => setFields([...fields, { ...fields[index], id: Date.now() }]);

  return (
    <div className="create-form-container">
      {/* Tabs */}
     <div className="tab-container">
  <button
    className={`tab ${activeTab === "configuration" ? "active" : ""}`}
    onClick={() => setActiveTab("configuration")}
  >
    Form Configuration
  </button>

  <button
    className={`tab ${activeTab === "layout" ? "active" : ""} ${
      !formName.trim() ? "disabled" : ""
    }`}
    onClick={() => {
      if (formName.trim()) setActiveTab("layout");
    }}
    disabled={!formName.trim()}
  >
    Form Layout
  </button>
</div>


      {/* Render Tab */}
      {activeTab === "configuration" ? (
        <FormConfiguration
          formName={formName}
          description={description}
          visibility={visibility}
          setFormName={setFormName}
          setDescription={setDescription}
          setVisibility={setVisibility}
        />
      ) : (
        <FormLayout
          inputFields={inputFields}
          fields={fields}
          setFields={setFields}  
          formName={formName}
          description={description}
          handleDrop={handleDrop}
          handleDelete={handleDelete}
          handleCopy={handleCopy}
          setFormName={setFormName}
          setDescription={setDescription}
        />
      )}

      {/* Footer */}
     <div className="footer-buttons">
  <div className="footer-left-buttons">
    {activeTab === "layout" && (
      <button className="preview-btn" onClick={handlePreview}>
        <img src={EyeIcon} alt="preview" className="preview-icon" />
        Preview
      </button>
    )}
  </div>

  <div className="footer-right-buttons">
    <button className="draft-btn">Save as draft</button>
    {activeTab === "configuration" ? (
      <button
        className="next-btn"
        onClick={() => setActiveTab("layout")}
        disabled={!formName.trim()}
      >
        Next
      </button>
    ) : (
      <button className="publish-btn">Publish Form</button>
    )}
  </div>
</div>
 <FormPreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        formName={formName}
        description={description}
        fields={fields}
      />

    </div>
  );
}
