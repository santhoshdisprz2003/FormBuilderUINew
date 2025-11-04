import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BreadcrumbHeader from "../BreadcrumbHeader";

// Mock images (to prevent Jest errors for imported png files)
jest.mock("../../assets/home.png", () => "home.png");
jest.mock("../../assets/AltArrowRight.png", () => "arrow.png");

// Reusable setup helper
const renderWithRoleAndPath = (role, path, onLogout) => {
  if (role) {
    localStorage.setItem("role", role);
  }
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BreadcrumbHeader onLogout={onLogout} />
    </MemoryRouter>
  );
};

describe("BreadcrumbHeader Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Admin role tests
  test("renders Admin home breadcrumb (Form Builder)", () => {
    renderWithRoleAndPath("admin", "/");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  test("renders Admin Create Form breadcrumb", () => {
    renderWithRoleAndPath("admin", "/create-form");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
    expect(screen.getByText("Create Form")).toBeInTheDocument();
  });

  test("renders Admin Edit Form breadcrumb", () => {
    renderWithRoleAndPath("admin", "/form-builder/edit/123");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
    expect(screen.getByText("Edit Form")).toBeInTheDocument();
  });

  test("renders Admin View Form breadcrumb", () => {
    renderWithRoleAndPath("admin", "/form-builder/view/abc");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
    expect(screen.getByText("View Form")).toBeInTheDocument();
  });

  test("renders Admin /form-builder path", () => {
    renderWithRoleAndPath("admin", "/form-builder");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
  });

  test("renders Admin fallback for unknown path", () => {
    renderWithRoleAndPath("admin", "/some-unknown-path");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
  });

  // Learner role tests
  test("renders Learner Action Center for root path", () => {
    renderWithRoleAndPath("learner", "/");
    expect(screen.getByText("Action Center")).toBeInTheDocument();
    expect(screen.getByText("Forms")).toBeInTheDocument();
  });

  test("renders Learner Action Center and Forms breadcrumbs", () => {
    renderWithRoleAndPath("learner", "/learner-forms");
    expect(screen.getByText("Action Center")).toBeInTheDocument();
    expect(screen.getByText("Forms")).toBeInTheDocument();
  });

  test("renders Learner View breadcrumb for specific form with /learner-forms/view/", () => {
    renderWithRoleAndPath("learner", "/learner-forms/view/456");
    expect(screen.getByText("Action Center")).toBeInTheDocument();
    expect(screen.getByText("Forms")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  test("renders Learner View breadcrumb for specific form with /learner-forms/", () => {
    renderWithRoleAndPath("learner", "/learner-forms/123");
    expect(screen.getByText("Action Center")).toBeInTheDocument();
    expect(screen.getByText("Forms")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  test("renders Learner fallback for other learner endpoints", () => {
    renderWithRoleAndPath("learner", "/learner-other-page");
    expect(screen.getByText("Action Center")).toBeInTheDocument();
    expect(screen.getByText("Forms")).toBeInTheDocument();
  });

  // No role (null) tests
  test("renders default breadcrumb when role is null", () => {
    renderWithRoleAndPath(null, "/");
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
  });

  test("renders default breadcrumb when role is not set", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BreadcrumbHeader />
      </MemoryRouter>
    );
    expect(screen.getByText("Form Builder")).toBeInTheDocument();
  });

  // Logout functionality tests
  test("calls handleLogout and navigates to /login", () => {
    const onLogoutMock = jest.fn();
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "admin");
    
    renderWithRoleAndPath("admin", "/", onLogoutMock);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
    expect(onLogoutMock).toHaveBeenCalled();
  });

  test("calls handleLogout without onLogout callback", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "admin");
    
    renderWithRoleAndPath("admin", "/");

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
  });

  // Home icon and navigation tests
  test("renders home icon with correct alt text", () => {
    renderWithRoleAndPath("admin", "/");
    const homeIcon = screen.getByAltText("Home");
    expect(homeIcon).toBeInTheDocument();
  });

  test("renders arrow icons for breadcrumb separators", () => {
    renderWithRoleAndPath("admin", "/create-form");
    const arrowIcons = screen.getAllByAltText(">");
    expect(arrowIcons.length).toBeGreaterThan(0);
  });

  // Link functionality tests
  test("renders clickable links for non-current breadcrumbs", () => {
    renderWithRoleAndPath("learner", "/learner-forms/view/456");
    const actionCenterLink = screen.getByText("Action Center");
    const formsLink = screen.getByText("Forms");
    
    expect(actionCenterLink.closest('a')).toBeInTheDocument();
    expect(formsLink.closest('a')).toBeInTheDocument();
  });

  test("renders current breadcrumb without link", () => {
    renderWithRoleAndPath("admin", "/create-form");
    const currentCrumb = screen.getByText("Create Form");
    expect(currentCrumb).toBeInTheDocument();
    expect(currentCrumb.closest('a')).toBeNull();
  });

  test("home icon has correct aria-label", () => {
    renderWithRoleAndPath("admin", "/");
    const homeLink = screen.getByLabelText("Home");
    expect(homeLink).toBeInTheDocument();
  });

  test("breadcrumb container is rendered", () => {
    const { container } = renderWithRoleAndPath("admin", "/");
    const breadcrumbContainer = container.querySelector(".breadcrumb-container");
    expect(breadcrumbContainer).toBeInTheDocument();
  });

  test("logout button has correct class", () => {
    renderWithRoleAndPath("admin", "/");
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toHaveClass("logout-button");
  });
});
