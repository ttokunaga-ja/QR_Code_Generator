interface QRPreviewProps {
  size?: 'mobile' | 'desktop';
  hasQR?: boolean;
  qrDataUrl?: string;
}

export function QRPreview({ 
  size = 'desktop', 
  hasQR = false,
  qrDataUrl 
}: QRPreviewProps) {
  const dimension = size === 'mobile' ? 'w-64 h-64' : 'w-80 h-80';
  const pixelSize = size === 'mobile' ? '256×256px' : '320×320px';

  return (
    <div className="p-6 border-2 border-black bg-white">
      <div className={`${dimension} border-2 border-black bg-white mx-auto flex items-center justify-center`}>
        {hasQR || qrDataUrl ? (
          qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-full h-full p-4" />
          ) : (
            // Simulated QR code pattern
            <div className="w-full h-full p-8">
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                    } border border-gray-300`}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">⊞</div>
            <div className="text-xs text-black">QR Code Preview</div>
            <div className="text-xs text-black opacity-70">{pixelSize}</div>
          </div>
        )}
      </div>
    </div>
  );
}
