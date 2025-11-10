import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormBuilderHome from "../FormBuilderHome";

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock FormContext
const mockSetFormId = jest.fn();
const mockSetFormName = jest.fn();
const mockSetDescription = jest.fn();
const mockSetVisibility = jest.fn();
const mockSetFields = jest.fn();
const mockSetHeaderCard = jest.fn();
const mockSetActiveTab = jest.fn();

jest.mock("../../context/FormContext", () => ({
  useFormContext: () => ({
    setFormId: mockSetFormId,
    setFormName: mockSetFormName,
    setDescription: mockSetDescription,
    setVisibility: mockSetVisibility,
    setFields: mockSetFields,
    setHeaderCard: mockSetHeaderCard,
    setActiveTab: mockSetActiveTab,
  }),
}));

// Mock API
const mockGetAllForms = jest.fn();
const mockDeleteForm = jest.fn();

jest.mock("../../api/formService", () => ({
  getAllForms: (...args) => mockGetAllForms(...args),
  deleteForm: (...args) => mockDeleteForm(...args),
}));

// Mock SearchIcon
jest.mock("../../assets/SearchIcon.png", () => "search-icon.png");

// Mock child components
jest.mock("../HomePlaceholder", () => {
  return function HomePlaceholder({ onCreate }) {
    return (
      <div data-testid="home-placeholder">
        <h2>No Forms Available</h2>
        <button data-testid="create-form-placeholder" onClick={onCreate}>
          Create Your First Form
        </button>
      </div>
    );
  };
});

jest.mock("../FormList", () => {
  return function FormList({ forms, openMenuId, setOpenMenuId, handleDelete, loading }) {
    return (
      <div data-testid="form-list">
        <div data-testid="forms-count">{forms.length}</div>
        {loading && <div data-testid="loading-indicator">Loading...</div>}
        {forms.map((form, index) => (
          <div key={form.id} data-testid={`form-item-${index}`}>
            <div data-testid={`form-title-${index}`}>{form.config?.title || "Untitled"}</div>
            <button
              data-testid={`delete-button-${index}`}
              onClick={() => handleDelete(form.id)}
            >
              Delete
            </button>
            <button
              data-testid={`menu-button-${index}`}
              onClick={() => setOpenMenuId(openMenuId === form.id ? null : form.id)}
            >
              Menu
            </button>
            {openMenuId === form.id && (
              <div data-testid={`menu-${index}`}>Menu Open</div>
            )}
          </div>
        ))}
      </div>
    );
  };
});

describe("FormBuilderHome Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders component", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Form List")).toBeInTheDocument();
    });
  });

  test("renders header with Form List title", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Form List")).toBeInTheDocument();
    });
  });

  test("renders search input", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
  });

  test("renders Create Form button in header", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Create Form")).toBeInTheDocument();
    });
  });

  test("renders HomePlaceholder when no forms", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("home-placeholder")).toBeInTheDocument();
      expect(screen.getByText("No Forms Available")).toBeInTheDocument();
    });
  });

  test("renders FormList when forms exist", async () => {
    const mockForms = [
      {
        id: "form-1",
        config: { title: "Form 1", description: "Description 1" },
      },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("form-list")).toBeInTheDocument();
    });
  });

  test("displays correct number of forms", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
      { id: "form-3", config: { title: "Form 3" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("3");
    });
  });

  test("displays form titles", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "My First Form" } },
      { id: "form-2", config: { title: "My Second Form" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("My First Form")).toBeInTheDocument();
      expect(screen.getByText("My Second Form")).toBeInTheDocument();
    });
  });

  test("navigates to create form from placeholder", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("create-form-placeholder")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId("create-form-placeholder"));
    
    expect(mockSetFormId).toHaveBeenCalledWith(null);
    expect(mockSetFormName).toHaveBeenCalledWith("");
    expect(mockSetDescription).toHaveBeenCalledWith("");
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
    expect(mockSetFields).toHaveBeenCalledWith([]);
    expect(mockSetHeaderCard).toHaveBeenCalledWith({ title: "", description: "" });
    expect(mockSetActiveTab).toHaveBeenCalledWith("configuration");
    expect(mockNavigate).toHaveBeenCalledWith("/create-form");
  });

  test("navigates to create form from header button", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Create Form")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText("Create Form"));
    
    expect(mockSetFormId).toHaveBeenCalledWith(null);
    expect(mockSetFormName).toHaveBeenCalledWith("");
    expect(mockSetDescription).toHaveBeenCalledWith("");
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
    expect(mockSetFields).toHaveBeenCalledWith([]);
    expect(mockSetHeaderCard).toHaveBeenCalledWith({ title: "", description: "" });
    expect(mockSetActiveTab).toHaveBeenCalledWith("configuration");
    expect(mockNavigate).toHaveBeenCalledWith("/create-form");
  });

  test("updates search input value", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    
    expect(searchInput.value).toBe("test search");
  });

  test("calls getAllForms with search term after debounce", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test" } });
    
    // Advance timers to trigger debounce
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(mockGetAllForms).toHaveBeenCalledWith(0, 10, "test");
    });
  });

  test("renders delete buttons for each form", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("delete-button-0")).toBeInTheDocument();
      expect(screen.getByTestId("delete-button-1")).toBeInTheDocument();
    });
  });

  test("renders menu buttons for each form", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
      expect(screen.getByTestId("menu-button-1")).toBeInTheDocument();
    });
  });

  test("toggles menu open state", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId("menu-0")).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("menu-button-0"));
    expect(screen.getByTestId("menu-0")).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("menu-button-0"));
    expect(screen.queryByTestId("menu-0")).not.toBeInTheDocument();
  });

  test("deletes a form", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    mockDeleteForm.mockResolvedValue({});
    
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("2");
    });
    
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(mockDeleteForm).toHaveBeenCalledWith("form-1");
      expect(screen.getByTestId("forms-count").textContent).toBe("1");
    });
  });

  test("handles form with no title", async () => {
    const mockForms = [{ id: "form-1", config: {} }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Untitled")).toBeInTheDocument();
    });
  });

  test("renders multiple forms correctly", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
      { id: "form-3", config: { title: "Form 3" } },
      { id: "form-4", config: { title: "Form 4" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("form-item-0")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-3")).toBeInTheDocument();
    });
  });

  

  test("shows error message on load failure", async () => {
    mockGetAllForms.mockRejectedValue(new Error("Failed to load"));
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByText("Failed to load forms")).toBeInTheDocument();
    });
  });

  test("handles empty forms array", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("home-placeholder")).toBeInTheDocument();
    });
  });

  test("handles null forms data", async () => {
    mockGetAllForms.mockResolvedValue({ data: null });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("home-placeholder")).toBeInTheDocument();
    });
  });

  test("renders after successful form deletion", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    mockDeleteForm.mockResolvedValue({});
    
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("2");
    });
    
    fireEvent.click(screen.getByTestId("delete-button-1"));
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("1");
      expect(screen.getByText("Form 1")).toBeInTheDocument();
      expect(screen.queryByText("Form 2")).not.toBeInTheDocument();
    });
  });

  test("shows loading indicator during delete", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    mockDeleteForm.mockImplementation(() => new Promise(() => {}));
    
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("delete-button-0")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });
  });

  test("handles delete error gracefully", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    mockDeleteForm.mockRejectedValue(new Error("Delete failed"));
    
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("delete-button-0")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to delete form. Please try again.");
    });
  });

  test("closes menu after deletion", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    mockDeleteForm.mockResolvedValue({});
    
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId("menu-button-0"));
    expect(screen.getByTestId("menu-0")).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(screen.queryByTestId("menu-0")).not.toBeInTheDocument();
    });
  });

  test("renders with single form", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Single Form" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("1");
      expect(screen.getByText("Single Form")).toBeInTheDocument();
    });
  });

  test("search input starts empty", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search").value).toBe("");
    });
  });

  test("clears search input", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
    
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(searchInput.value).toBe("");
  });

  test("calls getAllForms on mount", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(mockGetAllForms).toHaveBeenCalledWith(0, 10, "");
    });
  });

  test("renders search icon", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      const searchIcon = screen.getByAltText("Search");
      expect(searchIcon).toBeInTheDocument();
      expect(searchIcon).toHaveAttribute("src", "search-icon.png");
    });
  });
});
