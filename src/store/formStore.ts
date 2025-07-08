import { create } from 'zustand';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  step?: number; // For multi-step forms
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // Array of field IDs
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps?: FormStep[];
  isMultiStep: boolean;
  settings: {
    submitText: string;
    redirectUrl?: string;
    showProgressBar: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  form: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>;
}

interface FormStore {
  // Current form being edited
  currentForm: Form | null;

  // Selected field for configuration
  selectedFieldId: string | null;

  // UI State
  previewMode: 'desktop' | 'tablet' | 'mobile';
  showPreview: boolean;
  isDragginOver: boolean;

  // Templates
  templates: Template[];

  // Saved forms
  savedForms: Form[];

  // Actions
  createNewForm: () => void;
  loadForm: (form: Form) => void;
  updateForm: (updates: Partial<Form>) => void;

  // Field actions
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (fieldId: string | null) => void;

  // Step actions
  addStep: (step: Omit<FormStep, 'id'>) => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  removeStep: (stepId: string) => void;

  // UI actions
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  togglePreview: () => void;
  setDragginOver: (isDragginOver: boolean) => void;

  // Template actions
  loadTemplate: (templateId: string) => void;
  saveAsTemplate: (name: string, description: string) => void;

  // Form persistence
  saveForm: () => string; // Returns form ID
  loadFormById: (formId: string) => Form | null;

  // Auto-save
  autoSave: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultForm = (): Form => ({
  id: generateId(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  steps: [],
  isMultiStep: false,
  settings: {
    submitText: 'Submit',
    showProgressBar: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

const defaultTemplates: Template[] = [
{
  id: 'contact-us',
  name: 'Contact Us',
  description: 'Basic contact form template',
  form: {
    title: 'Contact Us',
    description: 'Get in touch with us',
    fields: [
    {
      id: generateId(),
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      step: 0
    },
    {
      id: generateId(),
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      step: 0
    },
    {
      id: generateId(),
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500
      },
      step: 0
    }],

    steps: [],
    isMultiStep: false,
    settings: {
      submitText: 'Send Message',
      showProgressBar: true
    }
  }
},
{
  id: 'survey',
  name: 'Survey Form',
  description: 'Multi-step survey template',
  form: {
    title: 'Customer Survey',
    description: 'Help us improve our services',
    fields: [
    {
      id: generateId(),
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true,
      step: 0
    },
    {
      id: generateId(),
      type: 'select',
      label: 'How did you hear about us?',
      required: true,
      options: ['Google', 'Social Media', 'Friend', 'Advertisement', 'Other'],
      step: 0
    },
    {
      id: generateId(),
      type: 'radio',
      label: 'Overall satisfaction',
      required: true,
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      step: 1
    },
    {
      id: generateId(),
      type: 'textarea',
      label: 'Additional Comments',
      placeholder: 'Any additional feedback?',
      required: false,
      step: 1
    }],

    steps: [
    {
      id: generateId(),
      title: 'Basic Information',
      description: 'Tell us about yourself',
      fields: []
    },
    {
      id: generateId(),
      title: 'Feedback',
      description: 'Share your experience',
      fields: []
    }],

    isMultiStep: true,
    settings: {
      submitText: 'Submit Survey',
      showProgressBar: true
    }
  }
}];


export const useFormStore = create<FormStore>((set, get) => ({
  currentForm: null,
  selectedFieldId: null,
  previewMode: 'desktop',
  showPreview: false,
  isDragginOver: false,
  templates: defaultTemplates,
  savedForms: JSON.parse(localStorage.getItem('formBuilder_savedForms') || '[]'),

  createNewForm: () => {
    set({ currentForm: createDefaultForm(), selectedFieldId: null });
  },

  loadForm: (form) => {
    set({ currentForm: form, selectedFieldId: null });
  },

  updateForm: (updates) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          ...updates,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  addField: (field) => {
    const { currentForm } = get();
    if (currentForm) {
      const newField: FormField = {
        ...field,
        id: generateId(),
        step: currentForm.isMultiStep ? 0 : undefined
      };

      set({
        currentForm: {
          ...currentForm,
          fields: [...currentForm.fields, newField],
          updatedAt: new Date()
        },
        selectedFieldId: newField.id
      });
      get().autoSave();
    }
  },

  updateField: (fieldId, updates) => {
    const { currentForm } = get();
    if (currentForm) {
      const updatedFields = currentForm.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
      );

      set({
        currentForm: {
          ...currentForm,
          fields: updatedFields,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  removeField: (fieldId) => {
    const { currentForm, selectedFieldId } = get();
    if (currentForm) {
      const updatedFields = currentForm.fields.filter((field) => field.id !== fieldId);

      set({
        currentForm: {
          ...currentForm,
          fields: updatedFields,
          updatedAt: new Date()
        },
        selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId
      });
      get().autoSave();
    }
  },

  reorderFields: (fromIndex, toIndex) => {
    const { currentForm } = get();
    if (currentForm) {
      const newFields = [...currentForm.fields];
      const [reorderedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, reorderedField);

      set({
        currentForm: {
          ...currentForm,
          fields: newFields,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  selectField: (fieldId) => {
    set({ selectedFieldId: fieldId });
  },

  addStep: (step) => {
    const { currentForm } = get();
    if (currentForm) {
      const newStep: FormStep = {
        ...step,
        id: generateId()
      };

      set({
        currentForm: {
          ...currentForm,
          steps: [...(currentForm.steps || []), newStep],
          isMultiStep: true,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  updateStep: (stepId, updates) => {
    const { currentForm } = get();
    if (currentForm && currentForm.steps) {
      const updatedSteps = currentForm.steps.map((step) =>
      step.id === stepId ? { ...step, ...updates } : step
      );

      set({
        currentForm: {
          ...currentForm,
          steps: updatedSteps,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  removeStep: (stepId) => {
    const { currentForm } = get();
    if (currentForm && currentForm.steps) {
      const updatedSteps = currentForm.steps.filter((step) => step.id !== stepId);

      set({
        currentForm: {
          ...currentForm,
          steps: updatedSteps,
          isMultiStep: updatedSteps.length > 1,
          updatedAt: new Date()
        }
      });
      get().autoSave();
    }
  },

  setPreviewMode: (mode) => {
    set({ previewMode: mode });
  },

  togglePreview: () => {
    set((state) => ({ showPreview: !state.showPreview }));
  },

  setDragginOver: (isDragginOver) => {
    set({ isDragginOver });
  },

  loadTemplate: (templateId) => {
    const { templates } = get();
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      const newForm: Form = {
        ...template.form,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      set({ currentForm: newForm, selectedFieldId: null });
    }
  },

  saveAsTemplate: (name, description) => {
    const { currentForm, templates } = get();
    if (currentForm) {
      const newTemplate: Template = {
        id: generateId(),
        name,
        description,
        form: {
          title: currentForm.title,
          description: currentForm.description,
          fields: currentForm.fields,
          steps: currentForm.steps,
          isMultiStep: currentForm.isMultiStep,
          settings: currentForm.settings
        }
      };

      const updatedTemplates = [...templates, newTemplate];
      set({ templates: updatedTemplates });
      localStorage.setItem('formBuilder_templates', JSON.stringify(updatedTemplates));
    }
  },

  saveForm: () => {
    const { currentForm, savedForms } = get();
    if (currentForm) {
      const existingIndex = savedForms.findIndex((f) => f.id === currentForm.id);
      let updatedForms;

      if (existingIndex >= 0) {
        updatedForms = [...savedForms];
        updatedForms[existingIndex] = currentForm;
      } else {
        updatedForms = [...savedForms, currentForm];
      }

      set({ savedForms: updatedForms });
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(updatedForms));

      return currentForm.id;
    }
    return '';
  },

  loadFormById: (formId) => {
    const { savedForms } = get();
    return savedForms.find((f) => f.id === formId) || null;
  },

  autoSave: () => {
    const { currentForm, savedForms } = get();
    if (currentForm) {
      const existingIndex = savedForms.findIndex((f) => f.id === currentForm.id);
      let updatedForms;

      if (existingIndex >= 0) {
        updatedForms = [...savedForms];
        updatedForms[existingIndex] = currentForm;
      } else {
        updatedForms = [...savedForms, currentForm];
      }

      set({ savedForms: updatedForms });
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(updatedForms));
    }
  }
}));