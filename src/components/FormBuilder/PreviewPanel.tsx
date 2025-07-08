import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FieldRenderer from './FieldRenderer';
import { 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  Tablet, 
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PreviewPanel: React.FC = () => {
  const { currentForm, previewMode } = useFormStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentForm) return null;

  // Get fields for current step
  const getFieldsForStep = (stepIndex: number) => {
    if (!currentForm.isMultiStep) {
      return currentForm.fields;
    }
    return currentForm.fields.filter(field => field.step === stepIndex);
  };

  const currentStepFields = getFieldsForStep(currentStep);
  const totalSteps = currentForm.isMultiStep ? (currentForm.steps?.length || 1) : 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Validation function
  const validateField = (field: any, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    if (value && field.validation) {
      const { minLength, maxLength, pattern, min, max } = field.validation;

      if (typeof value === 'string') {
        if (minLength && value.length < minLength) {
          return `Minimum length is ${minLength} characters`;
        }
        if (maxLength && value.length > maxLength) {
          return `Maximum length is ${maxLength} characters`;
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return 'Invalid format';
        }
      }

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `Minimum value is ${min}`;
        }
        if (max !== undefined && value > max) {
          return `Maximum value is ${max}`;
        }
      }
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'phone' && value) {
      const phoneRegex = /^[+]?[1-9][d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[-s()]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    let hasErrors = false;

    currentStepFields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        stepErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(stepErrors);
    return !hasErrors;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! (This is just a preview)');
    }
  };

  const getPreviewContainerClass = () => {
    const baseClass = "mx-auto transition-all duration-300";
    switch (previewMode) {
      case 'mobile':
        return `${baseClass} max-w-sm`;
      case 'tablet':
        return `${baseClass} max-w-md`;
      default:
        return `${baseClass} max-w-2xl`;
    }
  };

  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const PreviewIcon = getPreviewIcon();

  return (
    <div className="h-full bg-gray-50 border-l border-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
          </div>
          <div className="flex items-center space-x-2">
            <PreviewIcon className="h-4 w-4 text-gray-500" />
            <Badge variant="outline" className="capitalize">
              {previewMode}
            </Badge>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <ScrollArea className="h-full p-6">
        <div className={getPreviewContainerClass()}>
          <motion.div
            key={previewMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h1 className="text-2xl font-bold">{currentForm.title}</h1>
              {currentForm.description && (
                <p className="text-blue-100 mt-2">{currentForm.description}</p>
              )}
              
              {/* Progress Bar */}
              {currentForm.isMultiStep && currentForm.settings.showProgressBar && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="bg-blue-500" />
                </div>
              )}
            </div>

            {/* Step Title (for multi-step forms) */}
            {currentForm.isMultiStep && currentForm.steps && currentForm.steps[currentStep] && (
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentForm.steps[currentStep].title}
                </h2>
                {currentForm.steps[currentStep].description && (
                  <p className="text-gray-600 mt-1">
                    {currentForm.steps[currentStep].description}
                  </p>
                )}
              </div>
            )}

            {/* Form Fields */}
            <div className="p-6 space-y-6">
              {currentStepFields.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No fields in this step</p>
                </div>
              ) : (
                currentStepFields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FieldRenderer
                      field={field}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      error={errors[field.id]}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  {currentForm.isMultiStep && currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>

                <div className="flex space-x-2">
                  {currentForm.isMultiStep && currentStep < totalSteps - 1 ? (
                    <Button
                      onClick={handleNext}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{currentForm.settings.submitText}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Notice */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Preview Mode:</strong> This is how your form will appear to users. 
              Data entered here is not saved.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PreviewPanel;