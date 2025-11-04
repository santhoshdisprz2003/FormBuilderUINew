import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewForm from './ViewForm';
import { getFormById } from '../api/formService';

// Mock the API service
vi.mock('../api/formService', () => ({
  getFormById: vi.fn(),
}));

// Mock child components
vi.mock('./FormConfiguration', () => ({
  default: ({ formName, description, readOnly }) => (
    <div data-testid="form-configuration">
      <div>Form Name: {formName}</div>
      <div>Description: {description}</div>
      <div>Read Only: {readOnly ? 'true' : 'false'}</div>
    </div>
  ),
}));

vi.mock('./ViewFormLayout', () => ({
  default: ({ formData }) => (
    <div data-testid="view-form-layout">
      Form Layout: {formData?.config?.title}
    </div>
  ),
}));

vi.mock('./FormResponses', () => ({
  default: () => <div data-testid="form-responses">Form Responses</div>,
}));

const mockFormData = {
  config: {
    title: 'Test Form',
    description: 'Test Description',
  },
  fields: [],
};

describe('ViewForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    getFormById.mockImplementation(() => new Promise(() => {}));
    
    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading form details...')).toBeInTheDocument();
  });

  it('should fetch and display form data', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={[{ pathname: '/form/123' }]}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getFormById).toHaveBeenCalledWith('123');
    });

    expect(screen.getByText('Form Name: Test Form')).toBeInTheDocument();
    expect(screen.getByText('Description: Test Description')).toBeInTheDocument();
  });

  it('should display error message when form is not found', async () => {
    getFormById.mockResolvedValue(null);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Form not found.')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    getFormById.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Form not found.')).toBeInTheDocument();
    });
  });

  it('should render all three tabs', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Form Configuration')).toBeInTheDocument();
    });

    expect(screen.getByText('Form Layout')).toBeInTheDocument();
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  it('should display configuration tab by default', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('view-form-layout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('form-responses')).not.toBeInTheDocument();
  });

  it('should switch to layout tab when clicked', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    const layoutTab = screen.getByText('Form Layout');
    fireEvent.click(layoutTab);

    expect(screen.getByTestId('view-form-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('form-configuration')).not.toBeInTheDocument();
  });

  it('should switch to responses tab when clicked', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-configuration')).toBeInTheDocument();
    });

    const responsesTab = screen.getByText('Responses');
    fireEvent.click(responsesTab);

    expect(screen.getByTestId('form-responses')).toBeInTheDocument();
    expect(screen.queryByTestId('form-configuration')).not.toBeInTheDocument();
  });

  it('should apply active class to current tab', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      const configTab = screen.getByText('Form Configuration');
      expect(configTab).toHaveClass('active');
    });

    const layoutTab = screen.getByText('Form Layout');
    fireEvent.click(layoutTab);

    expect(layoutTab).toHaveClass('active');
    expect(screen.getByText('Form Configuration')).not.toHaveClass('active');
  });

  it('should open specific tab from location state', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter 
        initialEntries={[{ 
          pathname: '/form/123', 
          state: { openTab: 'responses' } 
        }]}
      >
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-responses')).toBeInTheDocument();
    });
  });

  it('should pass readOnly prop as true to FormConfiguration', async () => {
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Read Only: true')).toBeInTheDocument();
    });
  });

  it('should handle empty form config gracefully', async () => {
    getFormById.mockResolvedValue({ config: {} });

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Form Name:')).toBeInTheDocument();
      expect(screen.getByText('Description:')).toBeInTheDocument();
    });
  });

  it('should log form ID and API response', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    getFormById.mockResolvedValue(mockFormData);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Fetching form with ID:', '123');
      expect(consoleSpy).toHaveBeenCalledWith('API response:', mockFormData);
    });

    consoleSpy.mockRestore();
  });

  it('should log error when API fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const error = new Error('Network error');
    getFormById.mockRejectedValue(error);

    render(
      <MemoryRouter initialEntries={['/form/123']}>
        <ViewForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching form:', error);
    });

    consoleErrorSpy.mockRestore();
  });
});
