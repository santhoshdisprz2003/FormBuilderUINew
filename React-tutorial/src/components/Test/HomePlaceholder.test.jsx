import { render, screen, fireEvent } from '@testing-library/react';
import HomePlaceholder from '../HomePlaceholder';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
  },
}));

// Mock the home avatar image
jest.mock('../../assets/home_avatar.jpg', () => 'home-avatar.jpg');

describe('HomePlaceholder Component', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (onCreate = mockOnCreate) => {
    return render(<HomePlaceholder onCreate={onCreate} />);
  };

  test('renders the component with all elements', () => {
    renderComponent();

    // Check if the image is rendered
    const image = screen.getByAltText('Create Form');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('home-avatar');

    // Check if the heading is rendered
    expect(screen.getByText('Create a Form Template')).toBeInTheDocument();

    // Check if the description is rendered
    expect(screen.getByText('Create templates that can be used in various other features.')).toBeInTheDocument();

    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /create form/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('create-button');
  });

  test('calls onCreate when Create Form button is clicked', () => {
    renderComponent();

    const createButton = screen.getByRole('button', { name: /create form/i });
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  test('calls onCreate multiple times when button is clicked multiple times', () => {
    renderComponent();

    const createButton = screen.getByRole('button', { name: /create form/i });
    
    fireEvent.click(createButton);
    fireEvent.click(createButton);
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(3);
  });

  test('renders with correct image source', () => {
    renderComponent();

    const image = screen.getByAltText('Create Form');
    expect(image).toHaveAttribute('src', 'home-avatar.jpg');
  });

  test('renders container with correct class', () => {
    const { container } = renderComponent();

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  test('button has correct text content', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /create form/i });
    expect(button).toHaveTextContent('Create Form');
  });

  test('heading has correct text', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Create a Form Template');
  });

  test('description paragraph is present', () => {
    renderComponent();

    const description = screen.getByText(/Create templates that can be used in various other features/i);
    expect(description.tagName).toBe('P');
  });

  test('does not call onCreate on initial render', () => {
    renderComponent();

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  test('works without onCreate prop', () => {
    // This should not throw an error
    expect(() => {
      render(<HomePlaceholder />);
    }).not.toThrow();
  });

  test('handles undefined onCreate gracefully', () => {
    render(<HomePlaceholder onCreate={undefined} />);

    const createButton = screen.getByRole('button', { name: /create form/i });
    
    // Should not throw error when clicked
    expect(() => {
      fireEvent.click(createButton);
    }).not.toThrow();
  });
});
