
import React from "react";
import "../styles/DraggableField.css";

export default function DraggableField({ field }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(field));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="draggable-field" draggable onDragStart={handleDragStart}>
      <div
        className="icon-border"
        style={{ 
          borderColor: field.borderColor,
          backgroundColor: field.borderColor
        }}
      >
        {field.icon && (
          <img
            src={field.icon}
            alt={field.label}
            className="field-icon"
          />
        )}
      </div>
      <span className="label">{field.label}</span>
    </div>
  );
}
