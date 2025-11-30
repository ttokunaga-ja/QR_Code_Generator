interface NoticeTextProps {
  children: React.ReactNode;
  icon?: boolean;
}

export function NoticeText({ children, icon = true }: NoticeTextProps) {
  return (
    <div className="text-xs text-black opacity-70" style={{ lineHeight: '1.5' }}>
      {icon && <span className="mr-1">ⓘ</span>}
      {children}
    </div>
  );
}
