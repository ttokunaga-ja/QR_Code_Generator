import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface NoticeTextProps {
  children: React.ReactNode;
  icon?: boolean;
}

export function NoticeText({ children, icon = true }: NoticeTextProps) {
  return (
    <Typography
      variant="caption"
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0.5,
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000',
        opacity: 0.7,
      }}
    >
      {icon && <InfoOutlinedIcon sx={{ fontSize: 14, mt: '2px', flexShrink: 0 }} />}
      <span>{children}</span>
    </Typography>
  );
}
