import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormConfiguration from "../FormConfiguration";

describe("FormConfiguration Component - Rendering Tests", () => {
  const mockSetFormName = jest.fn();
  const mockSetDescription = jest.fn();
  const mockSetVisibility = jest.fn();

  const defaultProps = {
    formName: "",
    description: "",
    visibility: false,
    setFormName: mockSetFormName,
    setDescription: mockSetDescription,
    setVisibility: mockSetVisibility,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("Form Details")).toBeInTheDocument();
  });

  test("renders section title", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("Form Details")).toBeInTheDocument();
  });

  test("renders form name label", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText(/Form Name/i)).toBeInTheDocument();
  });

  test("renders required asterisk for form name", () => {
    render(<FormConfiguration {...defaultProps} />);
    const requiredSpan = screen.getByText("*");
    expect(requiredSpan).toHaveClass("required");
  });

  test("renders form name input", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toBeInTheDocument();
  });

  test("renders form name input with correct type", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("type", "text");
  });

  test("renders form name input with correct id", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("id", "formName");
  });

  test("renders form name with empty value", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("");
  });

  test("renders form name with provided value", () => {
    const props = { ...defaultProps, formName: "Test Form" };
    render(<FormConfiguration {...props} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("Test Form");
  });

  test("renders form name character count", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("0/80")).toBeInTheDocument();
  });

  test("updates form name character count", () => {
    const props = { ...defaultProps, formName: "Test" };
    render(<FormConfiguration {...props} />);
    expect(screen.getByText("4/80")).toBeInTheDocument();
  });

  test("form name input has maxLength of 80", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("maxLength", "80");
  });

  test("calls setFormName when input changes", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    fireEvent.change(input, { target: { value: "New Form" } });
    expect(mockSetFormName).toHaveBeenCalledWith("New Form");
  });

  test("renders form description label", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("Form Description")).toBeInTheDocument();
  });

  test("renders form description textarea", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toBeInTheDocument();
  });

  test("renders form description with correct id", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toHaveAttribute("id", "formDesc");
  });

  test("renders description with empty value", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("");
  });

  test("renders description with provided value", () => {
    const props = { ...defaultProps, description: "Test Description" };
    render(<FormConfiguration {...props} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("Test Description");
  });

  test("renders description character count", () => {
    render(<FormConfiguration {...defaultProps} />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("0/200");
  });

  test("updates description character count", () => {
    const props = { ...defaultProps, description: "Test description" };
    render(<FormConfiguration {...props} />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("16/200");
  });

  test("description textarea has maxLength of 200", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toHaveAttribute("maxLength", "200");
  });

  test("calls setDescription when textarea changes", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    fireEvent.change(textarea, { target: { value: "New Description" } });
    expect(mockSetDescription).toHaveBeenCalledWith("New Description");
  });

  test("renders form visibility label", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("Form Visibility")).toBeInTheDocument();
  });

  test("renders visibility toggle switch", () => {
    render(<FormConfiguration {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("renders visibility switch with correct type", () => {
    render(<FormConfiguration {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  test("visibility is unchecked by default", () => {
    render(<FormConfiguration {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.checked).toBe(false);
  });

  test("visibility is checked when true", () => {
    const props = { ...defaultProps, visibility: true };
    render(<FormConfiguration {...props} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.checked).toBe(true);
  });

  test("renders visibility help text", () => {
    render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText(/Turn on to allow new workflows/i)).toBeInTheDocument();
  });

  test("help text has correct class", () => {
    render(<FormConfiguration {...defaultProps} />);
    const helpText = screen.getByText(/Turn on to allow new workflows/i);
    expect(helpText).toHaveClass("help-text");
  });

  test("calls setVisibility when checkbox is clicked", () => {
    render(<FormConfiguration {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockSetVisibility).toHaveBeenCalled();
  });

  test("toggles visibility from false to true", () => {
    const props = { ...defaultProps, visibility: false };
    render(<FormConfiguration {...props} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.change(checkbox, { target: { checked: true } });
    expect(mockSetVisibility).toHaveBeenCalled();
  });

  test("renders all form groups", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const formGroups = container.querySelectorAll(".form-group");
    expect(formGroups.length).toBeGreaterThanOrEqual(3);
  });

  test("renders form section container", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const formSection = container.querySelector(".form-section");
    expect(formSection).toBeInTheDocument();
  });

  test("renders section title with correct class", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const sectionTitle = container.querySelector(".section-title");
    expect(sectionTitle).toHaveTextContent("Form Details");
  });

  test("renders visibility group with correct class", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const visibilityGroup = container.querySelector(".form-group.visibility");
    expect(visibilityGroup).toBeInTheDocument();
  });

  test("renders switch with correct class", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const switchLabel = container.querySelector(".switch");
    expect(switchLabel).toBeInTheDocument();
  });

  test("renders slider with correct classes", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const slider = container.querySelector(".slider.round");
    expect(slider).toBeInTheDocument();
  });

  test("handles long form name", () => {
    const longName = "A".repeat(80);
    const props = { ...defaultProps, formName: longName };
    render(<FormConfiguration {...props} />);
    expect(screen.getByText("80/80")).toBeInTheDocument();
  });

  test("handles long description", () => {
    const longDesc = "A".repeat(200);
    const props = { ...defaultProps, description: longDesc };
    render(<FormConfiguration {...props} />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("200/200");
  });

  test("renders with all props provided", () => {
    const props = {
      formName: "Complete Form",
      description: "Complete Description",
      visibility: true,
      setFormName: mockSetFormName,
      setDescription: mockSetDescription,
      setVisibility: mockSetVisibility,
    };
    render(<FormConfiguration {...props} />);
    expect(screen.getByPlaceholderText("Enter Form Name").value).toBe("Complete Form");
    expect(screen.getByPlaceholderText("Summarize the form's purpose for internal reference.").value).toBe("Complete Description");
    expect(screen.getByRole("checkbox").checked).toBe(true);
  });

  test("handles special characters in form name", () => {
    const props = { ...defaultProps, formName: "Form & <Special> Characters!" };
    render(<FormConfiguration {...props} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("Form & <Special> Characters!");
  });

  test("handles special characters in description", () => {
    const props = { ...defaultProps, description: "Description with & <tags> and symbols!" };
    render(<FormConfiguration {...props} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("Description with & <tags> and symbols!");
  });

  test("handles numeric input in form name", () => {
    const props = { ...defaultProps, formName: "12345" };
    render(<FormConfiguration {...props} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("12345");
  });

  test("handles numeric input in description", () => {
    const props = { ...defaultProps, description: "67890" };
    render(<FormConfiguration {...props} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("67890");
  });

  test("multiple onChange calls for form name", () => {
    render(<FormConfiguration {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    
    fireEvent.change(input, { target: { value: "First" } });
    fireEvent.change(input, { target: { value: "Second" } });
    fireEvent.change(input, { target: { value: "Third" } });
    
    expect(mockSetFormName).toHaveBeenCalledTimes(3);
  });

  test("multiple onChange calls for description", () => {
    render(<FormConfiguration {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    
    fireEvent.change(textarea, { target: { value: "First" } });
    fireEvent.change(textarea, { target: { value: "Second" } });
    
    expect(mockSetDescription).toHaveBeenCalledTimes(2);
  });

  test("multiple clicks on visibility toggle", () => {
    render(<FormConfiguration {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    
    expect(mockSetVisibility).toHaveBeenCalledTimes(3);
  });

  test("renders with empty string values", () => {
    const props = {
      formName: "",
      description: "",
      visibility: false,
      setFormName: mockSetFormName,
      setDescription: mockSetDescription,
      setVisibility: mockSetVisibility,
    };
    render(<FormConfiguration {...props} />);
    expect(screen.getByPlaceholderText("Enter Form Name").value).toBe("");
    expect(screen.getByPlaceholderText("Summarize the form's purpose for internal reference.").value).toBe("");
  });

  test("character count updates correctly for form name", () => {
    const { rerender } = render(<FormConfiguration {...defaultProps} />);
    expect(screen.getByText("0/80")).toBeInTheDocument();
    
    rerender(<FormConfiguration {...defaultProps} formName="Test" />);
    expect(screen.getByText("4/80")).toBeInTheDocument();
    
    rerender(<FormConfiguration {...defaultProps} formName="Test Form Name" />);
    expect(screen.getByText("14/80")).toBeInTheDocument();
  });

  test("character count updates correctly for description", () => {
    const { rerender } = render(<FormConfiguration {...defaultProps} />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("0/200");
    
    rerender(<FormConfiguration {...defaultProps} description="Test" />);
    const updatedCounts = screen.getAllByText(/\/200/);
    expect(updatedCounts[0]).toHaveTextContent("4/200");
  });

  test("all character count elements have correct class", () => {
    const { container } = render(<FormConfiguration {...defaultProps} />);
    const charCounts = container.querySelectorAll(".char-count");
    expect(charCounts.length).toBe(2);
  });

  test("form name label is associated with input", () => {
    render(<FormConfiguration {...defaultProps} />);
    const label = screen.getByText(/Form Name/);
    expect(label).toHaveAttribute("for", "formName");
  });

  test("description label is associated with textarea", () => {
    render(<FormConfiguration {...defaultProps} />);
    const label = screen.getByText("Form Description");
    expect(label).toHaveAttribute("for", "formDesc");
  });

  test("renders correctly after multiple re-renders", () => {
    const { rerender } = render(<FormConfiguration {...defaultProps} />);
    
    rerender(<FormConfiguration {...defaultProps} formName="First" />);
    rerender(<FormConfiguration {...defaultProps} formName="Second" description="Desc" />);
    rerender(<FormConfiguration {...defaultProps} formName="Third" description="New Desc" visibility={true} />);
    
    expect(screen.getByPlaceholderText("Enter Form Name").value).toBe("Third");
    expect(screen.getByPlaceholderText("Summarize the form's purpose for internal reference.").value).toBe("New Desc");
    expect(screen.getByRole("checkbox").checked).toBe(true);
  });
});
