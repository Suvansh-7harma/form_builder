import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/formStore';
import FieldPalette from './FormBuilder/FieldPalette';
import FormCanvas from './FormBuilder/FormCanvas';
import FieldConfigPanel from './FormBuilder/FieldConfigPanel';
import PreviewPanel from './FormBuilder/PreviewPanel';
import FormHeader from './FormBuilder/FormHeader';
import TemplateManager from './FormBuilder/TemplateManager';
import { useToast } from '@/hooks/use-toast';
import {
  Eye,
  EyeOff,
  Save,
  Share2,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

const FormBuilder: React.FC = () => {
  const {
    currentForm,
    previewMode,
    showPreview,
    createNewForm,
    saveForm,
    setPreviewMode,
    togglePreview
  } = useFormStore();

  const { toast } = useToast();

  useEffect(() => {
    if (!currentForm) {
      createNewForm();
    }
  }, [currentForm, createNewForm]);

  const handleSave = () => {
    const formId = saveForm();
    if (formId) {
      toast({
        title: 'Form Saved',
        description: `Form saved successfully with ID: ${formId}`
      });
    }
  };

  const handleShare = () => {
    if (currentForm) {
      const shareUrl = `${window.location.origin}/form/${currentForm.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: 'Link Copied',
          description: 'Form share link copied to clipboard'
        });
      });
    }
  };

  const getPreviewIcon = () => {
    switch (previewMode) {
      case 'tablet':
        return Tablet;
      case 'mobile':
        return Smartphone;
      default:
        return Monitor;
    }
  };

  const PreviewIcon = getPreviewIcon();

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading Form Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="./Vlogo.png" alt="" className="h-10 w-10 text-black" />
            <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <FormHeader />
        </div>

        <div className="flex items-center space-x-2">
     
          {/* <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className={`h-8 w-8 p-0 ${previewMode === 'desktop' ? 'bg-black text-white' : 'text-black'}`}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className={`h-8 w-8 p-0 ${previewMode === 'tablet' ? 'bg-black text-white' : 'text-black'}`}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className={`h-8 w-8 p-0 ${previewMode === 'mobile' ? 'bg-black text-white' : 'text-black'}`}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div> */}

          {/* Preview Toggle */}
          <Button
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            onClick={togglePreview}
            className={`flex items-center space-x-2 ${showPreview ? 'bg-black text-white' : 'text-black border border-black'}`}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </Button>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            size="sm"
            className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-black text-black hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
  {/* Canvas Panel (Main Center) */}
  <ResizablePanel defaultSize={50} minSize={30}>
    <motion.div
      layout
      className="h-full bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FormCanvas />
    </motion.div>
  </ResizablePanel>

  <ResizableHandle withHandle />

  {/* Conditional Middle Panel: Preview or Config */}
  <ResizablePanel defaultSize={showPreview ? 30 : 30} minSize={25}>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white border-l border-r border-gray-200"
    >
      {showPreview ? <PreviewPanel /> : <FieldConfigPanel />}
    </motion.div>
  </ResizablePanel>

  <ResizableHandle withHandle />

  {/* FieldPalette on Right Side */}
  <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
    <div className="h-full bg-white border-l border-gray-200">
      <div className="p-4 space-y-6 overflow-y-auto h-full custom-scrollbar">
        <FieldPalette />
      </div>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>

      </div>
    </div>
  );
};

export default FormBuilder;
