import React, { useState, useEffect } from "react";
import "../styles/CreateForm.css";
import "../styles/FormLayout.css";
import FormConfiguration from "./FormConfiguration";
import ViewFormLayout from "./ViewFormLayout";
import { getFormById } from "../api/formService.js"; 
import FormResponses from "./FormResponses";
import { useParams, useLocation } from "react-router-dom";
import { useFormContext } from "../context/FormContext.jsx";



export default function ViewForm() {
  const { id } = useParams();
   const location = useLocation();
   const [activeTab, setActiveTab] = useState( location.state?.openTab ||"configuration");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
      setFormName,
      setDescription,
      setReadOnly

    } = useFormContext();

  
  useEffect(() => {
     console.log("Form ID from route:", id); 
    const fetchForm = async () => {
      try {
         console.log("Fetching form with ID:", id);
         const response = await getFormById(id); 
         console.log("API response:", response);
  setFormData(response);
  setFormName(response.config.title);
  setDescription(response.config.description);
  setReadOnly(true);

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

  console.log(formData);
  

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
          className={`tab ${activeTab === "layout" ? "active" : ""}`}
          onClick={() => setActiveTab("layout")}
        >
          Form Content
        </button>
        <button
          className={`tab ${activeTab === "responses" ? "active" : ""}`}
          onClick={() => setActiveTab("responses")}
        >
          Responses
        </button>
      </div>

      
      <div className="tab-content">
        {activeTab === "configuration" && (
          <FormConfiguration />
        )}

        {activeTab === "layout" && (
          <ViewFormLayout formData={formData} />
        )}

        {activeTab === "responses" && <FormResponses />}

      </div>
    </div>
  );
}
