import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ViewForm from '../ViewForm';
import { getFormById } from '../../api/formService';

// Mock the API module
jest.mock('../../api/formService');

// Mock child components
jest.mock('../FormConfiguration', () => {
  return function MockFormConfiguration(props) {
    return <div data-testid="form-configuration">Form Configuration Component</div>;
  };
});

jest.mock('../ViewFormLayout', () => {
  return function MockViewFormLayout(props) {
    return <div data-testid="view-form-layout">View Form Layout Component</div>;
  };
});

jest.mock('../FormResponses', () => {
  return function MockFormResponses() {
    return <div data-testid="form-responses">Form Responses Component</div>;
  };
});

const mockFormData = {
  config: {
    title: 'Test Form',
    description: 'Test Description',
  },
  layout: {
    sections: [],
  },
};

describe('ViewForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    getFormById.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading form details/i)).toBeInTheDocument();
  });

  test('renders error state when form is not found', async () => {
    getFormById.mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/form not found/i)).toBeInTheDocument();
    });
  });

  test('renders form configuration tab by default', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    expect(screen.getByText('Form Configuration')).toHaveClass('active');
  });

  test('switches to layout tab when clicked', async () => {
    getFormById.mockResolvedValue(mockFormData);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    const layoutTab = screen.getByText('Form Content');
    await user.click(layoutTab);

    expect(screen.getByTestId('view-form-layout')).toBeInTheDocument();
    expect(layoutTab).toHaveClass('active');
  });

  test('switches to responses tab when clicked', async () => {
    getFormById.mockResolvedValue(mockFormData);
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    const responsesTab = screen.getByText('Responses');
    await user.click(responsesTab);

    expect(screen.getByTestId('form-responses')).toBeInTheDocument();
    expect(responsesTab).toHaveClass('active');
  });

  test('fetches form data with correct ID from URL params', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/forms/456']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getFormById).toHaveBeenCalledWith('456');
    });
  });

  test('handles API error gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    getFormById.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/forms/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/form not found/i)).toBeInTheDocument();
    });

    expect(consoleError).toHaveBeenCalledWith(
      'Error fetching form:',
      expect.any(Error)
    );

    consoleError.mockRestore();
  });

  test('opens specific tab when passed via location state', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter 
        initialEntries={[
          { pathname: '/forms/123', state: { openTab: 'responses' } }
        ]}
      >
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-responses')).toBeInTheDocument();
    });

    expect(screen.getByText('Responses')).toHaveClass('active');
  });
});
