import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFormStore } from '@/store/formStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Settings, 
  GripVertical, 
  Plus,
  FileText,
  Layers
} from 'lucide-react';
import FieldRenderer from './FieldRenderer';

const FormCanvas: React.FC = () => {
  const {
    currentForm,
    selectedFieldId,
    isDragginOver,
    addField,
    removeField,
    selectField,
    reorderFields,
    setDragginOver,
    updateForm,
  } = useFormStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!currentForm) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragginOver(true);
  };

  const handleDragLeave = () => {
    setDragginOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragginOver(false);

    try {
      const fieldData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (fieldData.type) {
        addField(fieldData);
      }
    } catch (error) {
      console.error('Error parsing dropped field data:', error);
    }
  };

  const handleFieldDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleFieldDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleFieldDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderFields(draggedIndex, targetIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleFieldDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const toggleMultiStep = () => {
    if (currentForm.isMultiStep) {
      // Convert to single step
      updateForm({
        isMultiStep: false,
        steps: [],
      });
      // Update all fields to remove step assignment
      currentForm.fields.forEach(field => {
        if (field.step !== undefined) {
          // Remove step property
          const { step, ...fieldWithoutStep } = field;
          // This would need to be handled by the store
        }
      });
    } else {
      // Convert to multi-step
      updateForm({
        isMultiStep: true,
        steps: [
          {
            id: Math.random().toString(36).substr(2, 9),
            title: 'Step 1',
            description: 'First step of the form',
            fields: currentForm.fields.map(f => f.id),
          },
        ],
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Form Canvas</h3>
            </div>
            {/* <Badge variant={currentForm.isMultiStep ? 'default' : 'secondary'}>
              {currentForm.isMultiStep ? 'Multi-Step' : 'Single Page'}
            </Badge> */}
          </div>

          <div className="flex items-center space-x-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={toggleMultiStep}
              className="flex items-center space-x-2"
            >
              <Layers className="h-4 w-4" />
              <span>{currentForm.isMultiStep ? 'Single Page' : 'Multi-Step'}</span>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className={`min-h-full transition-all duration-200 ${
            isDragginOver 
              ? 'bg-grey-50 border-2 border-grey-300 border-dashed' 
              : 'bg-white border border-gray-200'
          } rounded-lg p-6`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {currentForm.fields.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Start Building Your Form
              </h3>
              <p className="text-gray-500 mb-6">
                Drag fields from the palette or click to add them to your form
              </p>
              <div className="bg-grey-50 border border-grey-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-grey-800">
                  <strong>Pro Tip:</strong> You can reorder fields by dragging them up and down once they're added.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {currentForm.fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative p-4 border rounded-lg transition-all duration-200 ${
                      selectedFieldId === field.id
                        ? 'border-grey-500 shadow-md bg-grey-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    } ${
                      dragOverIndex === index ? 'border-grey-400 shadow-lg' : ''
                    }`}
                    draggable
                    onDragStart={(e:any) => handleFieldDragStart(e, index)}
                    onDragOver={(e:any) => handleFieldDragOver(e, index)}
                    onDrop={(e:any) => handleFieldDrop(e, index)}
                    onDragEnd={handleFieldDragEnd}
                    onClick={() => selectField(field.id)}
                  >
                    {/* Drag Handle */}
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Field Controls */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectField(field.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Field Content */}
                    <div className="pr-20 pl-6">
                      <FieldRenderer field={field} isEditing={true} />
                      
                      {/* Field Info */}
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {field.type}
                        </Badge>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {currentForm.isMultiStep && field.step !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            Step {field.step + 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Field Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-4"
              >
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 border-dashed border-2 hover:border-grey-300 hover:bg-grey-50"
                  onClick={() => {
                    // This could open a quick field selector
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Field</span>
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;