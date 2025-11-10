import {
  submitResponse,
  getResponsesForForm,
  getAllResponsesByLearner,
  downloadFile,
} from '../responses';
import axiosInstance from '../axiosInstance';

// Mock axiosInstance
jest.mock('../axiosInstance');

describe('responses.js - Responses API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // 📝 SUBMIT RESPONSE TESTS
  // =========================
  describe('submitResponse', () => {
    test('successfully submits a response to a form', async () => {
      const formId = 1;
      const mockResponseDto = {
        answers: [
          { fieldId: 1, value: 'John Doe' },
          { fieldId: 2, value: 'john@example.com' },
        ],
      };

      const mockResponse = {
        data: {
          id: 1,
          formId: 1,
          answers: mockResponseDto.answers,
          submittedAt: '2024-01-01T10:00:00Z',
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await submitResponse(formId, mockResponseDto);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/forms/${formId}/responses`,
        mockResponseDto
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.formId).toBe(1);
      expect(result.answers).toHaveLength(2);
    });

    test('submits response with file upload', async () => {
      const formId = 2;
      const mockResponseDto = {
        answers: [
          { fieldId: 1, value: 'Answer text' },
          { fieldId: 2, fileId: 'file123', fileName: 'document.pdf' },
        ],
      };

      const mockResponse = {
        data: {
          id: 2,
          formId: 2,
          answers: mockResponseDto.answers,
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await submitResponse(formId, mockResponseDto);

      expect(result.answers[1].fileId).toBe('file123');
    });

    test('handles error when submitting invalid response', async () => {
      const formId = 1;
      const mockResponseDto = {
        answers: [],
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid response data' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(submitResponse(formId, mockResponseDto)).rejects.toEqual(mockError);
    });

    test('handles error when form not found', async () => {
      const formId = 999;
      const mockResponseDto = {
        answers: [{ fieldId: 1, value: 'Test' }],
      };

      const mockError = {
        response: {
          status: 404,
          data: { message: 'Form not found' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(submitResponse(formId, mockResponseDto)).rejects.toEqual(mockError);
    });

    test('handles network error during submission', async () => {
      const formId = 1;
      const mockResponseDto = { answers: [] };
      const networkError = new Error('Network Error');

      axiosInstance.post.mockRejectedValue(networkError);

      await expect(submitResponse(formId, mockResponseDto)).rejects.toThrow('Network Error');
    });

    test('submits response with multiple field types', async () => {
      const formId = 3;
      const mockResponseDto = {
        answers: [
          { fieldId: 1, value: 'Short text answer' },
          { fieldId: 2, value: 'Long text answer with more details' },
          { fieldId: 3, value: '2024-01-15' },
          { fieldId: 4, value: 'Option A' },
          { fieldId: 5, value: 42 },
        ],
      };

      const mockResponse = {
        data: {
          id: 3,
          formId: 3,
          answers: mockResponseDto.answers,
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await submitResponse(formId, mockResponseDto);

      expect(result.answers).toHaveLength(5);
    });
  });

  // =========================
  // 📋 GET RESPONSES FOR FORM TESTS
  // =========================
  describe('getResponsesForForm', () => {
    test('successfully fetches responses for a specific form', async () => {
      const formId = 1;
      const mockResponse = {
        data: [
          {
            id: 1,
            formId: 1,
            answers: [{ fieldId: 1, value: 'Answer 1' }],
            submittedAt: '2024-01-01',
          },
          {
            id: 2,
            formId: 1,
            answers: [{ fieldId: 1, value: 'Answer 2' }],
            submittedAt: '2024-01-02',
          },
        ],
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getResponsesForForm(formId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/forms/${formId}/responses`);
      expect(result).toEqual(mockResponse.data);
      expect(result).toHaveLength(2);
    });

    test('returns empty array when no responses exist', async () => {
      const formId = 2;
      const mockResponse = {
        data: [],
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getResponsesForForm(formId);

      expect(result).toEqual([]);
    });

    test('handles error when form not found', async () => {
      const formId = 999;
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Form not found' },
        },
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getResponsesForForm(formId)).rejects.toEqual(mockError);
    });

    test('handles unauthorized access error', async () => {
      const formId = 1;
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Unauthorized access' },
        },
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getResponsesForForm(formId)).rejects.toEqual(mockError);
    });

    test('fetches responses with complete answer data', async () => {
      const formId = 3;
      const mockResponse = {
        data: [
          {
            id: 1,
            formId: 3,
            respondentName: 'John Doe',
            answers: [
              { fieldId: 1, fieldLabel: 'Name', value: 'John Doe' },
              { fieldId: 2, fieldLabel: 'Email', value: 'john@example.com' },
            ],
            submittedAt: '2024-01-01T10:00:00Z',
          },
        ],
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getResponsesForForm(formId);

      expect(result[0].respondentName).toBe('John Doe');
      expect(result[0].answers).toHaveLength(2);
    });
  });

  // =========================
  // 👤 GET ALL RESPONSES BY LEARNER TESTS
  // =========================
  describe('getAllResponsesByLearner', () => {
    test('fetches all responses by learner with default parameters', async () => {
      const mockResponse = {
        data: {
          items: [
            { id: 1, formTitle: 'Form 1', submittedAt: '2024-01-01' },
            { id: 2, formTitle: 'Form 2', submittedAt: '2024-01-02' },
          ],
          totalCount: 2,
          pageNumber: 1,
          pageSize: 6,
        },
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getAllResponsesByLearner();

      expect(axiosInstance.get).toHaveBeenCalledWith('/responses/my-responses', {
        params: {
          search: '',
          pageNumber: 1,
          pageSize: 6,
        },
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.items).toHaveLength(2);
    });

    test('fetches responses with custom pagination', async () => {
      const mockResponse = {
        data: {
          items: [],
          totalCount: 50,
          pageNumber: 3,
          pageSize: 10,
        },
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getAllResponsesByLearner('', 3, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith('/responses/my-responses', {
        params: {
          search: '',
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
          items: [
            { id: 1, formTitle: 'Survey Form', submittedAt: '2024-01-01' },
          ],
          totalCount: 1,
          pageNumber: 1,
          pageSize: 6,
        },
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getAllResponsesByLearner('Survey');

      expect(axiosInstance.get).toHaveBeenCalledWith('/responses/my-responses', {
        params: {
          search: 'Survey',
          pageNumber: 1,
          pageSize: 6,
        },
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].formTitle).toBe('Survey Form');
    });

    test('returns empty items when no responses found', async () => {
      const mockResponse = {
        data: {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 6,
        },
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getAllResponsesByLearner();

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    test('handles error when fetching learner responses', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(getAllResponsesByLearner()).rejects.toEqual(mockError);
    });

    test('fetches responses with all parameters', async () => {
      const mockResponse = {
        data: {
          items: [
            { id: 5, formTitle: 'Feedback Form', submittedAt: '2024-01-05' },
          ],
          totalCount: 15,
          pageNumber: 2,
          pageSize: 10,
        },
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getAllResponsesByLearner('Feedback', 2, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith('/responses/my-responses', {
        params: {
          search: 'Feedback',
          pageNumber: 2,
          pageSize: 10,
        },
      });
      expect(result.totalCount).toBe(15);
    });

    test('handles network error when fetching responses', async () => {
      const networkError = new Error('Network Error');
      axiosInstance.get.mockRejectedValue(networkError);

      await expect(getAllResponsesByLearner()).rejects.toThrow('Network Error');
    });
  });

  // =========================
  // 📥 DOWNLOAD FILE TESTS
  // =========================
  describe('downloadFile', () => {
    let createElementSpy;
    let appendChildSpy;
    let clickSpy;
    let removeSpy;
    let createObjectURLSpy;

    beforeEach(() => {
      // Mock DOM methods
      clickSpy = jest.fn();
      removeSpy = jest.fn();
      
      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        setAttribute: jest.fn(),
        click: clickSpy,
        remove: removeSpy,
      });

      appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});

      createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    });

    afterEach(() => {
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      createObjectURLSpy.mockRestore();
    });

    test('successfully downloads a file', async () => {
      const responseId = 1;
      const fileId = 'file123';
      const mockBlob = new Blob(['file content'], { type: 'application/pdf' });

      const mockResponse = {
        data: mockBlob,
      };

      axiosInstance.get.mockResolvedValue(mockResponse);

      await downloadFile(responseId, fileId);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `/responses/download-file/${responseId}/${fileId}`,
        { responseType: 'blob' }
      );

      expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });

    test('sets correct download filename', async () => {
      const responseId = 2;
      const fileId = 'file456';
      const mockBlob = new Blob(['content']);

      const mockResponse = {
        data: mockBlob,
      };

      const mockLink = {
        href: '',
        setAttribute: jest.fn(),
        click: jest.fn(),
        remove: jest.fn(),
      };

      createElementSpy.mockReturnValue(mockLink);
      axiosInstance.get.mockResolvedValue(mockResponse);

      await downloadFile(responseId, fileId);

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', `file_${fileId}`);
    });

    test('handles error when file not found', async () => {
      const responseId = 999;
      const fileId = 'nonexistent';

      const mockError = {
        response: {
          status: 404,
          data: { message: 'File not found' },
        },
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(downloadFile(responseId, fileId)).rejects.toEqual(mockError);
    });

    test('handles unauthorized access to file', async () => {
      const responseId = 1;
      const fileId = 'file123';

      const mockError = {
        response: {
          status: 403,
          data: { message: 'Unauthorized access' },
        },
      };

      axiosInstance.get.mockRejectedValue(mockError);

      await expect(downloadFile(responseId, fileId)).rejects.toEqual(mockError);
    });

    test('handles network error during download', async () => {
      const responseId = 1;
      const fileId = 'file123';
      const networkError = new Error('Network Error');

      axiosInstance.get.mockRejectedValue(networkError);

      await expect(downloadFile(responseId, fileId)).rejects.toThrow('Network Error');
    });

    test('uses blob response type for file download', async () => {
      const responseId = 1;
      const fileId = 'file123';
      const mockBlob = new Blob(['content']);

      axiosInstance.get.mockResolvedValue({ data: mockBlob });

      await downloadFile(responseId, fileId);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ responseType: 'blob' })
      );
    });

    test('creates blob URL and triggers download', async () => {
      const responseId = 3;
      const fileId = 'document789';
      const mockBlob = new Blob(['test content'], { type: 'text/plain' });

      axiosInstance.get.mockResolvedValue({ data: mockBlob });

      await downloadFile(responseId, fileId);

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
    });
  });

  // =========================
  // 🔗 API ENDPOINT TESTS
  // =========================
  describe('API Endpoint Paths', () => {
    test('submitResponse uses correct endpoint', async () => {
      axiosInstance.post.mockResolvedValue({ data: {} });
      await submitResponse(1, {});
      expect(axiosInstance.post).toHaveBeenCalledWith('/forms/1/responses', expect.any(Object));
    });

    test('getResponsesForForm uses correct endpoint', async () => {
      axiosInstance.get.mockResolvedValue({ data: [] });
      await getResponsesForForm(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/forms/1/responses');
    });

    test('getAllResponsesByLearner uses correct endpoint', async () => {
      axiosInstance.get.mockResolvedValue({ data: {} });
      await getAllResponsesByLearner();
      expect(axiosInstance.get).toHaveBeenCalledWith('/responses/my-responses', expect.any(Object));
    });

    test('downloadFile uses correct endpoint', async () => {
      axiosInstance.get.mockResolvedValue({ data: new Blob() });
      
      // Mock DOM methods to prevent errors
      jest.spyOn(document, 'createElement').mockReturnValue({
        href: '',
        setAttribute: jest.fn(),
        click: jest.fn(),
        remove: jest.fn(),
      });
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock');

      await downloadFile(1, 'file123');
      
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/responses/download-file/1/file123',
        expect.objectContaining({ responseType: 'blob' })
      );
    });
  });
});
