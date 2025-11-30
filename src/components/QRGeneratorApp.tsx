import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { ModeToggle } from './ui/ModeToggle';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';
import { NoticeText } from './ui/NoticeText';

type QRMode = 'wifi' | 'url';

export function QRGeneratorApp() {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<QRMode>('wifi');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [ssidError, setSsidError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [hasQR, setHasQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const qrSize = isMobile ? 256 : 320;

  // Validate and generate QR code whenever inputs change
  useEffect(() => {
    if (mode === 'wifi') {
      if (ssid.trim()) {
        setSsidError('');
        generateWiFiQR();
      } else {
        setHasQR(false);
      }
    } else {
      if (url.trim()) {
        setUrlError('');
        generateURLQR();
      } else {
        setHasQR(false);
      }
    }
  }, [mode, ssid, password, url, qrSize]);

  const generateWiFiQR = async () => {
    if (!ssid.trim()) {
      setSsidError(t('error.ssid_required'));
      setHasQR(false);
      return;
    }

    setSsidError('');
    
    // Wi-Fi QR format: WIFI:T:WPA;S:SSID;P:password;H:false;;
    const encryption = password ? 'WPA' : 'nopass';
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:false;;`;

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, wifiString, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setHasQR(true);
      }
    } catch (err) {
      console.error('QR generation failed:', err);
      setHasQR(false);
    }
  };

  const generateURLQR = async () => {
    if (!url.trim()) {
      setHasQR(false);
      return;
    }

    // Auto-add https:// if missing
    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `https://${fullUrl}`;
    }

    // Validate URL
    try {
      new URL(fullUrl);
      setUrlError('');
    } catch {
      setUrlError(t('error.invalid_url'));
      setHasQR(false);
      return;
    }

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, fullUrl, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setHasQR(true);
      }
    } catch (err) {
      console.error('QR generation failed:', err);
      setHasQR(false);
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current || !hasQR) return;

    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `qr-${mode}-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja');
  };

  const handleModeChange = (newMode: QRMode) => {
    setMode(newMode);
    setSsidError('');
    setUrlError('');
    setHasQR(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-2xl">
        {/* Language Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors text-sm"
            aria-label="Toggle language"
          >
            {i18n.language === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>

        {/* Main Container */}
        <div className="border-4 border-black bg-white p-4 md:p-6">
          {/* Mode Toggle */}
          <div className="mb-8">
            <ModeToggle 
              defaultMode={mode} 
              onChange={handleModeChange}
            />
          </div>

          {/* Input Section */}
          <div className="mb-8">
            {mode === 'wifi' ? (
              <div className="space-y-4">
                <TextInput
                  label={t('label.ssid')}
                  placeholder={t('placeholder.ssid')}
                  required
                  value={ssid}
                  onChange={setSsid}
                  error={ssidError}
                />
                <TextInput
                  label={t('label.password')}
                  placeholder={t('placeholder.password')}
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                <div className="pt-2 border-t-2 border-black">
                  <NoticeText>{t('notice.wifi')}</NoticeText>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <TextInput
                  label={t('label.url')}
                  placeholder={t('placeholder.url')}
                  value={url}
                  onChange={setUrl}
                  error={urlError}
                />
                <div className="pt-2 border-t-2 border-black">
                  <NoticeText>{t('notice.url')}</NoticeText>
                </div>
              </div>
            )}
          </div>

          {/* QR Preview Section */}
          <div className="mb-8">
            <div className="p-6 border-2 border-black bg-white">
              <div 
                className={`border-2 border-black bg-white mx-auto flex items-center justify-center ${
                  isMobile ? 'w-64 h-64' : 'w-80 h-80'
                }`}
              >
                {hasQR ? (
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full p-4"
                    aria-label={t('qr.preview')}
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">⊞</div>
                    <div className="text-xs text-black">{t('qr.preview')}</div>
                    <div className="text-xs text-black opacity-70">
                      {isMobile ? '256×256px' : '320×320px'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="mb-6">
            <PrimaryButton 
              onClick={downloadQR} 
              disabled={!hasQR}
            >
              {t('action.download')}
            </PrimaryButton>
          </div>

          {/* Footer Notice */}
          <div className="pt-4 border-t-2 border-black">
            <NoticeText>{t('notice.security')}</NoticeText>
          </div>
        </div>
      </div>
    </div>
  );
}
