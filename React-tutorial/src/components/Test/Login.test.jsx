import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { login, register } from '../../api/auth';

// Mock the auth API
jest.mock('../../api/auth');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test('renders login form by default', () => {
    renderLogin();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('toggles to register form', () => {
    renderLogin();
    const toggleLink = screen.getByText('Register');
    fireEvent.click(toggleLink);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  test('toggles back to login form from register', () => {
    renderLogin();
    fireEvent.click(screen.getByText('Register'));
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        role: 'Learner'
      }
    };
    login.mockResolvedValue(mockResponse);

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
        role: 'Learner'
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('role', 'Learner');
      expect(window.location.href).toBe('/');
    });
  });

  test('handles failed login', async () => {
    const errorMessage = 'Invalid credentials';
    login.mockRejectedValue({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(`❌ ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    const mockResponse = { success: true };
    register.mockResolvedValue(mockResponse);

    renderLogin();

    // Switch to register mode
    fireEvent.click(screen.getByText('Register'));

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'newuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'newpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'newpass',
        role: 'Learner'
      });
      expect(screen.getByText('✅ Registration successful! Please log in.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  test('handles failed registration', async () => {
    const errorMessage = 'Username already exists';
    register.mockRejectedValue({
      response: {
        data: {
          message: errorMessage
        }
      }
    });

    renderLogin();

    // Switch to register mode
    fireEvent.click(screen.getByText('Register'));

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'existinguser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(`❌ ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('handles error without response message', async () => {
    login.mockRejectedValue(new Error('Network error'));

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('❌ Something went wrong')).toBeInTheDocument();
    });
  });

  test('updates username input', () => {
    renderLogin();
    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.change(usernameInput, { target: { value: 'myusername' } });
    expect(usernameInput.value).toBe('myusername');
  });

  test('updates password input', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
    expect(passwordInput.value).toBe('mypassword');
  });
});
