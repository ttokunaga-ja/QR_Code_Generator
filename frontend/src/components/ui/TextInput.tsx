import { useState, ReactNode } from 'react';

interface TextInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  autoFocus?: boolean;
  type?: 'text' | 'password';
  onChange?: (value: string) => void;
  leadingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  leadingIconLabel?: string;
  trailingIcon?: ReactNode;
  onTrailingIconClick?: () => void;
  trailingIconLabel?: string;
}

export function TextInput({ 
  id,
  label, 
  placeholder = '', 
  required = false,
  error = '',
  value: controlledValue,
  autoFocus = false,
  type = 'text',
  onChange,
  leadingIcon,
  onLeadingIconClick,
  leadingIconLabel = '',
  trailingIcon,
  onTrailingIconClick,
  trailingIconLabel = ''
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(autoFocus);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasError = !!error;
  const generatedId =
    id ||
    `${label}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
  const inputId = generatedId || `input-${label.length}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="w-full">
      <label className="block mb-1" htmlFor={inputId}>
        <span className="text-sm text-black">
          {label}
          {required && <span className="ml-1 text-black">*</span>}
        </span>
      </label>
      
      {/* 
        【重要】style={{ position: 'relative' }} を追加 
        これにより、アイコンがこのdivを基準に配置されるよう強制します。
      */}
      <div className="relative" style={{ position: 'relative' }}>
        <input
          id={inputId}
          name={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`block w-full py-3 pl-3 ${trailingIcon ? 'pr-10' : 'pr-3'} ${leadingIcon ? 'pl-10' : ''} bg-white text-black placeholder-gray-400 transition-all ${
            hasError
              ? 'border-2 border-black'
              : isFocused
              ? 'border-[3px] border-black'
              : 'border-2 border-black'
          } focus:outline-none`}
          style={{ 
            fontFamily: 'system-ui, Segoe UI, Noto Sans JP, sans-serif',
            fontSize: '14px',
            boxSizing: 'border-box' // 幅の計算ズレを防止
          }}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${label}-error` : undefined}
        />

        {leadingIcon && (
          <button
            type="button"
            onClick={onLeadingIconClick}
            aria-label={leadingIconLabel}
            className="absolute left-0 top-1/2 z-10 p-2 text-black hover:bg-black hover:text-white transition-colors rounded-full"
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '4px',
              transform: 'translateY(-50%)', 
              zIndex: 10 
            }}
          >
            <span className="flex items-center justify-center w-5 h-5">
              {leadingIcon}
            </span>
          </button>
        )}

        {trailingIcon && (
          <button
            type="button"
            onClick={onTrailingIconClick}
            aria-label={trailingIconLabel}
            className="absolute right-0 top-1/2 z-10 p-2 text-black hover:bg-black hover:text-white transition-colors rounded-full"
            // 【重要】right: '8px' でフォームの右内側に配置
            style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '8px', 
              transform: 'translateY(-50%)', 
              zIndex: 10 
            }}
          >
            <span className="flex items-center justify-center w-5 h-5">
              {trailingIcon}
            </span>
          </button>
        )}
      </div>

      {hasError && (
        <div id={`${label}-error`} className="mt-2">
          <span className="text-xs text-black font-bold">⚠ {error}</span>
        </div>
      )}
    </div>
  );
}