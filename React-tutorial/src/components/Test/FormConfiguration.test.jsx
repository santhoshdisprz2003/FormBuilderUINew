import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormConfiguration from "../FormConfiguration";

// Mock FormContext
const mockSetFormName = jest.fn();
const mockSetDescription = jest.fn();
const mockSetVisibility = jest.fn();

jest.mock("../../context/FormContext", () => ({
  useFormContext: () => ({
    formName: "",
    setFormName: mockSetFormName,
    description: "",
    setDescription: mockSetDescription,
    visibility: false,
    setVisibility: mockSetVisibility,
  }),
}));

describe("FormConfiguration Component - Basic Rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component", () => {
    render(<FormConfiguration />);
    expect(screen.getByText("Form Details")).toBeInTheDocument();
  });

  test("renders section title", () => {
    render(<FormConfiguration />);
    expect(screen.getByText("Form Details")).toBeInTheDocument();
  });

  test("renders form name label", () => {
    render(<FormConfiguration />);
    expect(screen.getByText(/Form Name/i)).toBeInTheDocument();
  });

  test("renders required asterisk for form name", () => {
    render(<FormConfiguration />);
    const requiredSpan = screen.getByText("*");
    expect(requiredSpan).toHaveClass("required");
  });

  test("renders form name input", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toBeInTheDocument();
  });

  test("renders form name input with correct type", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("type", "text");
  });

  test("renders form name input with correct id", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("id", "formName");
  });

  test("renders form name character count", () => {
    render(<FormConfiguration />);
    expect(screen.getByText("0/80")).toBeInTheDocument();
  });

  test("form name input has maxLength of 80", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input).toHaveAttribute("maxLength", "80");
  });

  test("renders form description label", () => {
    render(<FormConfiguration />);
    expect(screen.getByText("Form Description")).toBeInTheDocument();
  });

  test("renders form description textarea", () => {
    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toBeInTheDocument();
  });

  test("renders form description with correct id", () => {
    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toHaveAttribute("id", "formDesc");
  });

  test("renders description character count", () => {
    render(<FormConfiguration />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("0/200");
  });

  test("description textarea has maxLength of 200", () => {
    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea).toHaveAttribute("maxLength", "200");
  });

  test("renders form visibility label", () => {
    render(<FormConfiguration />);
    expect(screen.getByText("Form Visibility")).toBeInTheDocument();
  });

  test("renders visibility toggle switch", () => {
    render(<FormConfiguration />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  test("renders visibility help text", () => {
    render(<FormConfiguration />);
    expect(screen.getByText(/Turn on to allow new workflows/i)).toBeInTheDocument();
  });

  test("help text has correct class", () => {
    render(<FormConfiguration />);
    const helpText = screen.getByText(/Turn on to allow new workflows/i);
    expect(helpText).toHaveClass("help-text");
  });

  test("renders all form groups", () => {
    const { container } = render(<FormConfiguration />);
    const formGroups = container.querySelectorAll(".form-group");
    expect(formGroups.length).toBeGreaterThanOrEqual(3);
  });

  test("renders form section container", () => {
    const { container } = render(<FormConfiguration />);
    const formSection = container.querySelector(".form-section");
    expect(formSection).toBeInTheDocument();
  });

  test("renders section title with correct class", () => {
    const { container } = render(<FormConfiguration />);
    const sectionTitle = container.querySelector(".section-title");
    expect(sectionTitle).toHaveTextContent("Form Details");
  });

  test("renders visibility group with correct class", () => {
    const { container } = render(<FormConfiguration />);
    const visibilityGroup = container.querySelector(".form-group.visibility");
    expect(visibilityGroup).toBeInTheDocument();
  });

  test("renders switch with correct class", () => {
    const { container } = render(<FormConfiguration />);
    const switchLabel = container.querySelector(".switch");
    expect(switchLabel).toBeInTheDocument();
  });

  test("renders slider with correct classes", () => {
    const { container } = render(<FormConfiguration />);
    const slider = container.querySelector(".slider.round");
    expect(slider).toBeInTheDocument();
  });

  test("all character count elements have correct class", () => {
    const { container } = render(<FormConfiguration />);
    const charCounts = container.querySelectorAll(".char-count");
    expect(charCounts.length).toBe(2);
  });

  test("form name label is associated with input", () => {
    render(<FormConfiguration />);
    const label = screen.getByText(/Form Name/);
    expect(label).toHaveAttribute("for", "formName");
  });

  test("description label is associated with textarea", () => {
    render(<FormConfiguration />);
    const label = screen.getByText("Form Description");
    expect(label).toHaveAttribute("for", "formDesc");
  });
});

describe("FormConfiguration Component - With Context Values", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form name with empty value from context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("");
  });

  test("renders form name with provided value from context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test Form",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("Test Form");
  });

  test("updates form name character count", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Test",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    expect(screen.getByText("4/80")).toBeInTheDocument();
  });

  test("renders description with empty value from context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("");
  });

  test("renders description with provided value from context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "Test Description",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("Test Description");
  });

  test("updates description character count", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "Test description",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("16/200");
  });

  test("visibility is unchecked when false in context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0].checked).toBe(false);
  });

  test("visibility is checked when true in context", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: true,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0].checked).toBe(true);
  });

  test("handles long form name", () => {
    const longName = "A".repeat(80);
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: longName,
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    expect(screen.getByText("80/80")).toBeInTheDocument();
  });

  test("handles long description", () => {
    const longDesc = "A".repeat(200);
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: longDesc,
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const charCounts = screen.getAllByText(/\/200/);
    expect(charCounts[0]).toHaveTextContent("200/200");
  });

  test("renders with all props provided", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Complete Form",
      setFormName: mockSetFormName,
      description: "Complete Description",
      setDescription: mockSetDescription,
      visibility: true,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    expect(screen.getByPlaceholderText("Enter Form Name").value).toBe("Complete Form");
    expect(screen.getByPlaceholderText("Summarize the form's purpose for internal reference.").value).toBe("Complete Description");
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0].checked).toBe(true);
  });

  test("handles special characters in form name", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "Form & <Special> Characters!",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("Form & <Special> Characters!");
  });

  test("handles special characters in description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "Description with & <tags> and symbols!",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("Description with & <tags> and symbols!");
  });

  test("handles numeric input in form name", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "12345",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    expect(input.value).toBe("12345");
  });

  test("handles numeric input in description", () => {
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "67890",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });

    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    expect(textarea.value).toBe("67890");
  });
});

describe("FormConfiguration Component - User Interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("../../context/FormContext"), "useFormContext").mockReturnValue({
      formName: "",
      setFormName: mockSetFormName,
      description: "",
      setDescription: mockSetDescription,
      visibility: false,
      setVisibility: mockSetVisibility,
    });
  });

  test("calls setFormName when input changes", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    fireEvent.change(input, { target: { value: "New Form" } });
    expect(mockSetFormName).toHaveBeenCalledWith("New Form");
  });

  test("calls setDescription when textarea changes", () => {
    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    fireEvent.change(textarea, { target: { value: "New Description" } });
    expect(mockSetDescription).toHaveBeenCalledWith("New Description");
  });

  test("calls setVisibility when checkbox is clicked", () => {
    render(<FormConfiguration />);
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.change(checkboxes[0]);
    expect(mockSetVisibility).toHaveBeenCalled();
  });

  test("multiple onChange calls for form name", () => {
    render(<FormConfiguration />);
    const input = screen.getByPlaceholderText("Enter Form Name");
    
    fireEvent.change(input, { target: { value: "First" } });
    fireEvent.change(input, { target: { value: "Second" } });
    fireEvent.change(input, { target: { value: "Third" } });
    
    expect(mockSetFormName).toHaveBeenCalledTimes(3);
  });

  test("multiple onChange calls for description", () => {
    render(<FormConfiguration />);
    const textarea = screen.getByPlaceholderText("Summarize the form's purpose for internal reference.");
    
    fireEvent.change(textarea, { target: { value: "First" } });
    fireEvent.change(textarea, { target: { value: "Second" } });
    
    expect(mockSetDescription).toHaveBeenCalledTimes(2);
  });

  test("multiple clicks on visibility toggle", () => {
    render(<FormConfiguration />);
    const checkboxes = screen.getAllByRole("checkbox");
    
    fireEvent.change(checkboxes[0]);
    fireEvent.change(checkboxes[0]);
    fireEvent.change(checkboxes[0]);
    
    expect(mockSetVisibility).toHaveBeenCalledTimes(3);
  });
});
