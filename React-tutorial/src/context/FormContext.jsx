import React, { createContext, useContext, useState } from "react";

// 1️⃣ Create the context
export const FormContext = createContext();

// 2️⃣ Create the provider
export function FormProvider({ children }) {
  // --- Form configuration state ---
  const [formId, setFormId] = useState(null);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);

  
  const [fields, setFields] = useState([]);
  const [headerCard, setHeaderCard] = useState({ title: "", description: "" });

  
  const [showPreview, setShowPreview] = useState(false);

  
  const [activeTab, setActiveTab] = useState("configuration");

  

  return (
    <FormContext.Provider
      value={{
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
        showPreview,
        setShowPreview,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

// ✅ Export custom hook
export const useFormContext = () => useContext(FormContext);
