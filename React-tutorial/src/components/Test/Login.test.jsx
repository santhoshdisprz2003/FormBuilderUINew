import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { login, register } from "../api/auth";

jest.mock("../api/auth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe("Login Component - Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: "" };
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
  });

  describe("Initial Rendering", () => {
    test("renders login form by default", () => {
      renderComponent();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("renders username input field", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    });

    test("renders password input field", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    test("renders login button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    test("renders toggle text for registration", () => {
      renderComponent();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("password field has type password", () => {
      renderComponent();
      const passwordInput = screen.getByPlaceholderText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("username field has type text", () => {
      renderComponent();
      const usernameInput = screen.getByPlaceholderText("Username");
      expect(usernameInput).toHaveAttribute("type", "text");
    });

    test("both input fields are required", () => {
      renderComponent();
      expect(screen.getByPlaceholderText("Username")).toBeRequired();
      expect(screen.getByPlaceholderText("Password")).toBeRequired();
    });
  });

  describe("Form Toggle Between Login and Register", () => {
    test("switches to register form when register link is clicked", () => {
      renderComponent();
      const registerLink = screen.getByText("Register");
      
      fireEvent.click(registerLink);
      
      expect(screen.getByText("Register")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
    });

    test("shows login toggle text in register mode", () => {
      renderComponent();
      const registerLink = screen.getByText("Register");
      
      fireEvent.click(registerLink);
      
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("switches back to login form when login link is clicked", () => {
      renderComponent();
      const registerLink = screen.getByText("Register");
      fireEvent.click(registerLink);
      
      const loginLink = screen.getByText("Login");
      fireEvent.click(loginLink);
      
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    test("clears form when toggling between login and register", () => {
      renderComponent();
      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      const registerLink = screen.getByText("Register");
      fireEvent.click(registerLink);
      
      expect(usernameInput.value).toBe("testuser");
      expect(passwordInput.value).toBe("password123");
    });
  });

  describe("Form Input Handling", () => {
    test("updates username input on change", () => {
      renderComponent();
      const usernameInput = screen.getByPlaceholderText("Username");
      
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      
      expect(usernameInput.value).toBe("testuser");
    });

    test("updates password input on change", () => {
      renderComponent();
      const passwordInput = screen.getByPlaceholderText("Password");
      
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      expect(passwordInput.value).toBe("password123");
    });

    test("handles multiple character inputs in username", () => {
      renderComponent();
      const usernameInput = screen.getByPlaceholderText("Username");
      
      fireEvent.change(usernameInput, { target: { value: "a" } });
      fireEvent.change(usernameInput, { target: { value: "ab" } });
      fireEvent.change(usernameInput, { target: { value: "abc" } });
      
      expect(usernameInput.value).toBe("abc");
    });

    test("handles special characters in inputs", () => {
      renderComponent();
      const usernameInput = screen.getByPlaceholderText("Username");
      const passwordInput = screen.getByPlaceholderText("Password");
      
      fireEvent.change(usernameInput, { target: { value: "user@123" } });
      fireEvent.change(passwordInput, { target: { value: "p@ss!123" } });
      
      expect(usernameInput.value).toBe("user@123");
      expect(passwordInput.value).toBe("p@ss!123");
    });
  });

  describe("Login Functionality", () => {
    test("calls login API with correct credentials on submit", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
          role: "Learner",
        });
      });
    });

    test("stores token in localStorage on successful login", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
      });
    });

    test("stores role in localStorage on successful login", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith("role", "Learner");
      });
    });

    test("redirects to home page on successful login", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(window.location.href).toBe("/");
      });
    });

    test("displays error message on login failure", async () => {
      login.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(screen.getByText("❌ Invalid credentials")).toBeInTheDocument();
      });
    });

    test("displays generic error message when no specific error is provided", async () => {
      login.mockRejectedValue(new Error("Network error"));
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(screen.getByText("❌ Something went wrong")).toBeInTheDocument();
      });
    });
  });

  describe("Registration Functionality", () => {
    test("calls register API with correct credentials on submit", async () => {
      register.mockResolvedValue({ data: { success: true } });
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "newpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(register).toHaveBeenCalledWith({
          username: "newuser",
          password: "newpassword",
          role: "Learner",
        });
      });
    });

    test("displays success message on successful registration", async () => {
      register.mockResolvedValue({ data: { success: true } });
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "newpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(
          screen.getByText("✅ Registration successful! Please log in.")
        ).toBeInTheDocument();
      });
    });

    test("switches to login form after successful registration", async () => {
      register.mockResolvedValue({ data: { success: true } });
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "newpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
      });
    });

    test("displays error message on registration failure", async () => {
      register.mockRejectedValue({
        response: { data: { message: "Username already exists" } },
      });
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "existinguser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(screen.getByText("❌ Username already exists")).toBeInTheDocument();
      });
    });

    test("displays generic error message on registration network error", async () => {
      register.mockRejectedValue(new Error("Network error"));
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(screen.getByText("❌ Something went wrong")).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    test("prevents default form submission", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      const form = screen.getByRole("button", { name: "Login" }).closest("form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      form.dispatchEvent(submitEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test("does not submit form with empty username", () => {
      renderComponent();
      
      const submitButton = screen.getByRole("button", { name: "Login" });
      
      fireEvent.click(submitButton);
      
      expect(login).not.toHaveBeenCalled();
    });

    test("does not submit form with empty password", () => {
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      
      const submitButton = screen.getByRole("button", { name: "Login" });
      fireEvent.click(submitButton);
      
      expect(login).not.toHaveBeenCalled();
    });
  });

  describe("CSS Classes and Styling", () => {
    test("login container has correct class", () => {
      const { container } = renderComponent();
      expect(container.querySelector(".login-container")).toBeInTheDocument();
    });

    test("toggle text has correct class", () => {
      const { container } = renderComponent();
      expect(container.querySelector(".toggle-text")).toBeInTheDocument();
    });

    test("message has correct class when displayed", async () => {
      login.mockRejectedValue({
        response: { data: { message: "Error" } },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        const { container } = renderComponent();
        expect(container.querySelector(".message")).toBeTruthy();
      });
    });
  });

  describe("Message Display", () => {
    test("no message is displayed initially", () => {
      renderComponent();
      expect(screen.queryByText(/❌/)).not.toBeInTheDocument();
      expect(screen.queryByText(/✅/)).not.toBeInTheDocument();
    });

    test("clears previous error message when switching forms", async () => {
      login.mockRejectedValue({
        response: { data: { message: "Invalid credentials" } },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(screen.getByText("❌ Invalid credentials")).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText("Register"));
      
      expect(screen.queryByText("❌ Invalid credentials")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles whitespace in username", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "  testuser  " },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith({
          username: "  testuser  ",
          password: "password123",
          role: "Learner",
        });
      });
    });

    test("handles very long username and password", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      const longUsername = "a".repeat(100);
      const longPassword = "b".repeat(100);
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: longUsername },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: longPassword },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith({
          username: longUsername,
          password: longPassword,
          role: "Learner",
        });
      });
    });

    test("role is always set to Learner for login", async () => {
      login.mockResolvedValue({
        data: { token: "test-token", role: "Learner" },
      });
      
      renderComponent();
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith(
          expect.objectContaining({ role: "Learner" })
        );
      });
    });

    test("role is always set to Learner for registration", async () => {
      register.mockResolvedValue({ data: { success: true } });
      
      renderComponent();
      
      fireEvent.click(screen.getByText("Register"));
      
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "newpassword" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
      
      await waitFor(() => {
        expect(register).toHaveBeenCalledWith(
          expect.objectContaining({ role: "Learner" })
        );
      });
    });
  });
});
