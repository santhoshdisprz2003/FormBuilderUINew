import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormLayout from "../FormLayout";

// Mock images
jest.mock("../../assets/DragFieldIcon.png", () => "drag-field-icon.png");

// Mock child components
jest.mock("../DraggableField", () => {
  return function DraggableField({ field }) {
    return (
      <div data-testid={`draggable-field-${field.id}`}>
        <span>{field.label}</span>
      </div>
    );
  };
});

jest.mock("../QuestionCard", () => {
  return function QuestionCard({ field, index, onDelete, onCopy, onUpdate }) {
    return (
      <div data-testid={`question-card-${index}`}>
        <div data-testid={`field-label-${index}`}>{field.label || field.question}</div>
        <div data-testid={`field-type-${index}`}>{field.type}</div>
        <button data-testid={`delete-btn-${index}`} onClick={() => onDelete(index)}>
          Delete
        </button>
        <button data-testid={`copy-btn-${index}`} onClick={() => onCopy(index)}>
          Copy
        </button>
        <button
          data-testid={`update-btn-${index}`}
          onClick={() => onUpdate(index, { ...field, label: "Updated" })}
        >
          Update
        </button>
      </div>
    );
  };
});

describe("FormLayout Component - Rendering Tests", () => {
  const mockSetFields = jest.fn();
  const mockHandleDrop = jest.fn();
  const mockHandleDelete = jest.fn();
  const mockHandleCopy = jest.fn();
  const mockSetFormName = jest.fn();
  const mockSetDescription = jest.fn();

  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", icon: "long-text.png", borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: "date-picker.png", borderColor: "#BBE9E4" },
  ];

  const defaultProps = {
    inputFields: defaultInputFields,
    fields: [],
    setFields: mockSetFields,
    formName: "Test Form",
    description: "Test Description",
    handleDrop: mockHandleDrop,
    handleDelete: mockHandleDelete,
    handleCopy: mockHandleCopy,
    setFormName: mockSetFormName,
    setDescription: mockSetDescription,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders left panel", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const leftPanel = container.querySelector(".form-layout-left");
    expect(leftPanel).toBeInTheDocument();
  });

  test("renders right panel", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const rightPanel = container.querySelector(".form-layout-right");
    expect(rightPanel).toBeInTheDocument();
  });

  test("renders Input Fields title", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders input field list", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const inputFieldList = container.querySelector(".input-field-list");
    expect(inputFieldList).toBeInTheDocument();
  });

  test("renders all input fields", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-3")).toBeInTheDocument();
  });

  test("renders input field labels", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Short Text")).toBeInTheDocument();
    expect(screen.getByText("Long Text")).toBeInTheDocument();
    expect(screen.getByText("Date Picker")).toBeInTheDocument();
  });

  test("renders form header box", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const headerBox = container.querySelector(".form-header-box");
    expect(headerBox).toBeInTheDocument();
  });

  test("renders Form Header title", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Form Header")).toBeInTheDocument();
  });

  test("renders form name", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("renders Untitled Form when formName is empty", () => {
    const props = { ...defaultProps, formName: "" };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("renders form description", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("does not render description when empty", () => {
    const props = { ...defaultProps, description: "" };
    render(<FormLayout {...props} />);
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("renders drop zone when no fields", () => {
    render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Drag fields from the left panel")).toBeInTheDocument();
  });

  test("renders drag icon in drop zone", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const dragIcon = container.querySelector(".drag-icon");
    expect(dragIcon).toBeInTheDocument();
  });

  test("does not render drop zone when fields exist", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.queryByText("Drag fields from the left panel")).not.toBeInTheDocument();
  });

  test("renders question cards for fields", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
  });

  test("renders field labels in question cards", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("Question 1");
    expect(screen.getByTestId("field-label-1")).toHaveTextContent("Question 2");
  });

  test("renders field types in question cards", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "number" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("field-type-0")).toHaveTextContent("short-text");
    expect(screen.getByTestId("field-type-1")).toHaveTextContent("number");
  });

  test("renders delete buttons for each field", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("delete-btn-0")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn-1")).toBeInTheDocument();
  });

  test("renders copy buttons for each field", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("copy-btn-0")).toBeInTheDocument();
    expect(screen.getByTestId("copy-btn-1")).toBeInTheDocument();
  });

  test("calls handleDelete when delete button is clicked", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    const deleteBtn = screen.getByTestId("delete-btn-0");
    fireEvent.click(deleteBtn);
    expect(mockHandleDelete).toHaveBeenCalledWith(0);
  });

  test("calls handleCopy when copy button is clicked", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    const copyBtn = screen.getByTestId("copy-btn-0");
    fireEvent.click(copyBtn);
    expect(mockHandleCopy).toHaveBeenCalledWith(0);
  });

  test("calls setFields when update button is clicked", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    const updateBtn = screen.getByTestId("update-btn-0");
    fireEvent.click(updateBtn);
    expect(mockSetFields).toHaveBeenCalled();
  });

  test("handles drag over event", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const rightPanel = container.querySelector(".form-layout-right");
    const dragOverEvent = new Event("dragover", { bubbles: true });
    Object.defineProperty(dragOverEvent, "preventDefault", { value: jest.fn() });
    rightPanel.dispatchEvent(dragOverEvent);
    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
  });

  test("calls handleDrop on drop event", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const rightPanel = container.querySelector(".form-layout-right");
    fireEvent.drop(rightPanel);
    expect(mockHandleDrop).toHaveBeenCalled();
  });

  test("renders multiple input fields", () => {
    const manyInputFields = [
      { id: 1, label: "Short Text", type: "short-text", icon: "icon1.png", borderColor: "#000" },
      { id: 2, label: "Long Text", type: "long-text", icon: "icon2.png", borderColor: "#111" },
      { id: 3, label: "Number", type: "number", icon: "icon3.png", borderColor: "#222" },
      { id: 4, label: "Date Picker", type: "date-picker", icon: "icon4.png", borderColor: "#333" },
      { id: 5, label: "Dropdown", type: "drop-down", icon: "icon5.png", borderColor: "#444" },
    ];
    const props = { ...defaultProps, inputFields: manyInputFields };
    render(<FormLayout {...props} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-3")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-4")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-5")).toBeInTheDocument();
  });

  test("renders multiple question cards", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
        { id: 3, label: "Q3", type: "number" },
        { id: 4, label: "Q4", type: "date-picker" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-3")).toBeInTheDocument();
  });

  test("renders with empty input fields array", () => {
    const props = { ...defaultProps, inputFields: [] };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders form title with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const formTitle = container.querySelector(".form-title");
    expect(formTitle).toHaveTextContent("Test Form");
  });

  test("renders form description with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const formDescription = container.querySelector(".form-description");
    expect(formDescription).toHaveTextContent("Test Description");
  });

  test("renders drop zone with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const dropZone = container.querySelector(".form-drop-zone");
    expect(dropZone).toBeInTheDocument();
  });

  test("renders drag panel with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const dragPanel = container.querySelector(".drag-panel");
    expect(dragPanel).toBeInTheDocument();
  });

  test("renders field wrapper for form name", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const fieldWrappers = container.querySelectorAll(".field-wrapper");
    expect(fieldWrappers.length).toBeGreaterThan(0);
  });

  test("renders field wrapper for description when provided", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const fieldWrappers = container.querySelectorAll(".field-wrapper");
    expect(fieldWrappers.length).toBe(2); // One for title, one for description
  });

  test("renders only one field wrapper when description is empty", () => {
    const props = { ...defaultProps, description: "" };
    const { container } = render(<FormLayout {...props} />);
    const fieldWrappers = container.querySelectorAll(".field-wrapper");
    expect(fieldWrappers.length).toBe(1); // Only for title
  });

  test("renders with long form name", () => {
    const longName = "A".repeat(100);
    const props = { ...defaultProps, formName: longName };
    render(<FormLayout {...props} />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  test("renders with long description", () => {
    const longDesc = "B".repeat(200);
    const props = { ...defaultProps, description: longDesc };
    render(<FormLayout {...props} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  test("renders with special characters in form name", () => {
    const props = { ...defaultProps, formName: "Form & <Special> Characters!" };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Form & <Special> Characters!")).toBeInTheDocument();
  });

  test("renders with special characters in description", () => {
    const props = { ...defaultProps, description: "Description & <tags> symbols!" };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Description & <tags> symbols!")).toBeInTheDocument();
  });

  test("renders field with question property instead of label", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, question: "What is your name?", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("What is your name?");
  });

  test("updates fields array when onUpdate is called", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Original", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    const updateBtn = screen.getByTestId("update-btn-0");
    fireEvent.click(updateBtn);
    
    expect(mockSetFields).toHaveBeenCalledWith([
      { id: 1, label: "Updated", type: "short-text" },
    ]);
  });

  test("renders container with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const layoutContainer = container.querySelector(".form-layout-container");
    expect(layoutContainer).toBeInTheDocument();
  });

  test("renders input title with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const inputTitle = container.querySelector(".input-title");
    expect(inputTitle).toHaveTextContent("Input Fields");
  });

  test("renders form header title with correct class", () => {
    const { container } = render(<FormLayout {...defaultProps} />);
    const headerTitle = container.querySelector(".form-header-title");
    expect(headerTitle).toHaveTextContent("Form Header");
  });

  test("handles null formName", () => {
    const props = { ...defaultProps, formName: null };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles undefined formName", () => {
    const props = { ...defaultProps, formName: undefined };
    render(<FormLayout {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles null description", () => {
    const props = { ...defaultProps, description: null };
    render(<FormLayout {...props} />);
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("handles undefined description", () => {
    const props = { ...defaultProps, description: undefined };
    render(<FormLayout {...props} />);
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("renders with single input field", () => {
    const props = {
      ...defaultProps,
      inputFields: [
        { id: 1, label: "Single Field", type: "short-text", icon: "icon.png", borderColor: "#000" },
      ],
    };
    render(<FormLayout {...props} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByText("Single Field")).toBeInTheDocument();
  });

  test("renders with single question card", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Single Question", type: "short-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("Single Question");
  });

  test("delete button calls handler with correct index", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
        { id: 3, label: "Q3", type: "number" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    
    fireEvent.click(screen.getByTestId("delete-btn-1"));
    expect(mockHandleDelete).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByTestId("delete-btn-2"));
    expect(mockHandleDelete).toHaveBeenCalledWith(2);
  });

  test("copy button calls handler with correct index", () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
      ],
    };
    render(<FormLayout {...propsWithFields} />);
    
    fireEvent.click(screen.getByTestId("copy-btn-0"));
    expect(mockHandleCopy).toHaveBeenCalledWith(0);
    
    fireEvent.click(screen.getByTestId("copy-btn-1"));
    expect(mockHandleCopy).toHaveBeenCalledWith(1);
  });

  test("renders after re-render with updated fields", () => {
    const { rerender } = render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Drag fields from the left panel")).toBeInTheDocument();
    
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: 1, label: "New Question", type: "short-text" },
      ],
    };
    rerender(<FormLayout {...propsWithFields} />);
    
    expect(screen.queryByText("Drag fields from the left panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
  });

  test("renders after re-render with updated form name", () => {
    const { rerender } = render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
    
    const updatedProps = { ...defaultProps, formName: "Updated Form Name" };
    rerender(<FormLayout {...updatedProps} />);
    
    expect(screen.getByText("Updated Form Name")).toBeInTheDocument();
    expect(screen.queryByText("Test Form")).not.toBeInTheDocument();
  });

  test("renders after re-render with updated description", () => {
    const { rerender } = render(<FormLayout {...defaultProps} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    
    const updatedProps = { ...defaultProps, description: "New Description" };
    rerender(<FormLayout {...updatedProps} />);
    
    expect(screen.getByText("New Description")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("renders correctly with all props", () => {
    const completeProps = {
      inputFields: [
        { id: 1, label: "Field 1", type: "short-text", icon: "icon1.png", borderColor: "#000" },
        { id: 2, label: "Field 2", type: "long-text", icon: "icon2.png", borderColor: "#111" },
      ],
      fields: [
        { id: 10, label: "Question 1", type: "short-text" },
        { id: 20, label: "Question 2", type: "number" },
      ],
      setFields: mockSetFields,
      formName: "Complete Form",
      description: "Complete Description",
      handleDrop: mockHandleDrop,
      handleDelete: mockHandleDelete,
      handleCopy: mockHandleCopy,
      setFormName: mockSetFormName,
      setDescription: mockSetDescription,
    };
    
    render(<FormLayout {...completeProps} />);
    
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
    expect(screen.getByText("Complete Form")).toBeInTheDocument();
    expect(screen.getByText("Complete Description")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
  });
});
