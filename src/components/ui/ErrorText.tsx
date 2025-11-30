interface ErrorTextProps {
  children: React.ReactNode;
  icon?: boolean;
}

export function ErrorText({ children, icon = true }: ErrorTextProps) {
  return (
    <div className="text-xs text-black font-bold" style={{ lineHeight: '1.5' }}>
      {icon && <span className="mr-1">⚠</span>}
      {children}
    </div>
  );
}
