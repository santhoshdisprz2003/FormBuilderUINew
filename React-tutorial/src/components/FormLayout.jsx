import React, { useState, useEffect } from "react";
import "../styles/FormLayout.css";
import DraggableField from "./DraggableField";
import QuestionCard from "./QuestionCard";
import DragFieldIcon from "../assets/DragFieldIcon.png";
import { useFormContext } from "../context/FormContext";



export default function FormLayout({inputFields}) {

     const {
    formName,
    description,
    fields,
    setFields,
    headerCard,
    setHeaderCard,
  } = useFormContext();
  
    const [activeIndex, setActiveIndex] = useState(null);

useEffect(() => {
  setHeaderCard((prev) => ({
    ...prev,
    title: prev.title || formName || "",
    description: prev.description || description || "",
  }));
}, [formName, description]);


  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const field = JSON.parse(data);
      setFields((prev) => [...prev, { ...field, id: Date.now() }]);
    } catch {}
  };

  const handleDelete = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopy = (index) => {
    setFields((prev) => [...prev, { ...prev[index], id: Date.now() }]);
  };


    return (
        <div className="form-layout-container">
            
            <div className="form-layout-left">
                <h4 className="input-title">Input Fields</h4>
                <div className="input-field-list">
                    {inputFields.map((field) => (
                        <DraggableField key={field.id} field={field} />
                    ))}
                </div>
            </div>

            
            <div
                className="form-layout-right"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="form-header-box">
                    <div className="form-header-title">Header Card</div>

                    <div className="field-wrapper">
                        <input
                            type="text"
                            className="form-header-input"
                            value={headerCard.title}
                            onChange={(e) =>
                                setHeaderCard((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Enter header title"
                            maxLength={80}
                        />
                    </div>

                    
                    <div className="field-wrapper">
                        <textarea
                            className="form-header-textarea"
                            value={headerCard.description}
                            onChange={(e) =>
                                setHeaderCard((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Enter header description"
                            maxLength={200}
                        />
                    </div>
                </div>


                
                {fields.length === 0 && (
                    <div className="form-drop-zone">
                        <div className="drag-panel">
                            <img
                                src={DragFieldIcon}
                                alt="drag icon"
                                className="drag-icon"
                            />
                            <p>Drag fields from the left panel</p>
                        </div>
                    </div>
                )}


                {fields.map((field, i) => (
                    <QuestionCard
                        key={i}
                        field={field}
                        index={i}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        onUpdate={(idx, updatedField) => {
                            const newFields = [...fields];
                            newFields[idx] = updatedField;
                            setFields(newFields);
                        }}
                        isActive={activeIndex === i}
                        setActiveIndex={() => setActiveIndex(i)}
                    />
                ))}

            </div>
        </div>
    );
}
