import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditForm from "../EditForm";

// Mock API
const mockGetFormById = jest.fn();
const mockUpdateFormConfig = jest.fn();
const mockUpdateFormLayout = jest.fn();
const mockPublishForm = jest.fn();

jest.mock("../../api/formService", () => ({
  getFormById: (...args) => mockGetFormById(...args),
  updateFormConfig: (...args) => mockUpdateFormConfig(...args),
  updateFormLayout: (...args) => mockUpdateFormLayout(...args),
  publishForm: (...args) => mockPublishForm(...args),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "test-form-123" }),
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
  return function FormConfiguration({ formName, description, visibility }) {
    return (
      <div data-testid="form-configuration">
        <div>Form Name: {formName}</div>
        <div>Description: {description}</div>
        <div>Visibility: {visibility ? "Public" : "Private"}</div>
      </div>
    );
  };
});

jest.mock("../FormLayout", () => {
  return function FormLayout({ fields, formName, description }) {
    return (
      <div data-testid="form-layout">
        <div>Form: {formName}</div>
        <div>Desc: {description}</div>
        <div>Fields: {fields.length}</div>
      </div>
    );
  };
});

jest.mock("../FormPreviewModal", () => {
  return function FormPreviewModal({ show, formName }) {
    if (!show) return null;
    return <div data-testid="preview-modal">Preview: {formName}</div>;
  };
});

const mockFormData = {
  id: "test-form-123",
  config: {
    title: "My Test Form",
    description: "Test form description",
    visibility: true,
  },
  layout: {
    fields: [
      {
        id: 1,
        questionId: "q1",
        label: "Question 1",
        type: "short-text",
        required: true,
      },
    ],
  },
};

describe("EditForm - Simple Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
    mockGetFormById.mockResolvedValue(mockFormData);
    mockUpdateFormConfig.mockResolvedValue({ success: true });
    mockUpdateFormLayout.mockResolvedValue({ success: true });
    mockPublishForm.mockResolvedValue({ success: true });
  });

  // Basic Rendering Tests
  test("should render the component", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Form Configuration")).toBeInTheDocument();
    });
  });

  test("should display both tabs", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Form Configuration")).toBeInTheDocument();
      expect(screen.getByText("Form Layout")).toBeInTheDocument();
    });
  });

  test("should show configuration tab by default", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
  });

  // Data Loading Tests
  test("should load form data on mount", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalledWith("test-form-123");
    });
  });

  test("should display loaded form name", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText(/My Test Form/)).toBeInTheDocument();
    });
  });

  test("should display loaded description", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText(/Test form description/)).toBeInTheDocument();
    });
  });

  test("should display visibility status", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText(/Public/)).toBeInTheDocument();
    });
  });

  // Tab Switching Tests
  test("should switch to layout tab when clicked", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    
    expect(screen.getByTestId("form-layout")).toBeInTheDocument();
    expect(screen.queryByTestId("form-configuration")).not.toBeInTheDocument();
  });

  test("should switch back to configuration tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Form Configuration"));
    
    expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
  });

  test("should show Next button in configuration tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  test("Next button should switch to layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Next"));
    
    expect(screen.getByTestId("form-layout")).toBeInTheDocument();
  });

  // Footer Buttons Tests
  test("should show Save as draft button", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Save as draft")).toBeInTheDocument();
    });
  });

  test("should show Publish button in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  test("should show Preview button in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  // Save Draft Tests
  test("should call updateFormConfig when saving draft in config tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Save as draft"));
    
    await waitFor(() => {
      expect(mockUpdateFormConfig).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "✅ Form Configuration updated and saved as Draft!"
      );
    });
  });

  test("should call updateFormLayout when saving draft in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Save as draft"));
    
    await waitFor(() => {
      expect(mockUpdateFormLayout).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "✅ Form Layout updated and saved as Draft!"
      );
    });
  });

  // Publish Tests
  test("should call publishForm when Publish button clicked", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Publish"));
    
    await waitFor(() => {
      expect(mockPublishForm).toHaveBeenCalledWith("test-form-123");
      expect(window.alert).toHaveBeenCalledWith("🚀 Form published successfully!");
    });
  });

  // Preview Modal Tests
  test("should not show preview modal by default", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId("preview-modal")).not.toBeInTheDocument();
  });

  test("should show preview modal when Preview clicked", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    
    expect(screen.getByTestId("preview-modal")).toBeInTheDocument();
  });

  // Error Handling Tests
  test("should handle API error gracefully", async () => {
    mockGetFormById.mockRejectedValue(new Error("API Error"));
    
    render(<EditForm />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  test("should handle save draft error", async () => {
    mockUpdateFormConfig.mockRejectedValue(new Error("Save failed"));
    
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Save as draft"));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("❌ Failed to save draft.");
    });
  });

  test("should handle publish error", async () => {
    mockPublishForm.mockRejectedValue(new Error("Publish failed"));
    
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Publish"));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("❌ Error publishing form.");
    });
  });

  // Fields Tests
  test("should display loaded fields count", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    
    await waitFor(() => {
      expect(screen.getByText(/Fields: 1/)).toBeInTheDocument();
    });
  });

  test("should handle empty fields", async () => {
    mockGetFormById.mockResolvedValue({
      ...mockFormData,
      layout: { fields: [] },
    });
    
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    
    fireEvent.click(screen.getByText("Form Layout"));
    
    await waitFor(() => {
      expect(screen.getByText(/Fields: 0/)).toBeInTheDocument();
    });
  });
});
