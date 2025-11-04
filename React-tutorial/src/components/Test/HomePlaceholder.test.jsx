import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePlaceholder from "./HomePlaceholder";

describe("HomePlaceholder - Rendering Tests", () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("renders the component without crashing", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      expect(screen.getByText("Create a Form Template")).toBeInTheDocument();
    });

    test("renders the home avatar image", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const image = screen.getByAltText("Create Form");
      expect(image).toBeInTheDocument();
      expect(image).toHaveClass("home-avatar");
    });

    test("renders the correct heading text", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      expect(screen.getByText("Create a Form Template")).toBeInTheDocument();
    });

    test("renders the correct description text", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      expect(
        screen.getByText("Create templates that can be used in various other features.")
      ).toBeInTheDocument();
    });

    test("renders the create form button", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const button = screen.getByText("Create Form");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("create-button");
    });
  });

  describe("Button Interaction", () => {
    test("calls onCreate when create button is clicked", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const button = screen.getByText("Create Form");
      
      fireEvent.click(button);
      
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    test("calls onCreate multiple times on multiple clicks", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const button = screen.getByText("Create Form");
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnCreate).toHaveBeenCalledTimes(3);
    });

    test("does not call onCreate on initial render", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      expect(mockOnCreate).not.toHaveBeenCalled();
    });
  });

  describe("CSS Classes", () => {
    test("container has correct class", () => {
      const { container } = render(<HomePlaceholder onCreate={mockOnCreate} />);
      expect(container.querySelector(".container")).toBeInTheDocument();
    });

    test("image has correct class", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const image = screen.getByAltText("Create Form");
      expect(image).toHaveClass("home-avatar");
    });

    test("button has correct class", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const button = screen.getByText("Create Form");
      expect(button).toHaveClass("create-button");
    });
  });

  describe("Image Properties", () => {
    test("image has correct src attribute", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const image = screen.getByAltText("Create Form");
      expect(image).toHaveAttribute("src");
      expect(image.src).toContain("home_avatar");
    });

    test("image has correct alt text", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const image = screen.getByAltText("Create Form");
      expect(image).toHaveAttribute("alt", "Create Form");
    });
  });

  describe("Text Content", () => {
    test("heading is rendered as h2 element", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const heading = screen.getByText("Create a Form Template");
      expect(heading.tagName).toBe("H2");
    });

    test("description is rendered as p element", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const description = screen.getByText(
        "Create templates that can be used in various other features."
      );
      expect(description.tagName).toBe("P");
    });
  });

  describe("Edge Cases", () => {
    test("renders correctly when onCreate is undefined", () => {
      render(<HomePlaceholder onCreate={undefined} />);
      expect(screen.getByText("Create a Form Template")).toBeInTheDocument();
    });

    test("renders correctly when onCreate is null", () => {
      render(<HomePlaceholder onCreate={null} />);
      expect(screen.getByText("Create a Form Template")).toBeInTheDocument();
    });

    test("button click does not throw error when onCreate is undefined", () => {
      render(<HomePlaceholder onCreate={undefined} />);
      const button = screen.getByText("Create Form");
      
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("Component Structure", () => {
    test("renders all elements in correct order", () => {
      const { container } = render(<HomePlaceholder onCreate={mockOnCreate} />);
      const elements = container.querySelectorAll(".container > *");
      
      expect(elements[0].tagName).toBe("IMG");
      expect(elements[1].tagName).toBe("H2");
      expect(elements[2].tagName).toBe("P");
      expect(elements[3].tagName).toBe("BUTTON");
    });

    test("container wraps all child elements", () => {
      const { container } = render(<HomePlaceholder onCreate={mockOnCreate} />);
      const containerDiv = container.querySelector(".container");
      
      expect(containerDiv.children.length).toBe(4);
    });
  });

  describe("Accessibility", () => {
    test("button is accessible and clickable", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const button = screen.getByRole("button", { name: "Create Form" });
      
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    test("image has descriptive alt text", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const image = screen.getByRole("img");
      
      expect(image).toHaveAttribute("alt", "Create Form");
    });

    test("heading is properly structured", () => {
      render(<HomePlaceholder onCreate={mockOnCreate} />);
      const heading = screen.getByRole("heading", { level: 2 });
      
      expect(heading).toHaveTextContent("Create a Form Template");
    });
  });
});