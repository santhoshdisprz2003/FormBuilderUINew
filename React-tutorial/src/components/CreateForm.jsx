import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useFormContext } from "../context/FormContext";
import { toast } from "react-toastify";

export default function CreateForm({ mode = "create" }) {
  const {
    formId,
    setFormId,
    formName,
    setFormName,
    description,
    setDescription,
    visibility,
    setVisibility,
    fields,
    setFields,
    headerCard,
    setHeaderCard,
    activeTab,
    setActiveTab,
    showPreview,
    setShowPreview,
  } = useFormContext();

  const { formId: paramFormId } = useParams();
  const navigate = useNavigate();

  const handlePreview = () => setShowPreview(true);


  const inputFields = [
    { id: 1, label: "Short Text", type: "short-text", maxChar: 100, icon: ShortTextIcon, borderColor: "#CBE3FE" },
    { id: 2, label: "Long Text", type: "long-text", maxChar: 500, icon: LongTextIcon, borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: DatePickerIcon, borderColor: "#BBE9E4" },
    { id: 4, label: "Dropdown", type: "drop-down", icon: DropDownIcon, borderColor: "#DBF3CC" },
    { id: 5, label: "File Upload", type: "file-upload", icon: FileUploadIcon, borderColor: "#E7CCF3" },
    { id: 6, label: "Number", type: "number", icon: NumberIcon, borderColor: "#F3CCE1" },
  ];

  useEffect(() => {
    if (mode === "edit" && paramFormId) {
      (async () => {
        try {
          const existingForm = await getFormById(paramFormId);

          setFormId(existingForm.id);
          setFormName(existingForm.config.title || "");
          setDescription(existingForm.config.description || "");
          setVisibility(existingForm.config.visibility || false);


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
          console.error(" Failed to load form for editing:", err);
          alert("Error loading form data for editing.");
        }
      })();
    }
  }, [mode, paramFormId]);


  const handleSaveDraft = async () => {
    try {
      if (activeTab === "configuration") {
        const configData = { title: formName, description, visibility };
        if (!formId) {
          const response = await createFormConfig(configData);
          setFormId(response.id);
          toast.success(" Form configuration created and saved as draft!");
          navigate("/");
          return response.id;
        } else {
          await updateFormConfig(formId, configData);
          toast.success(" Form configuration updated and saved as draft!");
          navigate("/");
          return formId;
        }
      } else if (activeTab === "layout") {
        if (!formId) {
          toast.error("Please save configuration first before layout draft!");
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
        toast.success(" Form layout Updated and saved as draft!");
        navigate("/");
      }
    } catch (err) {
      toast.error(" Error saving draft:");
      toast.error(" Failed to save draft.");
    }
  };


  const handlePublish = async () => {
    if (!formId) {
      toast.error("Please save the configuration first!");
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
      toast.success(" Form published successfully...");
      navigate("/");
    } catch (err) {
      toast.error("Error publishing form:");
      toast.error("Failed to publish form.");
    }
  };

  return (
    <div className="create-form-container">

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


      {activeTab === "configuration" ? (
        <FormConfiguration
        />
      ) : (
        <FormLayout inputFields={inputFields} />
      )}


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
