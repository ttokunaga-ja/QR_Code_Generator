import { useState, useEffect } from 'react';

export function WireframeView() {
  const [qrMode, setQrMode] = useState<'wifi' | 'url'>('wifi');
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const displayMode = isMobile ? 'Mobile' : 'Desktop';
  const displayWidth = isMobile ? `${screenWidth}px` : `${screenWidth}px`;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl border-4 border-black bg-white p-4 md:p-6 min-h-screen">
        {/* Wireframe Annotations */}
        <div className="text-xs text-black mb-4 pb-2 border-b border-black">
          {displayMode} Layout ({displayWidth}) - Auto-responsive
        </div>

        {/* Mode Toggle - Top Section */}
        <div className="mb-8">
          <div className="text-xs text-black mb-2">// Mode Toggle</div>
          <div className="border-2 border-black p-4 flex gap-2">
            <button
              onClick={() => setQrMode('wifi')}
              className={`flex-1 py-3 border-2 border-black transition-colors ${
                qrMode === 'wifi' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              Wi-Fi
            </button>
            <button
              onClick={() => setQrMode('url')}
              className={`flex-1 py-3 border-2 border-black transition-colors ${
                qrMode === 'url' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              URL
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="text-xs text-black mb-2">// Input Form</div>
          {qrMode === 'wifi' ? (
            <div className="border-2 border-black p-4 space-y-4">
              {/* SSID Input */}
              <div>
                <div className="text-sm text-black mb-1">SSID *</div>
                <div className="border-2 border-black p-3 bg-white">
                  [Text Input - SSID]
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="text-sm text-black mb-1">Password</div>
                <div className="border-2 border-black p-3 bg-white">
                  [Text Input - Password]
                </div>
              </div>

              {/* Notice */}
              <div className="text-xs text-black border-t-2 border-black pt-3 mt-3">
                ⓘ SSID is required. Password is optional for open networks.
              </div>
            </div>
          ) : (
            <div className="border-2 border-black p-4 space-y-4">
              {/* URL Input */}
              <div>
                <div className="text-sm text-black mb-1">URL</div>
                <div className="border-2 border-black p-3 bg-white">
                  [Text Input - URL]
                </div>
              </div>

              {/* Notice */}
              <div className="text-xs text-black border-t-2 border-black pt-3 mt-3">
                ⓘ Include https:// in your URL. It will be added automatically if missing.
              </div>
            </div>
          )}
        </div>

        {/* QR Preview Section */}
        <div className="mb-8">
          <div className="text-xs text-black mb-2">// QR Code Preview</div>
          <div className="border-2 border-black p-6">
            <div 
              className={`border-2 border-black bg-white mx-auto flex items-center justify-center ${
                isMobile ? 'w-64 h-64' : 'w-80 h-80'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">⊞</div>
                <div className="text-xs text-black">QR Code Preview</div>
                <div className="text-xs text-black">
                  {isMobile ? '256×256px' : '320×320px'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <div className="text-xs text-black mb-2">// Download Action</div>
          <button className="w-full border-2 border-black bg-black text-white py-4 hover:bg-white hover:text-black transition-colors">
            Download PNG
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-black border-t-2 border-black pt-4">
          <div className="mb-2">// Footer Information</div>
          <div className="opacity-70">
            All QR generation happens in your browser. No data is sent to servers.
          </div>
        </div>

        {/* Layout Annotations */}
        <div className="mt-8 p-4 border-2 border-black bg-white">
          <div className="text-xs text-black">
            <strong>Current Layout:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Viewport: {displayMode} ({displayWidth})</li>
              <li>Breakpoint: {isMobile ? 'Mobile (<768px)' : 'Desktop (≥768px)'}</li>
              <li>QR Size: {isMobile ? '256×256px' : '320×320px'}</li>
              <li>Max-width: {isMobile ? '28rem (448px)' : '42rem (672px)'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
