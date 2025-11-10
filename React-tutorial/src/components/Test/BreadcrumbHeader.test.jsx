import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BreadcrumbHeader from "../BreadcrumbHeader";

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock images
jest.mock("../../assets/home.png", () => "home.png");
jest.mock("../../assets/AltArrowRight.png", () => "arrow.png");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper function to render component
const renderBreadcrumb = (role, path, onLogout) => {
  if (role !== undefined) {
    localStorage.setItem("role", role);
  }
  // Provide default path if undefined
  const initialPath = path !== undefined ? path : "/";
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BreadcrumbHeader onLogout={onLogout} />
    </MemoryRouter>
  );
};

describe("BreadcrumbHeader Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // ========== ADMIN ROLE TESTS ==========
  describe("Admin Role", () => {
    test("shows 'Form Builder' at root path", () => {
      renderBreadcrumb("admin", "/");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });

    test("shows 'Form Builder > Create Form' at /create-form", () => {
      renderBreadcrumb("admin", "/create-form");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
      expect(screen.getByText("Create Form")).toBeInTheDocument();
    });

    test("shows 'Form Builder > Edit Form' at /form-builder/edit/123", () => {
      renderBreadcrumb("admin", "/form-builder/edit/123");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
      expect(screen.getByText("Edit Form")).toBeInTheDocument();
    });

    test("shows 'Form Builder > View Form' at /form-builder/view/abc", () => {
      renderBreadcrumb("admin", "/form-builder/view/abc");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
      expect(screen.getByText("View Form")).toBeInTheDocument();
    });

    test("shows 'Form Builder' at /form-builder", () => {
      renderBreadcrumb("admin", "/form-builder");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });

    test("shows 'Form Builder' for unknown admin paths", () => {
      renderBreadcrumb("admin", "/unknown-path");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });
  });

  // ========== LEARNER ROLE TESTS ==========
  describe("Learner Role", () => {
    test("shows 'Action Center > Forms' at root path", () => {
      renderBreadcrumb("learner", "/");
      expect(screen.getByText("Action Center")).toBeInTheDocument();
      expect(screen.getByText("Forms")).toBeInTheDocument();
    });

    test("shows 'Action Center > Forms' at /learner-forms", () => {
      renderBreadcrumb("learner", "/learner-forms");
      expect(screen.getByText("Action Center")).toBeInTheDocument();
      expect(screen.getByText("Forms")).toBeInTheDocument();
    });

    test("shows 'Action Center > Forms > View' at /learner-forms/123", () => {
      renderBreadcrumb("learner", "/learner-forms/123");
      expect(screen.getByText("Action Center")).toBeInTheDocument();
      expect(screen.getByText("Forms")).toBeInTheDocument();
      expect(screen.getByText("View")).toBeInTheDocument();
    });

    test("shows 'Action Center > Forms > View' at /learner-forms/view/456", () => {
      renderBreadcrumb("learner", "/learner-forms/view/456");
      expect(screen.getByText("Action Center")).toBeInTheDocument();
      expect(screen.getByText("Forms")).toBeInTheDocument();
      expect(screen.getByText("View")).toBeInTheDocument();
    });

    test("shows 'Action Center > Forms' for other learner paths", () => {
      renderBreadcrumb("learner", "/learner-other");
      expect(screen.getByText("Action Center")).toBeInTheDocument();
      expect(screen.getByText("Forms")).toBeInTheDocument();
    });
  });

  // ========== NO ROLE / DEFAULT TESTS ==========
  describe("No Role or Null Role", () => {
    test("defaults to 'Form Builder' when role is null", () => {
      renderBreadcrumb(null, "/");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });

    test("defaults to 'Form Builder' when no role is set", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <BreadcrumbHeader />
        </MemoryRouter>
      );
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });
  });

  // ========== LOGOUT FUNCTIONALITY ==========
  describe("Logout Functionality", () => {
    test("clears localStorage and navigates to /login on logout", () => {
      localStorage.setItem("token", "test-token");
      localStorage.setItem("role", "admin");

      renderBreadcrumb("admin", "/");
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("role")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("calls onLogout callback if provided", () => {
      const onLogoutMock = jest.fn();
      renderBreadcrumb("admin", "/", onLogoutMock);

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(onLogoutMock).toHaveBeenCalledTimes(1);
    });

    test("works without onLogout callback", () => {
      renderBreadcrumb("admin", "/");
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      
      expect(() => fireEvent.click(logoutButton)).not.toThrow();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  // ========== HOME ICON ==========
  describe("Home Icon", () => {
    test("renders home icon with correct alt text", () => {
      renderBreadcrumb("admin", "/");
      expect(screen.getByAltText("Home")).toBeInTheDocument();
    });

    test("home icon links to root path", () => {
      renderBreadcrumb("admin", "/create-form");
      const homeLink = screen.getByLabelText("Home");
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  // ========== ARROW ICONS ==========
  describe("Arrow Icons", () => {
    test("renders arrow icons as separators", () => {
      renderBreadcrumb("admin", "/create-form");
      const arrows = screen.getAllByAltText(">");
      expect(arrows.length).toBeGreaterThan(0);
    });

    test("renders correct number of arrows for breadcrumb depth", () => {
      renderBreadcrumb("learner", "/learner-forms/view/123");
      const arrows = screen.getAllByAltText(">");
      expect(arrows).toHaveLength(3); // One before each crumb
    });
  });

  // ========== BREADCRUMB LINKS ==========
  describe("Breadcrumb Links", () => {
    test("non-current breadcrumbs are clickable links", () => {
      renderBreadcrumb("admin", "/create-form");
      const formBuilderLink = screen.getByText("Form Builder");
      expect(formBuilderLink.closest("a")).toHaveAttribute("href", "/");
    });

    test("current breadcrumb is not a link", () => {
      renderBreadcrumb("admin", "/create-form");
      const currentCrumb = screen.getByText("Create Form");
      expect(currentCrumb.closest("a")).toBeNull();
    });

    test("learner breadcrumbs have correct links", () => {
      renderBreadcrumb("learner", "/learner-forms/view/123");
      
      const actionCenter = screen.getByText("Action Center");
      expect(actionCenter.closest("a")).toHaveAttribute("href", "/");
      
      const forms = screen.getByText("Forms");
      expect(forms.closest("a")).toHaveAttribute("href", "/learner-forms");
      
      const view = screen.getByText("View");
      expect(view.closest("a")).toBeNull(); // Current, not a link
    });
  });

  // ========== CSS CLASSES ==========
  describe("CSS Classes", () => {
    test("renders with breadcrumb-header class", () => {
      const { container } = renderBreadcrumb("admin", "/");
      expect(container.querySelector(".breadcrumb-header")).toBeInTheDocument();
    });

    test("renders with breadcrumb-container class", () => {
      const { container } = renderBreadcrumb("admin", "/");
      expect(container.querySelector(".breadcrumb-container")).toBeInTheDocument();
    });

    test("logout button has logout-button class", () => {
      renderBreadcrumb("admin", "/");
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toHaveClass("logout-button");
    });

    test("home icon has home-icon class", () => {
      renderBreadcrumb("admin", "/");
      const homeIcon = screen.getByAltText("Home");
      expect(homeIcon).toHaveClass("home-icon");
    });

    test("arrow icons have arrow-icon class", () => {
      renderBreadcrumb("admin", "/create-form");
      const arrows = screen.getAllByAltText(">");
      arrows.forEach(arrow => {
        expect(arrow).toHaveClass("arrow-icon");
      });
    });

    test("current breadcrumb has breadcrumb-current class", () => {
      renderBreadcrumb("admin", "/create-form");
      const currentCrumb = screen.getByText("Create Form");
      expect(currentCrumb).toHaveClass("breadcrumb-current");
    });

    test("breadcrumb links have breadcrumb-link class", () => {
      renderBreadcrumb("admin", "/create-form");
      const link = screen.getByText("Form Builder");
      expect(link).toHaveClass("breadcrumb-link");
    });
  });

  // ========== EDGE CASES ==========
  describe("Edge Cases", () => {
    test("handles empty string path", () => {
      renderBreadcrumb("admin", "");
      expect(screen.getByText("Form Builder")).toBeInTheDocument();
    });

    test("logout button is rendered for admin role", () => {
      renderBreadcrumb("admin", "/");
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    test("logout button is rendered for learner role", () => {
      renderBreadcrumb("learner", "/");
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
