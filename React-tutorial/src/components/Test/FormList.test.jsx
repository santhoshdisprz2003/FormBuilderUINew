import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormList from "../FormList";

// Mock useNavigate without importing react-router-dom
const mockNavigate = jest.fn();

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("FormList Component - Rendering Tests", () => {
  const mockSetSearch = jest.fn();
  const mockSetOpenMenuId = jest.fn();
  const mockHandleCreateForm = jest.fn();
  const mockHandleDelete = jest.fn();

  const defaultForms = [
    {
      id: "form-1",
      config: {
        title: "Test Form 1",
        description: "Description 1",
      },
      status: 0,
      createdBy: "admin",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "form-2",
      config: {
        title: "Test Form 2",
        description: "Description 2",
      },
      status: 1,
      publishedBy: "admin",
      publishedAt: "2024-01-20T10:00:00Z",
    },
  ];

  const defaultProps = {
    forms: defaultForms,
    search: "",
    setSearch: mockSetSearch,
    openMenuId: null,
    setOpenMenuId: mockSetOpenMenuId,
    handleCreateForm: mockHandleCreateForm,
    handleDelete: mockHandleDelete,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test("renders component", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Form List")).toBeInTheDocument();
  });

  test("renders Form List header", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Form List")).toBeInTheDocument();
  });

  test("renders search input", () => {
    render(<FormList {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText("Search forms");
    expect(searchInput).toBeInTheDocument();
  });

  test("renders Create Form button", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Create Form")).toBeInTheDocument();
  });

  test("renders container with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const containerDiv = container.querySelector(".container");
    expect(containerDiv).toBeInTheDocument();
  });

  test("renders header with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const header = container.querySelector(".header");
    expect(header).toBeInTheDocument();
  });

  test("renders search container with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const searchContainer = container.querySelector(".search-container");
    expect(searchContainer).toBeInTheDocument();
  });

  test("renders card grid", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cardGrid = container.querySelector(".card-grid");
    expect(cardGrid).toBeInTheDocument();
  });

  test("renders all form cards", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.getByText("Test Form 2")).toBeInTheDocument();
  });

  test("renders form titles", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cardTitles = container.querySelectorAll(".card-title");
    expect(cardTitles.length).toBe(2);
  });

  test("renders menu buttons for each form", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const menuButtons = container.querySelectorAll(".menu-btn");
    expect(menuButtons.length).toBe(2);
  });

  test("renders Draft status for unpublished form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("renders Published status for published form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  test("renders created by information for draft form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText(/Created by: admin/)).toBeInTheDocument();
  });

  test("renders published by information for published form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText(/Published by: admin/)).toBeInTheDocument();
  });

  test("renders created date for draft form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText(/Created Date:/)).toBeInTheDocument();
  });

  test("renders published date for published form", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText(/Published Date:/)).toBeInTheDocument();
  });

  test("renders View Responses button for each form", () => {
    render(<FormList {...defaultProps} />);
    const viewResponseButtons = screen.getAllByText("View Responses");
    expect(viewResponseButtons.length).toBe(2);
  });

  test("search input has correct value", () => {
    render(<FormList {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText("Search forms");
    expect(searchInput.value).toBe("");
  });

  test("search input updates value", () => {
    render(<FormList {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText("Search forms");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(mockSetSearch).toHaveBeenCalledWith("test");
  });

  test("calls handleCreateForm when Create Form button is clicked", () => {
    render(<FormList {...defaultProps} />);
    const createButton = screen.getByText("Create Form");
    fireEvent.click(createButton);
    expect(mockHandleCreateForm).toHaveBeenCalledTimes(1);
  });

  test("opens menu when menu button is clicked", () => {
    render(<FormList {...defaultProps} />);
    const menuButtons = screen.getAllByText("⋮");
    fireEvent.click(menuButtons[0]);
    expect(mockSetOpenMenuId).toHaveBeenCalledWith("form-1");
  });

  test("closes menu when menu button is clicked again", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const menuButtons = screen.getAllByText("⋮");
    fireEvent.click(menuButtons[0]);
    expect(mockSetOpenMenuId).toHaveBeenCalledWith(null);
  });

  test("renders Edit Form button for draft form when menu is open", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    expect(screen.getByText("Edit Form")).toBeInTheDocument();
  });

  test("renders View Form button for published form when menu is open", () => {
    const props = { ...defaultProps, openMenuId: "form-2" };
    render(<FormList {...props} />);
    expect(screen.getByText("View Form")).toBeInTheDocument();
  });

  test("renders Delete button when menu is open", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("does not render menu when openMenuId is null", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.queryByText("Edit Form")).not.toBeInTheDocument();
    expect(screen.queryByText("View Form")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("opens delete popup when Delete button is clicked", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Delete Form")).toBeInTheDocument();
  });

  test("renders delete popup with correct content", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Are you sure you want to delete this form?")).toBeInTheDocument();
    expect(screen.getByText("It will be permanently removed.")).toBeInTheDocument();
  });

  test("renders Cancel button in delete popup", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("renders Yes, Delete button in delete popup", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
  });

  test("closes delete popup when Cancel is clicked", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(screen.queryByText("Delete Form")).not.toBeInTheDocument();
  });

  test("calls handleDelete when Yes, Delete is clicked", async () => {
    mockHandleDelete.mockResolvedValue();
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockHandleDelete).toHaveBeenCalledWith("form-1");
    });
  });

  test("filters forms by search term", () => {
    const props = { ...defaultProps, search: "Form 1" };
    render(<FormList {...props} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Form 2")).not.toBeInTheDocument();
  });

  test("filters forms case-insensitively", () => {
    const props = { ...defaultProps, search: "form 1" };
    render(<FormList {...props} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Form 2")).not.toBeInTheDocument();
  });

  test("renders all forms when search is empty", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.getByText("Test Form 2")).toBeInTheDocument();
  });

  test("renders no forms when search matches nothing", () => {
    const props = { ...defaultProps, search: "NonExistent" };
    render(<FormList {...props} />);
    expect(screen.queryByText("Test Form 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Form 2")).not.toBeInTheDocument();
  });

  test("renders Untitled Form when title is missing", () => {
    const formsWithoutTitle = [
      {
        id: "form-1",
        config: {},
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithoutTitle };
    render(<FormList {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("renders N/A for missing date", () => {
    const formsWithoutDate = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdBy: "admin",
        createdAt: null,
      },
    ];
    const props = { ...defaultProps, forms: formsWithoutDate };
    render(<FormList {...props} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  test("renders card header with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cardHeaders = container.querySelectorAll(".card-header");
    expect(cardHeaders.length).toBeGreaterThan(0);
  });

  test("renders card meta with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cardMetas = container.querySelectorAll(".card-meta");
    expect(cardMetas.length).toBeGreaterThan(0);
  });

  test("renders card footer with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cardFooters = container.querySelectorAll(".card-footer");
    expect(cardFooters.length).toBeGreaterThan(0);
  });

  test("renders status button with draft class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const draftStatus = container.querySelector(".status-btn.draft");
    expect(draftStatus).toBeInTheDocument();
  });

  test("renders status button with published class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const publishedStatus = container.querySelector(".status-btn.published");
    expect(publishedStatus).toBeInTheDocument();
  });

  test("renders popup overlay when delete popup is open", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const overlay = container.querySelector(".popup-overlay");
    expect(overlay).toBeInTheDocument();
  });

  test("renders popup with correct class", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const popup = container.querySelector(".popup");
    expect(popup).toBeInTheDocument();
  });

  test("renders popup header", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const popupHeader = container.querySelector(".popup-header");
    expect(popupHeader).toBeInTheDocument();
  });

  test("renders popup content", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const popupContent = container.querySelector(".popup-content");
    expect(popupContent).toBeInTheDocument();
  });

  test("renders popup buttons container", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const popupButtons = container.querySelector(".popup-buttons");
    expect(popupButtons).toBeInTheDocument();
  });

  test("disables buttons during deletion", async () => {
    mockHandleDelete.mockImplementation(() => new Promise(() => {}));
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText("Deleting...")).toBeInTheDocument();
    });
  });

  test("renders with single form", () => {
    const singleForm = [defaultForms[0]];
    const props = { ...defaultProps, forms: singleForm };
    render(<FormList {...props} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Form 2")).not.toBeInTheDocument();
  });

  test("renders with many forms", () => {
    const manyForms = [
      { id: "1", config: { title: "Form 1" }, status: 0, createdBy: "admin", createdAt: "2024-01-01" },
      { id: "2", config: { title: "Form 2" }, status: 1, publishedBy: "admin", publishedAt: "2024-01-02" },
      { id: "3", config: { title: "Form 3" }, status: 0, createdBy: "admin", createdAt: "2024-01-03" },
      { id: "4", config: { title: "Form 4" }, status: 1, publishedBy: "admin", publishedAt: "2024-01-04" },
    ];
    const props = { ...defaultProps, forms: manyForms };
    render(<FormList {...props} />);
    expect(screen.getByText("Form 1")).toBeInTheDocument();
    expect(screen.getByText("Form 2")).toBeInTheDocument();
    expect(screen.getByText("Form 3")).toBeInTheDocument();
    expect(screen.getByText("Form 4")).toBeInTheDocument();
  });

  test("renders with empty forms array", () => {
    const props = { ...defaultProps, forms: [] };
    const { container } = render(<FormList {...props} />);
    const cards = container.querySelectorAll(".card");
    expect(cards.length).toBe(0);
  });

  test("formats date correctly", () => {
    const formsWithDate = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:30:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithDate };
    render(<FormList {...props} />);
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
  });

  test("renders menu container for each card", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const menuContainers = container.querySelectorAll(".menu-container");
    expect(menuContainers.length).toBe(2);
  });

  test("renders card title wrapper", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const titleWrappers = container.querySelectorAll(".card-title-wrapper");
    expect(titleWrappers.length).toBe(2);
  });

  test("renders meta text elements", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const metaTexts = container.querySelectorAll(".meta-text");
    expect(metaTexts.length).toBeGreaterThan(0);
  });

  test("handles status as string '1'", () => {
    const formsWithStringStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: "1",
        publishedBy: "admin",
        publishedAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithStringStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  test("handles status as number 1", () => {
    const formsWithNumberStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 1,
        publishedBy: "admin",
        publishedAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithNumberStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  test("handles status as string '0'", () => {
    const formsWithStringStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: "0",
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithStringStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("renders search input with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const searchInput = container.querySelector(".search-input");
    expect(searchInput).toBeInTheDocument();
  });

  test("renders create button with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const createBtn = container.querySelector(".create-btn");
    expect(createBtn).toBeInTheDocument();
  });

  test("renders view button with correct class", () => {
    const props = { ...defaultProps, openMenuId: "form-2" };
    const { container } = render(<FormList {...props} />);
    const viewBtn = container.querySelector(".view-btn");
    expect(viewBtn).toBeInTheDocument();
  });

  test("renders edit button with correct class", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const editBtn = container.querySelector(".edit-btn");
    expect(editBtn).toBeInTheDocument();
  });

  test("renders delete button with correct class in menu", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteBtn = container.querySelector(".delete-btn");
    expect(deleteBtn).toBeInTheDocument();
  });

  test("renders viewresponse button with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const viewResponseBtns = container.querySelectorAll(".viewresponse-btn");
    expect(viewResponseBtns.length).toBe(2);
  });

  test("renders cancel button with correct class in popup", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const cancelBtn = container.querySelector(".cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
  });

  test("renders confirm delete button with correct class", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmBtn = container.querySelector(".confirm-delete-btn");
    expect(confirmBtn).toBeInTheDocument();
  });

  test("renders menu with correct class", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const menu = container.querySelector(".menu");
    expect(menu).toBeInTheDocument();
  });

  test("search filters partial matches", () => {
    const props = { ...defaultProps, search: "Form" };
    render(<FormList {...props} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
    expect(screen.getByText("Test Form 2")).toBeInTheDocument();
  });

  test("search filters with special characters", () => {
    const formsWithSpecialChars = [
      {
        id: "form-1",
        config: { title: "Form & Special <Characters>" },
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithSpecialChars, search: "Special" };
    render(<FormList {...props} />);
    expect(screen.getByText("Form & Special <Characters>")).toBeInTheDocument();
  });

  test("handles forms with null config", () => {
    const formsWithNullConfig = [
      {
        id: "form-1",
        config: null,
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithNullConfig };
    render(<FormList {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("closes delete popup after successful deletion", async () => {
    mockHandleDelete.mockResolvedValue();
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.queryByText("Delete Form")).not.toBeInTheDocument();
    });
  });

  test("renders horizontal rule in delete popup", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
  });
});
