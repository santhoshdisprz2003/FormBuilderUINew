import {
  createFormConfig,
  updateFormConfig,
  createFormLayout,
  updateFormLayout,
  getAllForms,
  getFormById,
  publishForm,
  deleteForm,
} from '../formService';
import axiosInstance from '../axiosInstance';

// Mock axiosInstance
jest.mock('../axiosInstance');

describe('formService.js - Form Service API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // 📋 FORM CONFIGURATION TESTS
  // =========================
  describe('Form Configuration', () => {
    describe('createFormConfig', () => {
      test('successfully creates a new form configuration', async () => {
        const mockConfigDto = {
          title: 'New Form',
          description: 'Form description',
          visibility: true,
        };

        const mockResponse = {
          data: {
            id: 1,
            title: 'New Form',
            description: 'Form description',
            visibility: true,
            createdAt: '2024-01-01',
          },
        };

        axiosInstance.post.mockResolvedValue(mockResponse);

        const result = await createFormConfig(mockConfigDto);

        expect(axiosInstance.post).toHaveBeenCalledWith('/forms/formconfig', mockConfigDto);
        expect(result).toEqual(mockResponse.data);
        expect(result.id).toBe(1);
        expect(result.title).toBe('New Form');
      });

      test('handles error when creating form config fails', async () => {
        const mockConfigDto = {
          title: 'Invalid Form',
        };

        const mockError = {
          response: {
            status: 400,
            data: { message: 'Invalid form configuration' },
          },
        };

        axiosInstance.post.mockRejectedValue(mockError);

        await expect(createFormConfig(mockConfigDto)).rejects.toEqual(mockError);
        expect(axiosInstance.post).toHaveBeenCalledWith('/forms/formconfig', mockConfigDto);
      });

      test('creates form config with minimal data', async () => {
        const mockConfigDto = {
          title: 'Minimal Form',
        };

        const mockResponse = {
          data: {
            id: 2,
            title: 'Minimal Form',
          },
        };

        axiosInstance.post.mockResolvedValue(mockResponse);

        const result = await createFormConfig(mockConfigDto);

        expect(result.title).toBe('Minimal Form');
      });
    });

    describe('updateFormConfig', () => {
      test('successfully updates an existing form configuration', async () => {
        const formId = 1;
        const mockConfigDto = {
          title: 'Updated Form',
          description: 'Updated description',
          visibility: false,
        };

        const mockResponse = {
          data: {
            id: 1,
            title: 'Updated Form',
            description: 'Updated description',
            visibility: false,
            updatedAt: '2024-01-02',
          },
        };

        axiosInstance.put.mockResolvedValue(mockResponse);

        const result = await updateFormConfig(formId, mockConfigDto);

        expect(axiosInstance.put).toHaveBeenCalledWith(`/forms/formconfig/${formId}`, mockConfigDto);
        expect(result).toEqual(mockResponse.data);
        expect(result.title).toBe('Updated Form');
      });

      test('handles error when form config not found', async () => {
        const formId = 999;
        const mockConfigDto = { title: 'Update' };

        const mockError = {
          response: {
            status: 404,
            data: { message: 'Form configuration not found' },
          },
        };

        axiosInstance.put.mockRejectedValue(mockError);

        await expect(updateFormConfig(formId, mockConfigDto)).rejects.toEqual(mockError);
      });

      test('updates only specific fields', async () => {
        const formId = 1;
        const mockConfigDto = {
          title: 'Partially Updated',
        };

        const mockResponse = {
          data: {
            id: 1,
            title: 'Partially Updated',
            description: 'Original description',
          },
        };

        axiosInstance.put.mockResolvedValue(mockResponse);

        const result = await updateFormConfig(formId, mockConfigDto);

        expect(result.title).toBe('Partially Updated');
        expect(result.description).toBe('Original description');
      });
    });
  });

  // =========================
  // 🧩 FORM LAYOUT TESTS
  // =========================
  describe('Form Layout', () => {
    describe('createFormLayout', () => {
      test('successfully creates a form layout', async () => {
        const formId = 1;
        const mockLayoutDto = {
          headerCard: {
            title: 'Form Header',
            description: 'Header description',
          },
          fields: [
            { label: 'Question 1', type: 'short-text' },
            { label: 'Question 2', type: 'long-text' },
          ],
        };

        const mockResponse = {
          data: {
            id: 1,
            formId: 1,
            headerCard: mockLayoutDto.headerCard,
            fields: mockLayoutDto.fields,
          },
        };

        axiosInstance.post.mockResolvedValue(mockResponse);

        const result = await createFormLayout(formId, mockLayoutDto);

        expect(axiosInstance.post).toHaveBeenCalledWith(`/forms/formlayout/${formId}`, mockLayoutDto);
        expect(result).toEqual(mockResponse.data);
        expect(result.fields).toHaveLength(2);
      });

      test('creates layout with empty fields array', async () => {
        const formId = 2;
        const mockLayoutDto = {
          headerCard: { title: 'Empty Form' },
          fields: [],
        };

        const mockResponse = {
          data: {
            id: 2,
            formId: 2,
            headerCard: mockLayoutDto.headerCard,
            fields: [],
          },
        };

        axiosInstance.post.mockResolvedValue(mockResponse);

        const result = await createFormLayout(formId, mockLayoutDto);

        expect(result.fields).toEqual([]);
      });

      test('handles error when creating layout for non-existent form', async () => {
        const formId = 999;
        const mockLayoutDto = { headerCard: {}, fields: [] };

        const mockError = {
          response: {
            status: 404,
            data: { message: 'Form not found' },
          },
        };

        axiosInstance.post.mockRejectedValue(mockError);

        await expect(createFormLayout(formId, mockLayoutDto)).rejects.toEqual(mockError);
      });
    });

    describe('updateFormLayout', () => {
      test('successfully updates a form layout', async () => {
        const formId = 1;
        const mockLayoutDto = {
          headerCard: {
            title: 'Updated Header',
            description: 'Updated description',
          },
          fields: [
            { label: 'Updated Question 1', type: 'number' },
          ],
        };

        const mockResponse = {
          data: {
            id: 1,
            formId: 1,
            headerCard: mockLayoutDto.headerCard,
            fields: mockLayoutDto.fields,
            updatedAt: '2024-01-02',
          },
        };

        axiosInstance.put.mockResolvedValue(mockResponse);

        const result = await updateFormLayout(formId, mockLayoutDto);

        expect(axiosInstance.put).toHaveBeenCalledWith(`/forms/formlayout/${formId}`, mockLayoutDto);
        expect(result).toEqual(mockResponse.data);
        expect(result.headerCard.title).toBe('Updated Header');
      });

      test('updates layout with additional fields', async () => {
        const formId = 1;
        const mockLayoutDto = {
          fields: [
            { label: 'Q1', type: 'short-text' },
            { label: 'Q2', type: 'date-picker' },
            { label: 'Q3', type: 'file-upload' },
          ],
        };

        const mockResponse = {
          data: {
            formId: 1,
            fields: mockLayoutDto.fields,
          },
        };

        axiosInstance.put.mockResolvedValue(mockResponse);

        const result = await updateFormLayout(formId, mockLayoutDto);

        expect(result.fields).toHaveLength(3);
      });

      test('handles error when updating non-existent layout', async () => {
        const formId = 999;
        const mockLayoutDto = { fields: [] };

        const mockError = {
          response: {
            status: 404,
            data: { message: 'Form layout not found' },
          },
        };

        axiosInstance.put.mockRejectedValue(mockError);

        await expect(updateFormLayout(formId, mockLayoutDto)).rejects.toEqual(mockError);
      });
    });
  });

  // =========================
  // 🔍 FETCH / VIEW TESTS
  // =========================
  describe('Fetch and View Forms', () => {
    describe('getAllForms', () => {
      test('fetches all forms with default pagination', async () => {
        const mockResponse = {
          data: {
            forms: [
              { id: 1, title: 'Form 1' },
              { id: 2, title: 'Form 2' },
            ],
            total: 2,
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getAllForms();

        expect(axiosInstance.get).toHaveBeenCalledWith('/forms', {
          params: { offset: 0, limit: 10, search: '' },
        });
        expect(result).toEqual(mockResponse.data);
        expect(result.forms).toHaveLength(2);
      });

      test('fetches forms with custom pagination parameters', async () => {
        const mockResponse = {
          data: {
            forms: [
              { id: 11, title: 'Form 11' },
              { id: 12, title: 'Form 12' },
            ],
            total: 50,
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getAllForms(10, 20);

        expect(axiosInstance.get).toHaveBeenCalledWith('/forms', {
          params: { offset: 10, limit: 20, search: '' },
        });
        expect(result.total).toBe(50);
      });

      test('fetches forms with search parameter', async () => {
        const mockResponse = {
          data: {
            forms: [
              { id: 1, title: 'Survey Form' },
            ],
            total: 1,
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getAllForms(0, 10, 'Survey');

        expect(axiosInstance.get).toHaveBeenCalledWith('/forms', {
          params: { offset: 0, limit: 10, search: 'Survey' },
        });
        expect(result.forms).toHaveLength(1);
        expect(result.forms[0].title).toBe('Survey Form');
      });

      test('handles empty forms list', async () => {
        const mockResponse = {
          data: {
            forms: [],
            total: 0,
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getAllForms();

        expect(result.forms).toEqual([]);
        expect(result.total).toBe(0);
      });

      test('handles error when fetching forms', async () => {
        const mockError = new Error('Network Error');
        axiosInstance.get.mockRejectedValue(mockError);

        await expect(getAllForms()).rejects.toThrow('Network Error');
      });
    });

    describe('getFormById', () => {
      test('successfully fetches a form by ID', async () => {
        const formId = 1;
        const mockResponse = {
          data: {
            id: 1,
            config: {
              title: 'Test Form',
              description: 'Test Description',
            },
            layout: {
              headerCard: {},
              fields: [],
            },
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getFormById(formId);

        expect(axiosInstance.get).toHaveBeenCalledWith(`/forms/${formId}`);
        expect(result).toEqual(mockResponse.data);
        expect(result.id).toBe(1);
        expect(result.config.title).toBe('Test Form');
      });

      test('fetches form with complete layout', async () => {
        const formId = 2;
        const mockResponse = {
          data: {
            id: 2,
            config: {
              title: 'Complete Form',
            },
            layout: {
              headerCard: {
                title: 'Header',
                description: 'Description',
              },
              fields: [
                { label: 'Q1', type: 'short-text' },
                { label: 'Q2', type: 'number' },
              ],
            },
          },
        };

        axiosInstance.get.mockResolvedValue(mockResponse);

        const result = await getFormById(formId);

        expect(result.layout.fields).toHaveLength(2);
        expect(result.layout.headerCard.title).toBe('Header');
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

        await expect(getFormById(formId)).rejects.toEqual(mockError);
        expect(axiosInstance.get).toHaveBeenCalledWith(`/forms/${formId}`);
      });

      test('handles network error when fetching form', async () => {
        const formId = 1;
        const networkError = new Error('Network Error');
        axiosInstance.get.mockRejectedValue(networkError);

        await expect(getFormById(formId)).rejects.toThrow('Network Error');
      });
    });
  });

  // =========================
  // 🚀 PUBLISH / DELETE TESTS
  // =========================
  describe('Publish and Delete Forms', () => {
    describe('publishForm', () => {
      test('successfully publishes a form', async () => {
        const formId = 1;
        const mockResponse = {
          data: {
            id: 1,
            title: 'Published Form',
            isPublished: true,
            publishedAt: '2024-01-01',
          },
        };

        axiosInstance.put.mockResolvedValue(mockResponse);

        const result = await publishForm(formId);

        expect(axiosInstance.put).toHaveBeenCalledWith(`/forms/${formId}/publish`);
        expect(result).toEqual(mockResponse.data);
        expect(result.isPublished).toBe(true);
      });

      test('handles error when publishing non-existent form', async () => {
        const formId = 999;
        const mockError = {
          response: {
            status: 404,
            data: { message: 'Form not found' },
          },
        };

        axiosInstance.put.mockRejectedValue(mockError);

        await expect(publishForm(formId)).rejects.toEqual(mockError);
      });

      test('handles error when form is already published', async () => {
        const formId = 1;
        const mockError = {
          response: {
            status: 400,
            data: { message: 'Form is already published' },
          },
        };

        axiosInstance.put.mockRejectedValue(mockError);

        await expect(publishForm(formId)).rejects.toEqual(mockError);
      });

      test('handles network error during publish', async () => {
        const formId = 1;
        const networkError = new Error('Network Error');
        axiosInstance.put.mockRejectedValue(networkError);

        await expect(publishForm(formId)).rejects.toThrow('Network Error');
      });
    });

    describe('deleteForm', () => {
      test('successfully deletes a form', async () => {
        const formId = 1;
        const mockResponse = {
          data: {
            message: 'Form deleted successfully',
            deletedId: 1,
          },
        };

        axiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await deleteForm(formId);

        expect(axiosInstance.delete).toHaveBeenCalledWith(`/forms/${formId}`);
        expect(result).toEqual(mockResponse.data);
        expect(result.deletedId).toBe(1);
      });

      test('handles error when deleting non-existent form', async () => {
        const formId = 999;
        const mockError = {
          response: {
            status: 404,
            data: { message: 'Form not found' },
          },
        };

        axiosInstance.delete.mockRejectedValue(mockError);

        await expect(deleteForm(formId)).rejects.toEqual(mockError);
        expect(axiosInstance.delete).toHaveBeenCalledWith(`/forms/${formId}`);
      });

      test('handles error when deleting published form', async () => {
        const formId = 1;
        const mockError = {
          response: {
            status: 403,
            data: { message: 'Cannot delete published form' },
          },
        };

        axiosInstance.delete.mockRejectedValue(mockError);

        await expect(deleteForm(formId)).rejects.toEqual(mockError);
      });

      test('handles network error during delete', async () => {
        const formId = 1;
        const networkError = new Error('Network Error');
        axiosInstance.delete.mockRejectedValue(networkError);

        await expect(deleteForm(formId)).rejects.toThrow('Network Error');
      });

      test('deletes form and returns success message', async () => {
        const formId = 5;
        const mockResponse = {
          data: {
            message: 'Form deleted successfully',
          },
        };

        axiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await deleteForm(formId);

        expect(result.message).toBe('Form deleted successfully');
      });
    });
  });

  // =========================
  // 🔗 API ENDPOINT TESTS
  // =========================
  describe('API Endpoint Paths', () => {
    test('createFormConfig uses correct endpoint', async () => {
      axiosInstance.post.mockResolvedValue({ data: {} });
      await createFormConfig({});
      expect(axiosInstance.post).toHaveBeenCalledWith('/forms/formconfig', expect.any(Object));
    });

    test('updateFormConfig uses correct endpoint with ID', async () => {
      axiosInstance.put.mockResolvedValue({ data: {} });
      await updateFormConfig(1, {});
      expect(axiosInstance.put).toHaveBeenCalledWith('/forms/formconfig/1', expect.any(Object));
    });

    test('createFormLayout uses correct endpoint with formId', async () => {
      axiosInstance.post.mockResolvedValue({ data: {} });
      await createFormLayout(1, {});
      expect(axiosInstance.post).toHaveBeenCalledWith('/forms/formlayout/1', expect.any(Object));
    });

    test('updateFormLayout uses correct endpoint with formId', async () => {
      axiosInstance.put.mockResolvedValue({ data: {} });
      await updateFormLayout(1, {});
      expect(axiosInstance.put).toHaveBeenCalledWith('/forms/formlayout/1', expect.any(Object));
    });

    test('getAllForms uses correct endpoint', async () => {
      axiosInstance.get.mockResolvedValue({ data: {} });
      await getAllForms();
      expect(axiosInstance.get).toHaveBeenCalledWith('/forms', expect.any(Object));
    });

    test('getFormById uses correct endpoint with ID', async () => {
      axiosInstance.get.mockResolvedValue({ data: {} });
      await getFormById(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/forms/1');
    });

    test('publishForm uses correct endpoint with ID', async () => {
      axiosInstance.put.mockResolvedValue({ data: {} });
      await publishForm(1);
      expect(axiosInstance.put).toHaveBeenCalledWith('/forms/1/publish');
    });

    test('deleteForm uses correct endpoint with ID', async () => {
      axiosInstance.delete.mockResolvedValue({ data: {} });
      await deleteForm(1);
      expect(axiosInstance.delete).toHaveBeenCalledWith('/forms/1');
    });
  });
});
