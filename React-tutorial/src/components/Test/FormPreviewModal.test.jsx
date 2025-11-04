import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormPreviewModal from "../FormPreviewModal";

describe("FormPreviewModal Component - Rendering Tests", () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    show: true,
    onClose: mockOnClose,
    formName: "Test Form",
    description: "Test Description",
    fields: [
      {
        id: 1,
        label: "Question 1",
        type: "short-text",
        description: "Field description",
        required: true,
      },
      {
        id: 2,
        question: "Question 2",
        type: "long-text",
        description: "",
        required: false,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal when show is true", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("does not render modal when show is false", () => {
    const props = { ...defaultProps, show: false };
    const { container } = render(<FormPreviewModal {...props} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders modal overlay", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const overlay = container.querySelector(".modal-overlay");
    expect(overlay).toBeInTheDocument();
  });

  test("renders modal content", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const content = container.querySelector(".modal-content");
    expect(content).toBeInTheDocument();
  });

  test("renders preview header", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const header = container.querySelector(".preview-header");
    expect(header).toBeInTheDocument();
  });

  test("renders preview title", () => {
    render(<FormPreviewModal {...defaultProps} />);
    const titles = screen.getAllByText("Test Form");
    expect(titles.length).toBeGreaterThan(0);
  });

  test("renders Untitled Form when formName is empty", () => {
    const props = { ...defaultProps, formName: "" };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("renders preview card", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const card = container.querySelector(".preview-card");
    expect(card).toBeInTheDocument();
  });

  test("renders form header", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const formHeader = container.querySelector(".form-header");
    expect(formHeader).toBeInTheDocument();
  });

  test("renders form title in card", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const formTitle = container.querySelector(".form-title");
    expect(formTitle).toHaveTextContent("Test Form");
  });

  test("renders form description", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("renders default description when empty", () => {
    const props = { ...defaultProps, description: "" };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form description here.")).toBeInTheDocument();
  });

  test("renders preview fields container", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const fieldsContainer = container.querySelector(".preview-fields");
    expect(fieldsContainer).toBeInTheDocument();
  });

  test("renders all questions", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  test("renders question numbers", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questionNumbers = container.querySelectorAll(".question-number");
    expect(questionNumbers.length).toBe(2);
    expect(questionNumbers[0]).toHaveTextContent("1.");
    expect(questionNumbers[1]).toHaveTextContent("2.");
  });

  test("renders question content", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questionContents = container.querySelectorAll(".question-content");
    expect(questionContents.length).toBe(2);
  });

  test("renders question labels", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const labels = container.querySelectorAll(".question-label");
    expect(labels.length).toBe(2);
  });

  test("renders required asterisk for required fields", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const requiredSpans = container.querySelectorAll(".required");
    expect(requiredSpans.length).toBe(1);
  });

  test("does not render asterisk for non-required fields", () => {
    const props = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Optional Question", type: "short-text", required: false },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const requiredSpans = container.querySelectorAll(".required");
    expect(requiredSpans.length).toBe(0);
  });

  test("renders field description when provided", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Field description")).toBeInTheDocument();
  });

  test("does not render field description when empty", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const descriptions = container.querySelectorAll(".question-desc");
    expect(descriptions.length).toBe(1); // Only one field has description
  });

  test("renders short-text input field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Short Text", type: "short-text" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("input-field");
  });

  test("renders long-text textarea field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Long Text", type: "long-text" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("textarea-field");
  });

  test("renders date-picker input field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Date", type: "date-picker" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
  });

  test("renders drop-down select field", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          id: 1,
          label: "Dropdown",
          type: "drop-down",
          options: [
            { value: "Option 1" },
            { value: "Option 2" },
          ],
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("renders dropdown options", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          id: 1,
          label: "Dropdown",
          type: "drop-down",
          options: [
            { value: "Option 1" },
            { value: "Option 2" },
            { value: "Option 3" },
          ],
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  test("renders dropdown with string options", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          id: 1,
          label: "Dropdown",
          type: "drop-down",
          options: ["String Option 1", "String Option 2"],
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("String Option 1")).toBeInTheDocument();
    expect(screen.getByText("String Option 2")).toBeInTheDocument();
  });

  test("renders file-upload field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "File Upload", type: "file-upload" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const fileUploadBox = container.querySelector(".file-upload-box");
    expect(fileUploadBox).toBeInTheDocument();
  });

  test("renders file upload text", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "File Upload", type: "file-upload" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText(/Drop files here or/)).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  test("renders file upload supported files text", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "File Upload", type: "file-upload" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText(/Supported files: PDF, PNG, JPG/)).toBeInTheDocument();
  });

  test("renders number input field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Number", type: "number" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const numberInput = container.querySelector('input[type="number"]');
    expect(numberInput).toBeInTheDocument();
  });

  test("renders preview footer", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const footer = container.querySelector(".preview-footer");
    expect(footer).toBeInTheDocument();
  });

  test("renders Clear Form button", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Clear Form")).toBeInTheDocument();
  });

  test("calls onClose when Clear Form button is clicked", () => {
    render(<FormPreviewModal {...defaultProps} />);
    const clearButton = screen.getByText("Clear Form");
    fireEvent.click(clearButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders no questions message when fields array is empty", () => {
    const props = { ...defaultProps, fields: [] };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("does not render preview fields when no fields", () => {
    const props = { ...defaultProps, fields: [] };
    const { container } = render(<FormPreviewModal {...props} />);
    const previewFields = container.querySelector(".preview-fields");
    expect(previewFields).not.toBeInTheDocument();
  });

  test("renders with null fields", () => {
    const props = { ...defaultProps, fields: null };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("renders with undefined fields", () => {
    const props = { ...defaultProps, fields: undefined };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("renders multiple questions of different types", () => {
    const props = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Short Text", type: "short-text" },
        { id: 2, label: "Long Text", type: "long-text" },
        { id: 3, label: "Number", type: "number" },
        { id: 4, label: "Date", type: "date-picker" },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(container.querySelector("textarea")).toBeInTheDocument();
    expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
  });

  test("renders Untitled Question when label is missing", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, type: "short-text" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Untitled Question")).toBeInTheDocument();
  });

  test("uses question property when label is missing", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, question: "What is your name?", type: "short-text" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("What is your name?")).toBeInTheDocument();
  });

  test("renders with long form name", () => {
    const longName = "A".repeat(100);
    const props = { ...defaultProps, formName: longName };
    render(<FormPreviewModal {...props} />);
    expect(screen.getAllByText(longName).length).toBeGreaterThan(0);
  });

  test("renders with long description", () => {
    const longDesc = "B".repeat(200);
    const props = { ...defaultProps, description: longDesc };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  test("renders with special characters in form name", () => {
    const props = { ...defaultProps, formName: "Form & <Special> Characters!" };
    render(<FormPreviewModal {...props} />);
    expect(screen.getAllByText("Form & <Special> Characters!").length).toBeGreaterThan(0);
  });

  test("renders with special characters in description", () => {
    const props = { ...defaultProps, description: "Description & <tags> symbols!" };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Description & <tags> symbols!")).toBeInTheDocument();
  });

  test("renders input placeholder text", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Question", type: "short-text" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByPlaceholderText("Your answer")).toBeInTheDocument();
  });

  test("renders textarea placeholder text", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Question", type: "long-text" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByPlaceholderText("Your answer")).toBeInTheDocument();
  });

  test("renders number input placeholder text", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Question", type: "number" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByPlaceholderText("Your answer")).toBeInTheDocument();
  });

  test("renders preview question with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questions = container.querySelectorAll(".preview-question");
    expect(questions.length).toBe(2);
  });

  test("renders browse span with correct class", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "File", type: "file-upload" }],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const browseSpan = container.querySelector(".browse");
    expect(browseSpan).toBeInTheDocument();
  });

  test("renders clear button with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const clearBtn = container.querySelector(".clear-btn");
    expect(clearBtn).toBeInTheDocument();
  });

  test("renders with single field", () => {
    const props = {
      ...defaultProps,
      fields: [{ id: 1, label: "Single Question", type: "short-text" }],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Single Question")).toBeInTheDocument();
  });

  test("renders with many fields", () => {
    const manyFields = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      label: `Question ${i + 1}`,
      type: "short-text",
    }));
    const props = { ...defaultProps, fields: manyFields };
    const { container } = render(<FormPreviewModal {...props} />);
    const questions = container.querySelectorAll(".preview-question");
    expect(questions.length).toBe(10);
  });

  test("renders dropdown with empty options array", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          id: 1,
          label: "Dropdown",
          type: "drop-down",
          options: [],
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("renders dropdown without options property", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          id: 1,
          label: "Dropdown",
          type: "drop-down",
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("handles null formName", () => {
    const props = { ...defaultProps, formName: null };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles undefined formName", () => {
    const props = { ...defaultProps, formName: undefined };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles null description", () => {
    const props = { ...defaultProps, description: null };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form description here.")).toBeInTheDocument();
  });

  test("handles undefined description", () => {
    const props = { ...defaultProps, description: undefined };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form description here.")).toBeInTheDocument();
  });

  test("renders after re-render with updated show prop", () => {
    const { rerender, container } = render(<FormPreviewModal {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
    
    rerender(<FormPreviewModal {...defaultProps} show={true} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("renders after re-render with updated formName", () => {
    const { rerender } = render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getAllByText("Test Form").length).toBeGreaterThan(0);
    
    rerender(<FormPreviewModal {...defaultProps} formName="Updated Form" />);
    expect(screen.getAllByText("Updated Form").length).toBeGreaterThan(0);
  });

  test("renders after re-render with updated fields", () => {
    const { rerender } = render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    
    const newFields = [{ id: 1, label: "New Question", type: "short-text" }];
    rerender(<FormPreviewModal {...defaultProps} fields={newFields} />);
    expect(screen.getByText("New Question")).toBeInTheDocument();
    expect(screen.queryByText("Question 1")).not.toBeInTheDocument();
  });

  test("renders all field types correctly", () => {
    const props = {
      ...defaultProps,
      fields: [
        { id: 1, label: "Short Text", type: "short-text" },
        { id: 2, label: "Long Text", type: "long-text" },
        { id: 3, label: "Number", type: "number" },
        { id: 4, label: "Date", type: "date-picker" },
        { id: 5, label: "Dropdown", type: "drop-down", options: [{ value: "Opt1" }] },
        { id: 6, label: "File", type: "file-upload" },
      ],
    };
    render(<FormPreviewModal {...props} />);
    
    expect(screen.getByText("Short Text")).toBeInTheDocument();
    expect(screen.getByText("Long Text")).toBeInTheDocument();
    expect(screen.getByText("Number")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Dropdown")).toBeInTheDocument();
    expect(screen.getByText("File")).toBeInTheDocument();
  });

  test("does not call onClose when modal content is clicked", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const modalContent = container.querySelector(".modal-content");
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("renders correctly with all props provided", () => {
    const completeProps = {
      show: true,
      onClose: mockOnClose,
      formName: "Complete Form",
      description: "Complete Description",
      fields: [
        {
          id: 1,
          label: "Complete Question",
          type: "short-text",
          description: "Complete field description",
          required: true,
        },
      ],
    };
    
    render(<FormPreviewModal {...completeProps} />);
    
    expect(screen.getAllByText("Complete Form").length).toBeGreaterThan(0);
    expect(screen.getByText("Complete Description")).toBeInTheDocument();
    expect(screen.getByText("Complete Question")).toBeInTheDocument();
    expect(screen.getByText("Complete field description")).toBeInTheDocument();
    expect(screen.getByText("Clear Form")).toBeInTheDocument();
  });
});