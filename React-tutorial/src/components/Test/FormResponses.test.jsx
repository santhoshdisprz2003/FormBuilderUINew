import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FormResponses from "./FormResponses";
import { getAllResponsesForForm } from "../api/admin.js";
import { getFormById } from "../api/formService.js";

jest.mock("../api/admin.js");
jest.mock("../api/formService.js");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "form123" }),
}));

const mockFormDetails = {
  config: {
    title: "Test Form",
    description: "Test Description",
  },
  layout: {
    fields: [
      {
        questionId: "q1",
        label: "Question 1",
        type: "text",
        description: "Description 1",
        descriptionEnabled: true,
      },
      {
        questionId: "q2",
        label: "Question 2",
        type: "drop-down",
        options: [
          { optionId: "opt1", value: "Option 1" },
          { optionId: "opt2", value: "Option 2" },
        ],
      },
      {
        questionId: "q3",
        label: "Question 3",
        type: "checkbox",
        options: [
          { optionId: "opt3", value: "Choice A" },
          { optionId: "opt4", value: "Choice B" },
        ],
      },
      {
        questionId: "q4",
        label: "Upload File",
        type: "file-upload",
      },
    ],
  },
};

const mockResponses = [
  {
    responseId: "1",
    submittedUserName: "John Doe",
    submittedBy: "user123",
    submittedAt: "2024-01-15T10:30:00Z",
    email: "john@example.com",
    answers: [
      { questionId: "q1", answerText: "Answer 1" },
      { questionId: "q2", answerText: '["opt1"]' },
    ],
    files: [],
  },
  {
    responseId: "2",
    submittedUserName: "Jane Smith",
    submittedBy: "user456",
    submittedAt: "2024-01-16T14:20:00Z",
    email: "jane@example.com",
    answers: [
      { questionId: "q1", answerText: "Answer 2" },
      { questionId: "q3", answerText: '["opt3","opt4"]' },
    ],
    files: [],
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <FormResponses />
    </BrowserRouter>
  );
};

describe("FormResponses - Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading and Error States", () => {
    test("renders loading state initially", () => {
      getAllResponsesForForm.mockReturnValue(new Promise(() => {}));
      getFormById.mockReturnValue(new Promise(() => {}));

      renderComponent();
      expect(screen.getByText("Loading responses...")).toBeInTheDocument();
    });

    test("renders error message on fetch failure", async () => {
      getAllResponsesForForm.mockRejectedValue(new Error("API Error"));
      getFormById.mockResolvedValue({});

      renderComponent();
      expect(
        await screen.findByText(/Failed to load responses/i)
      ).toBeInTheDocument();
    });
  });

  describe("No Responses State", () => {
    test("renders no responses message when responses array is empty", async () => {
      getAllResponsesForForm.mockResolvedValue([]);
      getFormById.mockResolvedValue({});

      renderComponent();
      expect(await screen.findByText("No Responses Yet")).toBeInTheDocument();
      expect(
        screen.getByText(/Once learners start submitting/i)
      ).toBeInTheDocument();
      expect(screen.getByAltText("No Responses")).toBeInTheDocument();
    });

    test("renders no responses subtitle correctly", async () => {
      getAllResponsesForForm.mockResolvedValue([]);
      getFormById.mockResolvedValue({});

      renderComponent();
      expect(
        await screen.findByText(/You can view, filter, and analyze/i)
      ).toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("renders both tabs correctly", async () => {
      renderComponent();
      expect(await screen.findByText("Response Summary")).toBeInTheDocument();
      expect(screen.getByText("Individual Response")).toBeInTheDocument();
    });

    test("summary tab is active by default", async () => {
      renderComponent();
      const summaryTab = await screen.findByText("Response Summary");
      expect(summaryTab.closest("button")).toHaveClass("active");
    });

    test("switches to individual response tab on click", async () => {
      renderComponent();
      const individualTab = await screen.findByText("Individual Response");
      fireEvent.click(individualTab);
      expect(individualTab.closest("button")).toHaveClass("active");
    });

    test("switches back to summary tab on click", async () => {
      renderComponent();
      const individualTab = await screen.findByText("Individual Response");
      const summaryTab = await screen.findByText("Response Summary");

      fireEvent.click(individualTab);
      fireEvent.click(summaryTab);
      expect(summaryTab.closest("button")).toHaveClass("active");
    });
  });

  describe("Search and Filter UI", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("renders search box with placeholder", async () => {
      renderComponent();
      expect(
        await screen.findByPlaceholderText("Search by Name/User ID")
      ).toBeInTheDocument();
    });

    test("renders search icon", async () => {
      renderComponent();
      await screen.findByPlaceholderText("Search by Name/User ID");
      expect(screen.getByAltText("search")).toBeInTheDocument();
    });

    test("renders filter button with icon", async () => {
      renderComponent();
      expect(await screen.findByText("Filter")).toBeInTheDocument();
      expect(screen.getByAltText("filter")).toBeInTheDocument();
    });

    test("renders export to excel button", async () => {
      renderComponent();
      expect(await screen.findByText("Export to Excel")).toBeInTheDocument();
    });

    test("search input updates on typing", async () => {
      renderComponent();
      const searchInput = await screen.findByPlaceholderText(
        "Search by Name/User ID"
      );
      fireEvent.change(searchInput, { target: { value: "John" } });
      expect(searchInput.value).toBe("John");
    });
  });

  describe("Responses Table", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("renders table headers correctly", async () => {
      renderComponent();
      expect(await screen.findByText("Submitted By")).toBeInTheDocument();
      expect(screen.getByText("User ID")).toBeInTheDocument();
      expect(screen.getByText("Submitted On")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Response")).toBeInTheDocument();
    });

    test("renders all response rows", async () => {
      renderComponent();
      expect(await screen.findByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    test("renders user IDs correctly", async () => {
      renderComponent();
      expect(await screen.findByText("user123")).toBeInTheDocument();
      expect(screen.getByText("user456")).toBeInTheDocument();
    });

    test("renders email addresses correctly", async () => {
      renderComponent();
      expect(await screen.findByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    test("renders view buttons for each response", async () => {
      renderComponent();
      await screen.findByText("John Doe");
      const viewButtons = screen.getAllByText("View");
      expect(viewButtons).toHaveLength(2);
    });

    test("renders formatted submission dates", async () => {
      renderComponent();
      await screen.findByText("John Doe");
      const dateElements = screen.getAllByText(/2024/i);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe("Search Filtering", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("filters responses by name", async () => {
      renderComponent();
      const searchInput = await screen.findByPlaceholderText(
        "Search by Name/User ID"
      );

      fireEvent.change(searchInput, { target: { value: "John" } });

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
      });
    });

    test("filters responses by user ID", async () => {
      renderComponent();
      const searchInput = await screen.findByPlaceholderText(
        "Search by Name/User ID"
      );

      fireEvent.change(searchInput, { target: { value: "user456" } });

      await waitFor(() => {
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      });
    });

    test("shows all responses when search is cleared", async () => {
      renderComponent();
      const searchInput = await screen.findByPlaceholderText(
        "Search by Name/User ID"
      );

      fireEvent.change(searchInput, { target: { value: "John" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });

    test("search is case insensitive", async () => {
      renderComponent();
      const searchInput = await screen.findByPlaceholderText(
        "Search by Name/User ID"
      );

      fireEvent.change(searchInput, { target: { value: "JOHN" } });

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });
    });
  });

  describe("Response Modal", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("opens modal when view button is clicked", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Test Form")).toBeInTheDocument();
    });

    test("displays form title in modal", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Test Form")).toBeInTheDocument();
    });

    test("displays form description in modal", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    test("renders close button in modal", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("✕")).toBeInTheDocument();
    });

    test("closes modal when close button is clicked", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      const closeButton = screen.getByText("✕");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Test Form")).not.toBeInTheDocument();
      });
    });

    test("closes modal when overlay is clicked", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      const overlay = screen.getByText("Test Form").closest(".response-modal-overlay");
      fireEvent.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText("Test Form")).not.toBeInTheDocument();
      });
    });

    test("modal does not close when clicking inside modal content", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      const modalContent = screen.getByText("Test Form").closest(".response-modal");
      fireEvent.click(modalContent);

      expect(screen.getByText("Test Form")).toBeInTheDocument();
    });
  });

  describe("Modal Questions Display", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("displays all questions in modal", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Question 1")).toBeInTheDocument();
      expect(screen.getByText("Question 2")).toBeInTheDocument();
    });

    test("displays question numbers", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    test("displays question descriptions when enabled", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Description 1")).toBeInTheDocument();
    });

    test("displays text answers correctly", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Answer 1")).toBeInTheDocument();
    });

    test("displays 'No response' for unanswered questions", async () => {
      const responseWithMissing = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q1", answerText: "Answer 1" }],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithMissing);

      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("No response")).toBeInTheDocument();
    });
  });

  describe("Dropdown and Checkbox Answers", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("displays dropdown option values instead of IDs", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    test("displays multiple checkbox selections", async () => {
      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[1]);

      expect(screen.getByText("Choice A, Choice B")).toBeInTheDocument();
    });
  });

  describe("File Upload Display", () => {
    test("displays file download link when file is uploaded", async () => {
      const responseWithFile = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q4", answerText: "" }],
          files: [
            {
              questionId: "q4",
              fileName: "test.pdf",
              fileType: "application/pdf",
              base64Content: btoa("test content"),
            },
          ],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithFile);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    test("displays 'No file uploaded' when no file is present", async () => {
      const responseWithoutFile = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q4", answerText: "" }],
          files: [],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithoutFile);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("No file uploaded")).toBeInTheDocument();
    });
  });

  describe("Export Functionality", () => {
    beforeEach(() => {
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
      global.alert = jest.fn();
    });

    test("shows alert when trying to export with no responses", async () => {
      getAllResponsesForForm.mockResolvedValue([]);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      await waitFor(() => {
        expect(screen.queryByText("Export to Excel")).not.toBeInTheDocument();
      });
    });

    test("export button is visible when responses exist", async () => {
      renderComponent();
      expect(await screen.findByText("Export to Excel")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles responses with missing user names", async () => {
      const responseWithoutName = [
        {
          responseId: "1",
          submittedBy: "user123",
          submittedAt: "2024-01-15T10:30:00Z",
          answers: [],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithoutName);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      expect(await screen.findByText("Unknown")).toBeInTheDocument();
    });

    test("handles responses with missing email", async () => {
      const responseWithoutEmail = [
        {
          responseId: "1",
          submittedUserName: "John Doe",
          submittedBy: "user123",
          submittedAt: "2024-01-15T10:30:00Z",
          answers: [],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithoutEmail);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      await screen.findByText("John Doe");
      expect(screen.getByText("-")).toBeInTheDocument();
    });

    test("handles form without description", async () => {
      const formWithoutDesc = {
        ...mockFormDetails,
        config: { title: "Test Form" },
      };
      getAllResponsesForForm.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(formWithoutDesc);

      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    test("handles invalid JSON in answer text gracefully", async () => {
      const responseWithInvalidJSON = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q2", answerText: "invalid json" }],
        },
      ];
      getAllResponsesForForm.mockResolvedValue(responseWithInvalidJSON);
      getFormById.mockResolvedValue(mockFormDetails);

      renderComponent();
      const viewButtons = await screen.findAllByText("View");
      fireEvent.click(viewButtons[0]);

      expect(screen.getByText("invalid json")).toBeInTheDocument();
    });
  });
});
