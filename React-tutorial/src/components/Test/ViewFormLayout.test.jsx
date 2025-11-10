import { render, screen } from '@testing-library/react';
import ViewFormLayout from '../ViewFormLayout';

describe('ViewFormLayout Component', () => {
  const mockFormDataWithFields = {
    config: {
      title: 'Test Form',
      description: 'Test Form Description',
    },
    layout: {
      headerCard: {
        title: 'Custom Header Title',
        description: 'Custom Header Description',
      },
      fields: [
        {
          label: 'What is your name?',
          description: 'Please enter your full name',
          type: 'short-text',
          maxChar: 100,
        },
        {
          label: 'Tell us about yourself',
          type: 'long-text',
          maxChar: 500,
        },
        {
          label: 'Select your birth date',
          type: 'date-picker',
        },
        {
          label: 'Choose your country',
          type: 'drop-down',
          options: ['USA', 'Canada', 'UK', 'Australia'],
        },
        {
          label: 'Upload your resume',
          type: 'file-upload',
        },
        {
          label: 'Enter your age',
          type: 'number',
        },
      ],
    },
  };

  const mockFormDataEmpty = {
    config: {
      title: 'Empty Form',
      description: 'Empty Form Description',
    },
    layout: {
      headerCard: {},
      fields: [],
    },
  };

  test('renders input fields list', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    expect(screen.getByText('Input Fields')).toBeInTheDocument();
    expect(screen.getByText('Short Text')).toBeInTheDocument();
    expect(screen.getByText('Long Text')).toBeInTheDocument();
    expect(screen.getByText('Date Picker')).toBeInTheDocument();
    expect(screen.getByText('Dropdown')).toBeInTheDocument();
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
  });

  test('renders form header with custom title and description', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    expect(screen.getByText('Form Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Header Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Header Description')).toBeInTheDocument();
  });

  test('renders form header with fallback to config when headerCard is empty', () => {
    const formDataWithoutHeader = {
      config: {
        title: 'Config Title',
        description: 'Config Description',
      },
      layout: {
        headerCard: {},
        fields: [],
      },
    };

    render(<ViewFormLayout formData={formDataWithoutHeader} />);

    expect(screen.getByText('Config Title')).toBeInTheDocument();
    expect(screen.getByText('Config Description')).toBeInTheDocument();
  });

  test('renders all question fields correctly', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    expect(screen.getByText('1. What is your name?')).toBeInTheDocument();
    expect(screen.getByText('Please enter your full name')).toBeInTheDocument();
    expect(screen.getByText('2. Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByText('3. Select your birth date')).toBeInTheDocument();
    expect(screen.getByText('4. Choose your country')).toBeInTheDocument();
    expect(screen.getByText('5. Upload your resume')).toBeInTheDocument();
    expect(screen.getByText('6. Enter your age')).toBeInTheDocument();
  });

  test('renders short text input field', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const shortTextInput = screen.getByPlaceholderText('Short text answer (max 100 chars)');
    expect(shortTextInput).toBeInTheDocument();
    expect(shortTextInput).toHaveAttribute('type', 'text');
    expect(shortTextInput).toHaveAttribute('readonly');
  });

  test('renders long text textarea field', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const longTextArea = screen.getByPlaceholderText('Long text answer (max 500 chars)');
    expect(longTextArea).toBeInTheDocument();
    expect(longTextArea.tagName).toBe('TEXTAREA');
    expect(longTextArea).toHaveAttribute('readonly');
  });

  test('renders date picker field', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const dateInputs = screen.getAllByDisplayValue('');
    const dateInput = dateInputs.find(input => input.type === 'date');
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('readonly');
  });

  test('renders dropdown options as radio buttons', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('UK')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  test('renders file upload field with info', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Supported files:PDF,PNG,JPG |Max file 2 MB')).toBeInTheDocument();
  });

  test('renders number input field', () => {
    render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const numberInput = screen.getByPlaceholderText('Enter number');
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveAttribute('type', 'number');
    expect(numberInput).toHaveAttribute('readonly');
  });

  test('renders "No questions found" when fields array is empty', () => {
    render(<ViewFormLayout formData={mockFormDataEmpty} />);

    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  test('renders "No options available" for dropdown without options', () => {
    const formDataWithEmptyDropdown = {
      config: { title: 'Test', description: 'Test' },
      layout: {
        headerCard: {},
        fields: [
          {
            label: 'Select option',
            type: 'drop-down',
            options: [],
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataWithEmptyDropdown} />);

    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  test('does not render question description when not provided', () => {
    const formDataWithoutDescription = {
      config: { title: 'Test', description: 'Test' },
      layout: {
        headerCard: {},
        fields: [
          {
            label: 'Question without description',
            type: 'short-text',
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataWithoutDescription} />);

    expect(screen.getByText('1. Question without description')).toBeInTheDocument();
    expect(screen.queryByClassName('question-description1')).not.toBeInTheDocument();
  });

  test('handles dropdown options as objects with value property', () => {
    const formDataWithObjectOptions = {
      config: { title: 'Test', description: 'Test' },
      layout: {
        headerCard: {},
        fields: [
          {
            label: 'Select option',
            type: 'drop-down',
            options: [
              { value: 'Option 1' },
              { value: 'Option 2' },
            ],
          },
        ],
      },
    };

    render(<ViewFormLayout formData={formDataWithObjectOptions} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('renders with undefined formData gracefully', () => {
    render(<ViewFormLayout formData={{}} />);

    expect(screen.getByText('Form Header')).toBeInTheDocument();
    expect(screen.getByText('No questions found for this form.')).toBeInTheDocument();
  });

  test('all input fields have disabled class', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const inputFields = container.querySelectorAll('.input-field');
    inputFields.forEach(field => {
      expect(field).toHaveClass('disabled');
    });
  });

  test('question cards have view-mode class', () => {
    const { container } = render(<ViewFormLayout formData={mockFormDataWithFields} />);

    const questionCards = container.querySelectorAll('.question-card');
    questionCards.forEach(card => {
      expect(card).toHaveClass('view-mode');
    });
  });
});
