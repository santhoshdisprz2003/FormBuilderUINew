import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionCard from '../QuestionCard';

describe('QuestionCard Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnCopy = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockSetActiveIndex = jest.fn();

  const defaultProps = {
    field: {
      type: 'short-text',
      question: 'Test Question',
      description: 'Test Description',
      showDescription: false,
      required: false,
      maxChar: 100,
    },
    index: 0,
    onDelete: mockOnDelete,
    onCopy: mockOnCopy,
    onUpdate: mockOnUpdate,
    isActive: true,
    setActiveIndex: mockSetActiveIndex,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders question card with short-text field', () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByPlaceholderText('Untitled Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Short text (Up to 100 characters)')).toBeInTheDocument();
  });

  test('renders question card with long-text field', () => {
    const props = {
      ...defaultProps,
      field: { ...defaultProps.field, type: 'long-text', maxChar: 500 },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByDisplayValue('Long text (Up to 500 characters)')).toBeInTheDocument();
  });

  test('updates question text', () => {
    render(<QuestionCard {...defaultProps} />);
    const questionInput = screen.getByPlaceholderText('Untitled Question');
    fireEvent.change(questionInput, { target: { value: 'New Question' } });
    expect(questionInput.value).toBe('New Question');
  });

  test('shows character count for question', () => {
    render(<QuestionCard {...defaultProps} />);
    const questionInput = screen.getByPlaceholderText('Untitled Question');
    fireEvent.change(questionInput, { target: { value: 'Test' } });
    expect(screen.getByText('4/150')).toBeInTheDocument();
  });

  test('limits question to 150 characters', () => {
    render(<QuestionCard {...defaultProps} />);
    const questionInput = screen.getByPlaceholderText('Untitled Question');
    expect(questionInput).toHaveAttribute('maxLength', '150');
  });

  test('toggles description visibility', () => {
    render(<QuestionCard {...defaultProps} />);
    const descriptionToggle = screen.getByRole('checkbox', { name: '' });
    const toggles = screen.getAllByRole('checkbox');
    const descriptionCheckbox = toggles[0]; // First checkbox is description
    
    fireEvent.click(descriptionCheckbox);
    
    waitFor(() => {
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });
  });

  test('toggles required field', () => {
    render(<QuestionCard {...defaultProps} />);
    const toggles = screen.getAllByRole('checkbox');
    const requiredCheckbox = toggles[1]; // Second checkbox is required
    
    expect(requiredCheckbox).not.toBeChecked();
    fireEvent.click(requiredCheckbox);
    expect(requiredCheckbox).toBeChecked();
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<QuestionCard {...defaultProps} />);
    const deleteButton = screen.getByAltText('delete').closest('button');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(0);
  });

  test('calls onCopy when copy button is clicked', () => {
    render(<QuestionCard {...defaultProps} />);
    const copyButton = screen.getByAltText('copy').closest('button');
    fireEvent.click(copyButton);
    expect(mockOnCopy).toHaveBeenCalledWith(0);
  });

  test('calls setActiveIndex when card is clicked', () => {
    render(<QuestionCard {...defaultProps} />);
    const card = screen.getByPlaceholderText('Untitled Question').closest('.question-card');
    fireEvent.click(card);
    expect(mockSetActiveIndex).toHaveBeenCalledWith(0);
  });

  test('renders date-picker field with date format options', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'date-picker',
        dateFormat: 'DD/MM/YYYY',
        selectedDate: '',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByText('Date Format')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DD/MM/YYYY')).toBeInTheDocument();
    expect(screen.getByDisplayValue('MM-DD-YYYY')).toBeInTheDocument();
  });

  test('changes date format in date-picker', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'date-picker',
        dateFormat: 'DD/MM/YYYY',
        selectedDate: '',
      },
    };
    render(<QuestionCard {...props} />);
    const mmddyyyyRadio = screen.getByDisplayValue('MM-DD-YYYY');
    fireEvent.click(mmddyyyyRadio);
    expect(mmddyyyyRadio).toBeChecked();
  });

  test('renders drop-down field with options', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [
          { id: 1, value: 'Option 1' },
          { id: 2, value: 'Option 2' },
        ],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
    expect(screen.getByText('+ Add option')).toBeInTheDocument();
  });

  test('adds new option in drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [{ id: 1, value: 'Option 1' }],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    const addButton = screen.getByText('+ Add option');
    fireEvent.click(addButton);
    
    waitFor(() => {
      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
    });
  });

  test('deletes option in drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [
          { id: 1, value: 'Option 1' },
          { id: 2, value: 'Option 2' },
        ],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    const deleteButtons = screen.getAllByText('✕');
    fireEvent.click(deleteButtons[0]);
    
    waitFor(() => {
      expect(screen.queryByDisplayValue('Option 1')).not.toBeInTheDocument();
    });
  });

  test('does not delete last option in drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [{ id: 1, value: 'Option 1' }],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  test('changes option value in drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [{ id: 1, value: 'Option 1' }],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    const optionInput = screen.getByDisplayValue('Option 1');
    fireEvent.change(optionInput, { target: { value: 'New Option' } });
    expect(optionInput.value).toBe('New Option');
  });

  test('renders selection type options for drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [{ id: 1, value: 'Option 1' }],
        selectionType: 'single',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByText('Selection Type')).toBeInTheDocument();
    expect(screen.getByText('Single select')).toBeInTheDocument();
    expect(screen.getByText('Multi select')).toBeInTheDocument();
  });

  test('changes selection type in drop-down', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'drop-down',
        options: [{ id: 1, value: 'Option 1' }],
        selectionType: 'single',
        single_choice: true,
        multiple_choice: false,
      },
    };
    render(<QuestionCard {...props} />);
    const multiSelectRadio = screen.getByDisplayValue('multi');
    fireEvent.click(multiSelectRadio);
    expect(multiSelectRadio).toBeChecked();
  });

  test('renders file-upload field', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'file-upload',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByText('File upload (only one file allowed)')).toBeInTheDocument();
    expect(screen.getByText('Supported files: PDF, JPG, PNG | Max file size 2 MB')).toBeInTheDocument();
  });

  test('renders number field', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'number',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByDisplayValue('Numeric value')).toBeInTheDocument();
  });

  test('disables inputs when card is inactive', () => {
    const props = {
      ...defaultProps,
      isActive: false,
    };
    render(<QuestionCard {...props} />);
    const questionInput = screen.getByPlaceholderText('Untitled Question');
    expect(questionInput).toBeDisabled();
  });

  test('applies active class when card is active', () => {
    render(<QuestionCard {...defaultProps} />);
    const card = screen.getByPlaceholderText('Untitled Question').closest('.question-card');
    expect(card).toHaveClass('active');
  });

  test('applies inactive class when card is inactive', () => {
    const props = {
      ...defaultProps,
      isActive: false,
    };
    render(<QuestionCard {...props} />);
    const card = screen.getByPlaceholderText('Untitled Question').closest('.question-card');
    expect(card).toHaveClass('inactive');
  });

  test('calls onUpdate when field changes', async () => {
    render(<QuestionCard {...defaultProps} />);
    const questionInput = screen.getByPlaceholderText('Untitled Question');
    fireEvent.change(questionInput, { target: { value: 'Updated Question' } });
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  test('shows description input when showDescription is true', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        showDescription: true,
        description: 'Test Description',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  test('updates description text', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        showDescription: true,
        description: '',
      },
    };
    render(<QuestionCard {...props} />);
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    expect(descriptionInput.value).toBe('New Description');
  });

  test('formats date correctly for DD/MM/YYYY', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'date-picker',
        dateFormat: 'DD/MM/YYYY',
        selectedDate: '2024-01-15',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
  });

  test('formats date correctly for MM-DD-YYYY', () => {
    const props = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        type: 'date-picker',
        dateFormat: 'MM-DD-YYYY',
        selectedDate: '2024-01-15',
      },
    };
    render(<QuestionCard {...props} />);
    expect(screen.getByText('01-15-2024')).toBeInTheDocument();
  });
});
