import { useState, useEffect } from 'react';

interface ModeToggleProps {
  defaultMode?: 'wifi' | 'url';
  disabled?: boolean;
  onChange?: (mode: 'wifi' | 'url') => void;
}

export function ModeToggle({ 
  defaultMode = 'wifi', 
  disabled = false,
  onChange 
}: ModeToggleProps) {
  const [mode, setMode] = useState<'wifi' | 'url'>(defaultMode);

  // Update internal state when defaultMode changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleModeChange = (newMode: 'wifi' | 'url') => {
    if (!disabled) {
      setMode(newMode);
      onChange?.(newMode);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleModeChange('wifi')}
        disabled={disabled}
        className={`flex-1 py-3 border-2 transition-colors ${ 
          mode === 'wifi' 
            ? 'bg-black text-white border-black' 
            : 'bg-white text-black border-black hover:bg-gray-100'
        } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
        aria-label="Wi-Fi mode"
        aria-pressed={mode === 'wifi'}
      >
        Wi-Fi
      </button>
      <button
        onClick={() => handleModeChange('url')}
        disabled={disabled}
        className={`flex-1 py-3 border-2 transition-colors ${ 
          mode === 'url' 
            ? 'bg-black text-white border-black' 
            : 'bg-white text-black border-black hover:bg-gray-100'
        } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
        aria-label="URL mode"
        aria-pressed={mode === 'url'}
      >
        URL
      </button>
    </div>
  );
}