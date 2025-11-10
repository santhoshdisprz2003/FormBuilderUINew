import { getAllResponsesForForm } from '../admin';
import axiosInstance from '../axiosInstance';

// Mock axiosInstance
jest.mock('../axiosInstance');

describe('admin.js - getAllResponsesForForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches responses with default pagination parameters', async () => {
    const mockResponse = {
      data: {
        totalCount: 50,
        totalPages: 9,
        pageNumber: 1,
        pageSize: 6,
        items: [
          { id: 1, respondentName: 'John Doe', submittedAt: '2024-01-01' },
          { id: 2, respondentName: 'Jane Smith', submittedAt: '2024-01-02' },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getAllResponsesForForm('form123');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form123/responses', {
      params: {
        pageNumber: 1,
        pageSize: 6,
      },
    });

    expect(result).toEqual(mockResponse.data);
    expect(result.totalCount).toBe(50);
    expect(result.items).toHaveLength(2);
  });

  test('fetches responses with custom pagination parameters', async () => {
    const mockResponse = {
      data: {
        totalCount: 100,
        totalPages: 10,
        pageNumber: 3,
        pageSize: 10,
        items: [],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getAllResponsesForForm('form456', 3, 10);

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form456/responses', {
      params: {
        pageNumber: 3,
        pageSize: 10,
      },
    });

    expect(result.pageNumber).toBe(3);
    expect(result.pageSize).toBe(10);
  });

  test('fetches responses with search parameter', async () => {
    const mockResponse = {
      data: {
        totalCount: 5,
        totalPages: 1,
        pageNumber: 1,
        pageSize: 6,
        items: [
          { id: 1, respondentName: 'John Doe', submittedAt: '2024-01-01' },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getAllResponsesForForm('form789', 1, 6, 'John');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form789/responses', {
      params: {
        pageNumber: 1,
        pageSize: 6,
        search: 'John',
      },
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].respondentName).toBe('John Doe');
  });

  test('does not include search parameter when search is empty string', async () => {
    const mockResponse = {
      data: {
        totalCount: 10,
        totalPages: 2,
        pageNumber: 1,
        pageSize: 6,
        items: [],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    await getAllResponsesForForm('form123', 1, 6, '');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form123/responses', {
      params: {
        pageNumber: 1,
        pageSize: 6,
      },
    });
  });

  test('trims whitespace from search parameter', async () => {
    const mockResponse = {
      data: {
        totalCount: 3,
        totalPages: 1,
        pageNumber: 1,
        pageSize: 6,
        items: [],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    await getAllResponsesForForm('form123', 1, 6, '  search term  ');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form123/responses', {
      params: {
        pageNumber: 1,
        pageSize: 6,
        search: 'search term',
      },
    });
  });

  test('does not include search parameter when search is only whitespace', async () => {
    const mockResponse = {
      data: {
        totalCount: 10,
        totalPages: 2,
        pageNumber: 1,
        pageSize: 6,
        items: [],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    await getAllResponsesForForm('form123', 1, 6, '   ');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form123/responses', {
      params: {
        pageNumber: 1,
        pageSize: 6,
      },
    });
  });

  test('handles API error and throws error', async () => {
    const mockError = new Error('Network Error');
    axiosInstance.get.mockRejectedValue(mockError);

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getAllResponsesForForm('form123')).rejects.toThrow('Network Error');

    expect(consoleError).toHaveBeenCalledWith(
      'Error fetching paginated responses:',
      mockError
    );

    consoleError.mockRestore();
  });

  test('handles 404 error when form not found', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Form not found' },
      },
    };

    axiosInstance.get.mockRejectedValue(mockError);

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getAllResponsesForForm('nonexistent')).rejects.toEqual(mockError);

    expect(consoleError).toHaveBeenCalledWith(
      'Error fetching paginated responses:',
      mockError
    );

    consoleError.mockRestore();
  });

  test('handles empty response items array', async () => {
    const mockResponse = {
      data: {
        totalCount: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: 6,
        items: [],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getAllResponsesForForm('form123');

    expect(result.items).toEqual([]);
    expect(result.totalCount).toBe(0);
  });

  test('fetches responses with all parameters provided', async () => {
    const mockResponse = {
      data: {
        totalCount: 25,
        totalPages: 3,
        pageNumber: 2,
        pageSize: 10,
        items: [
          { id: 11, respondentName: 'Alice Johnson', submittedAt: '2024-01-15' },
          { id: 12, respondentName: 'Bob Williams', submittedAt: '2024-01-16' },
        ],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const result = await getAllResponsesForForm('form999', 2, 10, 'Alice');

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/forms/form999/responses', {
      params: {
        pageNumber: 2,
        pageSize: 10,
        search: 'Alice',
      },
    });

    expect(result.totalCount).toBe(25);
    expect(result.pageNumber).toBe(2);
    expect(result.items).toHaveLength(2);
  });
});
