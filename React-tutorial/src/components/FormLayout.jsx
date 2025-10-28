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
                        <h2 className="form-title">{formName || "Untitled Form"}</h2>
                    </div>

                    {/* Description */}
                    {description && (
                        <div className="field-wrapper">
                            <p className="form-description">{description}</p>
                        </div>
                    )}
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
