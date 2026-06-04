import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
  const [showPassword, setShowPassword] = useState(false);
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
      }
    } else {
      if (url.trim()) {
        setUrlError('');
        generateURLQR();
      }
    }
  }, [mode, ssid, password, url, qrSize]);

  const generateWiFiQR = async () => {
    if (!ssid.trim()) {
      setSsidError(t('error.ssid_required'));
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
            light: '#FFFFFF',
          },
        });
      }
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  };

  const generateURLQR = async () => {
    if (!url.trim()) return;

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
      return;
    }

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, fullUrl, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
      }
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current || !shouldShowQR) return;

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
  };

  const trimmedSsid = ssid.trim();
  const trimmedUrl = url.trim();
  const trimmedPassword = password.trim();
  const hasWifiInput = mode === 'wifi' && Boolean(trimmedSsid);
  const hasUrlInput = mode === 'url' && Boolean(trimmedUrl) && !urlError;
  const shouldShowQR = hasWifiInput || hasUrlInput;
  const canTogglePassword = Boolean(trimmedPassword);

  const passwordIcon = showPassword ? (
    <VisibilityOffIcon sx={{ fontSize: 18 }} />
  ) : (
    <VisibilityIcon sx={{ fontSize: 18 }} />
  );

  const previewSide = isMobile ? 256 : 320;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: { xs: 448, md: 672 } }}>
        {/* Language Toggle - Top Right */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              fontSize: 14,
              border: '2px solid #000',
              color: '#000',
              backgroundColor: '#fff',
              '&:hover': { backgroundColor: '#000', color: '#fff', borderColor: '#000' },
            }}
          >
            {i18n.language === 'ja' ? 'EN' : 'JA'}
          </Button>
        </Box>

        {/* Main Container */}
        <Box sx={{ border: '4px solid #000', backgroundColor: '#fff', p: { xs: 2, md: 3 } }}>
          {/* Mode Toggle */}
          <Box sx={{ mb: 4 }}>
            <ModeToggle defaultMode={mode} onChange={handleModeChange} />
          </Box>

          {/* Input Section */}
          <Box sx={{ mb: 4 }}>
            {mode === 'wifi' ? (
              <Stack spacing={2}>
                <TextInput
                  id="ssid-input"
                  label={t('label.ssid')}
                  placeholder={t('placeholder.ssid')}
                  required
                  value={ssid}
                  onChange={setSsid}
                  error={ssidError}
                />
                <TextInput
                  id="password-input"
                  label={t('label.password')}
                  placeholder={t('placeholder.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={setPassword}
                  trailingIcon={canTogglePassword ? passwordIcon : undefined}
                  trailingIconLabel={
                    showPassword ? t('action.hide_password') : t('action.show_password')
                  }
                  onTrailingIconClick={
                    canTogglePassword ? () => setShowPassword((prev) => !prev) : undefined
                  }
                />
                <Box sx={{ pt: 1, borderTop: '2px solid #000' }}>
                  <NoticeText>{t('notice.wifi')}</NoticeText>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextInput
                  id="url-input"
                  label={t('label.url')}
                  placeholder={t('placeholder.url')}
                  value={url}
                  onChange={setUrl}
                  error={urlError}
                />
                <Box sx={{ pt: 1, borderTop: '2px solid #000' }}>
                  <NoticeText>{t('notice.url')}</NoticeText>
                </Box>
              </Stack>
            )}
          </Box>

          {/* QR Preview Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                border: '2px solid #000',
                backgroundColor: '#fff',
                mx: 'auto',
                width: previewSide,
                height: previewSide,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {shouldShowQR ? (
                <Box
                  component="canvas"
                  ref={canvasRef}
                  aria-label={t('qr.preview')}
                  sx={{ width: '100%', height: '100%', p: 2 }}
                />
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    px: 3,
                  }}
                >
                  <Box sx={{ fontSize: 36 }}>⊞</Box>
                  <Typography sx={{ fontSize: 12, color: '#000', whiteSpace: 'pre-line' }}>
                    {t('qr.preview')}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#000', opacity: 0.7 }}>
                    {isMobile ? '256×256px' : '320×320px'}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Download Button */}
          <Box sx={{ mb: 3 }}>
            <PrimaryButton onClick={downloadQR} disabled={!shouldShowQR}>
              {t('action.download')}
            </PrimaryButton>
          </Box>

          {/* Footer Notice */}
          <Box sx={{ pt: 2, borderTop: '2px solid #000' }}>
            <NoticeText>{t('notice.security')}</NoticeText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
