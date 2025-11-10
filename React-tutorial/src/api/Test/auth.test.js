import { login, register } from '../auth';
import axiosInstance from '../axiosInstance';

// Mock axiosInstance
jest.mock('../axiosInstance');

describe('auth.js - Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('login', () => {
    test('successfully logs in with valid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await login(mockCredentials);

      expect(console.log).toHaveBeenCalledWith(mockCredentials);
      expect(axiosInstance.post).toHaveBeenCalledWith('/login', mockCredentials);
      expect(result).toEqual(mockResponse.data);
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });

    test('logs credentials to console', async () => {
      const mockCredentials = {
        email: 'user@test.com',
        password: 'secret',
      };

      const mockResponse = {
        data: { token: 'token123' },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      await login(mockCredentials);

      expect(console.log).toHaveBeenCalledWith(mockCredentials);
    });

    test('handles login with username instead of email', async () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: 2, username: 'testuser' },
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await login(mockCredentials);

      expect(axiosInstance.post).toHaveBeenCalledWith('/login', mockCredentials);
      expect(result.user.username).toBe('testuser');
    });

    test('throws error when credentials are invalid', async () => {
      const mockCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(login(mockCredentials)).rejects.toEqual(mockError);
      expect(axiosInstance.post).toHaveBeenCalledWith('/login', mockCredentials);
    });

    test('handles network error during login', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network Error');
      axiosInstance.post.mockRejectedValue(networkError);

      await expect(login(mockCredentials)).rejects.toThrow('Network Error');
    });

    test('handles server error (500) during login', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
      };

      axiosInstance.post.mockRejectedValue(serverError);

      await expect(login(mockCredentials)).rejects.toEqual(serverError);
    });
  });

  describe('register', () => {
    test('successfully registers a new user', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await register(mockUser);

      expect(axiosInstance.post).toHaveBeenCalledWith('/register', mockUser);
      expect(result).toEqual(mockResponse.data);
      expect(result.user.email).toBe('john@example.com');
    });

    test('registers user with additional fields', async () => {
      const mockUser = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'securepass',
        role: 'admin',
        phone: '1234567890',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          user: {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
          },
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await register(mockUser);

      expect(axiosInstance.post).toHaveBeenCalledWith('/register', mockUser);
      expect(result.user.role).toBe('admin');
    });

    test('throws error when email already exists', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      const mockError = {
        response: {
          status: 409,
          data: { message: 'Email already exists' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(register(mockUser)).rejects.toEqual(mockError);
      expect(axiosInstance.post).toHaveBeenCalledWith('/register', mockUser);
    });

    test('throws error when required fields are missing', async () => {
      const mockUser = {
        email: 'incomplete@example.com',
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Missing required fields' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(register(mockUser)).rejects.toEqual(mockError);
    });

    test('handles network error during registration', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network Error');
      axiosInstance.post.mockRejectedValue(networkError);

      await expect(register(mockUser)).rejects.toThrow('Network Error');
    });

    test('handles validation error for weak password', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Password too weak' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(register(mockUser)).rejects.toEqual(mockError);
    });

    test('handles invalid email format error', async () => {
      const mockUser = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid email format' },
        },
      };

      axiosInstance.post.mockRejectedValue(mockError);

      await expect(register(mockUser)).rejects.toEqual(mockError);
    });

    test('returns token upon successful registration', async () => {
      const mockUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          token: 'new-user-token',
          user: {
            id: 3,
            name: 'New User',
            email: 'newuser@example.com',
          },
        },
      };

      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await register(mockUser);

      expect(result.token).toBe('new-user-token');
      expect(result.user.id).toBe(3);
    });
  });

  describe('API endpoint paths', () => {
    test('login uses correct endpoint', async () => {
      const mockCredentials = { email: 'test@test.com', password: 'pass' };
      axiosInstance.post.mockResolvedValue({ data: {} });

      await login(mockCredentials);

      expect(axiosInstance.post).toHaveBeenCalledWith('/login', expect.any(Object));
    });

    test('register uses correct endpoint', async () => {
      const mockUser = { name: 'Test', email: 'test@test.com', password: 'pass' };
      axiosInstance.post.mockResolvedValue({ data: {} });

      await register(mockUser);

      expect(axiosInstance.post).toHaveBeenCalledWith('/register', expect.any(Object));
    });
  });
});
