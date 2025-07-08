import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FieldRenderer from './FormBuilder/FieldRenderer';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  FileText,
  ArrowLeft } from
'lucide-react';

const FormFiller: React.FC = () => {
  const { formId } = useParams<{formId: string;}>();
  const navigate = useNavigate();
  const { loadFormById } = useFormStore();
  const { toast } = useToast();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formId) {
      const loadedForm = loadFormById(formId);
      if (loadedForm) {
        setForm(loadedForm);
      } else {
        toast({
          title: 'Form Not Found',
          description: 'The form you are looking for does not exist or has been removed.',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }
  }, [formId, loadFormById, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-id="3h1qckd63" data-path="src/components/FormFiller.tsx">
        <div className="text-center" data-id="eutjffd4d" data-path="src/components/FormFiller.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-id="i7gq3kcdm" data-path="src/components/FormFiller.tsx"></div>
          <p className="text-gray-600" data-id="24c7yvedm" data-path="src/components/FormFiller.tsx">Loading form...</p>
        </div>
      </div>);

  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-id="4lnf9tnnp" data-path="src/components/FormFiller.tsx">
        <Card className="max-w-md mx-auto" data-id="yg6f6b6xu" data-path="src/components/FormFiller.tsx">
          <CardContent className="p-8 text-center" data-id="bfgh55pen" data-path="src/components/FormFiller.tsx">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" data-id="6ef8q0tjs" data-path="src/components/FormFiller.tsx" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2" data-id="ftdthsvzb" data-path="src/components/FormFiller.tsx">Form Not Found</h2>
            <p className="text-gray-600 mb-4" data-id="izihokdrh" data-path="src/components/FormFiller.tsx">
              The form you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')} className="flex items-center space-x-2" data-id="gbzlkz4xc" data-path="src/components/FormFiller.tsx">
              <ArrowLeft className="h-4 w-4" data-id="om1df34nm" data-path="src/components/FormFiller.tsx" />
              <span data-id="b1vm3ue5j" data-path="src/components/FormFiller.tsx">Go Home</span>
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-id="yx8tyywid" data-path="src/components/FormFiller.tsx">
        <Card className="max-w-md mx-auto" data-id="qthia9vwa" data-path="src/components/FormFiller.tsx">
          <CardContent className="p-8 text-center" data-id="z22kyepgb" data-path="src/components/FormFiller.tsx">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" data-id="qstk3n6al" data-path="src/components/FormFiller.tsx" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2" data-id="4675mc5je" data-path="src/components/FormFiller.tsx">Form Submitted!</h2>
            <p className="text-gray-600 mb-4" data-id="iv6fsxzle" data-path="src/components/FormFiller.tsx">
              Thank you for your submission. We have received your response.
            </p>
            <Button onClick={() => navigate('/')} className="flex items-center space-x-2" data-id="2lfz3hx90" data-path="src/components/FormFiller.tsx">
              <ArrowLeft className="h-4 w-4" data-id="06jtahl8l" data-path="src/components/FormFiller.tsx" />
              <span data-id="xfi6zvxe9" data-path="src/components/FormFiller.tsx">Go Home</span>
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  // Get fields for current step
  const getFieldsForStep = (stepIndex: number) => {
    if (!form.isMultiStep) {
      return form.fields;
    }
    return form.fields.filter((field: any) => field.step === stepIndex);
  };

  const currentStepFields = getFieldsForStep(currentStep);
  const totalSteps = form.isMultiStep ? form.steps?.length || 1 : 1;
  const progress = (currentStep + 1) / totalSteps * 100;

  // Validation function
  const validateField = (field: any, value: any): string | null => {
    if (field.required && (!value || Array.isArray(value) && value.length === 0)) {
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[-\s()]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    let hasErrors = false;

    currentStepFields.forEach((field: any) => {
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
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted:', {
        formId: form.id,
        formTitle: form.title,
        data: formData,
        submittedAt: new Date().toISOString()
      });

      // Store submission in localStorage for demo purposes
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      submissions.push({
        id: Math.random().toString(36).substr(2, 9),
        formId: form.id,
        formTitle: form.title,
        data: formData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      setSubmitted(true);

      toast({
        title: 'Form Submitted',
        description: 'Your response has been recorded successfully.'
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your form. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="xihf5je06" data-path="src/components/FormFiller.tsx">
      <div className="max-w-2xl mx-auto px-4" data-id="gvto65b2x" data-path="src/components/FormFiller.tsx">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} data-id="l55ueuvfs" data-path="src/components/FormFiller.tsx">

          <Card className="shadow-lg" data-id="dce8cfsv0" data-path="src/components/FormFiller.tsx">
            {/* Form Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" data-id="ktgakgv9m" data-path="src/components/FormFiller.tsx">
              <div className="flex items-center space-x-2 mb-2" data-id="occxa2yyq" data-path="src/components/FormFiller.tsx">
                <FileText className="h-6 w-6" data-id="7ie6g9yx2" data-path="src/components/FormFiller.tsx" />
                <span className="text-sm opacity-90" data-id="t2018jf40" data-path="src/components/FormFiller.tsx">Form</span>
              </div>
              <CardTitle className="text-2xl" data-id="juidwvup3" data-path="src/components/FormFiller.tsx">{form.title}</CardTitle>
              {form.description &&
              <p className="text-blue-100 mt-2" data-id="68wvul9zh" data-path="src/components/FormFiller.tsx">{form.description}</p>
              }
              
              {/* Progress Bar */}
              {form.isMultiStep && form.settings.showProgressBar &&
              <div className="mt-4 space-y-2" data-id="8vc0i3qfu" data-path="src/components/FormFiller.tsx">
                  <div className="flex items-center justify-between text-sm" data-id="rmu5ju9i9" data-path="src/components/FormFiller.tsx">
                    <span data-id="v6rdef6lz" data-path="src/components/FormFiller.tsx">Step {currentStep + 1} of {totalSteps}</span>
                    <span data-id="7wa8z153x" data-path="src/components/FormFiller.tsx">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="bg-blue-500" data-id="hbfpthfhp" data-path="src/components/FormFiller.tsx" />
                </div>
              }
            </CardHeader>

            {/* Step Title (for multi-step forms) */}
            {form.isMultiStep && form.steps && form.steps[currentStep] &&
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200" data-id="ag96e1635" data-path="src/components/FormFiller.tsx">
                <h2 className="text-lg font-semibold text-gray-900" data-id="dt1clk8az" data-path="src/components/FormFiller.tsx">
                  {form.steps[currentStep].title}
                </h2>
                {form.steps[currentStep].description &&
              <p className="text-gray-600 mt-1" data-id="ky2e6rav9" data-path="src/components/FormFiller.tsx">
                    {form.steps[currentStep].description}
                  </p>
              }
              </div>
            }

            {/* Form Fields */}
            <CardContent className="p-6" data-id="mr25wt9mw" data-path="src/components/FormFiller.tsx">
              <div className="space-y-6" data-id="gizx6btpc" data-path="src/components/FormFiller.tsx">
                {currentStepFields.length === 0 ?
                <div className="text-center py-12 text-gray-500" data-id="xiwobvpxh" data-path="src/components/FormFiller.tsx">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" data-id="hql4dq9kc" data-path="src/components/FormFiller.tsx" />
                    <p data-id="j72sdxfc8" data-path="src/components/FormFiller.tsx">No fields in this step</p>
                  </div> :

                currentStepFields.map((field: any) =>
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }} data-id="v3awr1kck" data-path="src/components/FormFiller.tsx">

                      <FieldRenderer
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]} data-id="5c606ludh" data-path="src/components/FormFiller.tsx" />

                    </motion.div>
                )
                }
              </div>
            </CardContent>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200" data-id="2x59a26po" data-path="src/components/FormFiller.tsx">
              <div className="flex items-center justify-between" data-id="ulckgdt8k" data-path="src/components/FormFiller.tsx">
                <div data-id="va2o125qu" data-path="src/components/FormFiller.tsx">
                  {form.isMultiStep && currentStep > 0 &&
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={submitting}
                    className="flex items-center space-x-2" data-id="2hftr4zmc" data-path="src/components/FormFiller.tsx">

                      <ChevronLeft className="h-4 w-4" data-id="ioksl1hkw" data-path="src/components/FormFiller.tsx" />
                      <span data-id="5r06xm2x8" data-path="src/components/FormFiller.tsx">Previous</span>
                    </Button>
                  }
                </div>

                <div className="flex space-x-2" data-id="0veln0ipa" data-path="src/components/FormFiller.tsx">
                  {form.isMultiStep && currentStep < totalSteps - 1 ?
                  <Button
                    onClick={handleNext}
                    disabled={submitting}
                    className="flex items-center space-x-2" data-id="1aqzyt66t" data-path="src/components/FormFiller.tsx">

                      <span data-id="wf9qm50zi" data-path="src/components/FormFiller.tsx">Next</span>
                      <ChevronRight className="h-4 w-4" data-id="01wa5rb1j" data-path="src/components/FormFiller.tsx" />
                    </Button> :

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center space-x-2" data-id="yyz63tgsd" data-path="src/components/FormFiller.tsx">

                      {submitting ?
                    <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" data-id="tiu7tblx6" data-path="src/components/FormFiller.tsx"></div>
                          <span data-id="c1habt13o" data-path="src/components/FormFiller.tsx">Submitting...</span>
                        </> :

                    <>
                          <CheckCircle className="h-4 w-4" data-id="2h3h5gzs6" data-path="src/components/FormFiller.tsx" />
                          <span data-id="zi63hal46" data-path="src/components/FormFiller.tsx">{form.settings.submitText}</span>
                        </>
                    }
                    </Button>
                  }
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>);

};

export default FormFiller;