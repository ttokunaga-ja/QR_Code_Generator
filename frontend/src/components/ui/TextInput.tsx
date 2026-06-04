import { useState, ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

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

const adornmentIconSx = {
  color: 'text.secondary',
  borderRadius: '50%',
  '&:hover': { backgroundColor: 'grey.100', color: 'primary.main' },
} as const;

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
  trailingIconLabel = '',
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');

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
    <TextField
      id={inputId}
      name={inputId}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      required={required}
      error={hasError}
      helperText={hasError ? `⚠ ${error}` : undefined}
      fullWidth
      variant="outlined"
      label={label}
      InputLabelProps={{ sx: { fontSize: 14, fontWeight: 700 } }}
      slotProps={{
        formHelperText: {
          sx: { color: 'secondary.main', fontWeight: 700, fontSize: 12, ml: 0, mt: 1 },
        },
      }}
      InputProps={{
        startAdornment: leadingIcon ? (
          <InputAdornment position="start">
            <IconButton
              type="button"
              onClick={onLeadingIconClick}
              aria-label={leadingIconLabel}
              edge="start"
              sx={adornmentIconSx}
            >
              {leadingIcon}
            </IconButton>
          </InputAdornment>
        ) : undefined,
        endAdornment: trailingIcon ? (
          <InputAdornment position="end">
            <IconButton
              type="button"
              onClick={onTrailingIconClick}
              aria-label={trailingIconLabel}
              edge="end"
              sx={adornmentIconSx}
            >
              {trailingIcon}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}
