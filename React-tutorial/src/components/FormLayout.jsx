// src/components/FormLayout.jsx
import React from "react";
import "../styles/FormLayout.css";
import DraggableField from "./DraggableField";
import QuestionCard from "./QuestionCard";
import DragFieldIcon from "../assets/DragFieldIcon.png";


export default function FormLayout({
    inputFields,
    fields,
      setFields, 
    formName,
    description,
    handleDrop,
    handleDelete,
    handleCopy,
    setFormName,
    setDescription,
}) {
    return (
        <div className="form-layout-container">
            {/* Left Panel */}
            <div className="form-layout-left">
                <h4 className="input-title">Input Fields</h4>
                <div className="input-field-list">
                    {inputFields.map((field) => (
                        <DraggableField key={field.id} field={field} />
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div
                className="form-layout-right"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="form-header-box">
                    <div className="form-header-title">Form Header</div>

                    {/* Form Name */}
                    <div className="field-wrapper">
                        <input
                            type="text"
                            placeholder="Form Name"
                            className="header-input"
                            maxLength={80}
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                        />
                        <span className="char-count right">{formName.length}/80</span>
                    </div>

                    {/* Description */}
                    <div className="field-wrapper">
                        <textarea
                            placeholder="Form Description (optional)"
                            className="header-textarea"
                            maxLength={200}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <span className="char-count right desc">
                            {description.length}/200
                        </span>
                    </div>
                </div>

                {/* Drop zone */}
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
  />
))}

            </div>
        </div>
    );
}
