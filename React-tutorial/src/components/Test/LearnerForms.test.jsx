import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LearnerForms from '../LearnerForms';
import { getAllForms, getFormById } from '../../api/formService';
import { getAllResponsesByLearner } from '../../api/responses';

// Mock the API modules
jest.mock('../../api/formService');
jest.mock('../../api/responses');

// Mock child components
jest.mock('../FormFillView', () => {
  return function MockFormFillView({ form, onBack }) {
    return (
      <div data-testid="form-fill-view">
        <h1>{form.config?.title}</h1>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
});

jest.mock('../SearchBar', () => {
  return function MockSearchBar({ search, setSearch, onFilterClick }) {
    return (
      <div data-testid="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={onFilterClick}>Filter</button>
      </div>
    );
  };
});

// Mock images
jest.mock('../../assets/ViewResponsesIcon.png', () => 'view-responses-icon.png');

describe('LearnerForms Component', () => {
  const mockPublishedForms = {
    data: [
      {
        id: 'form1',
        status: 1,
        publishedAt: '2024-01-15T10:30:00Z',
        config: {
          title: 'Published Form 1',
          description: 'This is a published form',
        },
      },
      {
        id: 'form2',
        status: '1',
        publishedAt: '2024-01-20T14:20:00Z',
        config: {
          title: 'Published Form 2',
          description: 'Another published form',
        },
      },
      {
        id: 'form3',
        status: 0,
        config: {
          title: 'Draft Form',
          description: 'This is a draft',
        },
      },
    ],
  };

  const mockResponses = {
    items: [
      {
        responseId: 'resp1',
        formId: 'form1',
        formTitle: 'Published Form 1',
        submittedAt: '2024-01-16T10:30:00Z',
        answers: [
          { questionId: 'q1', answerText: 'Answer 1' },
        ],
        files: [],
      },
      {
        responseId: 'resp2',
        formId: 'form2',
        formTitle: 'Published Form 2',
        submittedAt: '2024-01-17T14:20:00Z',
        answers: [
          { questionId: 'q2', answerText: 'Answer 2' },
        ],
        files: [],
      },
    ],
    totalCount: 2,
    pageSize: 1,
  };

  const mockFormDetails = {
    config: {
      title: 'Published Form 1',
      description: 'Form description',
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
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getAllForms.mockResolvedValue(mockPublishedForms);
    getAllResponsesByLearner.mockResolvedValue(mockResponses);
    getFormById.mockResolvedValue(mockFormDetails);
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LearnerForms />
      </BrowserRouter>
    );
  };

  test('renders component with tabs', async () => {
    renderComponent();

    expect(screen.getByText('Self-Service Forms')).toBeInTheDocument();
    expect(screen.getByText('My Submissions')).toBeInTheDocument();
  });

  test('displays published forms in Self-Service tab', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
      expect(screen.getByText('Published Form 2')).toBeInTheDocument();
    });

    expect(screen.queryByText('Draft Form')).not.toBeInTheDocument();
  });

  test('displays form descriptions and dates', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('This is a published form')).toBeInTheDocument();
      expect(screen.getByText('Another published form')).toBeInTheDocument();
    });

    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 20, 2024/)).toBeInTheDocument();
  });

  test('switches to My Submissions tab', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Training Name')).toBeInTheDocument();
      expect(screen.getByText('Submitted On')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  test('displays submissions in My Submissions tab', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
      expect(screen.getByText('Published Form 2')).toBeInTheDocument();
    });
  });

  test('handles search input', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Form 1' } });

    expect(searchInput.value).toBe('Form 1');

    await waitFor(() => {
      expect(getAllForms).toHaveBeenCalledWith(0, 50, 'Form 1');
    }, { timeout: 1000 });
  });

  test('opens FormFillView when Start Completion is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByText('Start Completion');
    fireEvent.click(startButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('form-fill-view')).toBeInTheDocument();
    });
  });

  test('returns from FormFillView to My Submissions', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const startButtons = screen.getAllByText('Start Completion');
    fireEvent.click(startButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('form-fill-view')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('My Submissions')).toBeInTheDocument();
      expect(screen.getByText('My Submissions')).toHaveClass('active');
    });
  });

  test('displays view response button in submissions', async () => {
    const { container } = renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      const viewButtons = container.querySelectorAll('.view-button');
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  test('opens response modal when view button is clicked', async () => {
    const { container } = renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const viewButtons = container.querySelectorAll('.view-button');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(getFormById).toHaveBeenCalledWith('form1');
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });
  });

  test('closes response modal when close button is clicked', async () => {
    const { container } = renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const viewButtons = container.querySelectorAll('.view-button');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Question 1')).not.toBeInTheDocument();
    });
  });

  test('handles pagination - next page', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('›');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getAllResponsesByLearner).toHaveBeenCalledWith('', 2, 1);
    });
  });

  test('handles pagination - previous page', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    // Go to page 2
    const nextButton = screen.getByText('›');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getAllResponsesByLearner).toHaveBeenCalledWith('', 2, 1);
    });

    // Go back to page 1
    const prevButton = screen.getByText('‹');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(getAllResponsesByLearner).toHaveBeenCalledWith('', 1, 1);
    });
  });

  test('handles page size change', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Published Form 1')).toBeInTheDocument();
    });

    const pageSizeSelect = screen.getByDisplayValue('1');
    fireEvent.change(pageSizeSelect, { target: { value: '10' } });

    await waitFor(() => {
      expect(getAllResponsesByLearner).toHaveBeenCalledWith('', 1, 10);
    });
  });

  test('displays pagination info correctly', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('1–1 of 2 items')).toBeInTheDocument();
    });
  });

  test('displays no submissions message when empty', async () => {
    getAllResponsesByLearner.mockResolvedValue({
      items: [],
      totalCount: 0,
      pageSize: 1,
    });

    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('No submissions found.')).toBeInTheDocument();
    });
  });

  test('displays no forms message when empty', async () => {
    getAllForms.mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No published forms available.')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAllForms.mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  test('displays file download link in response modal', async () => {
    const mockResponseWithFile = {
      items: [
        {
          responseId: 'resp1',
          formId: 'form1',
          formTitle: 'Form with File',
          submittedAt: '2024-01-16T10:30:00Z',
          answers: [],
          files: [
            {
              questionId: 'q3',
              fileName: 'test.pdf',
              fileType: 'application/pdf',
              base64Content: 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDMgM10+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDEwMiAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjE0OAolJUVPRgo=',
            },
          ],
        },
      ],
      totalCount: 1,
      pageSize: 1,
    };

    const mockFormWithFileUpload = {
      config: {
        title: 'Form with File',
        description: 'Form with file upload',
      },
      layout: {
        fields: [
          {
            questionId: 'q3',
            label: 'Upload File',
            type: 'file-upload',
          },
        ],
      },
    };

    getAllResponsesByLearner.mockResolvedValue(mockResponseWithFile);
    getFormById.mockResolvedValue(mockFormWithFileUpload);

    const { container } = renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Form with File')).toBeInTheDocument();
    }, { timeout: 2000 });

    const viewButtons = container.querySelectorAll('.view-button');
    expect(viewButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(getFormById).toHaveBeenCalledWith('form1');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByText('Upload File')).toBeInTheDocument();
    }, { timeout: 2000 });

    await waitFor(() => {
      const fileLink = screen.getByText('test.pdf');
      expect(fileLink).toBeInTheDocument();
      expect(fileLink).toHaveAttribute('href', 'blob:mock-url');
      expect(fileLink).toHaveAttribute('download', 'test.pdf');
    }, { timeout: 2000 });
  });

  test('handles dropdown/checkbox/radio answers correctly', async () => {
    const mockResponseWithOptions = {
      items: [
        {
          responseId: 'resp1',
          formId: 'form1',
          formTitle: 'Form with Options',
          submittedAt: '2024-01-16T10:30:00Z',
          answers: [
            { questionId: 'q2', answerText: '["opt1"]' },
          ],
          files: [],
        },
      ],
      totalCount: 1,
      pageSize: 1,
    };

    getAllResponsesByLearner.mockResolvedValue(mockResponseWithOptions);

    const { container } = renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(screen.getByText('Form with Options')).toBeInTheDocument();
    });

    const viewButtons = container.querySelectorAll('.view-button');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  test('resets page number when switching tabs', async () => {
    renderComponent();

    const mySubmissionsTab = screen.getByText('My Submissions');
    fireEvent.click(mySubmissionsTab);

    await waitFor(() => {
      expect(getAllResponsesByLearner).toHaveBeenCalledWith('', 1, 1);
    });
  });
});
