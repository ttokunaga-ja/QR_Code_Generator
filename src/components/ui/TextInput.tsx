import { useState } from 'react';

interface TextInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  autoFocus?: boolean;
  type?: 'text' | 'password';
  onChange?: (value: string) => void;
}

export function TextInput({ 
  label, 
  placeholder = '', 
  required = false,
  error = '',
  value: controlledValue,
  autoFocus = false,
  type = 'text',
  onChange
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(autoFocus);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="w-full">
      <label className="block mb-1">
        <span className="text-sm text-black">
          {label}
          {required && <span className="ml-1 text-black">*</span>}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full p-3 bg-white text-black placeholder-gray-400 transition-all ${
          hasError
            ? 'border-2 border-black'
            : isFocused
            ? 'border-[3px] border-black'
            : 'border-2 border-black'
        } focus:outline-none`}
        style={{ 
          fontFamily: 'system-ui, Segoe UI, Noto Sans JP, sans-serif',
          fontSize: '14px'
        }}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${label}-error` : undefined}
      />
      {hasError && (
        <div id={`${label}-error`} className="mt-2">
          <span className="text-xs text-black font-bold">⚠ {error}</span>
        </div>
      )}
    </div>
  );
}
