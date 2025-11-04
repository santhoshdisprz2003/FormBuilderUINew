import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LearnerForms from "./LearnerForms";
import { getAllForms, getFormById } from "../api/formService";
import { getAllResponsesByLearner } from "../api/responses";

jest.mock("../api/formService");
jest.mock("../api/responses");

const mockPublishedForms = [
  {
    id: "form1",
    status: 1,
    publishedAt: "2024-01-15T10:30:00Z",
    config: {
      title: "Employee Feedback Form",
      description: "Share your feedback about the workplace",
    },
  },
  {
    id: "form2",
    status: "1",
    publishedAt: "2024-01-20T14:20:00Z",
    config: {
      title: "Training Assessment",
      description: "Evaluate your training experience",
    },
  },
];

const mockDraftForm = {
  id: "form3",
  status: 0,
  config: {
    title: "Draft Form",
    description: "This is a draft",
  },
};

const mockResponses = [
  {
    responseId: "resp1",
    formId: "form1",
    formTitle: "Employee Feedback Form",
    submittedAt: "2024-01-16T10:30:00Z",
    answers: [
      { questionId: "q1", answerText: "Great workplace" },
      { questionId: "q2", answerText: '["opt1"]' },
    ],
    files: [],
  },
  {
    responseId: "resp2",
    formId: "form2",
    formTitle: "Training Assessment",
    submittedAt: "2024-01-21T14:20:00Z",
    answers: [
      { questionId: "q1", answerText: "Excellent training" },
    ],
    files: [],
  },
];

const mockFormDetails = {
  id: "form1",
  config: {
    title: "Employee Feedback Form",
    description: "Share your feedback",
  },
  layout: {
    fields: [
      {
        questionId: "q1",
        label: "How do you rate the workplace?",
        type: "text",
        description: "Please provide details",
        descriptionEnabled: true,
      },
      {
        questionId: "q2",
        label: "Select your department",
        type: "drop-down",
        options: [
          { optionId: "opt1", value: "Engineering" },
          { optionId: "opt2", value: "Marketing" },
        ],
      },
      {
        questionId: "q3",
        label: "Upload document",
        type: "file-upload",
      },
    ],
  },
};

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <LearnerForms />
    </BrowserRouter>
  );
};

describe("LearnerForms - Rendering Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading and Error States", () => {
    test("renders loading state initially", () => {
      getAllForms.mockReturnValue(new Promise(() => {}));
      
      renderComponent();
      expect(screen.getByText("Loading forms...")).toBeInTheDocument();
    });

    test("renders error message on fetch failure", async () => {
      getAllForms.mockRejectedValue(new Error("API Error"));
      
      renderComponent();
      expect(await screen.findByText("Failed to load forms")).toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
    });

    test("renders both tabs correctly", async () => {
      renderComponent();
      expect(await screen.findByText("Self-Service Forms")).toBeInTheDocument();
      expect(screen.getByText("My Submissions")).toBeInTheDocument();
    });

    test("self-service tab is active by default", async () => {
      renderComponent();
      const selfServiceTab = await screen.findByText("Self-Service Forms");
      expect(selfServiceTab.closest("button")).toHaveClass("active");
    });

    test("switches to my submissions tab on click", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      
      fireEvent.click(mySubmissionsTab);
      
      expect(mySubmissionsTab.closest("button")).toHaveClass("active");
    });

    test("switches back to self-service tab on click", async () => {
      renderComponent();
      const selfServiceTab = await screen.findByText("Self-Service Forms");
      const mySubmissionsTab = await screen.findByText("My Submissions");
      
      fireEvent.click(mySubmissionsTab);
      fireEvent.click(selfServiceTab);
      
      expect(selfServiceTab.closest("button")).toHaveClass("active");
    });
  });

  describe("Self-Service Forms Tab", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
    });

    test("renders published forms in grid layout", async () => {
      renderComponent();
      expect(await screen.findByText("Employee Feedback Form")).toBeInTheDocument();
      expect(screen.getByText("Training Assessment")).toBeInTheDocument();
    });

    test("displays form titles correctly", async () => {
      renderComponent();
      expect(await screen.findByText("Employee Feedback Form")).toBeInTheDocument();
      expect(screen.getByText("Training Assessment")).toBeInTheDocument();
    });

    test("displays form descriptions correctly", async () => {
      renderComponent();
      expect(await screen.findByText("Share your feedback about the workplace")).toBeInTheDocument();
      expect(screen.getByText("Evaluate your training experience")).toBeInTheDocument();
    });

    test("displays formatted created dates", async () => {
      renderComponent();
      await screen.findByText("Employee Feedback Form");
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 20, 2024/)).toBeInTheDocument();
    });

    test("renders start completion buttons for each form", async () => {
      renderComponent();
      await screen.findByText("Employee Feedback Form");
      const buttons = screen.getAllByText("Start Completion");
      expect(buttons).toHaveLength(2);
    });

    test("filters out draft forms (status 0)", async () => {
      getAllForms.mockResolvedValue({ 
        data: [...mockPublishedForms, mockDraftForm] 
      });
      
      renderComponent();
      await screen.findByText("Employee Feedback Form");
      expect(screen.queryByText("Draft Form")).not.toBeInTheDocument();
    });

    test("shows message when no published forms available", async () => {
      getAllForms.mockResolvedValue({ data: [] });
      
      renderComponent();
      expect(await screen.findByText("No published forms available.")).toBeInTheDocument();
    });

    test("handles forms without description", async () => {
      const formWithoutDesc = {
        ...mockPublishedForms[0],
        config: { title: "Test Form" },
      };
      getAllForms.mockResolvedValue({ data: [formWithoutDesc] });
      
      renderComponent();
      expect(await screen.findByText("No description available")).toBeInTheDocument();
    });

    test("handles forms without published date", async () => {
      const formWithoutDate = {
        ...mockPublishedForms[0],
        publishedAt: null,
      };
      getAllForms.mockResolvedValue({ data: [formWithoutDate] });
      
      renderComponent();
      await screen.findByText("Employee Feedback Form");
      expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });
  });

  describe("My Submissions Tab", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
    });

    test("renders search input in submissions tab", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      expect(screen.getByPlaceholderText("Search forms...")).toBeInTheDocument();
    });

    test("renders submissions table headers", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      await waitFor(() => {
        expect(screen.getByText("Training Name")).toBeInTheDocument();
        expect(screen.getByText("Submitted On")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
      });
    });

    test("displays all submitted forms in table", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      await waitFor(() => {
        expect(screen.getByText("Employee Feedback Form")).toBeInTheDocument();
        expect(screen.getByText("Training Assessment")).toBeInTheDocument();
      });
    });

    test("displays formatted submission dates", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      await waitFor(() => {
        const dates = screen.getAllByText(/2024/);
        expect(dates.length).toBeGreaterThan(0);
      });
    });

    test("renders view buttons for each submission", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      await waitFor(() => {
        const viewButtons = screen.getAllByRole("button", { name: "View" });
        expect(viewButtons).toHaveLength(2);
      });
    });

    test("shows message when no submissions found", async () => {
      getAllResponsesByLearner.mockResolvedValue([]);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      await waitFor(() => {
        expect(screen.getByText("No submissions found.")).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
    });

    test("filters submissions by form title", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const searchInput = await screen.findByPlaceholderText("Search forms...");
      fireEvent.change(searchInput, { target: { value: "Employee" } });
      
      await waitFor(() => {
        expect(screen.getByText("Employee Feedback Form")).toBeInTheDocument();
        expect(screen.queryByText("Training Assessment")).not.toBeInTheDocument();
      });
    });

    test("search is case insensitive", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const searchInput = await screen.findByPlaceholderText("Search forms...");
      fireEvent.change(searchInput, { target: { value: "TRAINING" } });
      
      await waitFor(() => {
        expect(screen.getByText("Training Assessment")).toBeInTheDocument();
      });
    });

    test("shows all submissions when search is cleared", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const searchInput = await screen.findByPlaceholderText("Search forms...");
      fireEvent.change(searchInput, { target: { value: "Employee" } });
      fireEvent.change(searchInput, { target: { value: "" } });
      
      await waitFor(() => {
        expect(screen.getByText("Employee Feedback Form")).toBeInTheDocument();
        expect(screen.getByText("Training Assessment")).toBeInTheDocument();
      });
    });

    test("shows no results message when search has no matches", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const searchInput = await screen.findByPlaceholderText("Search forms...");
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
      
      await waitFor(() => {
        expect(screen.getByText("No submissions found.")).toBeInTheDocument();
      });
    });
  });

  describe("Response Modal", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("opens modal when view button is clicked", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Employee Feedback Form")).toBeInTheDocument();
      });
    });

    test("displays form title in modal", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Employee Feedback Form")).toBeInTheDocument();
      });
    });

    test("displays form description in modal", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Share your feedback")).toBeInTheDocument();
      });
    });

    test("renders close button in modal", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("✕")).toBeInTheDocument();
      });
    });

    test("closes modal when close button is clicked", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      const closeButton = await screen.findByText("✕");
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText("Share your feedback")).not.toBeInTheDocument();
      });
    });

    test("closes modal when overlay is clicked", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        const overlay = screen.getByText("Share your feedback").closest(".response-modal-overlay");
        fireEvent.click(overlay);
      });
      
      await waitFor(() => {
        expect(screen.queryByText("Share your feedback")).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal Questions Display", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("displays all questions in modal", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/How do you rate the workplace?/)).toBeInTheDocument();
        expect(screen.getByText(/Select your department/)).toBeInTheDocument();
      });
    });

    test("displays question numbers", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/1\./)).toBeInTheDocument();
        expect(screen.getByText(/2\./)).toBeInTheDocument();
      });
    });

    test("displays question descriptions when enabled", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Please provide details")).toBeInTheDocument();
      });
    });

    test("displays text answers correctly", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Great workplace")).toBeInTheDocument();
      });
    });

    test("displays 'No response' for unanswered questions", async () => {
      const responseWithMissing = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q1", answerText: "Great workplace" }],
        },
      ];
      getAllResponsesByLearner.mockResolvedValue(responseWithMissing);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("No response")).toBeInTheDocument();
      });
    });
  });

  describe("Dropdown and Checkbox Answers", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getAllResponsesByLearner.mockResolvedValue(mockResponses);
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("displays dropdown option values instead of IDs", async () => {
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Engineering")).toBeInTheDocument();
      });
    });

    test("handles multiple checkbox selections", async () => {
      const responseWithMultiple = [
        {
          ...mockResponses[0],
          answers: [
            { questionId: "q2", answerText: '["opt1","opt2"]' },
          ],
        },
      ];
      getAllResponsesByLearner.mockResolvedValue(responseWithMultiple);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("Engineering, Marketing")).toBeInTheDocument();
      });
    });

    test("handles invalid JSON in answer text gracefully", async () => {
      const responseWithInvalidJSON = [
        {
          ...mockResponses[0],
          answers: [
            { questionId: "q2", answerText: "invalid json" },
          ],
        },
      ];
      getAllResponsesByLearner.mockResolvedValue(responseWithInvalidJSON);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("invalid json")).toBeInTheDocument();
      });
    });
  });

  describe("File Upload Display", () => {
    beforeEach(() => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      getFormById.mockResolvedValue(mockFormDetails);
    });

    test("displays file download link when file is uploaded", async () => {
      const responseWithFile = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q3", answerText: "" }],
          files: [
            {
              questionId: "q3",
              fileName: "document.pdf",
              fileType: "application/pdf",
              base64Content: btoa("test content"),
            },
          ],
        },
      ];
      getAllResponsesByLearner.mockResolvedValue(responseWithFile);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("document.pdf")).toBeInTheDocument();
      });
    });

    test("displays 'No file uploaded' when no file is present", async () => {
      const responseWithoutFile = [
        {
          ...mockResponses[0],
          answers: [{ questionId: "q3", answerText: "" }],
          files: [],
        },
      ];
      getAllResponsesByLearner.mockResolvedValue(responseWithoutFile);
      
      renderComponent();
      const mySubmissionsTab = await screen.findByText("My Submissions");
      fireEvent.click(mySubmissionsTab);
      
      const viewButtons = await screen.findAllByRole("button", { name: "View" });
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText("No file uploaded")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles forms with status as string '1'", async () => {
      getAllForms.mockResolvedValue({ data: mockPublishedForms });
      
      renderComponent();
      expect(await screen.findByText("Training Assessment")).toBeInTheDocument();
    });

    test("handles empty form data response", async () => {
      getAllForms.mockResolvedValue({ data: null });
      
      renderComponent();
      await waitFor(() => {
        expect(screen.queryByText("Employee Feedback Form")).not.toBeInTheDocument();
      });
    });

    test("handles form without config object", async () => {
      const formWithoutConfig = {
        id: "form1",
        status: 1,
        publishedAt: "2024-01-15T10:30:00Z",
      };
      getAllForms.mockResolvedValue({ data: [formWithoutConfig] });
      
      renderComponent();
      expect(await screen.findByText("Untitled Form")).toBeInTheDocument();
    });
  });
});
