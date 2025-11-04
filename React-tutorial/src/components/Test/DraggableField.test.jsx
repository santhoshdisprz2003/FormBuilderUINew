import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DraggableField from "../DraggableField";

describe("DraggableField Component", () => {
  const mockField = {
    id: 1,
    label: "Short Text",
    type: "short-text",
    icon: "short-text-icon.png",
    borderColor: "#4F46E5",
  };

  test("renders component with field label", () => {
    render(<DraggableField field={mockField} />);
    expect(screen.getByText("Short Text")).toBeInTheDocument();
  });

  test("renders with correct draggable attribute", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const draggableDiv = container.querySelector(".draggable-field");
    expect(draggableDiv).toHaveAttribute("draggable", "true");
  });

  test("renders icon with correct src", () => {
    render(<DraggableField field={mockField} />);
    const icon = screen.getByAltText("Short Text");
    expect(icon).toHaveAttribute("src", "short-text-icon.png");
  });

  test("renders icon with correct class", () => {
    render(<DraggableField field={mockField} />);
    const icon = screen.getByAltText("Short Text");
    expect(icon).toHaveClass("field-icon");
  });

  test("applies correct border color to icon container", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const iconBorder = container.querySelector(".icon-border");
    expect(iconBorder).toHaveStyle({
      borderColor: "#4F46E5",
      backgroundColor: "#4F46E5",
    });
  });

  test("renders without icon when icon is not provided", () => {
    const fieldWithoutIcon = { ...mockField, icon: null };
    render(<DraggableField field={fieldWithoutIcon} />);
    expect(screen.queryByAltText("Short Text")).not.toBeInTheDocument();
  });

  test("renders label with correct class", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const label = container.querySelector(".label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Short Text");
  });

  test("renders with different field types", () => {
    const longTextField = {
      id: 2,
      label: "Long Text",
      type: "long-text",
      icon: "long-text-icon.png",
      borderColor: "#7B61FF40",
    };
    render(<DraggableField field={longTextField} />);
    expect(screen.getByText("Long Text")).toBeInTheDocument();
  });

  test("renders with different border colors", () => {
    const dateField = {
      id: 3,
      label: "Date Picker",
      type: "date-picker",
      icon: "date-icon.png",
      borderColor: "#BBE9E4",
    };
    const { container } = render(<DraggableField field={dateField} />);
    const iconBorder = container.querySelector(".icon-border");
    expect(iconBorder).toHaveStyle({
      borderColor: "#BBE9E4",
      backgroundColor: "#BBE9E4",
    });
  });

  test("handles drag start event", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const draggableDiv = container.querySelector(".draggable-field");
    
    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: "",
    };
    
    fireEvent.dragStart(draggableDiv, { dataTransfer });
    
    expect(dataTransfer.setData).toHaveBeenCalledWith(
      "text/plain",
      JSON.stringify(mockField)
    );
    expect(dataTransfer.effectAllowed).toBe("move");
  });

  test("renders multiple DraggableField components", () => {
    const fields = [
      { id: 1, label: "Short Text", type: "short-text", icon: "icon1.png", borderColor: "#4F46E5" },
      { id: 2, label: "Long Text", type: "long-text", icon: "icon2.png", borderColor: "#7B61FF40" },
      { id: 3, label: "Number", type: "number", icon: "icon3.png", borderColor: "#F3CCE1" },
    ];

    const { container } = render(
      <div>
        {fields.map((field) => (
          <DraggableField key={field.id} field={field} />
        ))}
      </div>
    );

    expect(screen.getByText("Short Text")).toBeInTheDocument();
    expect(screen.getByText("Long Text")).toBeInTheDocument();
    expect(screen.getByText("Number")).toBeInTheDocument();
    
    const draggableFields = container.querySelectorAll(".draggable-field");
    expect(draggableFields).toHaveLength(3);
  });

  test("renders with empty label", () => {
    const fieldWithEmptyLabel = { ...mockField, label: "" };
    const { container } = render(<DraggableField field={fieldWithEmptyLabel} />);
    const label = container.querySelector(".label");
    expect(label).toHaveTextContent("");
  });

  test("renders icon border container", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const iconBorder = container.querySelector(".icon-border");
    expect(iconBorder).toBeInTheDocument();
  });

  test("renders with special characters in label", () => {
    const specialField = {
      ...mockField,
      label: "Text & Special <Characters>",
    };
    render(<DraggableField field={specialField} />);
    expect(screen.getByText("Text & Special <Characters>")).toBeInTheDocument();
  });

  test("renders with long label text", () => {
    const longLabelField = {
      ...mockField,
      label: "This is a very long label text that should still render correctly",
    };
    render(<DraggableField field={longLabelField} />);
    expect(screen.getByText("This is a very long label text that should still render correctly")).toBeInTheDocument();
  });

  test("renders with numeric label", () => {
    const numericField = {
      ...mockField,
      label: "123456",
    };
    render(<DraggableField field={numericField} />);
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  test("component structure is correct", () => {
    const { container } = render(<DraggableField field={mockField} />);
    
    const draggableField = container.querySelector(".draggable-field");
    const iconBorder = container.querySelector(".icon-border");
    const label = container.querySelector(".label");
    
    expect(draggableField).toContainElement(iconBorder);
    expect(draggableField).toContainElement(label);
  });

  test("renders with undefined icon gracefully", () => {
    const fieldWithUndefinedIcon = { ...mockField, icon: undefined };
    const { container } = render(<DraggableField field={fieldWithUndefinedIcon} />);
    expect(container.querySelector(".field-icon")).not.toBeInTheDocument();
  });

  test("renders with all field types", () => {
    const fieldTypes = [
      { id: 1, label: "Short Text", type: "short-text", icon: "icon1.png", borderColor: "#4F46E5" },
      { id: 2, label: "Long Text", type: "long-text", icon: "icon2.png", borderColor: "#7B61FF40" },
      { id: 3, label: "Date Picker", type: "date-picker", icon: "icon3.png", borderColor: "#BBE9E4" },
      { id: 4, label: "Dropdown", type: "drop-down", icon: "icon4.png", borderColor: "#DBF3CC" },
      { id: 5, label: "File Upload", type: "file-upload", icon: "icon5.png", borderColor: "#E7CCF3" },
      { id: 6, label: "Number", type: "number", icon: "icon6.png", borderColor: "#F3CCE1" },
    ];

    fieldTypes.forEach((field) => {
      const { unmount } = render(<DraggableField field={field} />);
      expect(screen.getByText(field.label)).toBeInTheDocument();
      unmount();
    });
  });

  test("drag start sets correct data format", () => {
    const { container } = render(<DraggableField field={mockField} />);
    const draggableDiv = container.querySelector(".draggable-field");
    
    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: "",
    };
    
    fireEvent.dragStart(draggableDiv, { dataTransfer });
    
    const expectedData = JSON.stringify(mockField);
    expect(dataTransfer.setData).toHaveBeenCalledWith("text/plain", expectedData);
  });

  test("renders correctly when re-rendered with different props", () => {
    const { rerender } = render(<DraggableField field={mockField} />);
    expect(screen.getByText("Short Text")).toBeInTheDocument();
    
    const newField = {
      id: 2,
      label: "Updated Field",
      type: "long-text",
      icon: "new-icon.png",
      borderColor: "#000000",
    };
    
    rerender(<DraggableField field={newField} />);
    expect(screen.getByText("Updated Field")).toBeInTheDocument();
    expect(screen.queryByText("Short Text")).not.toBeInTheDocument();
  });
});
