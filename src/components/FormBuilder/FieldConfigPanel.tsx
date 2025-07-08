import React, { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Move,
  AlertCircle,
  Hash,
  Type
} from 'lucide-react';

const FieldConfigPanel: React.FC = () => {
  const { currentForm, selectedFieldId, updateField, selectField } = useFormStore();
  const [newOption, setNewOption] = useState('');

  const selectedField = currentForm?.fields.find(f => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="h-full bg-white border-l border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Field Configuration</h3>
          </div>
          
          <div className="text-center py-16">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Field Selected
            </h3>
            <p className="text-gray-500">
              Click on a field in the canvas to configure its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateField = (updates: any) => {
    updateField(selectedField.id, updates);
  };

  const addOption = () => {
    if (newOption.trim() && selectedField.options) {
      const updatedOptions = [...selectedField.options, newOption.trim()];
      handleUpdateField({ options: updatedOptions });
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    if (selectedField.options) {
      const updatedOptions = selectedField.options.filter((_, i) => i !== index);
      handleUpdateField({ options: updatedOptions });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (selectedField.options) {
      const updatedOptions = [...selectedField.options];
      updatedOptions[index] = value;
      handleUpdateField({ options: updatedOptions });
    }
  };

  const fieldSupportsOptions = ['select', 'radio', 'checkbox'].includes(selectedField.type);
  const fieldSupportsPattern = ['text', 'email', 'phone'].includes(selectedField.type);
  const fieldSupportsLength = ['text', 'textarea', 'email', 'phone'].includes(selectedField.type);
  const fieldSupportsMinMax = ['number'].includes(selectedField.type);

  return (
    <div className="h-full bg-white border-l border-gray-200">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Field Configuration</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectField(null)}
              className="text-gray-500"
            >
              ×
            </Button>
          </div>

          {/* Field Type Badge */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {selectedField.type}
            </Badge>
            <Badge variant={selectedField.required ? 'destructive' : 'secondary'}>
              {selectedField.required ? 'Required' : 'Optional'}
            </Badge>
          </div>

          <Separator />

          {/* Basic Properties */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Basic Properties</span>
            </h4>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={selectedField.label}
                onChange={(e) => handleUpdateField({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>

            {/* Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={selectedField.placeholder || ''}
                onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="field-help">Help Text</Label>
              <Textarea
                id="field-help"
                value={selectedField.helpText || ''}
                onChange={(e) => handleUpdateField({ helpText: e.target.value })}
                placeholder="Additional help text for users"
                rows={2}
              />
            </div>

            {/* Required Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="field-required">Required Field</Label>
              <Switch
                id="field-required"
                checked={selectedField.required}
                onCheckedChange={(checked) => handleUpdateField({ required: checked })}
              />
            </div>
          </div>

          {/* Options (for select, radio, checkbox) */}
          {fieldSupportsOptions && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  <Move className="h-4 w-4" />
                  <span>Options</span>
                </h4>

                {/* Existing Options */}
                <div className="space-y-2">
                  {selectedField.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder="Option text"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add New Option */}
                <div className="flex items-center space-x-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="New option"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={!newOption.trim()}
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Validation Rules */}
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Validation Rules</span>
            </h4>

            {/* Length Validation */}
            {fieldSupportsLength && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="min-length">Min Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    value={selectedField.validation?.minLength || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      handleUpdateField({
                        validation: { ...selectedField.validation, minLength: value }
                      });
                    }}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-length">Max Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={selectedField.validation?.maxLength || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      handleUpdateField({
                        validation: { ...selectedField.validation, maxLength: value }
                      });
                    }}
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Number Validation */}
            {fieldSupportsMinMax && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="min-value">Min Value</Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={selectedField.validation?.min || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      handleUpdateField({
                        validation: { ...selectedField.validation, min: value }
                      });
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-value">Max Value</Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={selectedField.validation?.max || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      handleUpdateField({
                        validation: { ...selectedField.validation, max: value }
                      });
                    }}
                    placeholder="100"
                  />
                </div>
              </div>
            )}

            {/* Pattern Validation */}
            {fieldSupportsPattern && (
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern (Regex)</Label>
                <Input
                  id="pattern"
                  value={selectedField.validation?.pattern || ''}
                  onChange={(e) => {
                    handleUpdateField({
                      validation: { ...selectedField.validation, pattern: e.target.value }
                    });
                  }}
                  placeholder="^[a-zA-Z0-9]+$"
                />
                <p className="text-xs text-gray-500">
                  Regular expression pattern for validation
                </p>
              </div>
            )}
          </div>

          {/* Multi-step Configuration */}
          {currentForm?.isMultiStep && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Multi-step Configuration</span>
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="field-step">Assign to Step</Label>
                  <select
                    id="field-step"
                    value={selectedField.step || 0}
                    onChange={(e) => handleUpdateField({ step: parseInt(e.target.value) })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {currentForm.steps?.map((step, index) => (
                      <option key={step.id} value={index}>
                        Step {index + 1}: {step.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FieldConfigPanel;