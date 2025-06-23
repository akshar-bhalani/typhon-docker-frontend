import React from 'react';
import Select from 'react-select';

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder, className, ...props }) => {
  const handleChange = (selectedOptions: any) => {
    onChange(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  return (
    <Select
      isMulti
      options={options}
      value={options.filter((option) => value.includes(option.value))}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
};

export default MultiSelect;
