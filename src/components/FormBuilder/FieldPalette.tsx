import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormStore } from '@/store/formStore';
import {
  Type,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  Hash,
  Circle,
  FileText,
  Settings2,
  Image,
  Upload,
  Search
} from 'lucide-react';

const allFieldTypes = {
  basic: [
    { type: 'text', label: 'Text Input', icon: Type, description: 'Single line input' },
    { type: 'textarea', label: 'Textarea', icon: AlignLeft, description: 'Multi-line input' },
    { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
    { type: 'email', label: 'Email', icon: Mail, description: 'Email input' },
    { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone input' },
  ],
  advanced: [
    { type: 'select', label: 'Dropdown', icon: ChevronDown, description: 'Select from options' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Multiple options' },
    { type: 'radio', label: 'Radio Button', icon: Circle, description: 'Single choice' },
    { type: 'date', label: 'Date Picker', icon: Calendar, description: 'Pick a date' },
  ],
  media: [
    { type: 'image', label: 'Image Upload', icon: Image, description: 'Upload an image' },
    { type: 'file', label: 'File Upload', icon: Upload, description: 'Upload any file' },
  ]
};

const FieldPalette: React.FC = () => {
  const { addField } = useFormStore();
  const [search, setSearch] = useState('');

  const createFieldData = (field: any) => {
    const base = {
      type: field.type,
      label: field.label,
      required: false,
      placeholder: `Enter ${field.label.toLowerCase()}`,
    };

    if (['select', 'radio', 'checkbox'].includes(field.type)) {
      return {
        ...base,
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    }

    if (field.type === 'image') {
      return {
        ...base,
        accept: 'image/*',
        multiple: false,
      };
    }

    if (field.type === 'file') {
      return {
        ...base,
        accept: '*/*',
        multiple: true,
      };
    }

    return base;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, field: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(createFieldData(field)));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddField = (field: any) => {
    addField(createFieldData(field));
  };

  const renderFields = (fields: any[]) => {
    const filtered = fields.filter(field =>
      field.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((field, index) => {
          const Icon = field.icon;
          return (
            <motion.div
              key={field.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, field)}
                onClick={() => handleAddField(field)}
                className="cursor-pointer group p-3 bg-white border border-gray-200 rounded-md hover:shadow-sm hover:border-blue-400 transition-all"
              >
                <div className="flex items-start space-x-2">
                  <Icon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-900">{field.label}</p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-700">{field.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const FieldSection = ({ title, icon: Icon, fields }: any) => {
    const filtered = fields.filter(field =>
      field.label.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-1 mt-4">
          <Icon className="h-5 w-5 text-gray-500" />
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</h4>
        </div>
        {renderFields(filtered)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-gray-600" />
        <h3 className="text-base font-semibold text-gray-900">Add Fields</h3>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Sections */}
      <FieldSection title="Basic Fields" icon={FileText} fields={allFieldTypes.basic} />
      <FieldSection title="Advanced Fields" icon={Settings2} fields={allFieldTypes.advanced} />
      <FieldSection title="Media Fields" icon={Upload} fields={allFieldTypes.media} />

      {/* Tip */}
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-800">
          <strong>Tip:</strong> Drag and drop to position or click to auto-add to the form canvas.
        </p>
      </div>
    </div>
  );
};

export default FieldPalette;
