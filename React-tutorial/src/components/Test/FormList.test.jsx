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
  const mockSetOpenMenuId = jest.fn();
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
    openMenuId: null,
    setOpenMenuId: mockSetOpenMenuId,
    handleDelete: mockHandleDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test("renders component", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.getByText("Test Form 1")).toBeInTheDocument();
  });

  test("renders container with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const containerDiv = container.querySelector(".container");
    expect(containerDiv).toBeInTheDocument();
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

  test("navigates to view form when View Form button is clicked", () => {
    const props = { ...defaultProps, openMenuId: "form-2" };
    render(<FormList {...props} />);
    const viewButton = screen.getByText("View Form");
    fireEvent.click(viewButton);
    expect(mockNavigate).toHaveBeenCalledWith("/form-builder/view/form-2");
  });

  test("navigates to edit form when Edit Form button is clicked", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const editButton = screen.getByText("Edit Form");
    fireEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith("/form-builder/edit/form-1");
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

  test("logs console message when rendering card", () => {
    render(<FormList {...defaultProps} />);
    expect(console.log).toHaveBeenCalledWith("Rendering card for form:", "form-1", "Test Form 1");
    expect(console.log).toHaveBeenCalledWith("Rendering card for form:", "form-2", "Test Form 2");
  });

  test("logs console message when navigating to view form", () => {
    const props = { ...defaultProps, openMenuId: "form-2" };
    render(<FormList {...props} />);
    const viewButton = screen.getByText("View Form");
    fireEvent.click(viewButton);
    expect(console.log).toHaveBeenCalledWith("Navigating to View Form with ID:", "form-2");
  });

  test("handles delete error and logs to console", async () => {
    const error = new Error("Delete failed");
    mockHandleDelete.mockRejectedValue(error);
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Delete failed:", error);
    });
  });

  test("renders toggle wrapper with correct class", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const toggleWrappers = container.querySelectorAll(".toggle-wrapper");
    expect(toggleWrappers.length).toBe(2);
  });

  test("renders toggle label", () => {
    render(<FormList {...defaultProps} />);
    const toggleLabels = screen.getAllByText("Enabled");
    expect(toggleLabels.length).toBe(2);
  });

  test("renders toggle switch", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const switches = container.querySelectorAll(".switch");
    expect(switches.length).toBe(2);
  });

  test("renders toggle slider", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const sliders = container.querySelectorAll(".slider.round");
    expect(sliders.length).toBe(2);
  });

  test("toggle checkbox is unchecked by default", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      expect(checkbox.checked).toBe(false);
    });
  });

  test("toggles enabled state when checkbox is clicked", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const firstCheckbox = checkboxes[0];
    
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
  });

  test("each form has independent toggle state", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
    
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(true);
  });

  test("View Responses button is disabled for draft forms", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const viewResponseBtns = container.querySelectorAll(".viewresponse-btn");
    const draftFormBtn = viewResponseBtns[0]; // form-1 is draft
    expect(draftFormBtn).toHaveClass("disabled");
    expect(draftFormBtn).toBeDisabled();
  });

  test("View Responses button is enabled for published forms", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const viewResponseBtns = container.querySelectorAll(".viewresponse-btn");
    const publishedFormBtn = viewResponseBtns[1]; // form-2 is published
    expect(publishedFormBtn).not.toHaveClass("disabled");
    expect(publishedFormBtn).not.toBeDisabled();
  });

  test("navigates to responses tab when View Responses is clicked for published form", () => {
    render(<FormList {...defaultProps} />);
    const viewResponseBtns = screen.getAllByText("View Responses");
    const publishedFormBtn = viewResponseBtns[1]; // form-2 is published
    
    fireEvent.click(publishedFormBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/form-builder/view/form-2", {
      state: { openTab: "responses" },
    });
  });

  test("does not navigate when View Responses is clicked for draft form", () => {
    render(<FormList {...defaultProps} />);
    const viewResponseBtns = screen.getAllByText("View Responses");
    const draftFormBtn = viewResponseBtns[0]; // form-1 is draft
    
    fireEvent.click(draftFormBtn);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("renders default createdBy as admin when not provided", () => {
    const formsWithoutCreatedBy = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithoutCreatedBy };
    render(<FormList {...props} />);
    expect(screen.getByText(/Created by: admin/)).toBeInTheDocument();
  });

  test("renders default publishedBy as admin when not provided", () => {
    const formsWithoutPublishedBy = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 1,
        publishedAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithoutPublishedBy };
    render(<FormList {...props} />);
    expect(screen.getByText(/Published by: admin/)).toBeInTheDocument();
  });

  test("disables Cancel button during deletion", async () => {
    mockHandleDelete.mockImplementation(() => new Promise(() => {}));
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const cancelButton = screen.getByText("Cancel");
      expect(cancelButton).toBeDisabled();
    });
  });

  test("disables Yes, Delete button during deletion", async () => {
    mockHandleDelete.mockImplementation(() => new Promise(() => {}));
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      const deletingButton = screen.getByText("Deleting...");
      expect(deletingButton).toBeDisabled();
    });
  });

    test("handles undefined config title", () => {
    const formsWithUndefinedTitle = [
      {
        id: "form-1",
        config: { title: undefined },
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithUndefinedTitle };
    render(<FormList {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles empty string as title", () => {
    const formsWithEmptyTitle = [
      {
        id: "form-1",
        config: { title: "" },
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithEmptyTitle };
    render(<FormList {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles undefined config", () => {
    const formsWithUndefinedConfig = [
      {
        id: "form-1",
        config: undefined,
        status: 0,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithUndefinedConfig };
    render(<FormList {...props} />);
    expect(screen.getByText("Untitled Form")).toBeInTheDocument();
  });

  test("handles invalid date string", () => {
    const formsWithInvalidDate = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdBy: "admin",
        createdAt: "invalid-date",
      },
    ];
    const props = { ...defaultProps, forms: formsWithInvalidDate };
    render(<FormList {...props} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  test("handles empty string as date", () => {
    const formsWithEmptyDate = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdBy: "admin",
        createdAt: "",
      },
    ];
    const props = { ...defaultProps, forms: formsWithEmptyDate };
    render(<FormList {...props} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  test("handles undefined date", () => {
    const formsWithUndefinedDate = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 0,
        createdBy: "admin",
        createdAt: undefined,
      },
    ];
    const props = { ...defaultProps, forms: formsWithUndefinedDate };
    render(<FormList {...props} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  test("maintains toggle state after re-render", () => {
    const { container, rerender } = render(<FormList {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBe(true);
    
    rerender(<FormList {...defaultProps} />);
    const updatedCheckboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(updatedCheckboxes[0].checked).toBe(true);
  });

  test("handles multiple menu opens and closes", () => {
    render(<FormList {...defaultProps} />);
    const menuButtons = screen.getAllByText("⋮");
    
    fireEvent.click(menuButtons[0]);
    expect(mockSetOpenMenuId).toHaveBeenCalledWith("form-1");
    
    fireEvent.click(menuButtons[1]);
    expect(mockSetOpenMenuId).toHaveBeenCalledWith("form-2");
    
    mockSetOpenMenuId.mockClear();
    const props = { ...defaultProps, openMenuId: "form-2" };
    render(<FormList {...props} />);
    const updatedMenuButtons = screen.getAllByText("⋮");
    fireEvent.click(updatedMenuButtons[1]);
    expect(mockSetOpenMenuId).toHaveBeenCalledWith(null);
  });

  test("renders correct number of cards for filtered forms", () => {
    const { container } = render(<FormList {...defaultProps} />);
    const cards = container.querySelectorAll(".card");
    expect(cards.length).toBe(2);
  });

  test("handles status as other values (not 0 or 1)", () => {
    const formsWithOtherStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: 2,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithOtherStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("handles status as null", () => {
    const formsWithNullStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: null,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithNullStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("handles status as undefined", () => {
    const formsWithUndefinedStatus = [
      {
        id: "form-1",
        config: { title: "Test Form" },
        status: undefined,
        createdBy: "admin",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ];
    const props = { ...defaultProps, forms: formsWithUndefinedStatus };
    render(<FormList {...props} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  test("does not show delete popup by default", () => {
    render(<FormList {...defaultProps} />);
    expect(screen.queryByText("Delete Form")).not.toBeInTheDocument();
  });

  test("shows only one delete popup at a time", () => {
    const props = { ...defaultProps, openMenuId: "form-1" };
    const { container } = render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    
    const popups = container.querySelectorAll(".popup");
    expect(popups.length).toBe(1);
  });

  test("re-enables buttons after deletion completes", async () => {
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

  test("keeps popup open after deletion error", async () => {
    const error = new Error("Delete failed");
    mockHandleDelete.mockRejectedValue(error);
    const props = { ...defaultProps, openMenuId: "form-1" };
    render(<FormList {...props} />);
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Delete failed:", error);
      expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    });
  });
});

