import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
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
  updateFormLayout,
  publishForm,
  getFormById
} from "../api/formService";

export default function CreateForm({ mode = "create" }) {
  const { formId: paramFormId } = useParams();
  const [activeTab, setActiveTab] = useState("configuration");
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [fields, setFields] = useState([]);
  const [formId, setFormId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [headerCard, setHeaderCard] = useState({
  title: "",
  description: "",
});


  const handlePreview = () => setShowPreview(true);
  const navigate = useNavigate();


  // Available input field types
  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#CBE3FE" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: LongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: DatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: DropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: FileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: NumberIcon, borderColor: "#F3CCE1" },
  ];

  // 🔹 Load existing form if in edit mode
  useEffect(() => {
    if (mode === "edit" && paramFormId) {
      (async () => {
        try {
          const existingForm = await getFormById(paramFormId);

          setFormId(existingForm.id);
          setFormName(existingForm.config.title || "");
          setDescription(existingForm.config.description || "");
          setVisibility(existingForm.config.visibility || false);

          // Map layout fields back into UI format
          const loadedFields = existingForm.layout?.fields?.map((f) => ({
            id: f.id,
            label: f.label,
            question: f.label,
            type: f.type,
            descriptionEnabled: f.descriptionEnabled,
            description: f.description,
            SingleChoice: f.singleChoice,
            MultipleChoice: f.multipleChoice,
            options: f.options || [],
            format: f.format,
            required: f.required,
            order: f.order,
          })) || [];

          setFields(loadedFields);
        } catch (err) {
          console.error("❌ Failed to load form for editing:", err);
          alert("Error loading form data for editing.");
        }
      })();
    }
  }, [mode, paramFormId]);

  // --- Save Draft Logic ---
  const handleSaveDraft = async () => {
    try {
      if (activeTab === "configuration") {
        const configData = { title: formName, description, visibility };
        if (!formId) {
          const response = await createFormConfig(configData);
          setFormId(response.id);
          alert("✅ Form configuration created and saved as draft!");
          navigate("/"); // redirect to home after saving draft
          return response.id;
        } else {
          await updateFormConfig(formId, configData);
          alert(" Form configuration updated and saved as draft!");
          navigate("/"); // redirect to home after saving draft
          return formId;
        }
      } else if (activeTab === "layout") {
        if (!formId) {
          alert("Please save configuration first before layout draft!");
          return;
        }

        const layoutData = {
          headerCard: { 
          id: Date.now().toString(), 
          title: headerCard.title, 
          description: headerCard.description 
        },
          fields: fields.map((f, i) => ({
            id: f.id || i,
            questionId: f.questionId || Date.now().toString() + i,
            label: f.question || f.label || "Untitled Question",
            type: f.type,
            descriptionEnabled: f.descriptionEnabled ?? false,
            description: f.description || "",
            SingleChoice: f.single_choice ?? false,
            MultipleChoice: f.multiple_choice ?? false,
            options: f.options?.map((opt, idx) => ({
              optionId: opt.optionId || idx.toString(),
              value: opt.value || opt.label || opt || "",
            })) || [],
            format: f.format || "",
            required: f.required ?? false,
            order: i,
          })),
        };

        await updateFormLayout(formId, layoutData);
        alert(" Form layout Updated and saved as draft!");
        navigate("/"); // redirect to home after saving draft
      }
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      alert("❌ Failed to save draft.");
    }
  };

  // --- Publish Form ---
  const handlePublish = async () => {
    if (!formId) {
      alert("Please save the configuration first!");
      return;
    }

    try {
      const layoutData = {
         headerCard: {
        id: Date.now().toString(),
        title: headerCard.title,
        description: headerCard.description,
      },
        fields: fields.map((f, i) => ({
          id: f.id || i,
          questionId: f.questionId || Date.now().toString() + i,
          label: f.question || f.label || "Untitled Question",
          type: f.type,
          descriptionEnabled: f.descriptionEnabled ?? false,
          description: f.description || "",
          SingleChoice: f.single_choice ?? false,
          MultipleChoice: f.multiple_choice ?? false,
          options: f.options?.map((opt, idx) => ({
            optionId: opt.optionId || idx.toString(),
            value: opt.value || opt.label || opt || "",
          })) || [],
          format: f.format || "",
          required: f.required ?? false,
          order: i,
        })),
      };

      await updateFormLayout(formId, layoutData);
      const publishedForm = await publishForm(formId);
      alert(" Form published successfully...");
      navigate("/"); // redirect to home after saving draft
    } catch (err) {
      console.error("Error publishing form:", err);
      alert("❌ Failed to publish form.");
    }
  };

  // --- Drag and Drop handlers ---
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const field = JSON.parse(data);
      setFields([...fields, { ...field, id: Date.now() }]);
    } catch {}
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
          className={`tab ${activeTab === "layout" ? "active" : ""} ${!formName.trim() ? "disabled" : ""}`}
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
          headerCard={headerCard}
  setHeaderCard={setHeaderCard}
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
                 setActiveTab("layout");
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
