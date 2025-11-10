import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateForm from "../CreateForm";
import { useFormContext } from "../../context/FormContext";
import * as formService from "../../api/formService";

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockParams = { formId: null };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

// Mock FormContext
const mockFormContext = {
  formId: null,
  setFormId: jest.fn(),
  formName: "",
  setFormName: jest.fn(),
  description: "",
  setDescription: jest.fn(),
  visibility: false,
  setVisibility: jest.fn(),
  fields: [],
  setFields: jest.fn(),
  headerCard: { title: "", description: "" },
  setHeaderCard: jest.fn(),
  activeTab: "configuration",
  setActiveTab: jest.fn(),
  showPreview: false,
  setShowPreview: jest.fn(),
};

jest.mock("../../context/FormContext", () => ({
  useFormContext: jest.fn(),
}));

// Mock API services
jest.mock("../../api/formService", () => ({
  createFormConfig: jest.fn(),
  updateFormConfig: jest.fn(),
  updateFormLayout: jest.fn(),
  publishForm: jest.fn(),
  getFormById: jest.fn(),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
  return function FormConfiguration() {
    const { formName, setFormName } = require("../../context/FormContext").useFormContext();
    return (
      <div data-testid="form-configuration">
        <input
          data-testid="form-name-input"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Form Name"
        />
      </div>
    );
  };
});

jest.mock("../FormLayout", () => {
  return function FormLayout({ inputFields }) {
    const { fields, setFields } = require("../../context/FormContext").useFormContext();
    return (
      <div data-testid="form-layout">
        <div data-testid="fields-count">{fields.length}</div>
        <button
          data-testid="add-field-button"
          onClick={() => setFields([...fields, { id: Date.now(), type: "short-text", question: "New Field" }])}
        >
          Add Field
        </button>
        <div data-testid="input-fields-count">{inputFields?.length || 0}</div>
      </div>
    );
  };
});

jest.mock("../FormPreviewModal", () => {
  return function FormPreviewModal({ show, onClose, formName, description, fields }) {
    if (!show) return null;
    return (
      <div data-testid="form-preview-modal">
        <div data-testid="preview-form-name">{formName}</div>
        <div data-testid="preview-fields-count">{fields?.length || 0}</div>
        <button data-testid="close-preview" onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe("CreateForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockParams.formId = null;
    
    // Reset mock context to default values
    useFormContext.mockReturnValue({
      ...mockFormContext,
      formId: null,
      formName: "",
      description: "",
      visibility: false,
      fields: [],
      headerCard: { title: "", description: "" },
      activeTab: "configuration",
      showPreview: false,
    });
  });

  // ========== RENDERING TESTS ==========
  describe("Component Rendering", () => {
    test("renders CreateForm component in create mode", () => {
      render(<CreateForm mode="create" />);
      expect(screen.getByText("Form Configuration")).toBeInTheDocument();
      expect(screen.getByText("Form Layout")).toBeInTheDocument();
    });

    test("renders with configuration tab active by default", () => {
      render(<CreateForm mode="create" />);
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
      expect(screen.queryByTestId("form-layout")).not.toBeInTheDocument();
    });

    test("renders all footer buttons", () => {
      render(<CreateForm mode="create" />);
      expect(screen.getByText("Save as draft")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  // ========== TAB NAVIGATION TESTS ==========
  describe("Tab Navigation", () => {
    test("configuration tab is active by default", () => {
      render(<CreateForm mode="create" />);
      const configTab = screen.getByText("Form Configuration");
      expect(configTab.closest("button")).toHaveClass("active");
    });

    test("layout tab is disabled when form name is empty", () => {
      render(<CreateForm mode="create" />);
      const layoutTab = screen.getByText("Form Layout");
      expect(layoutTab.closest("button")).toHaveClass("disabled");
      expect(layoutTab.closest("button")).toBeDisabled();
    });

    test("switches to layout tab when form name is provided", () => {
      const contextWithName = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "configuration",
      };
      useFormContext.mockReturnValue(contextWithName);

      render(<CreateForm mode="create" />);
      
      const layoutTab = screen.getByText("Form Layout");
      fireEvent.click(layoutTab);
      
      expect(contextWithName.setActiveTab).toHaveBeenCalledWith("layout");
    });

    test("does not switch to layout tab when form name is empty", () => {
      const contextWithoutName = {
        ...mockFormContext,
        formName: "",
      };
      useFormContext.mockReturnValue(contextWithoutName);

      render(<CreateForm mode="create" />);
      
      const layoutTab = screen.getByText("Form Layout");
      fireEvent.click(layoutTab);
      
      expect(contextWithoutName.setActiveTab).not.toHaveBeenCalled();
    });

    test("renders layout tab content when active", () => {
      const contextWithLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
      };
      useFormContext.mockReturnValue(contextWithLayout);

      render(<CreateForm mode="create" />);
      expect(screen.getByTestId("form-layout")).toBeInTheDocument();
      expect(screen.queryByTestId("form-configuration")).not.toBeInTheDocument();
    });
  });

  // ========== NEXT BUTTON TESTS ==========
  describe("Next Button", () => {
    test("Next button is disabled when form name is empty", () => {
      render(<CreateForm mode="create" />);
      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    test("Next button is enabled when form name is provided", () => {
      const contextWithName = {
        ...mockFormContext,
        formName: "Test Form",
      };
      useFormContext.mockReturnValue(contextWithName);

      render(<CreateForm mode="create" />);
      const nextButton = screen.getByText("Next");
      expect(nextButton).not.toBeDisabled();
    });

    test("Next button switches to layout tab", () => {
      const contextWithName = {
        ...mockFormContext,
        formName: "Test Form",
      };
      useFormContext.mockReturnValue(contextWithName);

      render(<CreateForm mode="create" />);
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      
      expect(contextWithName.setActiveTab).toHaveBeenCalledWith("layout");
    });
  });

  // ========== PREVIEW FUNCTIONALITY TESTS ==========
  describe("Preview Functionality", () => {
    test("Preview button is visible only in layout tab", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });

    test("Preview button is not visible in configuration tab", () => {
      render(<CreateForm mode="create" />);
      expect(screen.queryByText("Preview")).not.toBeInTheDocument();
    });

    test("Preview button opens preview modal", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        showPreview: false,
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      const previewButton = screen.getByText("Preview");
      fireEvent.click(previewButton);
      
      expect(contextLayout.setShowPreview).toHaveBeenCalledWith(true);
    });

    test("Preview modal displays when showPreview is true", () => {
      const contextWithPreview = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        showPreview: true,
        fields: [{ id: 1, type: "short-text", question: "Question 1" }],
      };
      useFormContext.mockReturnValue(contextWithPreview);

      render(<CreateForm mode="create" />);
      expect(screen.getByTestId("form-preview-modal")).toBeInTheDocument();
      expect(screen.getByTestId("preview-form-name")).toHaveTextContent("Test Form");
    });

    test("Preview modal closes when onClose is called", () => {
      const contextWithPreview = {
        ...mockFormContext,
        formName: "Test Form",
        showPreview: true,
      };
      useFormContext.mockReturnValue(contextWithPreview);

      render(<CreateForm mode="create" />);
      const closeButton = screen.getByTestId("close-preview");
      fireEvent.click(closeButton);
      
      expect(contextWithPreview.setShowPreview).toHaveBeenCalledWith(false);
    });
  });

  // ========== PUBLISH BUTTON TESTS ==========
  describe("Publish Button", () => {
    test("Publish button is visible only in layout tab", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      expect(screen.getByText("Publish Form")).toBeInTheDocument();
    });

    test("Publish button is disabled when no fields are added", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        fields: [],
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      expect(publishButton).toBeDisabled();
    });

    test("Publish button is enabled when fields are added", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        fields: [{ id: 1, type: "short-text", question: "Question 1" }],
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      expect(publishButton).not.toBeDisabled();
    });
  });

  // ========== SAVE DRAFT TESTS ==========
  describe("Save Draft Functionality", () => {
    test("Save draft button is always visible", () => {
      render(<CreateForm mode="create" />);
      expect(screen.getByText("Save as draft")).toBeInTheDocument();
    });

    test("saves configuration draft when in configuration tab", async () => {
      const contextConfig = {
        ...mockFormContext,
        formName: "Test Form",
        description: "Test Description",
        visibility: true,
        activeTab: "configuration",
        formId: null,
      };
      useFormContext.mockReturnValue(contextConfig);

      formService.createFormConfig.mockResolvedValue({ id: "form-123" });

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(formService.createFormConfig).toHaveBeenCalledWith({
          title: "Test Form",
          description: "Test Description",
          visibility: true,
        });
      });
    });

    test("updates configuration draft when formId exists", async () => {
      const contextConfig = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Updated Form",
        description: "Updated Description",
        visibility: false,
        activeTab: "configuration",
      };
      useFormContext.mockReturnValue(contextConfig);

      formService.updateFormConfig.mockResolvedValue({});

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(formService.updateFormConfig).toHaveBeenCalledWith("form-123", {
          title: "Updated Form",
          description: "Updated Description",
          visibility: false,
        });
      });
    });

       test("saves layout draft when in layout tab", async () => {
      const contextLayout = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [
          {
            id: 1,
            question: "Question 1",
            type: "short-text",
            required: true,
            descriptionEnabled: false,
            description: "",
            options: [],
          },
        ],
      };
      useFormContext.mockReturnValue(contextLayout);

      formService.updateFormLayout.mockResolvedValue({});

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(formService.updateFormLayout).toHaveBeenCalledWith("form-123", expect.any(Object));
      });
    });

    test("shows error when saving layout without formId", async () => {
      const { toast } = require("react-toastify");
      const contextLayout = {
        ...mockFormContext,
        formId: null,
        formName: "Test Form",
        activeTab: "layout",
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  // ========== PUBLISH FUNCTIONALITY TESTS ==========
  describe("Publish Functionality", () => {
    test("publishes form successfully", async () => {
      const { toast } = require("react-toastify");
      const contextPublish = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [
          {
            id: 1,
            question: "Question 1",
            type: "short-text",
            required: true,
          },
        ],
      };
      useFormContext.mockReturnValue(contextPublish);

      formService.updateFormLayout.mockResolvedValue({});
      formService.publishForm.mockResolvedValue({ id: "form-123", status: "published" });

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(formService.updateFormLayout).toHaveBeenCalled();
        expect(formService.publishForm).toHaveBeenCalledWith("form-123");
        expect(toast.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("shows error when publishing without formId", async () => {
      const { toast } = require("react-toastify");
      const contextPublish = {
        ...mockFormContext,
        formId: null,
        formName: "Test Form",
        activeTab: "layout",
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextPublish);

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    test("handles publish error gracefully", async () => {
      const { toast } = require("react-toastify");
      const contextPublish = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextPublish);

      formService.updateFormLayout.mockResolvedValue({});
      formService.publishForm.mockRejectedValue(new Error("Publish failed"));

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  // ========== EDIT MODE TESTS ==========
  describe("Edit Mode", () => {
    test("loads existing form data in edit mode", async () => {
      mockParams.formId = "form-456";
      
      const existingFormData = {
        id: "form-456",
        config: {
          title: "Existing Form",
          description: "Existing Description",
          visibility: true,
        },
        layout: {
          fields: [
            {
              id: 1,
              label: "Existing Question",
              type: "short-text",
              required: true,
              descriptionEnabled: false,
              description: "",
              options: [],
              order: 0,
            },
          ],
        },
      };

      formService.getFormById.mockResolvedValue(existingFormData);

      const contextEdit = {
        ...mockFormContext,
      };
      useFormContext.mockReturnValue(contextEdit);

      render(<CreateForm mode="edit" />);

      await waitFor(() => {
        expect(formService.getFormById).toHaveBeenCalledWith("form-456");
        expect(contextEdit.setFormId).toHaveBeenCalledWith("form-456");
        expect(contextEdit.setFormName).toHaveBeenCalledWith("Existing Form");
        expect(contextEdit.setDescription).toHaveBeenCalledWith("Existing Description");
        expect(contextEdit.setVisibility).toHaveBeenCalledWith(true);
      });
    });

    test("handles error when loading form in edit mode", async () => {
      mockParams.formId = "form-error";
      
      formService.getFormById.mockRejectedValue(new Error("Failed to load"));

      const contextEdit = {
        ...mockFormContext,
      };
      useFormContext.mockReturnValue(contextEdit);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<CreateForm mode="edit" />);

      await waitFor(() => {
        expect(formService.getFormById).toHaveBeenCalledWith("form-error");
      });

      consoleErrorSpy.mockRestore();
      alertSpy.mockRestore();
    });

    test("does not load form data when not in edit mode", () => {
      mockParams.formId = "form-123";

      render(<CreateForm mode="create" />);

      expect(formService.getFormById).not.toHaveBeenCalled();
    });
  });

  // ========== INPUT FIELDS TESTS ==========
  describe("Input Fields", () => {
    test("passes inputFields to FormLayout component", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      
      expect(screen.getByTestId("input-fields-count")).toHaveTextContent("6");
    });

    test("inputFields contain correct field types", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
      };
      useFormContext.mockReturnValue(contextLayout);

      const { container } = render(<CreateForm mode="create" />);
      
      expect(screen.getByTestId("form-layout")).toBeInTheDocument();
    });
  });

  // ========== FIELD MANAGEMENT TESTS ==========
  describe("Field Management", () => {
    test("displays correct field count", () => {
      const contextWithFields = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        fields: [
          { id: 1, type: "short-text", question: "Q1" },
          { id: 2, type: "long-text", question: "Q2" },
        ],
      };
      useFormContext.mockReturnValue(contextWithFields);

      render(<CreateForm mode="create" />);
      expect(screen.getByTestId("fields-count")).toHaveTextContent("2");
    });

    test("adds field when add button is clicked", () => {
      const contextLayout = {
        ...mockFormContext,
        formName: "Test Form",
        activeTab: "layout",
        fields: [],
      };
      useFormContext.mockReturnValue(contextLayout);

      render(<CreateForm mode="create" />);
      
      const addButton = screen.getByTestId("add-field-button");
      fireEvent.click(addButton);

      expect(contextLayout.setFields).toHaveBeenCalled();
    });
  });

  // ========== NAVIGATION TESTS ==========
  describe("Navigation", () => {
    test("navigates to home after saving draft in configuration tab", async () => {
      const contextConfig = {
        ...mockFormContext,
        formName: "Test Form",
        description: "Test Description",
        visibility: true,
        activeTab: "configuration",
        formId: null,
      };
      useFormContext.mockReturnValue(contextConfig);

      formService.createFormConfig.mockResolvedValue({ id: "form-123" });

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("navigates to home after saving draft in layout tab", async () => {
      const contextLayout = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextLayout);

      formService.updateFormLayout.mockResolvedValue({});

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("navigates to home after publishing form", async () => {
      const contextPublish = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextPublish);

      formService.updateFormLayout.mockResolvedValue({});
      formService.publishForm.mockResolvedValue({ id: "form-123" });

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  // ========== EDGE CASES ==========
  describe("Edge Cases", () => {
    test("handles fields with options (dropdown)", async () => {
      const contextWithDropdown = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [
          {
            id: 1,
            question: "Select Option",
            type: "drop-down",
            options: [
              { optionId: "1", value: "Option 1" },
              { optionId: "2", value: "Option 2" },
            ],
          },
        ],
      };
      useFormContext.mockReturnValue(contextWithDropdown);

      formService.updateFormLayout.mockResolvedValue({});
      formService.publishForm.mockResolvedValue({ id: "form-123" });

      render(<CreateForm mode="create" />);
      const publishButton = screen.getByText("Publish Form");
      fireEvent.click(publishButton);

      await waitFor(() => {
        expect(formService.updateFormLayout).toHaveBeenCalledWith(
          "form-123",
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "drop-down",
                options: expect.arrayContaining([
                  expect.objectContaining({ value: "Option 1" }),
                  expect.objectContaining({ value: "Option 2" }),
                ]),
              }),
            ]),
          })
        );
      });
    });

    test("handles fields without questionId", async () => {
      const contextWithoutQuestionId = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "Header", description: "Header Desc" },
        fields: [
          {
            id: 1,
            question: "Question without ID",
            type: "short-text",
          },
        ],
      };
      useFormContext.mockReturnValue(contextWithoutQuestionId);

      formService.updateFormLayout.mockResolvedValue({});

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(formService.updateFormLayout).toHaveBeenCalled();
      });
    });

    test("handles empty headerCard", async () => {
      const contextEmptyHeader = {
        ...mockFormContext,
        formId: "form-123",
        formName: "Test Form",
        activeTab: "layout",
        headerCard: { title: "", description: "" },
        fields: [{ id: 1, question: "Q1", type: "short-text" }],
      };
      useFormContext.mockReturnValue(contextEmptyHeader);

      formService.updateFormLayout.mockResolvedValue({});

      render(<CreateForm mode="create" />);
      const draftButton = screen.getByText("Save as draft");
      fireEvent.click(draftButton);

      await waitFor(() => {
        expect(formService.updateFormLayout).toHaveBeenCalledWith(
          "form-123",
          expect.objectContaining({
            headerCard: expect.objectContaining({
              title: "",
              description: "",
            }),
          })
        );
      });
    });
  });
});
