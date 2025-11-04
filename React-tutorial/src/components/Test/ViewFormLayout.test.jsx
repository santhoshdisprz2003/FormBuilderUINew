import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ViewFormLayout from './ViewFormLayout';

describe('ViewFormLayout Component', () => {
  const mockFormDataComplete = {
    config: {
      title: 'Test Form',
      description: 'Test Description',
    },
    layout: {
      headerCard: {
        title: 'Custom Header Title',
        description: 'Custom Header Description',
      },
      fields: [
        {
          type: 'short-text',
          label: 'Short Text Question',
          required: true,
          maxChar: 100,
          description: 'Short text description',
          description_enabled: true,
        },
        {
          type: 'long-text',
          label: 'Long Text Question',
          required: false,
          maxChar: 500,
          description: 'Long text description',
          descriptionEnabled: true,
        },
        {
          type: 'date-picker',
          label: 'Date Question',
          required: true,
        },
        {
          type: 'drop-down',
          label: 'Dropdown Question',
          required: false,
          options: [
            { value: 'Option 1' },
            { value: 'Option 2' },
            { value: 'Option 3' },
          ],
        },
        {
          type: 'file-upload',
          label: 'File Upload Question',
          required: true,
        },
        {
          type: 'number',
          label: 'Number Question',
          required: false,
        },
      ],
    },
  };

  it('should render all input field types in left panel', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText('Input Fields')).toBeInTheDocument();
    expect(screen.getByText('Short Text')).toBeInTheDocument();
    expect(screen.getByText('Long Text')).toBeInTheDocument();
    expect(screen.getByText('Date Picker')).toBeInTheDocument();
    expect(screen.getByText('Dropdown')).toBeInTheDocument();
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
  });

  it('should render form header with custom title and description', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText('Form Header')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Custom Header Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Custom Header Description')).toBeInTheDocument();
  });

  it('should fallback to config title when header title is missing', () => {
    const formDataWithoutHeader = {
      config: {
        title: 'Fallback Title',
        description: 'Fallback Description',
      },
      layout: {
        fields: [],
      },
    };

    render(<ViewFormLayout formData={formDataWithoutHeader} />);

    expect(screen.getByDisplayValue('Fallback Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fallback Description')).toBeInTheDocument();
  });

  it('should render all question types correctly', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText(/1\. Short Text Question/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Long Text Question/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Date Question/)).toBeInTheDocument();
    expect(screen.getByText(/4\. Dropdown Question/)).toBeInTheDocument();
    expect(screen.getByText(/5\. File Upload Question/)).toBeInTheDocument();
    expect(screen.getByText(/6\. Number Question/)).toBeInTheDocument();
  });

  it('should display required asterisk for required fields', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    const requiredMarkers = screen.getAllByText('*');
    expect(requiredMarkers.length).toBeGreaterThan(0);
  });

  it('should render short text input with placeholder', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    const shortTextInput = screen.getByPlaceholderText('Short text answer (max 100 chars)');
    expect(shortTextInput).toBeInTheDocument();
    expect(shortTextInput).toHaveAttribute('readonly');
  });

  it('should render long text textarea with placeholder', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    const longTextInput = screen.getByPlaceholderText('Long text answer (max 500 chars)');
    expect(longTextInput).toBeInTheDocument();
    expect(longTextInput).toHaveAttribute('readonly');
  });

  it('should render date picker input', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('readonly');
  });

  it('should render dropdown options', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should display "No options available" for dropdown without options', () => {
    const formDataNoOptions = {
      layout: {
        fields: [
          {
            type: 'drop-down',
            label: 'Empty Dropdown',
            options: [],
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataNoOptions} />);

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  it('should render file upload display', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText('Upload a file')).toBeInTheDocument();
    expect(screen.getByText('Max 25 MB | Formats: PDF, DOCX, JPG')).toBeInTheDocument();
  });

  it('should render number input with placeholder', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    const numberInput = screen.getByPlaceholderText('Enter number');
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveAttribute('type', 'number');
    expect(numberInput).toHaveAttribute('readonly');
  });

  it('should display "No questions found" when fields array is empty', () => {
    const formDataNoFields = {
      layout: {
        fields: [],
      },
    };

    render(<ViewFormLayout formData={formDataNoFields} />);

    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  it('should handle missing layout gracefully', () => {
    const formDataNoLayout = {
      config: {
        title: 'Test',
        description: 'Test',
      },
    };

    render(<ViewFormLayout formData={formDataNoLayout} />);

    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  it('should render question descriptions when enabled', () => {
    render(<ViewFormLayout formData={mockFormDataComplete} />);

    expect(screen.getByText('Short text description')).toBeInTheDocument();
    expect(screen.getByText('Long text description')).toBeInTheDocument();
  });

  it('should not render description when description_enabled is false', () => {
    const formDataNoDescription = {
      layout: {
        fields: [
          {
            type: 'short-text',
            label: 'Question',
            description: 'Hidden description',
            description_enabled: false,
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataNoDescription} />);

    expect(screen.queryByText('Hidden description')).not.toBeInTheDocument();
  });

  it('should handle dropdown options as strings', () => {
    const formDataStringOptions = {
      layout: {
        fields: [
          {
            type: 'drop-down',
            label: 'Dropdown',
            options: ['String Option 1', 'String Option 2'],
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataStringOptions} />);

    expect(screen.getByText('String Option 1')).toBeInTheDocument();
    expect(screen.getByText('String Option 2')).toBeInTheDocument();
  });

  it('should apply disabled class to input fields in left panel', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataComplete} />);

    const inputFields = container.querySelectorAll('.input-field.disabled');
    expect(inputFields.length).toBe(6);
  });

  it('should apply readonly class to form header', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataComplete} />);

    const headerBox = container.querySelector('.form-header-box.readonly');
    expect(headerBox).toBeInTheDocument();
  });

  it('should apply view-mode class to question cards', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataComplete} />);

    const questionCards = container.querySelectorAll('.question-card.view-mode');
    expect(questionCards.length).toBe(6);
  });

  it('should render correct border colors for input fields', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataComplete} />);

    const inputFields = container.querySelectorAll('.input-field');
    expect(inputFields[0]).toHaveStyle({ borderLeft: '4px solid #4F46E5' });
    expect(inputFields[1]).toHaveStyle({ borderLeft: '4px solid #7B61FF40' });
    expect(inputFields[2]).toHaveStyle({ borderLeft: '4px solid #BBE9E4' });
  });

  it('should render all input field icons', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataComplete} />);

    const icons = container.querySelectorAll('.input-icon');
    expect(icons.length).toBe(6);
  });

  it('should handle null formData gracefully', () => {
    render(<ViewFormLayout formData={null} />);

    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  it('should handle undefined formData gracefully', () => {
    render(<ViewFormLayout formData={undefined} />);

    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  it('should render empty header inputs when no data provided', () => {
    render(<ViewFormLayout formData={{}} />);

    const headerInputs = screen.getAllByDisplayValue('');
    expect(headerInputs.length).toBeGreaterThan(0);
  });

  it('should handle maxChar fallback for short text', () => {
    const formDataNoMaxChar = {
      layout: {
        fields: [
          {
            type: 'short-text',
            label: 'Question',
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataNoMaxChar} />);

    expect(screen.getByPlaceholderText('Short text answer (max 100 chars)')).toBeInTheDocument();
  });

  it('should handle maxChar fallback for long text', () => {
    const formDataNoMaxChar = {
      layout: {
        fields: [
          {
            type: 'long-text',
            label: 'Question',
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataNoMaxChar} />);

    expect(screen.getByPlaceholderText('Long text answer (max 500 chars)')).toBeInTheDocument();
  });

  it('should support both description_enabled and descriptionEnabled properties', () => {
    const formDataBothProps = {
      layout: {
        fields: [
          {
            type: 'short-text',
            label: 'Question 1',
            description: 'Description 1',
            description_enabled: true,
          },
          {
            type: 'short-text',
            label: 'Question 2',
            description: 'Description 2',
            descriptionEnabled: true,
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataBothProps} />);

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });
});
