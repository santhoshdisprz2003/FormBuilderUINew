import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormFillView from "../FormFillView";

// Mock API
const mockSubmitResponse = jest.fn();

jest.mock("../../api/responses", () => ({
  submitResponse: (...args) => mockSubmitResponse(...args),
}));

describe("FormFillView Component - Rendering Tests", () => {
  const mockOnBack = jest.fn();

  const mockForm = {
    id: "form-123",
    config: {
      title: "Test Form",
      description: "Test Description",
    },
    layout: {
      headerCard: {
        title: "Header Title",
        description: "Header Description",
      },
      fields: [
        {
          questionId: "q1",
          label: "Short Text Question",
          type: "short-text",
          description: "Enter your answer",
          required: true,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  test("renders component", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Header Title")).toBeInTheDocument();
  });

  test("renders back button", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const backButton = screen.getByText("←");
    expect(backButton).toBeInTheDocument();
  });

  test("renders form title from headerCard", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Header Title")).toBeInTheDocument();
  });

  test("renders form description from headerCard", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Header Description")).toBeInTheDocument();
  });

  test("renders section title", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Professional Certificate Training")).toBeInTheDocument();
  });

  test("renders section subtext", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Help us improve! Share your feedback on your learning experience.")).toBeInTheDocument();
  });

  test("renders Clear Form button", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Clear Form")).toBeInTheDocument();
  });

  test("renders Submit button", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("renders info banner", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("This form cannot be saved temporarily; please submit once completed.")).toBeInTheDocument();
  });

  test("calls onBack when back button is clicked", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const backButton = screen.getByText("←");
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test("renders question label", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText(/Short Text Question/)).toBeInTheDocument();
  });

  test("renders question number", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText(/1\./)).toBeInTheDocument();
  });

  test("renders required asterisk for required field", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const requiredSpan = screen.getByText("*");
    expect(requiredSpan).toHaveClass("required");
  });

  test("renders question description", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    expect(screen.getByText("Enter your answer")).toBeInTheDocument();
  });

  test("renders short-text input", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const input = screen.getByPlaceholderText("Your Answer");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  test("renders long-text textarea", () => {
    const formWithLongText = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Long Text Question",
            type: "long-text",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithLongText} onBack={mockOnBack} />);
    const textarea = screen.getByPlaceholderText("Your Answer");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  test("renders number input", () => {
    const formWithNumber = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Number Question",
            type: "number",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithNumber} onBack={mockOnBack} />);
    const input = screen.getByPlaceholderText("Your Answer");
    expect(input).toHaveAttribute("type", "number");
  });

  test("renders date-picker input", () => {
    const formWithDate = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Date Question",
            type: "date-picker",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithDate} onBack={mockOnBack} />);
    const input = screen.getByDisplayValue("");
    expect(input).toHaveAttribute("type", "date");
  });

  test("renders dropdown select", () => {
    const formWithDropdown = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Dropdown Question",
            type: "drop-down",
            options: [
              { value: "Option 1" },
              { value: "Option 2" },
            ],
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithDropdown} onBack={mockOnBack} />);
    expect(screen.getByText("Select Answer")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("renders file-upload input", () => {
    const formWithFile = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "File Upload Question",
            type: "file-upload",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithFile} onBack={mockOnBack} />);
    expect(screen.getByText(/Drop files here or/)).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  test("renders file upload hint text", () => {
    const formWithFile = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "File Upload Question",
            type: "file-upload",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithFile} onBack={mockOnBack} />);
    expect(screen.getByText(/Supported files: PDF, PNG, JPG, JPEG/)).toBeInTheDocument();
  });

  test("renders multiple fields", () => {
    const formWithMultipleFields = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Question 1",
            type: "short-text",
            required: true,
          },
          {
            questionId: "q2",
            label: "Question 2",
            type: "long-text",
            required: false,
          },
          {
            questionId: "q3",
            label: "Question 3",
            type: "number",
            required: true,
          },
        ],
      },
    };
    render(<FormFillView form={formWithMultipleFields} onBack={mockOnBack} />);
    expect(screen.getByText(/1\. Question 1/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Question 2/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Question 3/)).toBeInTheDocument();
  });

  test("renders no questions message when fields are empty", () => {
    const formWithNoFields = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [],
      },
    };
    render(<FormFillView form={formWithNoFields} onBack={mockOnBack} />);
    expect(screen.getByText("No questions found for this form.")).toBeInTheDocument();
  });

  test("updates short-text input value", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const input = screen.getByPlaceholderText("Your Answer");
    fireEvent.change(input, { target: { value: "Test Answer" } });
    expect(input.value).toBe("Test Answer");
  });

  test("updates long-text textarea value", () => {
    const formWithLongText = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Long Text Question",
            type: "long-text",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithLongText} onBack={mockOnBack} />);
    const textarea = screen.getByPlaceholderText("Your Answer");
    fireEvent.change(textarea, { target: { value: "Long answer text" } });
    expect(textarea.value).toBe("Long answer text");
  });

  test("updates number input value", () => {
    const formWithNumber = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Number Question",
            type: "number",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithNumber} onBack={mockOnBack} />);
    const input = screen.getByPlaceholderText("Your Answer");
    fireEvent.change(input, { target: { value: "42" } });
    expect(input.value).toBe("42");
  });

  test("updates date-picker value", () => {
    const formWithDate = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Date Question",
            type: "date-picker",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithDate} onBack={mockOnBack} />);
    const input = screen.getByDisplayValue("");
    fireEvent.change(input, { target: { value: "2024-01-15" } });
    expect(input.value).toBe("2024-01-15");
  });

  test("updates dropdown selection", () => {
    const formWithDropdown = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Dropdown Question",
            type: "drop-down",
            options: [
              { value: "Option 1" },
              { value: "Option 2" },
            ],
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithDropdown} onBack={mockOnBack} />);
    const select = screen.getByDisplayValue("Select Answer");
    fireEvent.change(select, { target: { value: "Option 1" } });
    expect(select.value).toBe("Option 1");
  });

  test("clears form responses", () => {
    render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const input = screen.getByPlaceholderText("Your Answer");
    fireEvent.change(input, { target: { value: "Test Answer" } });
    expect(input.value).toBe("Test Answer");
    
    const clearButton = screen.getByText("Clear Form");
    fireEvent.click(clearButton);
    expect(input.value).toBe("");
  });

  test("renders without description when not provided", () => {
    const formWithoutDesc = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Question without description",
            type: "short-text",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithoutDesc} onBack={mockOnBack} />);
    expect(screen.queryByText("Enter your answer")).not.toBeInTheDocument();
  });

  test("renders without required asterisk when not required", () => {
    const formNotRequired = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Optional Question",
            type: "short-text",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formNotRequired} onBack={mockOnBack} />);
    const requiredSpans = screen.queryAllByText("*");
    expect(requiredSpans.length).toBe(0);
  });

  test("uses config title when headerCard title is missing", () => {
    const formWithConfigTitle = {
      ...mockForm,
      layout: {
        headerCard: {},
        fields: [],
      },
    };
    render(<FormFillView form={formWithConfigTitle} onBack={mockOnBack} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("uses config description when headerCard description is missing", () => {
    const formWithConfigDesc = {
      ...mockForm,
      layout: {
        headerCard: {},
        fields: [],
      },
    };
    render(<FormFillView form={formWithConfigDesc} onBack={mockOnBack} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("renders Untitled Form when no title provided", () => {
    const formWithoutTitle = {
      id: "form-123",
      layout: {
        headerCard: {},
        fields: [],
      },
    };
    render(<FormFillView form={formWithoutTitle} onBack={mockOnBack} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles file upload selection", () => {
    const formWithFile = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "File Upload Question",
            type: "file-upload",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithFile} onBack={mockOnBack} />);
    
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText(/Drop files here or/);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
  });

  test("removes uploaded file", () => {
    const formWithFile = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "File Upload Question",
            type: "file-upload",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithFile} onBack={mockOnBack} />);
    
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const input = screen.getByLabelText(/Drop files here or/);
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    
    const removeButton = screen.getByText("Remove");
    fireEvent.click(removeButton);
    
    expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
  });

  test("renders footer with correct classes", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const footer = container.querySelector(".formfill-footer");
    expect(footer).toBeInTheDocument();
  });

  test("renders header with correct classes", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const header = container.querySelector(".formfill-header");
    expect(header).toBeInTheDocument();
  });

  test("renders body with correct classes", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const body = container.querySelector(".formfill-body");
    expect(body).toBeInTheDocument();
  });

  test("renders card with correct classes", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const card = container.querySelector(".formfill-card");
    expect(card).toBeInTheDocument();
  });

  test("renders all field types correctly", () => {
    const formWithAllTypes = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          { questionId: "q1", label: "Short Text", type: "short-text", required: false },
          { questionId: "q2", label: "Long Text", type: "long-text", required: false },
          { questionId: "q3", label: "Number", type: "number", required: false },
          { questionId: "q4", label: "Date", type: "date-picker", required: false },
          { questionId: "q5", label: "Dropdown", type: "drop-down", options: [{ value: "Opt1" }], required: false },
          { questionId: "q6", label: "File", type: "file-upload", required: false },
        ],
      },
    };
    render(<FormFillView form={formWithAllTypes} onBack={mockOnBack} />);
    
    expect(screen.getByText(/1\. Short Text/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Long Text/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Number/)).toBeInTheDocument();
    expect(screen.getByText(/4\. Date/)).toBeInTheDocument();
    expect(screen.getByText(/5\. Dropdown/)).toBeInTheDocument();
    expect(screen.getByText(/6\. File/)).toBeInTheDocument();
  });

  test("handles empty options array for dropdown", () => {
    const formWithEmptyOptions = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Dropdown Question",
            type: "drop-down",
            options: [],
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithEmptyOptions} onBack={mockOnBack} />);
    expect(screen.getByText("Select Answer")).toBeInTheDocument();
  });

  test("clears multiple field responses", () => {
    const formWithMultipleFields = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          { questionId: "q1", label: "Question 1", type: "short-text", required: false },
          { questionId: "q2", label: "Question 2", type: "number", required: false },
        ],
      },
    };
    render(<FormFillView form={formWithMultipleFields} onBack={mockOnBack} />);
    
    const inputs = screen.getAllByPlaceholderText("Your Answer");
    fireEvent.change(inputs[0], { target: { value: "Answer 1" } });
    fireEvent.change(inputs[1], { target: { value: "42" } });
    
    expect(inputs[0].value).toBe("Answer 1");
    expect(inputs[1].value).toBe("42");
    
    const clearButton = screen.getByText("Clear Form");
    fireEvent.click(clearButton);
    
    expect(inputs[0].value).toBe("");
    expect(inputs[1].value).toBe("");
  });

  test("renders textarea with correct rows attribute", () => {
    const formWithLongText = {
      ...mockForm,
      layout: {
        ...mockForm.layout,
        fields: [
          {
            questionId: "q1",
            label: "Long Text Question",
            type: "long-text",
            required: false,
          },
        ],
      },
    };
    render(<FormFillView form={formWithLongText} onBack={mockOnBack} />);
    const textarea = screen.getByPlaceholderText("Your Answer");
    expect(textarea).toHaveAttribute("rows", "3");
  });

  test("back button has correct class", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const backButton = container.querySelector(".back-button");
    expect(backButton).toBeInTheDocument();
  });

  test("clear button has correct class", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const clearButton = container.querySelector(".clear-btn");
    expect(clearButton).toBeInTheDocument();
  });

  test("submit button has correct class", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const submitButton = container.querySelector(".submit-btn");
    expect(submitButton).toBeInTheDocument();
  });

  test("info banner has correct class", () => {
    const { container } = render(<FormFillView form={mockForm} onBack={mockOnBack} />);
    const infoBanner = container.querySelector(".info-banner");
    expect(infoBanner).toBeInTheDocument();
  });
});
