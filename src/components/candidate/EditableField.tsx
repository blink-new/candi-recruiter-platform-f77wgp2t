import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface EditableFieldProps {
  label: string;
  value: string | number | readonly string[] | undefined;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: string;
  type?: 'text' | 'number' | 'textarea' | 'multiselect' | 'checkbox';
  options?: string[];
  className?: string;
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  onChange,
  name,
  type = 'text',
  className,
  placeholder = 'Enter value',
}) => {
  if (isEditing) {
    const commonProps = {
      name,
      value: Array.isArray(value) ? value.join(', ') : value,
      onChange,
      placeholder,
      className: 'w-full text-base bg-orange-50/50 border-orange-200 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200',
    };

    if (type === 'textarea') {
      return (
        <div className={`flex flex-col space-y-1 ${className}`}>
          <label className="text-sm font-medium text-gray-500">{label}</label>
          <Textarea {...commonProps} rows={3} />
        </div>
      );
    }

    return (
      <div className={`flex flex-col space-y-1 ${className}`}>
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <Input type={type} {...commonProps} />
      </div>
    );
  }

  const displayValue = Array.isArray(value) ? (
    <div className="flex flex-wrap gap-2">
      {value.map((item, index) => (
        <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
          {item}
        </Badge>
      ))}
    </div>
  ) : (
    value
  );

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <div className="text-base text-[#2e2e2e] p-2 min-h-[40px] border border-transparent rounded-md">
        {displayValue || <span className="text-gray-400">Not specified</span>}
      </div>
    </div>
  );
};

export default EditableField;
