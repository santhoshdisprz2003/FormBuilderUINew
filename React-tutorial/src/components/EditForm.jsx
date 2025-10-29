// src/components/EditForm.jsx
import React, { useState, useEffect } from "react";
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
  getFormById,
  updateFormConfig,
  updateFormLayout,
  publishForm
} from "../api/formService";
import { useParams } from "react-router-dom";

export default function EditForm() {
  const { id } = useParams(); // formId from URL
  const [activeTab, setActiveTab] = useState("configuration");

  const [formId, setFormId] = useState(id);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [fields, setFields] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // 🧠 Load existing form data on mount
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormById(id);
        console.log("🧾 Loaded form for edit:", res);

        setFormName(res.config?.title || "");
        setDescription(res.config?.description || "");

        // 🔹 Convert and normalize fields for editable mode
        const loadedFields =
          res.layout?.fields?.map((f, i) => ({
            id: f.id || i,
            questionId: f.questionId || `${Date.now()}-${i}`,
            label: f.label || f.question || "Untitled Question",
            type: f.type,
            descriptionEnabled: f.descriptionEnabled ?? true, // enable description for editing
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
            isEditing: true, // 🧩 force editable mode in QuestionCard
          })) || [];

        setFields(loadedFields);
      } catch (err) {
        console.error("❌ Failed to load form:", err);
      }
    };
    fetchForm();
  }, [id]);

  // 🎨 Input field templates for left panel
  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: LongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: DatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: DropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: FileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: NumberIcon, borderColor: "#F3CCE1" },
  ];

  // 🧩 Save Draft handler
  const handleSaveDraft = async () => {
    try {
      if (activeTab === "configuration") {
        const configData = { title: formName, description, visibility };
        await updateFormConfig(formId, configData);
        alert("✅ Configuration draft updated!");
      } else if (activeTab === "layout") {
        const layoutData = {
          headerCard: {
            id: Date.now().toString(),
            title: formName,
            description,
          },
          fields: fields.map((f, i) => ({
            id: f.id || i,
            questionId: f.questionId || Date.now().toString() + i,
            label: f.label || f.question || "Untitled Question",
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
        await updateFormLayout(formId, layoutData);
        alert("✅ Layout draft updated!");
      }
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      alert("❌ Failed to save draft.");
    }
  };

  // 🚀 Publish handler
  const handlePublish = async () => {
    try {
      await publishForm(formId);
      alert("🚀 Form published successfully!");
    } catch (err) {
      console.error("❌ Failed to publish:", err);
      alert("❌ Error publishing form.");
    }
  };

  // 🧲 Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const field = JSON.parse(data);
      setFields([...fields, { ...field, id: Date.now(), isEditing: true }]);
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDelete = (index) => setFields(fields.filter((_, i) => i !== index));
  const handleCopy = (index) => setFields([...fields, { ...fields[index], id: Date.now(), isEditing: true }]);

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
          className={`tab ${activeTab === "layout" ? "active" : ""}`}
          onClick={() => setActiveTab("layout")}
        >
          Form Layout
        </button>
      </div>

      {/* Render Tabs */}
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
            <button className="preview-btn" onClick={() => setShowPreview(true)}>
              <img src={EyeIcon} alt="preview" className="preview-icon" />
              Preview
            </button>
          )}
        </div>

        <div className="footer-right-buttons">
          <button className="draft-btn" onClick={handleSaveDraft}>
            Save as draft
          </button>

          {activeTab === "configuration" ? (
            <button className="next-btn" onClick={() => setActiveTab("layout")}>
              Next
            </button>
          ) : (
            <button className="publish-btn" onClick={handlePublish}>
              Publish
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
