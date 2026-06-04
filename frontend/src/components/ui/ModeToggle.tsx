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
      sx={{ gap: 1 }}
    >
      {(['wifi', 'url'] as const).map((value) => (
        <ToggleButton
          key={value}
          value={value}
          aria-label={value === 'wifi' ? 'Wi-Fi mode' : 'URL mode'}
          sx={{
            flex: 1,
            py: 1.5,
            border: '2px solid #000',
            borderRadius: 0,
            color: '#000',
            backgroundColor: '#fff',
            textTransform: 'none',
            '&:hover': { backgroundColor: 'grey.100' },
            '&.Mui-selected': {
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': { backgroundColor: '#000' },
            },
            // ToggleButtonGroup collapses the divider; keep a full 2px frame on each button
            '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
              borderLeft: '2px solid #000',
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
