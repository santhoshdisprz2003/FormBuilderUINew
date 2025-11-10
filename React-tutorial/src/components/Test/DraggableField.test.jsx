import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DraggableField from "../DraggableField";

describe("DraggableField", () => {
  const mockField = {
    label: "Text Input",
    icon: "/icons/text-icon.png",
    borderColor: "#3b82f6",
    type: "text"
  };

  test("renders field with label", () => {
    render(<DraggableField field={mockField} />);
    expect(screen.getByText("Text Input")).toBeInTheDocument();
  });

  test("renders field icon with correct src and alt", () => {
    render(<DraggableField field={mockField} />);
    const icon = screen.getByAltText("Text Input");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "/icons/text-icon.png");
  });

  test("applies correct border color and background color", () => {
    render(<DraggableField field={mockField} />);
    const iconBorder = document.querySelector(".icon-border");
    expect(iconBorder).toHaveStyle({
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6"
    });
  });

  test("is draggable", () => {
    render(<DraggableField field={mockField} />);
    const draggableElement = document.querySelector(".draggable-field");
    expect(draggableElement).toHaveAttribute("draggable");
  });

  test("handles drag start event correctly", () => {
    render(<DraggableField field={mockField} />);
    const draggableElement = document.querySelector(".draggable-field");
    
    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: ""
    };

    fireEvent.dragStart(draggableElement, { dataTransfer });

    expect(dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      JSON.stringify(mockField)
    );
    expect(dataTransfer.effectAllowed).toBe("move");
  });

  test("renders without icon when icon is not provided", () => {
    const fieldWithoutIcon = {
      label: "No Icon Field",
      borderColor: "#10b981"
    };
    
    render(<DraggableField field={fieldWithoutIcon} />);
    expect(screen.getByText("No Icon Field")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<DraggableField field={mockField} />);
    
    expect(document.querySelector(".draggable-field")).toBeInTheDocument();
    expect(document.querySelector(".icon-border")).toBeInTheDocument();
    expect(document.querySelector(".field-icon")).toBeInTheDocument();
    expect(document.querySelector(".label")).toBeInTheDocument();
  });
});
