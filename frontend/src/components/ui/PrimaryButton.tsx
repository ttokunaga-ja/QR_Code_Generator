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
        border: '2px solid #000',
        backgroundColor: '#000',
        color: '#fff',
        fontWeight: 500,
        '&:hover': { backgroundColor: '#fff', color: '#000', borderColor: '#000' },
        '&.Mui-disabled': {
          backgroundColor: 'grey.400',
          borderColor: 'grey.400',
          color: '#fff',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
