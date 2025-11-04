import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormBuilderHome from "../FormBuilderHome";

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock API
const mockGetAllForms = jest.fn();
const mockDeleteForm = jest.fn();

jest.mock("../../api/formService", () => ({
  getAllForms: (...args) => mockGetAllForms(...args),
  deleteForm: (...args) => mockDeleteForm(...args),
}));

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
  return function FormList({ forms, search, setSearch, openMenuId, setOpenMenuId, handleCreateForm, handleDelete, loading }) {
    return (
      <div data-testid="form-list">
        <input
          data-testid="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search forms"
        />
        <button data-testid="create-form-button" onClick={handleCreateForm}>
          Create New Form
        </button>
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

describe("FormBuilderHome Component - Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    window.alert = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  test("renders component", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("home-placeholder")).toBeInTheDocument();
    });
  });

  test("renders HomePlaceholder when no forms", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
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
    await waitFor(() => {
      expect(screen.getByText("My First Form")).toBeInTheDocument();
      expect(screen.getByText("My Second Form")).toBeInTheDocument();
    });
  });

  test("renders create form button in placeholder", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("create-form-placeholder")).toBeInTheDocument();
    });
  });

  test("renders create form button in form list", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("create-form-button")).toBeInTheDocument();
    });
  });

  test("navigates to create form from placeholder", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("create-form-placeholder")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("create-form-placeholder"));
    expect(mockNavigate).toHaveBeenCalledWith("/create-form");
  });

  test("navigates to create form from form list", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("create-form-button")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("create-form-button"));
    expect(mockNavigate).toHaveBeenCalledWith("/create-form");
  });

  test("renders search input", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });
  });

  test("updates search input value", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    expect(searchInput.value).toBe("test search");
  });

  test("renders delete buttons for each form", async () => {
    const mockForms = [
      { id: "form-1", config: { title: "Form 1" } },
      { id: "form-2", config: { title: "Form 2" } },
    ];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
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
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
      expect(screen.getByTestId("menu-button-1")).toBeInTheDocument();
    });
  });

  test("toggles menu open state", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
    });
    
    // Menu should not be visible initially
    expect(screen.queryByTestId("menu-0")).not.toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(screen.getByTestId("menu-button-0"));
    expect(screen.getByTestId("menu-0")).toBeInTheDocument();
    
    // Click to close menu
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
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("2");
    });
    
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("1");
    });
  });

  test("handles form with no title", async () => {
    const mockForms = [{ id: "form-1", config: {} }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
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
    await waitFor(() => {
      expect(screen.getByTestId("form-item-0")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-2")).toBeInTheDocument();
      expect(screen.getByTestId("form-item-3")).toBeInTheDocument();
    });
  });

  test("shows loading state initially", async () => {
    mockGetAllForms.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<FormBuilderHome />);
    expect(screen.getByText("Loading forms...")).toBeInTheDocument();
  });

  test("shows error message on load failure", async () => {
    mockGetAllForms.mockRejectedValue(new Error("Failed to load"));
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load forms")).toBeInTheDocument();
    });
  });

  test("handles empty forms array", async () => {
    mockGetAllForms.mockResolvedValue({ data: [] });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("home-placeholder")).toBeInTheDocument();
    });
  });

  test("handles null forms data", async () => {
    mockGetAllForms.mockResolvedValue({ data: null });
    render(<FormBuilderHome />);
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
    mockDeleteForm.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<FormBuilderHome />);
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
    await waitFor(() => {
      expect(screen.getByTestId("menu-button-0")).toBeInTheDocument();
    });
    
    // Open menu
    fireEvent.click(screen.getByTestId("menu-button-0"));
    expect(screen.getByTestId("menu-0")).toBeInTheDocument();
    
    // Delete form
    fireEvent.click(screen.getByTestId("delete-button-0"));
    
    await waitFor(() => {
      expect(screen.queryByTestId("menu-0")).not.toBeInTheDocument();
    });
  });

  test("renders with single form", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Single Form" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("forms-count").textContent).toBe("1");
      expect(screen.getByText("Single Form")).toBeInTheDocument();
    });
  });

  test("search input starts empty", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("search-input").value).toBe("");
    });
  });

  test("clears search input", async () => {
    const mockForms = [{ id: "form-1", config: { title: "Form 1" } }];
    mockGetAllForms.mockResolvedValue({ data: mockForms });
    render(<FormBuilderHome />);
    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
    
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(searchInput.value).toBe("");
  });
});
