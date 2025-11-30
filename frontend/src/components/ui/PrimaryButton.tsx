interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 border-2 border-black bg-black text-white transition-colors 
                  hover:bg-white hover:text-black 
                  disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white disabled:cursor-not-allowed 
                  disabled:hover:bg-gray-400 disabled:hover:text-white ${className}`}
      style={{ 
        fontFamily: 'system-ui, Segoe UI, Noto Sans JP, sans-serif',
        fontWeight: 500
      }}
    >
      {children}
    </button>
  );
}