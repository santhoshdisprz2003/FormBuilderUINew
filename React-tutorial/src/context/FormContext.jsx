import React, { createContext, useContext, useState } from "react";


export const FormContext = createContext();


export function FormProvider({ children }) {
  
  const [formId, setFormId] = useState(null);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  
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
        readOnly,
        setReadOnly
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

// ✅ Export custom hook
export const useFormContext = () => useContext(FormContext);
