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
import {
  createFormConfig,
  updateFormConfig,
  createFormLayout,
  updateFormLayout,
  publishForm
} from "../api/formService";


export default function CreateForm() {
  const [activeTab, setActiveTab] = useState("configuration");
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [fields, setFields] = useState([]);
  const [formId, setFormId] = useState(null);


  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => setShowPreview(true);

  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: LongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: DatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: DropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: FileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: NumberIcon, borderColor: "#F3CCE1" },
  ];

  const handleSaveDraft = async () => {
    try {
      if (activeTab === "configuration") {
        // --- Save Config Draft ---
        const configData = { title: formName, description, visibility };

        if (!formId) {
          const response = await createFormConfig(configData);
          setFormId(response.id);
          alert("✅ Form configuration saved as draft!");
          return response.id;
        } else {
          await updateFormConfig(formId, configData);
          alert("✅ Form configuration updated!");
          return formId;
        }
      }

      else if (activeTab === "layout") {
        // --- Save Layout Draft ---
        if (!formId) {
          alert("Please save configuration first before layout draft!");
          return;
        }

        const layoutData = {
          headerCard: {
            id: Date.now().toString(),
            title: formName,
            description,
          },
          fields: fields.map((f, i) => ({
            id: f.id || i,
            questionId: f.questionId || Date.now().toString() + i,
            label: f.question || f.label || "Untitled Question",
            type: f.type,
            descriptionEnabled: f.descriptionEnabled ?? false,
            description: f.description || "",
            singleChoice: f.singleChoice ?? false,
            multipleChoice: f.multipleChoice ?? false,
            options:
              f.options?.map((opt, idx) => ({
                optionId: opt.optionId || idx.toString(),
                value: opt.value || opt.label || opt || "",
              })) || [],
            format: f.format || "",
            required: f.required ?? false,
            order: i,
          })),
        };

        const res = await updateFormLayout(formId, layoutData);
        console.log("🧾 Layout draft saved:", res);
        alert("✅ Form layout saved as draft!");
      }
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      alert("❌ Failed to save draft.");
    }
  };



  const handlePublish = async () => {
    if (!formId) {
      alert("Please save the configuration first!");
      return;
    }

    try {
      const layoutData = {
        headerCard: {
          id: Date.now().toString(),
          title: formName,
          description,
        },
        fields: fields.map((f, i) => ({
          id: f.id || i,
          questionId: f.questionId || Date.now().toString() + i,
          label: f.question || f.label || "Untitled Question", // ✅ store actual question
          type: f.type,
          descriptionEnabled: f.descriptionEnabled ?? false,
          description: f.description || "",
          singleChoice: f.singleChoice ?? false,
          multipleChoice: f.multipleChoice ?? false,
          options:
            f.options?.map((opt, idx) => ({
              optionId: opt.optionId || idx.toString(),
              value: opt.value || opt.label || opt || "", // ✅ capture dropdown option text
            })) || [],
          format: f.format || "",
          required: f.required ?? false,
          order: i,
        })),
      };

      console.log("📦 Final layout payload:", JSON.stringify(layoutData, null, 2));

      if (fields.length > 0) {
        try {
          const res = await updateFormLayout(formId, layoutData);
          console.log("✅ Layout updated successfully!");
          console.log("🧾 Layout API response:", res);
        } catch (err) {
          console.log("🧩 Fields before publish:", fields);
          console.log("📦 Layout data to send (create):", layoutData);

          const res = await createFormLayout(formId, layoutData);
          console.log("✅ Layout created successfully!");
          console.log("🧾 Layout API response:", res);
        }
      }

      const publishedForm = await publishForm(formId);
      alert(`🚀 Form "${publishedForm.config.title}" published successfully!`);
    } catch (err) {
      console.error("Error publishing form:", err);
      alert("❌ Failed to publish form.");
    }
  };





  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const field = JSON.parse(data);
      setFields([...fields, { ...field, id: Date.now() }]);
    } catch (err) { }
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
          className={`tab ${activeTab === "layout" ? "active" : ""} ${!formName.trim() ? "disabled" : ""
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
          <button className="draft-btn" onClick={handleSaveDraft}>Save as draft</button>
          {activeTab === "configuration" ? (
            <button
              className="next-btn"
              onClick={async () => {
                const id = await handleSaveDraft();
                if (id || formName.trim()) setActiveTab("layout");
              }}
              disabled={!formName.trim()}
            >
              Next
            </button>

          ) : (
            <button
              className="publish-btn"
              onClick={handlePublish}
              disabled={!fields.length}
            >
              Publish Form
            </button>
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
