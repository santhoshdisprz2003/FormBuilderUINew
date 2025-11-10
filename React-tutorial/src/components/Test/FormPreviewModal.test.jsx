import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormPreviewModal from "../FormPreviewModal";

describe("FormPreviewModal Component - Comprehensive Tests", () => {
  const defaultProps = {
    show: true,
    onClose: jest.fn(),
    formName: "Test Form",
    description: "Test Description",
    fields: [
      {
        type: "short-text",
        question: "What is your name?",
        required: true,
        description: "Please enter your full name",
      },
      {
        type: "long-text",
        question: "Tell us about yourself",
        required: false,
      },
      {
        type: "date-picker",
        question: "Select a date",
        required: true,
      },
      {
        type: "drop-down",
        question: "Choose an option",
        required: false,
        options: [
          { value: "Option 1" },
          { value: "Option 2" },
          { value: "Option 3" },
        ],
      },
      {
        type: "file-upload",
        question: "Upload a file",
        required: true,
      },
      {
        type: "number",
        question: "Enter a number",
        required: false,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== RENDERING TESTS =====

  test("renders modal overlay when show is true", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const overlay = container.querySelector(".modal-overlay");
    expect(overlay).toBeInTheDocument();
  });

  test("does not render when show is false", () => {
    const props = { ...defaultProps, show: false };
    const { container } = render(<FormPreviewModal {...props} />);
    const overlay = container.querySelector(".modal-overlay");
    expect(overlay).not.toBeInTheDocument();
  });

  test("renders modal content", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const modalContent = container.querySelector(".modal-content");
    expect(modalContent).toBeInTheDocument();
  });

  test("renders preview header", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const header = container.querySelector(".preview-header");
    expect(header).toBeInTheDocument();
  });

  test("renders back button", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const backBtn = container.querySelector(".back-btn");
    expect(backBtn).toBeInTheDocument();
  });

  test("renders back arrow in button", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const arrow = container.querySelector(".arrow");
    expect(arrow).toBeInTheDocument();
    expect(arrow.textContent).toBe("←");
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

  test("renders form title", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("renders form title with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const title = container.querySelector(".form-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBe("Test Form");
  });

  test("renders default form title when formName is not provided", () => {
    const props = { ...defaultProps, formName: "" };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form Title")).toBeInTheDocument();
  });

  test("renders form description", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("renders form description with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const description = container.querySelector(".form-description");
    expect(description).toBeInTheDocument();
    expect(description.textContent).toBe("Test Description");
  });

  test("renders default description when description is not provided", () => {
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
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questions = container.querySelectorAll(".preview-question");
    expect(questions.length).toBe(6);
  });

  test("renders question numbers", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questionNumbers = container.querySelectorAll(".question-number");
    expect(questionNumbers.length).toBe(6);
    expect(questionNumbers[0].textContent).toBe("1.");
    expect(questionNumbers[1].textContent).toBe("2.");
    expect(questionNumbers[5].textContent).toBe("6.");
  });

  test("renders question content", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const questionContent = container.querySelectorAll(".question-content");
    expect(questionContent.length).toBe(6);
  });

  test("renders question labels", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("What is your name?")).toBeInTheDocument();
    expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
  });

  test("renders question label with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const labels = container.querySelectorAll(".question-label");
    expect(labels.length).toBe(6);
  });

  test("renders required asterisk for required fields", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const requiredMarkers = container.querySelectorAll(".required");
    expect(requiredMarkers.length).toBe(3); // 3 required fields
    requiredMarkers.forEach(marker => {
      expect(marker.textContent).toBe("*");
    });
  });

  test("does not render asterisk for non-required fields", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
          question: "Optional question",
          required: false,
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const requiredMarkers = container.querySelectorAll(".required");
    expect(requiredMarkers.length).toBe(0);
  });

  test("renders question description when provided", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Please enter your full name")).toBeInTheDocument();
  });

  test("renders question description with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const descriptions = container.querySelectorAll(".question-desc");
    expect(descriptions.length).toBe(1);
  });

  test("does not render description when not provided", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
          question: "Question without description",
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const descriptions = container.querySelectorAll(".question-desc");
    expect(descriptions.length).toBe(0);
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

  test("renders Clear Form button with correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const clearBtn = container.querySelector(".clear-btn");
    expect(clearBtn).toBeInTheDocument();
  });

  // ===== SHORT TEXT FIELD TESTS =====

  test("renders short-text input field", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInputs = container.querySelectorAll('input[type="text"]');
    expect(shortTextInputs.length).toBeGreaterThan(0);
  });

  test("short-text input has correct placeholder", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    expect(shortTextInput).toHaveAttribute("placeholder", "Your answer");
  });

  test("short-text input has correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    expect(shortTextInput).toHaveClass("input-fields");
  });

  test("can type in short-text input", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    fireEvent.change(shortTextInput, { target: { value: "John Doe" } });
    expect(shortTextInput.value).toBe("John Doe");
  });

  // ===== LONG TEXT FIELD TESTS =====

  test("renders long-text textarea field", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
  });

  test("textarea has correct placeholder", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("placeholder", "Your answer");
  });

  test("textarea has correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("textarea-field");
  });

  test("can type in textarea", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const textarea = container.querySelector("textarea");
    fireEvent.change(textarea, { target: { value: "Long text content" } });
    expect(textarea.value).toBe("Long text content");
  });

  // ===== DATE PICKER FIELD TESTS =====

  test("renders date-picker input field", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
  });

  test("date input has correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toHaveClass("input-fields");
  });

  test("can select a date", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2024-01-15" } });
    expect(dateInput.value).toBe("2024-01-15");
  });

  // ===== DROP-DOWN FIELD TESTS =====

  test("renders drop-down select field", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const select = container.querySelector("select");
    expect(select).toBeInTheDocument();
  });

  test("select has correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const select = container.querySelector("select");
    expect(select).toHaveClass("input-fields");
  });

  test("renders default option in select", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("renders all dropdown options", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const options = container.querySelectorAll("select option");
    expect(options.length).toBe(4); // 1 default + 3 options
  });

  test("renders dropdown options with correct values", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  test("can select an option from dropdown", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const select = container.querySelector("select");
    fireEvent.change(select, { target: { value: "Option 1" } });
    expect(select.value).toBe("Option 1");
  });

  test("handles dropdown options as strings", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "drop-down",
          question: "Choose",
          options: ["String Option 1", "String Option 2"],
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("String Option 1")).toBeInTheDocument();
    expect(screen.getByText("String Option 2")).toBeInTheDocument();
  });

  test("handles empty options array", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "drop-down",
          question: "Choose",
          options: [],
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const options = container.querySelectorAll("select option");
    expect(options.length).toBe(1); // Only default option
  });

  test("handles undefined options", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "drop-down",
          question: "Choose",
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const select = container.querySelector("select");
    expect(select).toBeInTheDocument();
  });

  // ===== FILE UPLOAD FIELD TESTS =====

  test("renders file-upload box", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const fileUploadBox = container.querySelector(".file-upload-box");
    expect(fileUploadBox).toBeInTheDocument();
  });

  test("renders upload icon", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const uploadIcon = container.querySelector(".upload-icon");
    expect(uploadIcon).toBeInTheDocument();
  });

  test("upload icon has correct src", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const uploadIcon = container.querySelector(".upload-icon");
    expect(uploadIcon).toHaveAttribute("alt", "Upload");
  });

  test("renders file upload text", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText(/Drop files here or/)).toBeInTheDocument();
  });

  test("renders Browse link", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const browseLink = container.querySelector(".browse");
    expect(browseLink).toBeInTheDocument();
    expect(browseLink.textContent).toBe("Browse");
  });

  test("renders file upload restrictions", () => {
    render(<FormPreviewModal {...defaultProps} />);
    expect(screen.getByText(/Supported files: PDF, PNG, JPG/)).toBeInTheDocument();
    expect(screen.getByText(/Max size: 2MB/)).toBeInTheDocument();
    expect(screen.getByText(/One file only/)).toBeInTheDocument();
  });

  // ===== NUMBER FIELD TESTS =====

  test("renders number input field", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const numberInput = container.querySelector('input[type="number"]');
    expect(numberInput).toBeInTheDocument();
  });

  test("number input has correct placeholder", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const numberInput = container.querySelector('input[type="number"]');
    expect(numberInput).toHaveAttribute("placeholder", "Your answer");
  });

  test("number input has correct class", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const numberInput = container.querySelector('input[type="number"]');
    expect(numberInput).toHaveClass("input-fields");
  });

  test("can type numbers in number input", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const numberInput = container.querySelector('input[type="number"]');
    fireEvent.change(numberInput, { target: { value: "42" } });
    expect(numberInput.value).toBe("42");
  });

  // ===== INTERACTION TESTS =====

  test("calls onClose when back button is clicked", () => {
    const onClose = jest.fn();
    const props = { ...defaultProps, onClose };
    const { container } = render(<FormPreviewModal {...props} />);
    const backBtn = container.querySelector(".back-btn");
    fireEvent.click(backBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clears all form inputs when Clear Form is clicked", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    
    // Fill in some inputs
    const shortTextInput = container.querySelector('input[type="text"]');
    const textarea = container.querySelector("textarea");
    const numberInput = container.querySelector('input[type="number"]');
    
    fireEvent.change(shortTextInput, { target: { value: "Test" } });
    fireEvent.change(textarea, { target: { value: "Long text" } });
    fireEvent.change(numberInput, { target: { value: "123" } });
    
    expect(shortTextInput.value).toBe("Test");
    expect(textarea.value).toBe("Long text");
    expect(numberInput.value).toBe("123");
    
    // Click Clear Form
    const clearBtn = screen.getByText("Clear Form");
    fireEvent.click(clearBtn);
    
    expect(shortTextInput.value).toBe("");
    expect(textarea.value).toBe("");
    expect(numberInput.value).toBe("");
  });

  test("clears date input when Clear Form is clicked", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const dateInput = container.querySelector('input[type="date"]');
    
    fireEvent.change(dateInput, { target: { value: "2024-01-15" } });
    expect(dateInput.value).toBe("2024-01-15");
    
    const clearBtn = screen.getByText("Clear Form");
    fireEvent.click(clearBtn);
    
    expect(dateInput.value).toBe("");
  });

  test("clears select input when Clear Form is clicked", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const select = container.querySelector("select");
    
    fireEvent.change(select, { target: { value: "Option 1" } });
    expect(select.value).toBe("Option 1");
    
    const clearBtn = screen.getByText("Clear Form");
    fireEvent.click(clearBtn);
    
    expect(select.value).toBe("");
  });

  // ===== EDGE CASES =====

  test("renders Untitled Question when question is not provided", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Untitled Question")).toBeInTheDocument();
  });

  test("uses label when question is not provided", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
          label: "Label Text",
        },
      ],
    };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Label Text")).toBeInTheDocument();
  });

  test("renders no questions message when fields is empty", () => {
    const props = { ...defaultProps, fields: [] };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("renders no questions message with correct class", () => {
    const props = { ...defaultProps, fields: [] };
    const { container } = render(<FormPreviewModal {...props} />);
    const noQuestions = container.querySelector(".no-questions");
    expect(noQuestions).toBeInTheDocument();
  });

  test("renders no questions message when fields is null", () => {
    const props = { ...defaultProps, fields: null };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("renders no questions message when fields is undefined", () => {
    const props = { ...defaultProps, fields: undefined };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  test("handles null formName", () => {
    const props = { ...defaultProps, formName: null };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form Title")).toBeInTheDocument();
  });

  test("handles undefined formName", () => {
    const props = { ...defaultProps, formName: undefined };
    render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Form Title")).toBeInTheDocument();
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

  // ===== USEEFFECT TESTS =====

  test("initializes input values when modal opens", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const inputs = container.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      expect(input.value).toBe("");
    });
  });

  test("reinitializes input values when fields change", () => {
    const { container, rerender } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    
    fireEvent.change(shortTextInput, { target: { value: "Test" } });
    expect(shortTextInput.value).toBe("Test");
    
    const newProps = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
          question: "New question",
        },
      ],
    };
    
    rerender(<FormPreviewModal {...newProps} />);
    const updatedInput = container.querySelector('input[type="text"]');
    expect(updatedInput.value).toBe("");
  });

  test("reinitializes input values when show changes to true", () => {
    const { container, rerender } = render(<FormPreviewModal {...defaultProps} show={false} />);
    
    rerender(<FormPreviewModal {...defaultProps} show={true} />);
    const inputs = container.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      expect(input.value).toBe("");
    });
  });

  test("handles fields with length 0", () => {
    const props = { ...defaultProps, fields: [] };
    const { container } = render(<FormPreviewModal {...props} />);
    const fieldsContainer = container.querySelector(".preview-fields");
    expect(fieldsContainer).not.toBeInTheDocument();
  });

  // ===== MULTIPLE INPUTS STATE MANAGEMENT =====

  test("maintains separate state for each input", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    const textarea = container.querySelector("textarea");
    const numberInput = container.querySelector('input[type="number"]');
    
    fireEvent.change(shortTextInput, { target: { value: "Name" } });
    fireEvent.change(textarea, { target: { value: "Bio" } });
    fireEvent.change(numberInput, { target: { value: "25" } });
    
    expect(shortTextInput.value).toBe("Name");
    expect(textarea.value).toBe("Bio");
    expect(numberInput.value).toBe("25");
  });

  test("updates only the changed input", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    const textarea = container.querySelector("textarea");
    
    fireEvent.change(shortTextInput, { target: { value: "First" } });
    fireEvent.change(textarea, { target: { value: "Second" } });
    
    expect(shortTextInput.value).toBe("First");
    
    fireEvent.change(textarea, { target: { value: "Updated" } });
    
    expect(shortTextInput.value).toBe("First");
    expect(textarea.value).toBe("Updated");
  });

  // ===== UNKNOWN FIELD TYPE =====

  test("handles unknown field type gracefully", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "unknown-type",
          question: "Unknown field",
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    expect(screen.getByText("Unknown field")).toBeInTheDocument();
    // Should not crash, just not render any input
  });

  // ===== ACCESSIBILITY TESTS =====

  test("back button is accessible", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const backBtn = container.querySelector(".back-btn");
    expect(backBtn).toBeEnabled();
  });

  test("clear form button is accessible", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const clearBtn = container.querySelector(".clear-btn");
    expect(clearBtn).toBeEnabled();
  });

  test("all inputs are accessible", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const allInputs = container.querySelectorAll("input, textarea, select");
    allInputs.forEach(input => {
      expect(input).toBeEnabled();
    });
  });

  // ===== COMPLEX SCENARIOS =====

  test("handles form with only one field", () => {
    const props = {
      ...defaultProps,
      fields: [
        {
          type: "short-text",
          question: "Single question",
        },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const questions = container.querySelectorAll(".preview-question");
    expect(questions.length).toBe(1);
  });

  test("handles form with many fields", () => {
    const manyFields = Array.from({ length: 20 }, (_, i) => ({
      type: "short-text",
      question: `Question ${i + 1}`,
    }));
    const props = { ...defaultProps, fields: manyFields };
    const { container } = render(<FormPreviewModal {...props} />);
    const questions = container.querySelectorAll(".preview-question");
    expect(questions.length).toBe(20);
  });

  test("handles mixed required and optional fields", () => {
    const props = {
      ...defaultProps,
      fields: [
        { type: "short-text", question: "Required 1", required: true },
        { type: "short-text", question: "Optional 1", required: false },
        { type: "short-text", question: "Required 2", required: true },
        { type: "short-text", question: "Optional 2" },
      ],
    };
    const { container } = render(<FormPreviewModal {...props} />);
    const requiredMarkers = container.querySelectorAll(".required");
    expect(requiredMarkers.length).toBe(2);
  });

  test("preserves input values when modal stays open", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    
    fireEvent.change(shortTextInput, { target: { value: "Persistent" } });
    expect(shortTextInput.value).toBe("Persistent");
    
    // Simulate some other interaction
    const clearBtn = screen.getByText("Clear Form");
    expect(clearBtn).toBeInTheDocument();
    
    // Value should still be there
    expect(shortTextInput.value).toBe("Persistent");
  });

  test("handles rapid input changes", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    
    fireEvent.change(shortTextInput, { target: { value: "A" } });
    fireEvent.change(shortTextInput, { target: { value: "AB" } });
    fireEvent.change(shortTextInput, { target: { value: "ABC" } });
    
    expect(shortTextInput.value).toBe("ABC");
  });

  test("handles empty string values in inputs", () => {
    const { container } = render(<FormPreviewModal {...defaultProps} />);
    const shortTextInput = container.querySelector('input[type="text"]');
    
    fireEvent.change(shortTextInput, { target: { value: "Test" } });
    fireEvent.change(shortTextInput, { target: { value: "" } });
    
    expect(shortTextInput.value).toBe("");
  });
});
