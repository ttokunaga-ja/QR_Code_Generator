import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit';
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  sx,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth
      variant="contained"
      sx={{
        py: 1.75,
        px: 3,
        border: '1px solid',
        borderColor: 'primary.main',
        backgroundColor: 'primary.main',
        color: '#fff',
        fontWeight: 800,
        boxShadow: '0 14px 28px rgba(20, 108, 108, 0.2)',
        '&:hover': {
          backgroundColor: 'primary.dark',
          borderColor: 'primary.dark',
          boxShadow: '0 16px 32px rgba(20, 108, 108, 0.26)',
        },
        '&.Mui-disabled': {
          backgroundColor: 'grey.100',
          borderColor: 'grey.300',
          color: 'grey.400',
          boxShadow: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
