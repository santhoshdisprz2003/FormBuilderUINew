import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/CreateForm.css";
import "../styles/FormLayout.css";
import FormConfiguration from "./FormConfiguration";
import ViewFormLayout from "./ViewFormLayout";
import { getFormById } from "../api/formService.js"; 

export default function ViewForm() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("configuration");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch form by ID from backend
  useEffect(() => {
     console.log("Form ID from route:", id); 
    const fetchForm = async () => {
      try {
         console.log("Fetching form with ID:", id);
         const response = await getFormById(id); 
         console.log("API response:", response);
  setFormData(response);
      } catch (err) {
        console.error("Error fetching form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (loading) return <div className="loading">Loading form details...</div>;
  if (!formData) return <div className="error">Form not found.</div>;

  return (
    <div className="create-form-container">
      

      {/* ✅ Tab Buttons */}
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
        <button
          className={`tab ${activeTab === "responses" ? "active" : ""}`}
          onClick={() => setActiveTab("responses")}
        >
          Responses
        </button>
      </div>

      {/* ✅ Tab Content */}
      <div className="tab-content">
        {activeTab === "configuration" && (
          <FormConfiguration
            formName={formData.config?.title || ""}
            description={formData.config?.description || ""}
            visibility={false}
            setFormName={() => {}}
            setDescription={() => {}}
            setVisibility={() => {}}
            readOnly={true} // ✅ optional: prevent editing in view mode
          />
        )}

        {activeTab === "layout" && (
          <ViewFormLayout formData={formData} />
        )}

        {activeTab === "responses" && (
          <div className="responses-tab">
            <p>Responses section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
