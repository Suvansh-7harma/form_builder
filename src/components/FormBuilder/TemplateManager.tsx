import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Save, 
  Download,
  Upload,
  Layers
} from 'lucide-react';

const TemplateManager: React.FC = () => {
  const { 
    currentForm, 
    templates, 
    loadTemplate, 
    saveAsTemplate 
  } = useFormStore();
  
  const { toast } = useToast();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId);
    toast({
      title: 'Template Loaded',
      description: 'Template has been loaded successfully',
    });
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: 'Error',
        description: 'Template name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentForm || currentForm.fields.length === 0) {
      toast({
        title: 'Error',
        description: 'Cannot save empty form as template',
        variant: 'destructive',
      });
      return;
    }

    saveAsTemplate(templateName.trim(), templateDescription.trim());
    setShowSaveDialog(false);
    setTemplateName('');
    setTemplateDescription('');
    
    toast({
      title: 'Template Saved',
      description: 'Your form has been saved as a template',
    });
  };

  const exportTemplate = (template: any) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/s+/g, '_')}_template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Template Exported',
      description: 'Template has been downloaded',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Templates</h3>
        </div>
        
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
              disabled={!currentForm || currentForm.fields.length === 0}
            >
              <Save className="h-3 w-3" />
              <span>Save</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Describe what this template is for"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {template.form.fields.length} fields
                  </Badge>
                  {template.form.isMultiStep && (
                    <Badge variant="secondary" className="text-xs">
                      Multi-step
                    </Badge>
                  )}
                </div>

                {/* Field Types Preview */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {[...new Set(template.form.fields.map(f => f.type))]
                    .slice(0, 3)
                    .map((type) => (
                      <span
                        key={type}
                        className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  {[...new Set(template.form.fields.map(f => f.type))].length > 3 && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      +{[...new Set(template.form.fields.map(f => f.type))].length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleLoadTemplate(template.id)}
                    className="flex-1 text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportTemplate(template)}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No templates yet</p>
              <p className="text-xs">Save your first form as a template</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Templates */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Quick Start Templates</p>
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleLoadTemplate('contact-us')}
            className="w-full justify-start text-xs"
          >
            <FileText className="h-3 w-3 mr-2" />
            Contact Form
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleLoadTemplate('survey')}
            className="w-full justify-start text-xs"
          >
            <Layers className="h-3 w-3 mr-2" />
            Survey Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;