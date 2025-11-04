import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuestionCard from "./QuestionCard";

describe("QuestionCard Component - Rendering Tests", () => {
  const mockOnDelete = jest.fn();
  const mockOnCopy = jest.fn();
  const mockOnUpdate = jest.fn();

  const defaultField = {
    questionId: "q1",
    type: "text",
    label: "Test Question",
    description: "Test Description",
    description_enabled: false,
    required: false,
    maxChar: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    test("renders question card component", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByPlaceholderText("Untitled Question")).toBeInTheDocument();
    });

    test("renders question input with initial value", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      expect(input.value).toBe("Test Question");
    });

    test("renders character count for question", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("13/150")).toBeInTheDocument();
    });

    test("renders copy button with icon", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByAltText("copy")).toBeInTheDocument();
    });

    test("renders delete button with icon", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByAltText("delete")).toBeInTheDocument();
    });

    test("renders description toggle", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    test("renders required toggle", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
  });

  describe("Question Input Handling", () => {
    test("updates question text on input change", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      
      fireEvent.change(input, { target: { value: "New Question" } });
      
      expect(input.value).toBe("New Question");
    });

    test("updates character count when typing", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      
      fireEvent.change(input, { target: { value: "Hello" } });
      
      expect(screen.getByText("5/150")).toBeInTheDocument();
    });

    test("enforces max character limit of 150", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      
      expect(input).toHaveAttribute("maxLength", "150");
    });

    test("calls onUpdate when question changes", async () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      
      fireEvent.change(input, { target: { value: "Updated Question" } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });
  });

  describe("Description Toggle and Input", () => {
    test("description input is hidden by default", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.queryByPlaceholderText("Enter description")).not.toBeInTheDocument();
    });

    test("shows description input when toggle is enabled", () => {
      const fieldWithDesc = { ...defaultField, description_enabled: true };
      render(
        <QuestionCard
          field={fieldWithDesc}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
    });

    test("toggles description input on switch click", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const toggles = screen.getAllByRole("checkbox");
      const descriptionToggle = toggles[0];
      
      fireEvent.click(descriptionToggle);
      
      expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
    });

    test("updates description text on input change", () => {
      const fieldWithDesc = { ...defaultField, description_enabled: true };
      render(
        <QuestionCard
          field={fieldWithDesc}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const descInput = screen.getByPlaceholderText("Enter description");
      
      fireEvent.change(descInput, { target: { value: "New Description" } });
      
      expect(descInput.value).toBe("New Description");
    });

    test("shows character count for description", () => {
      const fieldWithDesc = { ...defaultField, description_enabled: true };
      render(
        <QuestionCard
          field={fieldWithDesc}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("16/150")).toBeInTheDocument();
    });

    test("enforces max character limit of 150 for description", () => {
      const fieldWithDesc = { ...defaultField, description_enabled: true };
      render(
        <QuestionCard
          field={fieldWithDesc}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const descInput = screen.getByPlaceholderText("Enter description");
      
      expect(descInput).toHaveAttribute("maxLength", "150");
    });
  });

  describe("Required Toggle", () => {
    test("required toggle is off by default", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.queryByText("* Required")).not.toBeInTheDocument();
    });

    test("shows required indicator when toggle is enabled", () => {
      const requiredField = { ...defaultField, required: true };
      render(
        <QuestionCard
          field={requiredField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("* Required")).toBeInTheDocument();
    });

    test("toggles required indicator on switch click", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const toggles = screen.getAllByRole("checkbox");
      const requiredToggle = toggles[1];
      
      fireEvent.click(requiredToggle);
      
      expect(screen.getByText("* Required")).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    test("calls onCopy when copy button is clicked", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const copyButton = screen.getByAltText("copy").closest("button");
      
      fireEvent.click(copyButton);
      
      expect(mockOnCopy).toHaveBeenCalledWith(0);
    });

    test("calls onDelete when delete button is clicked", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const deleteButton = screen.getByAltText("delete").closest("button");
      
      fireEvent.click(deleteButton);
      
      expect(mockOnDelete).toHaveBeenCalledWith(0);
    });
  });

  describe("Date Picker Field Type", () => {
    const dateField = {
      questionId: "q2",
      type: "date-picker",
      label: "Select Date",
      dateFormat: "DD/MM/YYYY",
      selectedDate: "",
    };

    test("renders date picker input", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByPlaceholderText("DD/MM/YYYY")).toBeInTheDocument();
    });

    test("renders calendar icon", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByAltText("calendar")).toBeInTheDocument();
    });

    test("renders date format options", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("Date Format")).toBeInTheDocument();
      expect(screen.getByText("DD/MM/YYYY")).toBeInTheDocument();
      expect(screen.getByText("MM-DD-YYYY")).toBeInTheDocument();
    });

    test("DD/MM/YYYY format is selected by default", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons[0]).toBeChecked();
    });

    test("changes date format when radio button is clicked", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const radioButtons = screen.getAllByRole("radio");
      
      fireEvent.click(radioButtons[1]);
      
      expect(radioButtons[1]).toBeChecked();
    });

    test("updates selected date on input change", () => {
      render(
        <QuestionCard
          field={dateField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const dateInput = screen.getByRole("textbox", { type: /date/i });
      
      fireEvent.change(dateInput, { target: { value: "2024-01-15" } });
      
      expect(dateInput.value).toBe("2024-01-15");
    });
  });

  describe("Dropdown Field Type", () => {
    const dropdownField = {
      questionId: "q3",
      type: "drop-down",
      label: "Select Option",
      options: [
        { id: 1, value: "Option 1" },
        { id: 2, value: "Option 2" },
      ],
      selectionType: "single",
    };

    test("renders dropdown options", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
    });

    test("renders add option button", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("+ Add option")).toBeInTheDocument();
    });

    test("adds new option when add button is clicked", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const addButton = screen.getByText("+ Add option");
      
      fireEvent.click(addButton);
      
      expect(screen.getByDisplayValue("Option 3")).toBeInTheDocument();
    });

    test("updates option value on input change", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const optionInput = screen.getByDisplayValue("Option 1");
      
      fireEvent.change(optionInput, { target: { value: "Updated Option" } });
      
      expect(optionInput.value).toBe("Updated Option");
    });

    test("deletes option when delete button is clicked", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const deleteButtons = screen.getAllByText("✕");
      
      fireEvent.click(deleteButtons[0]);
      
      expect(screen.queryByDisplayValue("Option 1")).not.toBeInTheDocument();
    });

    test("does not delete option when only one option remains", () => {
      const singleOptionField = {
        ...dropdownField,
        options: [{ id: 1, value: "Option 1" }],
      };
      render(
        <QuestionCard
          field={singleOptionField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      
      expect(screen.queryByText("✕")).not.toBeInTheDocument();
    });

    test("renders selection type options", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("Selection Type")).toBeInTheDocument();
      expect(screen.getByText("Single select")).toBeInTheDocument();
      expect(screen.getByText("Multi select")).toBeInTheDocument();
    });

    test("single select is selected by default", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const radioButtons = screen.getAllByRole("radio");
      const singleSelectRadio = radioButtons.find(
        (radio) => radio.value === "single"
      );
      expect(singleSelectRadio).toBeChecked();
    });

    test("changes selection type when radio button is clicked", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const radioButtons = screen.getAllByRole("radio");
      const multiSelectRadio = radioButtons.find(
        (radio) => radio.value === "multi"
      );
      
      fireEvent.click(multiSelectRadio);
      
      expect(multiSelectRadio).toBeChecked();
    });

    test("renders option numbers", () => {
      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("File Upload Field Type", () => {
    const fileUploadField = {
      questionId: "q4",
      type: "file-upload",
      label: "Upload File",
    };

    test("renders file upload display", () => {
      render(
        <QuestionCard
          field={fileUploadField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("File upload (only one file allowed)")).toBeInTheDocument();
    });

    test("renders file upload icon", () => {
      render(
        <QuestionCard
          field={fileUploadField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByAltText("file upload")).toBeInTheDocument();
    });

    test("renders supported file types info", () => {
      render(
        <QuestionCard
          field={fileUploadField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText(/Supported files: PDF, JPG, PNG/)).toBeInTheDocument();
    });

    test("renders max file size info", () => {
      render(
        <QuestionCard
          field={fileUploadField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText(/Max file size 2 MB/)).toBeInTheDocument();
    });
  });

  describe("Number Field Type", () => {
    const numberField = {
      questionId: "q5",
      type: "number",
      label: "Enter Number",
    };

    test("renders number field display", () => {
      render(
        <QuestionCard
          field={numberField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByDisplayValue("Numeric value")).toBeInTheDocument();
    });

    test("number field is disabled", () => {
      render(
        <QuestionCard
          field={numberField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const numberInput = screen.getByDisplayValue("Numeric value");
      expect(numberInput).toBeDisabled();
    });
  });

  describe("Text Field with Max Characters", () => {
    test("renders text field with max character info", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByDisplayValue(/Up to 100 characters/)).toBeInTheDocument();
    });

    test("text field with max char is disabled", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const textField = screen.getByDisplayValue(/Up to 100 characters/);
      expect(textField).toBeDisabled();
    });
  });

  describe("OnUpdate Callback", () => {
    test("calls onUpdate with correct index and updated field", async () => {
      render(
        <QuestionCard
          field={defaultField}
          index={2}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      
      fireEvent.change(input, { target: { value: "New Question" } });
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          2,
          expect.objectContaining({
            label: "New Question",
          })
        );
      });
    });

    test("calls onUpdate when description is toggled", async () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const toggles = screen.getAllByRole("checkbox");
      
      fireEvent.click(toggles[0]);
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          0,
          expect.objectContaining({
            description_enabled: true,
          })
        );
      });
    });

    test("calls onUpdate when required is toggled", async () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const toggles = screen.getAllByRole("checkbox");
      
      fireEvent.click(toggles[1]);
      
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          0,
          expect.objectContaining({
            required: true,
          })
        );
      });
    });
  });

  describe("Dropdown Selection Type Logic", () => {
    test("sets single_choice to true when selectionType is single", async () => {
      const dropdownField = {
        questionId: "q3",
        type: "drop-down",
        label: "Select Option",
        options: [{ id: 1, value: "Option 1" }],
        selectionType: "single",
      };

      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          0,
          expect.objectContaining({
            single_choice: true,
            multiple_choice: false,
          })
        );
      });
    });

    test("sets multiple_choice to true when selectionType is multi", async () => {
      const dropdownField = {
        questionId: "q3",
        type: "drop-down",
        label: "Select Option",
        options: [{ id: 1, value: "Option 1" }],
        selectionType: "multi",
      };

      render(
        <QuestionCard
          field={dropdownField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          0,
          expect.objectContaining({
            single_choice: false,
            multiple_choice: true,
          })
        );
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles field without label", () => {
      const fieldWithoutLabel = { ...defaultField, label: "" };
      render(
        <QuestionCard
          field={fieldWithoutLabel}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      expect(input.value).toBe("");
    });

    test("handles field without description", () => {
      const fieldWithoutDesc = { ...defaultField, description: "" };
      render(
        <QuestionCard
          field={fieldWithoutDesc}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.queryByPlaceholderText("Enter description")).not.toBeInTheDocument();
    });

    test("handles dropdown with empty options array", () => {
      const dropdownWithNoOptions = {
        questionId: "q3",
        type: "drop-down",
        label: "Select Option",
        options: [],
        selectionType: "single",
      };
      render(
        <QuestionCard
          field={dropdownWithNoOptions}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByText("+ Add option")).toBeInTheDocument();
    });

    test("handles date field without selectedDate", () => {
      const dateFieldNoDate = {
        questionId: "q2",
        type: "date-picker",
        label: "Select Date",
        dateFormat: "DD/MM/YYYY",
      };
      render(
        <QuestionCard
          field={dateFieldNoDate}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(screen.getByPlaceholderText("DD/MM/YYYY")).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    test("question card has correct class", () => {
      const { container } = render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      expect(container.querySelector(".question-card")).toBeInTheDocument();
    });

    test("question input has correct class", () => {
      render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const input = screen.getByPlaceholderText("Untitled Question");
      expect(input).toHaveClass("question-input");
    });

    test("action buttons have correct class", () => {
      const { container } = render(
        <QuestionCard
          field={defaultField}
          index={0}
          onDelete={mockOnDelete}
          onCopy={mockOnCopy}
          onUpdate={mockOnUpdate}
        />
      );
      const actionButtons = container.querySelectorAll(".action-btn");
      expect(actionButtons.length).toBe(2);
    });
  });
});
