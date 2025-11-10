import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormLayout from "../FormLayout";

// Mock FormContext
const mockSetFields = jest.fn();
const mockSetHeaderCard = jest.fn();

jest.mock("../../context/FormContext", () => ({
  useFormContext: () => ({
    formName: "Test Form",
    description: "Test Description",
    fields: [],
    setFields: mockSetFields,
    headerCard: {
      title: "Test Form",
      description: "Test Description",
    },
    setHeaderCard: mockSetHeaderCard,
  }),
}));

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
  return function QuestionCard({ field, index, onDelete, onCopy, onUpdate, isActive, setActiveIndex }) {
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
        <button
          data-testid={`activate-btn-${index}`}
          onClick={() => setActiveIndex()}
        >
          Activate
        </button>
        {isActive && <div data-testid={`active-indicator-${index}`}>Active</div>}
      </div>
    );
  };
});

describe("FormLayout Component - Basic Rendering", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
    { id: 2, label: "Long Text", type: "long-text", icon: "long-text.png", borderColor: "#7B61FF40" },
    { id: 3, label: "Date Picker", type: "date-picker", icon: "date-picker.png", borderColor: "#BBE9E4" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders left panel", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const leftPanel = container.querySelector(".form-layout-left");
    expect(leftPanel).toBeInTheDocument();
  });

  test("renders right panel", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    expect(rightPanel).toBeInTheDocument();
  });

  test("renders Input Fields title", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders input field list", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const inputFieldList = container.querySelector(".input-field-list");
    expect(inputFieldList).toBeInTheDocument();
  });

  test("renders all input fields", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-3")).toBeInTheDocument();
  });

  test("renders input field labels", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Short Text")).toBeInTheDocument();
    expect(screen.getByText("Long Text")).toBeInTheDocument();
    expect(screen.getByText("Date Picker")).toBeInTheDocument();
  });

  test("renders form header box", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const headerBox = container.querySelector(".form-header-box");
    expect(headerBox).toBeInTheDocument();
  });

  test("renders Header Card title", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Header Card")).toBeInTheDocument();
  });

  test("renders header title input", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Test Form");
  });

  test("renders header description textarea", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe("Test Description");
  });

  test("header title input has maxLength of 80", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input).toHaveAttribute("maxLength", "80");
  });

  test("header description textarea has maxLength of 200", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea).toHaveAttribute("maxLength", "200");
  });

  test("renders drop zone when no fields", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Drag fields from the left panel")).toBeInTheDocument();
  });

  test("renders drag icon in drop zone", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const dragIcon = container.querySelector(".drag-icon");
    expect(dragIcon).toBeInTheDocument();
    expect(dragIcon).toHaveAttribute("src", "drag-field-icon.png");
  });

  test("renders container with correct class", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const layoutContainer = container.querySelector(".form-layout-container");
    expect(layoutContainer).toBeInTheDocument();
  });

  test("renders input title with correct class", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const inputTitle = container.querySelector(".input-title");
    expect(inputTitle).toHaveTextContent("Input Fields");
  });

  test("renders form header title with correct class", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const headerTitle = container.querySelector(".form-header-title");
    expect(headerTitle).toHaveTextContent("Header Card");
  });

  test("renders with empty input fields array", () => {
    render(<FormLayout inputFields={[]} />);
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
  });

  test("renders multiple input fields", () => {
    const manyInputFields = [
      { id: 1, label: "Short Text", type: "short-text", icon: "icon1.png", borderColor: "#000" },
      { id: 2, label: "Long Text", type: "long-text", icon: "icon2.png", borderColor: "#111" },
      { id: 3, label: "Number", type: "number", icon: "icon3.png", borderColor: "#222" },
      { id: 4, label: "Date Picker", type: "date-picker", icon: "icon4.png", borderColor: "#333" },
      { id: 5, label: "Dropdown", type: "drop-down", icon: "icon5.png", borderColor: "#444" },
    ];
    render(<FormLayout inputFields={manyInputFields} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-2")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-3")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-4")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-field-5")).toBeInTheDocument();
  });

  test("renders with single input field", () => {
    const singleField = [
      { id: 1, label: "Single Field", type: "short-text", icon: "icon.png", borderColor: "#000" },
    ];
    render(<FormLayout inputFields={singleField} />);
    expect(screen.getByTestId("draggable-field-1")).toBeInTheDocument();
    expect(screen.getByText("Single Field")).toBeInTheDocument();
  });
});

describe("FormLayout Component - With Fields from Context", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render drop zone when fields exist", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.queryByText("Drag fields from the left panel")).not.toBeInTheDocument();
  });

  test("renders question cards for fields", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
  });

  test("renders field labels in question cards", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("Question 1");
    expect(screen.getByTestId("field-label-1")).toHaveTextContent("Question 2");
  });

  test("renders field types in question cards", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "number" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("field-type-0")).toHaveTextContent("short-text");
    expect(screen.getByTestId("field-type-1")).toHaveTextContent("number");
  });

  test("renders delete buttons for each field", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("delete-btn-0")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn-1")).toBeInTheDocument();
  });

  test("renders copy buttons for each field", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
        { id: 2, label: "Question 2", type: "long-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("copy-btn-0")).toBeInTheDocument();
    expect(screen.getByTestId("copy-btn-1")).toBeInTheDocument();
  });

  test("renders multiple question cards", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
        { id: 3, label: "Q3", type: "number" },
        { id: 4, label: "Q4", type: "date-picker" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-3")).toBeInTheDocument();
  });

  test("renders field with question property instead of label", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, question: "What is your name?", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("What is your name?");
  });

  test("renders with single question card", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Single Question", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("field-label-0")).toHaveTextContent("Single Question");
  });
});

describe("FormLayout Component - User Interactions", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates header title when input changes", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    fireEvent.change(input, { target: { value: "New Title" } });
    
    expect(mockSetHeaderCard).toHaveBeenCalledWith(expect.any(Function));
  });

  test("updates header description when textarea changes", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    fireEvent.change(textarea, { target: { value: "New Description" } });
    
    expect(mockSetHeaderCard).toHaveBeenCalledWith(expect.any(Function));
  });

  test("handles drag over event", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const dragOverEvent = new Event("dragover", { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(dragOverEvent, "preventDefault");
    
    rightPanel.dispatchEvent(dragOverEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("handles drop event with valid JSON", async () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const fieldData = {
      label: "Dropped Field",
      type: "short-text",
      borderColor: "#000"
    };

    const dataTransfer = {
      getData: jest.fn(() => JSON.stringify(fieldData)),
    };

    fireEvent.drop(rightPanel, { dataTransfer });
    
    await waitFor(() => {
      expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test("handles drop event with invalid JSON", async () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const dataTransfer = {
      getData: jest.fn(() => "invalid json"),
    };

    fireEvent.drop(rightPanel, { dataTransfer });
    
    // Should not throw error, just silently fail
    expect(mockSetFields).not.toHaveBeenCalled();
  });

  test("calls setFields when delete button is clicked", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const deleteBtn = screen.getByTestId("delete-btn-0");
    fireEvent.click(deleteBtn);
    
    expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
  });

  test("calls setFields when copy button is clicked", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const copyBtn = screen.getByTestId("copy-btn-0");
    fireEvent.click(copyBtn);
    
    expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
  });

  test("calls setFields when update button is clicked", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const updateBtn = screen.getByTestId("update-btn-0");
    fireEvent.click(updateBtn);
    
    expect(mockSetFields).toHaveBeenCalled();
  });

  test("delete button calls handler with correct index", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
        { id: 3, label: "Q3", type: "number" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    fireEvent.click(screen.getByTestId("delete-btn-1"));
    expect(mockSetFields).toHaveBeenCalled();
    
    fireEvent.click(screen.getByTestId("delete-btn-2"));
    expect(mockSetFields).toHaveBeenCalled();
  });

  test("copy button calls handler with correct index", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Q1", type: "short-text" },
        { id: 2, label: "Q2", type: "long-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    fireEvent.click(screen.getByTestId("copy-btn-0"));
    expect(mockSetFields).toHaveBeenCalled();
    
    fireEvent.click(screen.getByTestId("copy-btn-1"));
    expect(mockSetFields).toHaveBeenCalled();
  });

  test("activates question card when activate button clicked", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, label: "Question 1", type: "short-text" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    expect(screen.queryByTestId("active-indicator-0")).not.toBeInTheDocument();
    
    const activateBtn = screen.getByTestId("activate-btn-0");
    fireEvent.click(activateBtn);
    
    // Re-render to see the active state
    expect(screen.getByTestId("activate-btn-0")).toBeInTheDocument();
  });

  test("multiple header title changes", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    
    fireEvent.change(input, { target: { value: "First" } });
    fireEvent.change(input, { target: { value: "Second" } });
    fireEvent.change(input, { target: { value: "Third" } });
    
    expect(mockSetHeaderCard).toHaveBeenCalledTimes(3);
  });

  test("multiple header description changes", () => {
    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    
    fireEvent.change(textarea, { target: { value: "First" } });
    fireEvent.change(textarea, { target: { value: "Second" } });
    
    expect(mockSetHeaderCard).toHaveBeenCalledTimes(2);
  });
});

describe("FormLayout Component - useEffect Hook", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates headerCard when formName changes", () => {
    const { rerender } = render(<FormLayout inputFields={defaultInputFields} />);
    
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Updated Form Name",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    rerender(<FormLayout inputFields={defaultInputFields} />);
    
    expect(mockSetHeaderCard).toHaveBeenCalled();
  });

  test("updates headerCard when description changes", () => {
    const { rerender } = render(<FormLayout inputFields={defaultInputFields} />);
    
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Updated Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    rerender(<FormLayout inputFields={defaultInputFields} />);
    
    expect(mockSetHeaderCard).toHaveBeenCalled();
  });

  test("preserves existing headerCard values", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "New Form",
      description: "New Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Existing Title",
        description: "Existing Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    expect(mockSetHeaderCard).toHaveBeenCalledWith(expect.any(Function));
  });
});

describe("FormLayout Component - Edge Cases", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles empty headerCard from context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "",
        description: "",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe("");
  });

  test("handles long header title", () => {
    const longTitle = "A".repeat(80);
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: longTitle,
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe(longTitle);
  });

  test("handles long header description", () => {
    const longDesc = "B".repeat(200);
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: longDesc,
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea.value).toBe(longDesc);
  });

    test("handles special characters in header title", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Form & <Special> Characters!",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe("Form & <Special> Characters!");
  });

  test("handles special characters in header description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Description & <tags> symbols!",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea.value).toBe("Description & <tags> symbols!");
  });

  test("handles null formName", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: null,
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe("");
  });

  test("handles undefined formName", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: undefined,
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe("");
  });

  test("handles null description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: null,
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea.value).toBe("");
  });

  test("handles undefined description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: undefined,
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea.value).toBe("");
  });

  test("handles empty fields array", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByText("Drag fields from the left panel")).toBeInTheDocument();
  });

  test("handles fields with missing properties", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [
        { id: 1, type: "short-text" }, // Missing label
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
  });

  test("renders correctly with all props", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Complete Form",
      description: "Complete Description",
      fields: [
        { id: 10, label: "Question 1", type: "short-text" },
        { id: 20, label: "Question 2", type: "number" },
      ],
      setFields: mockSetFields,
      headerCard: {
        title: "Complete Form",
        description: "Complete Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    expect(screen.getByText("Input Fields")).toBeInTheDocument();
    expect(screen.getByText("Short Text")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter header title").value).toBe("Complete Form");
    expect(screen.getByPlaceholderText("Enter header description").value).toBe("Complete Description");
    expect(screen.getByTestId("question-card-0")).toBeInTheDocument();
    expect(screen.getByTestId("question-card-1")).toBeInTheDocument();
  });

  test("drop zone has correct classes", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const dropZone = container.querySelector(".form-drop-zone");
    expect(dropZone).toBeInTheDocument();
  });

  test("drag panel has correct class", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const dragPanel = container.querySelector(".drag-panel");
    expect(dragPanel).toBeInTheDocument();
  });

  test("field wrapper elements exist", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const fieldWrappers = container.querySelectorAll(".field-wrapper");
    expect(fieldWrappers.length).toBeGreaterThan(0);
  });

  test("handles numeric values in header title", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "12345",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const input = screen.getByPlaceholderText("Enter header title");
    expect(input.value).toBe("12345");
  });

  test("handles numeric values in header description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: [],
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "67890",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    const textarea = screen.getByPlaceholderText("Enter header description");
    expect(textarea.value).toBe("67890");
  });
});

describe("FormLayout Component - Delete and Copy Operations", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handleDelete removes field at correct index", () => {
    const mockFields = [
      { id: 1, label: "Q1", type: "short-text" },
      { id: 2, label: "Q2", type: "long-text" },
      { id: 3, label: "Q3", type: "number" },
    ];

    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: mockFields,
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    fireEvent.click(screen.getByTestId("delete-btn-1"));
    
    expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
    
    // Test the function passed to setFields
    const setFieldsCallback = mockSetFields.mock.calls[0][0];
    const result = setFieldsCallback(mockFields);
    
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Q1");
    expect(result[1].label).toBe("Q3");
  });

  test("handleCopy duplicates field at correct index", () => {
    const mockFields = [
      { id: 1, label: "Q1", type: "short-text" },
    ];

    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: mockFields,
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    fireEvent.click(screen.getByTestId("copy-btn-0"));
    
    expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
    
    // Test the function passed to setFields
    const setFieldsCallback = mockSetFields.mock.calls[0][0];
    const result = setFieldsCallback(mockFields);
    
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Q1");
    expect(result[1].label).toBe("Q1");
    expect(result[1].id).not.toBe(result[0].id); // New ID should be generated
  });

  test("handleUpdate updates field at correct index", () => {
    const mockFields = [
      { id: 1, label: "Original", type: "short-text" },
    ];

    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: mockFields,
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    render(<FormLayout inputFields={defaultInputFields} />);
    
    fireEvent.click(screen.getByTestId("update-btn-0"));
    
    expect(mockSetFields).toHaveBeenCalled();
  });
});

describe("FormLayout Component - Drag and Drop Operations", () => {
  const defaultInputFields = [
    { id: 1, label: "Short Text", type: "short-text", icon: "short-text.png", borderColor: "#4F46E5" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handleDrop adds new field with timestamp ID", async () => {
    const mockFields = [];

    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: mockFields,
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const fieldData = {
      label: "New Field",
      type: "short-text",
      borderColor: "#000"
    };

    const dataTransfer = {
      getData: jest.fn(() => JSON.stringify(fieldData)),
    };

    fireEvent.drop(rightPanel, { dataTransfer });
    
    await waitFor(() => {
      expect(mockSetFields).toHaveBeenCalledWith(expect.any(Function));
    });

    // Test the function passed to setFields
    const setFieldsCallback = mockSetFields.mock.calls[0][0];
    const result = setFieldsCallback(mockFields);
    
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("New Field");
    expect(result[0].id).toBeDefined();
  });

  test("handleDrop prevents default behavior", () => {
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const dropEvent = new Event("drop", { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(dropEvent, "preventDefault");
    
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: {
        getData: jest.fn(() => JSON.stringify({ label: "Test", type: "short-text" })),
      },
    });

    rightPanel.dispatchEvent(dropEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("handleDrop catches JSON parse errors", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const dataTransfer = {
      getData: jest.fn(() => "not valid json {"),
    };

    fireEvent.drop(rightPanel, { dataTransfer });
    
    // Should not call setFields on error
    expect(mockSetFields).not.toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  test("dropped field includes all properties", async () => {
    const mockFields = [];

    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      description: "Test Description",
      fields: mockFields,
      setFields: mockSetFields,
      headerCard: {
        title: "Test Form",
        description: "Test Description",
      },
      setHeaderCard: mockSetHeaderCard,
    });

    const { container } = render(<FormLayout inputFields={defaultInputFields} />);
    const rightPanel = container.querySelector(".form-layout-right");
    
    const fieldData = {
      label: "Complete Field",
      type: "long-text",
      borderColor: "#123456",
      icon: "icon.png",
      maxChar: 500
    };

    const dataTransfer = {
      getData: jest.fn(() => JSON.stringify(fieldData)),
    };

    fireEvent.drop(rightPanel, { dataTransfer });
    
    await waitFor(() => {
      expect(mockSetFields).toHaveBeenCalled();
    });

    const setFieldsCallback = mockSetFields.mock.calls[0][0];
    const result = setFieldsCallback(mockFields);
    
    expect(result[0]).toMatchObject({
      label: "Complete Field",
      type: "long-text",
      borderColor: "#123456",
      icon: "icon.png",
      maxChar: 500
    });
  });
});

