// Mock axios BEFORE any imports
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
  
  return {
    create: jest.fn(() => mockAxiosInstance),
  };
});

import axios from 'axios';

describe('axiosInstance.js - Axios Configuration', () => {
  let requestInterceptor;
  let responseInterceptor;

  beforeAll(() => {
    // Clear any previous mocks
    jest.clearAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // =========================
  // 🔧 INSTANCE CREATION TESTS
  // =========================
  describe('Axios Instance Creation', () => {
    test('creates axios instance with correct base URL', () => {
      // Clear the module cache and re-import
      jest.resetModules();
      
      // Re-mock axios
      jest.doMock('axios', () => ({
        create: jest.fn(() => ({
          interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
          },
        })),
      }));

      const axios = require('axios');
      require('../axiosInstance');

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:5214/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('sets correct default headers', () => {
      jest.resetModules();
      
      jest.doMock('axios', () => ({
        create: jest.fn(() => ({
          interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
          },
        })),
      }));

      const axios = require('axios');
      require('../axiosInstance');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    test('uses correct base URL', () => {
      jest.resetModules();
      
      jest.doMock('axios', () => ({
        create: jest.fn(() => ({
          interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
          },
        })),
      }));

      const axios = require('axios');
      require('../axiosInstance');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:5214/api',
        })
      );
    });
  });

  // =========================
  // 🔐 REQUEST INTERCEPTOR TESTS
  // =========================
  describe('Request Interceptor', () => {
    beforeEach(() => {
      jest.resetModules();
      
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn((handler) => {
              requestInterceptor = handler;
            }),
          },
          response: {
            use: jest.fn((handler) => {
              responseInterceptor = handler;
            }),
          },
        },
      };

      jest.doMock('axios', () => ({
        create: jest.fn(() => mockInstance),
      }));

      require('../axiosInstance');
    });

    test('adds Authorization header when token exists and endpoint is not excluded', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      const config = {
        url: '/forms',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('does not add Authorization header for /login endpoint', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      const config = {
        url: '/login',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('does not add Authorization header for /register endpoint', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      const config = {
        url: '/register',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('does not add Authorization header when token does not exist', () => {
      const config = {
        url: '/forms',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('handles URL with /login path correctly', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      const config = {
        url: 'http://localhost:5214/api/login',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('handles URL with /register path correctly', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);

      const config = {
        url: 'http://localhost:5214/api/register',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('adds token for protected endpoints', () => {
      const token = 'protected-token';
      localStorage.setItem('token', token);

      const protectedEndpoints = [
        '/forms',
        '/forms/123',
        '/forms/formconfig',
        '/forms/formlayout/1',
        '/responses/my-responses',
        '/admin/forms/1/responses',
      ];

      protectedEndpoints.forEach((url) => {
        const config = {
          url,
          headers: {},
        };

        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBe(`Bearer ${token}`);
      });
    });

    test('preserves existing headers when adding Authorization', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const config = {
        url: '/forms',
        headers: {
          'Custom-Header': 'custom-value',
          'Content-Type': 'application/json',
        },
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
      expect(result.headers['Custom-Header']).toBe('custom-value');
      expect(result.headers['Content-Type']).toBe('application/json');
    });

    test('handles null token gracefully', () => {
      localStorage.setItem('token', null);

      const config = {
        url: '/forms',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('handles empty string token', () => {
      localStorage.setItem('token', '');

      const config = {
        url: '/forms',
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    test('handles undefined URL in config', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const config = {
        url: undefined,
        headers: {},
      };

      const result = requestInterceptor(config);

      // Should add token since URL is undefined (not excluded)
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('returns config object unchanged except for Authorization header', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      const config = {
        url: '/forms',
        method: 'GET',
        params: { id: 1 },
        data: { name: 'Test' },
        headers: {},
      };

      const result = requestInterceptor(config);

      expect(result.url).toBe('/forms');
      expect(result.method).toBe('GET');
      expect(result.params).toEqual({ id: 1 });
      expect(result.data).toEqual({ name: 'Test' });
    });

    test('handles partial URL matches correctly', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      // Should NOT exclude these (they contain 'login' but are not '/login')
      const config1 = {
        url: '/user/login-history',
        headers: {},
      };

      const result1 = requestInterceptor(config1);
      expect(result1.headers.Authorization).toBe(`Bearer ${token}`);

      // Should exclude this
      const config2 = {
        url: '/login',
        headers: {},
      };

      const result2 = requestInterceptor(config2);
      expect(result2.headers.Authorization).toBeUndefined();
    });
  });

  // =========================
  // 📨 RESPONSE INTERCEPTOR TESTS
  // =========================
  describe('Response Interceptor', () => {
    beforeEach(() => {
      jest.resetModules();
      
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn((handler) => {
              requestInterceptor = handler;
            }),
          },
          response: {
            use: jest.fn((handler) => {
              responseInterceptor = handler;
            }),
          },
        },
      };

      jest.doMock('axios', () => ({
        create: jest.fn(() => mockInstance),
      }));

      require('../axiosInstance');
    });

    test('returns response unchanged on success', () => {
      const mockResponse = {
        data: { message: 'Success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const result = responseInterceptor(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    test('passes through response data correctly', () => {
      const mockResponse = {
        data: {
          id: 1,
          title: 'Test Form',
          description: 'Test Description',
        },
        status: 200,
      };

      const result = responseInterceptor(mockResponse);

      expect(result.data).toEqual(mockResponse.data);
    });

    test('handles different status codes', () => {
      const statusCodes = [200, 201, 204, 304];

      statusCodes.forEach((status) => {
        const mockResponse = {
          data: {},
          status,
        };

        const result = responseInterceptor(mockResponse);

        expect(result.status).toBe(status);
      });
    });

    test('preserves response headers', () => {
      const mockResponse = {
        data: {},
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
        },
      };

      const result = responseInterceptor(mockResponse);

      expect(result.headers).toEqual(mockResponse.headers);
    });

    test('preserves response config', () => {
      const mockResponse = {
        data: {},
        status: 200,
        config: {
          url: '/forms',
          method: 'GET',
        },
      };

      const result = responseInterceptor(mockResponse);

      expect(result.config).toEqual(mockResponse.config);
    });
  });

  // =========================
  // 🔄 INTERCEPTOR REGISTRATION TESTS
  // =========================
  describe('Interceptor Registration', () => {
    test('registers request interceptor', () => {
      jest.resetModules();
      
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      };

      jest.doMock('axios', () => ({
        create: jest.fn(() => mockInstance),
      }));

      require('../axiosInstance');

      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test('registers response interceptor', () => {
      jest.resetModules();
      
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      };

      jest.doMock('axios', () => ({
        create: jest.fn(() => mockInstance),
      }));

      require('../axiosInstance');

      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
      expect(mockInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  // =========================
  // 🧪 INTEGRATION TESTS
  // =========================
  describe('Integration Tests', () => {
    beforeEach(() => {
      jest.resetModules();
      
      const mockInstance = {
        interceptors: {
          request: {
            use: jest.fn((handler) => {
              requestInterceptor = handler;
            }),
          },
          response: {
            use: jest.fn(),
          },
        },
      };

      jest.doMock('axios', () => ({
        create: jest.fn(() => mockInstance),
      }));

      require('../axiosInstance');
    });

    test('excluded endpoints list is correct', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      // Test excluded endpoints
      const excludedUrls = ['/login', '/register'];
      excludedUrls.forEach((url) => {
        const config = { url, headers: {} };
        const result = requestInterceptor(config);
        expect(result.headers.Authorization).toBeUndefined();
      });

      // Test non-excluded endpoint
      const config = { url: '/forms', headers: {} };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('handles multiple requests with different tokens', () => {
      // First request with token1
      localStorage.setItem('token', 'token1');
      const config1 = { url: '/forms', headers: {} };
      const result1 = requestInterceptor(config1);
      expect(result1.headers.Authorization).toBe('Bearer token1');

      // Second request with token2
      localStorage.setItem('token', 'token2');
      const config2 = { url: '/responses', headers: {} };
      const result2 = requestInterceptor(config2);
      expect(result2.headers.Authorization).toBe('Bearer token2');

      // Third request with no token
      localStorage.removeItem('token');
      const config3 = { url: '/forms', headers: {} };
      const result3 = requestInterceptor(config3);
      expect(result3.headers.Authorization).toBeUndefined();
    });
  });
});
