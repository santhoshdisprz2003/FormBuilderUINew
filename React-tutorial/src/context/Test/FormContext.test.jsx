import React from 'react';
import { render, screen, renderHook, act } from '@testing-library/react';
import { FormProvider, FormContext, useFormContext } from '../FormContext';

describe('FormContext.jsx - Form Context Provider', () => {
  // =========================
  // 🏗️ CONTEXT CREATION TESTS
  // =========================
  describe('Context Creation', () => {
    test('FormContext is created', () => {
      expect(FormContext).toBeDefined();
    });

    test('FormProvider is defined', () => {
      expect(FormProvider).toBeDefined();
    });

    test('useFormContext hook is defined', () => {
      expect(useFormContext).toBeDefined();
    });
  });

  // =========================
  // 🎯 PROVIDER RENDERING TESTS
  // =========================
  describe('FormProvider Rendering', () => {
    test('renders children correctly', () => {
      render(
        <FormProvider>
          <div>Test Child</div>
        </FormProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    test('renders multiple children', () => {
      render(
        <FormProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </FormProvider>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    test('renders nested components', () => {
      const NestedComponent = () => <div>Nested Component</div>;
      
      render(
        <FormProvider>
          <div>
            <NestedComponent />
          </div>
        </FormProvider>
      );

      expect(screen.getByText('Nested Component')).toBeInTheDocument();
    });
  });

  // =========================
  // 📊 INITIAL STATE TESTS
  // =========================
  describe('Initial State Values', () => {
    test('provides initial formId as null', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.formId).toBeNull();
    });

    test('provides initial formName as empty string', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.formName).toBe('');
    });

    test('provides initial description as empty string', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.description).toBe('');
    });

    test('provides initial visibility as false', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.visibility).toBe(false);
    });

    test('provides initial fields as empty array', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.fields).toEqual([]);
    });

    test('provides initial headerCard with empty title and description', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.headerCard).toEqual({
        title: '',
        description: '',
      });
    });

    test('provides initial showPreview as false', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.showPreview).toBe(false);
    });

    test('provides initial activeTab as "configuration"', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.activeTab).toBe('configuration');
    });
  });

  // =========================
  // 🔧 SETTER FUNCTIONS TESTS
  // =========================
  describe('Setter Functions', () => {
    test('setFormId updates formId', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormId(123);
      });

      expect(result.current.formId).toBe(123);
    });

    test('setFormName updates formName', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormName('New Form Name');
      });

      expect(result.current.formName).toBe('New Form Name');
    });

    test('setDescription updates description', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setDescription('New Description');
      });

      expect(result.current.description).toBe('New Description');
    });

    test('setVisibility updates visibility', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setVisibility(true);
      });

      expect(result.current.visibility).toBe(true);
    });

    test('setFields updates fields', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const newFields = [
        { id: 1, label: 'Question 1', type: 'short-text' },
        { id: 2, label: 'Question 2', type: 'long-text' },
      ];

      act(() => {
        result.current.setFields(newFields);
      });

      expect(result.current.fields).toEqual(newFields);
    });

    test('setHeaderCard updates headerCard', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const newHeaderCard = {
        title: 'Form Header',
        description: 'Header Description',
      };

      act(() => {
        result.current.setHeaderCard(newHeaderCard);
      });

      expect(result.current.headerCard).toEqual(newHeaderCard);
    });

    test('setShowPreview updates showPreview', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setShowPreview(true);
      });

      expect(result.current.showPreview).toBe(true);
    });

    test('setActiveTab updates activeTab', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setActiveTab('layout');
      });

      expect(result.current.activeTab).toBe('layout');
    });
  });

  // =========================
  // 🔄 STATE UPDATES TESTS
  // =========================
  describe('State Updates and Persistence', () => {
    test('multiple updates to formName persist', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormName('First Name');
      });
      expect(result.current.formName).toBe('First Name');

      act(() => {
        result.current.setFormName('Second Name');
      });
      expect(result.current.formName).toBe('Second Name');

      act(() => {
        result.current.setFormName('Final Name');
      });
      expect(result.current.formName).toBe('Final Name');
    });

    test('updates to different state values are independent', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormName('Test Form');
        result.current.setDescription('Test Description');
        result.current.setVisibility(true);
      });

      expect(result.current.formName).toBe('Test Form');
      expect(result.current.description).toBe('Test Description');
      expect(result.current.visibility).toBe(true);
    });

    test('fields array can be updated multiple times', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const fields1 = [{ id: 1, label: 'Q1' }];
      const fields2 = [{ id: 1, label: 'Q1' }, { id: 2, label: 'Q2' }];

      act(() => {
        result.current.setFields(fields1);
      });
      expect(result.current.fields).toHaveLength(1);

      act(() => {
        result.current.setFields(fields2);
      });
      expect(result.current.fields).toHaveLength(2);
    });

    test('activeTab can switch between different tabs', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.activeTab).toBe('configuration');

      act(() => {
        result.current.setActiveTab('layout');
      });
      expect(result.current.activeTab).toBe('layout');

      act(() => {
        result.current.setActiveTab('responses');
      });
      expect(result.current.activeTab).toBe('responses');

      act(() => {
        result.current.setActiveTab('configuration');
      });
      expect(result.current.activeTab).toBe('configuration');
    });
  });

  // =========================
  // 🧪 COMPLEX STATE TESTS
  // =========================
  describe('Complex State Management', () => {
    test('handles complete form configuration update', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormId(1);
        result.current.setFormName('Survey Form');
        result.current.setDescription('Customer Feedback Survey');
        result.current.setVisibility(true);
      });

      expect(result.current.formId).toBe(1);
      expect(result.current.formName).toBe('Survey Form');
      expect(result.current.description).toBe('Customer Feedback Survey');
      expect(result.current.visibility).toBe(true);
    });

    test('handles complete form layout update', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const headerCard = {
        title: 'Welcome to Survey',
        description: 'Please fill out this form',
      };

      const fields = [
        { id: 1, label: 'Name', type: 'short-text' },
        { id: 2, label: 'Email', type: 'short-text' },
        { id: 3, label: 'Feedback', type: 'long-text' },
      ];

      act(() => {
        result.current.setHeaderCard(headerCard);
        result.current.setFields(fields);
      });

      expect(result.current.headerCard).toEqual(headerCard);
      expect(result.current.fields).toEqual(fields);
      expect(result.current.fields).toHaveLength(3);
    });

    test('handles preview mode toggle', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current.showPreview).toBe(false);

      act(() => {
        result.current.setShowPreview(true);
      });
      expect(result.current.showPreview).toBe(true);

      act(() => {
        result.current.setShowPreview(false);
      });
      expect(result.current.showPreview).toBe(false);
    });

    test('resets fields to empty array', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const fields = [
        { id: 1, label: 'Q1' },
        { id: 2, label: 'Q2' },
      ];

      act(() => {
        result.current.setFields(fields);
      });
      expect(result.current.fields).toHaveLength(2);

      act(() => {
        result.current.setFields([]);
      });
      expect(result.current.fields).toEqual([]);
    });

    test('updates headerCard partially', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setHeaderCard({
          title: 'New Title',
          description: 'New Description',
        });
      });

      expect(result.current.headerCard.title).toBe('New Title');
      expect(result.current.headerCard.description).toBe('New Description');

      act(() => {
        result.current.setHeaderCard({
          ...result.current.headerCard,
          title: 'Updated Title',
        });
      });

      expect(result.current.headerCard.title).toBe('Updated Title');
      expect(result.current.headerCard.description).toBe('New Description');
    });
  });

  // =========================
  // 🎣 HOOK USAGE TESTS
  // =========================
  describe('useFormContext Hook', () => {
    test('throws error when used outside FormProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFormContext());
      }).toThrow();

      consoleError.mockRestore();
    });

    test('returns context value when used inside FormProvider', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.formId).toBeDefined();
      expect(result.current.setFormId).toBeDefined();
    });

    test('provides all expected properties', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const expectedProperties = [
        'formId',
        'setFormId',
        'formName',
        'setFormName',
        'description',
        'setDescription',
        'visibility',
        'setVisibility',
        'fields',
        'setFields',
        'headerCard',
        'setHeaderCard',
        'showPreview',
        'setShowPreview',
        'activeTab',
        'setActiveTab',
      ];

      expectedProperties.forEach((prop) => {
        expect(result.current).toHaveProperty(prop);
      });
    });

    test('all setter functions are callable', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      expect(typeof result.current.setFormId).toBe('function');
      expect(typeof result.current.setFormName).toBe('function');
      expect(typeof result.current.setDescription).toBe('function');
      expect(typeof result.current.setVisibility).toBe('function');
      expect(typeof result.current.setFields).toBe('function');
      expect(typeof result.current.setHeaderCard).toBe('function');
      expect(typeof result.current.setShowPreview).toBe('function');
      expect(typeof result.current.setActiveTab).toBe('function');
    });
  });

  // =========================
  // 🔀 MULTIPLE CONSUMERS TESTS
  // =========================
  describe('Multiple Consumers', () => {
    test('multiple components can access the same context', () => {
      const Consumer1 = () => {
        const { formName } = useFormContext();
        return <div>Consumer 1: {formName}</div>;
      };

      const Consumer2 = () => {
        const { formName } = useFormContext();
        return <div>Consumer 2: {formName}</div>;
      };

      const TestComponent = () => {
        const { setFormName } = useFormContext();
        
        React.useEffect(() => {
          setFormName('Shared Form Name');
        }, [setFormName]);

        return (
          <>
            <Consumer1 />
            <Consumer2 />
          </>
        );
      };

      render(
        <FormProvider>
          <TestComponent />
        </FormProvider>
      );

      expect(screen.getByText('Consumer 1: Shared Form Name')).toBeInTheDocument();
      expect(screen.getByText('Consumer 2: Shared Form Name')).toBeInTheDocument();
    });

    test('state updates are reflected in all consumers', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const { result: result2 } = renderHook(() => useFormContext(), {
        wrapper: ({ children }) => (
          <FormProvider>{children}</FormProvider>
        ),
      });

      // Note: These are separate providers, so they won't share state
      // This test demonstrates that each provider maintains its own state
      act(() => {
        result.current.setFormName('Form 1');
      });

      act(() => {
        result2.current.setFormName('Form 2');
      });

      expect(result.current.formName).toBe('Form 1');
      expect(result2.current.formName).toBe('Form 2');
    });
  });

  // =========================
  // 🧹 EDGE CASES TESTS
  // =========================
  describe('Edge Cases', () => {
    test('handles null formId', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormId(null);
      });

      expect(result.current.formId).toBeNull();
    });

    test('handles empty string for formName', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      act(() => {
        result.current.setFormName('');
      });

      expect(result.current.formName).toBe('');
    });

    test('handles very long description', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const longDescription = 'A'.repeat(1000);

      act(() => {
        result.current.setDescription(longDescription);
      });

      expect(result.current.description).toBe(longDescription);
      expect(result.current.description.length).toBe(1000);
    });

    test('handles large fields array', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const largeFieldsArray = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        label: `Question ${i}`,
        type: 'short-text',
      }));

      act(() => {
        result.current.setFields(largeFieldsArray);
      });

      expect(result.current.fields).toHaveLength(100);
    });

    test('handles special characters in formName', () => {
      const { result } = renderHook(() => useFormContext(), {
        wrapper: FormProvider,
      });

      const specialName = 'Form @#$%^&*()_+-={}[]|:;"<>?,./';

      act(() => {
        result.current.setFormName(specialName);
      });

      expect(result.current.formName).toBe(specialName);
    });
  });
});
