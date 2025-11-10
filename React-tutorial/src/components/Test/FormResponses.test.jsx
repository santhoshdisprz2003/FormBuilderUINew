import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FormResponses from '../FormResponses';
import { getAllResponsesForForm } from '../../api/admin';
import { getFormById } from '../../api/formService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Mock the API modules
jest.mock('../../api/admin');
jest.mock('../../api/formService');
jest.mock('xlsx');
jest.mock('file-saver');

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-form-id' }),
}));

// Mock images
jest.mock('../../assets/SearchIcon.png', () => 'search-icon.png');
jest.mock('../../assets/FilterIcon.png', () => 'filter-icon.png');
jest.mock('../../assets/NoResponseIcon.png', () => 'no-response-icon.png');

describe('FormResponses Component', () => {
  const mockFormDetails = {
    config: {
      title: 'Test Form',
      description: 'Test form description',
    },
    layout: {
      fields: [
        {
          questionId: 'q1',
          label: 'Question 1',
          description: 'First question',
          type: 'text',
        },
        {
          questionId: 'q2',
          label: 'Question 2',
          type: 'drop-down',
          options: [
            { optionId: 'opt1', value: 'Option 1' },
            { optionId: 'opt2', value: 'Option 2' },
          ],
        },
        {
          questionId: 'q3',
          label: 'Question 3',
          type: 'file-upload',
        },
      ],
    },
  };

  const mockResponses = {
    items: [
      {
        responseId: 'resp1',
        submittedUserName: 'John Doe',
        submittedBy: 'user123',
        submittedAt: '2024-01-15T10:30:00Z',
        answers: [
          { questionId: 'q1', answerText: 'Answer 1' },
          { questionId: 'q2', answerText: '["opt1"]' },
        ],
        files: [],
      },
      {
        responseId: 'resp2',
        submittedUserName: 'Jane Smith',
        submittedBy: 'user456',
        submittedAt: '2024-01-16T14:20:00Z',
        answers: [
          { questionId: 'q1', answerText: 'Answer 2' },
        ],
        files: [
          {
            questionId: 'q3',
            fileName: 'test.pdf',
            fileType: 'application/pdf',
            base64Content: 'base64content',
          },
        ],
      },
    ],
    totalPages: 1,
    totalCount: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getFormById.mockResolvedValue(mockFormDetails);
    getAllResponsesForForm.mockResolvedValue(mockResponses);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <FormResponses />
      </BrowserRouter>
    );
  };

  test('renders form responses with data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('user123')).toBeInTheDocument();
    expect(screen.getByText('user456')).toBeInTheDocument();
  });

  test('displays no responses message when no data', async () => {
    getAllResponsesForForm.mockResolvedValue({
      items: [],
      totalPages: 0,
      totalCount: 0,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No Responses Yet')).toBeInTheDocument();
    });

    expect(screen.getByText(/Once learners start submitting the form/i)).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const summaryTab = screen.getByText('Response Summary');
    const individualTab = screen.getByText('Individual Response');

    expect(summaryTab).toHaveClass('active');
    expect(individualTab).not.toHaveClass('active');

    fireEvent.click(individualTab);

    expect(individualTab).toHaveClass('active');
    expect(summaryTab).not.toHaveClass('active');
  });

  test('handles search input', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by Name/User ID');
    
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(searchInput.value).toBe('John');

    await waitFor(() => {
      expect(getAllResponsesForForm).toHaveBeenCalledWith(
        'test-form-id',
        1,
        1,
        'John'
      );
    }, { timeout: 1000 });
  });

  test('handles pagination - next page', async () => {
    getAllResponsesForForm.mockResolvedValue({
      ...mockResponses,
      totalPages: 3,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('›');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getAllResponsesForForm).toHaveBeenCalledWith(
        'test-form-id',
        2,
        1,
        ''
      );
    });
  });

  test('handles pagination - previous page', async () => {
    getAllResponsesForForm.mockResolvedValue({
      ...mockResponses,
      totalPages: 3,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Go to page 2 first
    const nextButton = screen.getByText('›');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getAllResponsesForForm).toHaveBeenCalledWith(
        'test-form-id',
        2,
        1,
        ''
      );
    });

    // Go back to page 1
    const prevButton = screen.getByText('‹');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(getAllResponsesForForm).toHaveBeenCalledWith(
        'test-form-id',
        1,
        1,
        ''
      );
    });
  });

  test('handles page size change', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const pageSizeSelect = screen.getByDisplayValue('1');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });

    await waitFor(() => {
      expect(getAllResponsesForForm).toHaveBeenCalledWith(
        'test-form-id',
        1,
        10,
        ''
      );
    });
  });

  test('opens response modal when View button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Answer 1')).toBeInTheDocument();
    });
  });

  test('closes response modal when close button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Question 1')).not.toBeInTheDocument();
    });
  });

  test('exports to Excel', async () => {
    const mockWorksheet = {};
    const mockWorkbook = { Sheets: {}, SheetNames: [] };
    const mockBuffer = new ArrayBuffer(8);

    XLSX.utils.json_to_sheet.mockReturnValue(mockWorksheet);
    XLSX.utils.book_new.mockReturnValue(mockWorkbook);
    XLSX.utils.book_append_sheet.mockImplementation(() => {});
    XLSX.write.mockReturnValue(mockBuffer);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Export to Excel');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.write).toHaveBeenCalled();
      expect(saveAs).toHaveBeenCalled();
    });
  });

  test('displays file download link in modal', async () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[1]);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const fileLink = screen.getByText('test.pdf');
    expect(fileLink).toHaveAttribute('href', 'blob:mock-url');
    expect(fileLink).toHaveAttribute('download', 'test.pdf');
  });

  test('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAllResponsesForForm.mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No Responses Yet')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  test('displays correct pagination info', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('1–1 of 2 items')).toBeInTheDocument();
      expect(screen.getByText('1 of 1 pages')).toBeInTheDocument();
    });
  });

  test('disables pagination buttons appropriately', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const prevButton = screen.getByText('‹');
    const nextButton = screen.getByText('›');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });
});
