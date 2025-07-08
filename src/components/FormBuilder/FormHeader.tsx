import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormStore } from '@/store/formStore';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FormHeader: React.FC = () => {
  const { currentForm, updateForm } = useFormStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');

  if (!currentForm) return null;

  const handleTitleEdit = () => {
    setTempTitle(currentForm.title);
    setIsEditingTitle(true);
  };

  const handleDescriptionEdit = () => {
    setTempDescription(currentForm.description || '');
    setIsEditingDescription(true);
  };

  const saveTitleEdit = () => {
    updateForm({ title: tempTitle });
    setIsEditingTitle(false);
  };

  const saveDescriptionEdit = () => {
    updateForm({ description: tempDescription });
    setIsEditingDescription(false);
  };

  const cancelTitleEdit = () => {
    setTempTitle('');
    setIsEditingTitle(false);
  };

  const cancelDescriptionEdit = () => {
    setTempDescription('');
    setIsEditingDescription(false);
  };

  return (
    <div className="space-y-2">
      {/* Form Title */}
      <div className="flex items-center space-x-2">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-lg font-medium h-8"
              placeholder="Form title"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTitleEdit();
                if (e.key === 'Escape') cancelTitleEdit();
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={saveTitleEdit}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelTitleEdit}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 group">
            <h2 className="text-lg font-medium text-gray-900">{currentForm.title}</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTitleEdit}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Form Description */}
      <div className="flex items-center space-x-2">
        {isEditingDescription ? (
          <div className="flex items-start space-x-2 w-full">
            <Textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="text-sm resize-none"
              placeholder="Form description (optional)"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) saveDescriptionEdit();
                if (e.key === 'Escape') cancelDescriptionEdit();
              }}
            />
            <div className="flex flex-col space-y-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={saveDescriptionEdit}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelDescriptionEdit}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 group w-full">
            {currentForm.description ? (
              <p className="text-sm text-gray-600">{currentForm.description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Add a description...</p>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDescriptionEdit}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormHeader;