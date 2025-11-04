import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateForm from "../CreateForm";

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockParams = {};

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

// Mock API
jest.mock("../../api/formService", () => ({
  createFormConfig: jest.fn(),
  updateFormConfig: jest.fn(),
  updateFormLayout: jest.fn(),
  publishForm: jest.fn(),
  getFormById: jest.fn(),
}));

// Mock images
jest.mock("../../assets/Eye.png", () => "eye.png");
jest.mock("../../assets/ShortTextIcon.png", () => "short-text.png");
jest.mock("../../assets/LongTextIcon.png", () => "long-text.png");
jest.mock("../../assets/DatePickerIcon.png", () => "date-picker.png");
jest.mock("../../assets/DropDownIcon.png", () => "drop-down.png");
jest.mock("../../assets/FileUploadIcon.png", () => "file-upload.png");
jest.mock("../../assets/NumberIcon.png", () => "number.png");

// Mock child components
jest.mock("../FormConfiguration", () => {
  return function FormConfiguration({ formName, setFormName }) {
    return (
      <div data-testid="form-configuration">
        <input
          data-testid="form-name-input"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>
    );
  };
});

jest.mock("../FormLayout", () => {
  return function FormLayout({ fields, setFields }) {
    return (
      <div data-testid="form-layout">
        <div data-testid="fields-count">{fields.length}</div>
        <button
          data-testid="add-field-button"
          onClick={() => setFields([...fields, { id: Date.now(), type: "short-text" }])}
        >
          Add Field
        </button>
      </div>
    );
  };
});

jest.mock("../FormPreviewModal", () => {
  return function FormPreviewModal({ show, onClose }) {
    if (!show) return null;
    return (
      <div data-testid="form-preview-modal">
        <button data-testid="close-preview" onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe("CreateForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test("renders component", () => {
    render(<CreateForm mode="create" />);
    expect(screen.getByText("Form Configuration")).toBeInTheDocument();
  });

  test("Next button disabled when form name empty", () => {
    render(<CreateForm mode="create" />);
    expect(screen.getByText("Next")).toBeDisabled();
  });

  test("Next button enabled when form name provided", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  test("switches to layout tab", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByTestId("form-layout")).toBeInTheDocument();
  });

  test("adds field", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByTestId("add-field-button"));
    expect(screen.getByTestId("fields-count").textContent).toBe("1");
  });

  test("Publish button disabled without fields", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Publish Form")).toBeDisabled();
  });

  test("shows preview modal", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Preview"));
    expect(screen.getByTestId("form-preview-modal")).toBeInTheDocument();
  });

  test("closes preview modal", () => {
    render(<CreateForm mode="create" />);
    fireEvent.change(screen.getByTestId("form-name-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Preview"));
    fireEvent.click(screen.getByTestId("close-preview"));
    expect(screen.queryByTestId("form-preview-modal")).not.toBeInTheDocument();
  });
});
