import { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ModeToggleProps {
  defaultMode?: 'wifi' | 'url';
  disabled?: boolean;
  onChange?: (mode: 'wifi' | 'url') => void;
}

export function ModeToggle({
  defaultMode = 'wifi',
  disabled = false,
  onChange,
}: ModeToggleProps) {
  const [mode, setMode] = useState<'wifi' | 'url'>(defaultMode);

  // Update internal state when defaultMode changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: 'wifi' | 'url' | null,
  ) => {
    if (disabled || newMode === null) return;
    setMode(newMode);
    onChange?.(newMode);
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleModeChange}
      disabled={disabled}
      fullWidth
      sx={{
        gap: 1,
        p: 0.5,
        backgroundColor: 'grey.100',
        borderRadius: 999,
      }}
    >
      {(['wifi', 'url'] as const).map((value) => (
        <ToggleButton
          key={value}
          value={value}
          aria-label={value === 'wifi' ? 'Wi-Fi mode' : 'URL mode'}
          sx={{
            flex: 1,
            py: 1.25,
            border: 0,
            borderRadius: '999px !important',
            color: 'text.secondary',
            backgroundColor: 'transparent',
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#fff' },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: '#fff',
              boxShadow: '0 10px 24px rgba(20, 108, 108, 0.24)',
              '&:hover': { backgroundColor: 'primary.dark' },
            },
            '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
              borderLeft: 0,
              marginLeft: 0,
            },
          }}
        >
          {value === 'wifi' ? 'Wi-Fi' : 'URL'}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
