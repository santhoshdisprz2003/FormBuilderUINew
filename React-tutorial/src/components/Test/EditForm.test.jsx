import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditForm from "../EditForm";

// Mock API
const mockGetFormById = jest.fn();

jest.mock("../../api/formService", () => ({
  getFormById: (...args) => mockGetFormById(...args),
  updateFormConfig: jest.fn(),
  updateFormLayout: jest.fn(),
  publishForm: jest.fn(),
}));

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "form-123" }),
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
  return function FormConfiguration({ formName, description, visibility, setFormName, setDescription, setVisibility }) {
    return (
      <div data-testid="form-configuration">
        <input
          data-testid="form-name-input"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <input
          data-testid="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          data-testid="visibility-checkbox"
          type="checkbox"
          checked={visibility}
          onChange={(e) => setVisibility(e.target.checked)}
        />
      </div>
    );
  };
});

jest.mock("../FormLayout", () => {
  return function FormLayout({ fields, setFields, formName, description, handleDelete, handleCopy }) {
    return (
      <div data-testid="form-layout">
        <div data-testid="form-title">{formName}</div>
        <div data-testid="form-description">{description}</div>
        <div data-testid="fields-count">{fields.length}</div>
        <button
          data-testid="add-field-button"
          onClick={() => setFields([...fields, { id: Date.now(), type: "short-text", label: "New Field" }])}
        >
          Add Field
        </button>
        {fields.map((field, index) => (
          <div key={field.id} data-testid={`field-${index}`}>
            <button data-testid={`delete-field-${index}`} onClick={() => handleDelete(index)}>
              Delete
            </button>
            <button data-testid={`copy-field-${index}`} onClick={() => handleCopy(index)}>
              Copy
            </button>
          </div>
        ))}
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
        <div data-testid="preview-description">{description}</div>
        <div data-testid="preview-fields-count">{fields.length}</div>
        <button data-testid="close-preview" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
});

const mockFormData = {
  id: "form-123",
  config: {
    title: "Test Form",
    description: "Test Description",
    visibility: true,
  },
  layout: {
    fields: [
      {
        id: 1,
        questionId: "q1",
        label: "Question 1",
        type: "short-text",
        descriptionEnabled: true,
        description: "Field description",
        singleChoice: false,
        multipleChoice: false,
        options: [],
        format: "",
        required: true,
        order: 0,
      },
    ],
  },
};

describe("EditForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    console.error = jest.fn();
    mockGetFormById.mockResolvedValue(mockFormData);
  });

  test("renders component", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Form Configuration")).toBeInTheDocument();
    });
  });

  test("renders both tabs", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Form Configuration")).toBeInTheDocument();
      expect(screen.getByText("Form Layout")).toBeInTheDocument();
    });
  });

  test("renders configuration tab by default", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
  });

  test("renders footer buttons", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByText("Save as draft")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });

  test("loads form name", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-name-input").value).toBe("Test Form");
    });
  });

  test("loads form description", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("description-input").value).toBe("Test Description");
    });
  });

  test("loads visibility state", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("visibility-checkbox").checked).toBe(true);
    });
  });

  test("switches to layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    expect(screen.getByTestId("form-layout")).toBeInTheDocument();
  });

  test("switches back to configuration tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Form Configuration"));
    expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
  });

  test("updates form name", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-name-input")).toBeInTheDocument();
    });
    const input = screen.getByTestId("form-name-input");
    fireEvent.change(input, { target: { value: "Updated Form" } });
    expect(input.value).toBe("Updated Form");
  });

  test("updates description", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("description-input")).toBeInTheDocument();
    });
    const input = screen.getByTestId("description-input");
    fireEvent.change(input, { target: { value: "Updated Description" } });
    expect(input.value).toBe("Updated Description");
  });

  test("toggles visibility", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("visibility-checkbox")).toBeInTheDocument();
    });
    const checkbox = screen.getByTestId("visibility-checkbox");
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test("displays form name in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("form-title").textContent).toBe("Test Form");
    });
  });

  test("displays form description in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("form-description").textContent).toBe("Test Description");
    });
  });

  test("displays existing fields count", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("fields-count").textContent).toBe("1");
    });
  });

  test("adds a new field", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("fields-count").textContent).toBe("1");
    });
    fireEvent.click(screen.getByTestId("add-field-button"));
    expect(screen.getByTestId("fields-count").textContent).toBe("2");
  });

  test("deletes a field", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("fields-count").textContent).toBe("1");
    });
    fireEvent.click(screen.getByTestId("delete-field-0"));
    expect(screen.getByTestId("fields-count").textContent).toBe("0");
  });

  test("copies a field", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    await waitFor(() => {
      expect(screen.getByTestId("fields-count").textContent).toBe("1");
    });
    fireEvent.click(screen.getByTestId("copy-field-0"));
    expect(screen.getByTestId("fields-count").textContent).toBe("2");
  });

  test("renders Preview button in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  test("renders Publish button in layout tab", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  test("does not show preview modal by default", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-configuration")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("form-preview-modal")).not.toBeInTheDocument();
  });

  test("shows preview modal when clicked", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    expect(screen.getByTestId("form-preview-modal")).toBeInTheDocument();
  });

  test("closes preview modal", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    fireEvent.click(screen.getByTestId("close-preview"));
    expect(screen.queryByTestId("form-preview-modal")).not.toBeInTheDocument();
  });

  test("displays form name in preview", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    expect(screen.getByTestId("preview-form-name").textContent).toBe("Test Form");
  });

  test("displays description in preview", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    expect(screen.getByTestId("preview-description").textContent).toBe("Test Description");
  });

  test("displays field count in preview", async () => {
    render(<EditForm />);
    await waitFor(() => {
      expect(mockGetFormById).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByText("Form Layout"));
    fireEvent.click(screen.getByText("Preview"));
    expect(screen.getByTestId("preview-fields-count").textContent).toBe("1");
  });

  test("handles empty form data", async () => {
    mockGetFormById.mockResolvedValue({
      id: "form-123",
      config: { title: "", description: "", visibility: false },
      layout: { fields: [] },
    });
    render(<EditForm />);
    await waitFor(() => {
      expect(screen.getByTestId("form-name-input").value).toBe("");
      expect(screen.getByTestId("description-input").value).toBe("");
    });
  });
});
