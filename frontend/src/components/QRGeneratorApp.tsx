import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import DownloadIcon from '@mui/icons-material/Download';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { ModeToggle } from './ui/ModeToggle';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';
import { NoticeText } from './ui/NoticeText';

type QRMode = 'wifi' | 'url';

interface AdSlotProps {
  label: string;
  size: string;
  orientation?: 'horizontal' | 'vertical';
}

function AdSlot({ label, size, orientation = 'horizontal' }: AdSlotProps) {
  return (
    <Paper
      component="aside"
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        minHeight: orientation === 'vertical' ? 250 : { xs: 84, sm: 96 },
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Stack spacing={0.5} alignItems="center">
        <AdUnitsIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
        <Typography sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 800 }}>
          {label}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>{size}</Typography>
      </Stack>
    </Paper>
  );
}

export function QRGeneratorApp() {
  const { t, i18n } = useTranslation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [mode, setMode] = useState<QRMode>('wifi');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [ssidError, setSsidError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrSize = isMobile ? 256 : 320;

  useEffect(() => {
    if (mode === 'wifi') {
      if (ssid.trim()) {
        setSsidError('');
        generateWiFiQR();
      }
    } else if (url.trim()) {
      setUrlError('');
      generateURLQR();
    }
  }, [mode, ssid, password, url, qrSize]);

  const generateWiFiQR = async () => {
    if (!ssid.trim()) {
      setSsidError(t('error.ssid_required'));
      return;
    }

    setSsidError('');

    const encryption = password ? 'WPA' : 'nopass';
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:false;;`;

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, wifiString, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#172326',
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

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `https://${fullUrl}`;
    }

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
            dark: '#172326',
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
  const previewSide = isMobile ? 256 : 320;

  const passwordIcon = showPassword ? (
    <VisibilityOffIcon sx={{ fontSize: 18 }} />
  ) : (
    <VisibilityIcon sx={{ fontSize: 18 }} />
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(20,108,108,0.10), transparent 34%), linear-gradient(180deg, #F6F8F7 0%, #EEF3F1 100%)',
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 }, gap: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 12px 28px rgba(20, 108, 108, 0.25)',
                }}
              >
                <QrCode2Icon />
              </Box>
              <Box>
                <Typography component="div" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {t('app.title')}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'block' },
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {t('app.subtitle')}
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={<SecurityIcon />}
              label={t('app.private_badge')}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                borderRadius: 999,
                backgroundColor: 'rgba(20, 108, 108, 0.10)',
                color: 'primary.dark',
                fontWeight: 800,
              }}
            />
            <Button
              onClick={toggleLanguage}
              aria-label={t('action.toggle_language')}
              variant="outlined"
              startIcon={<LanguageIcon />}
              sx={{
                px: 2,
                borderColor: 'divider',
                color: 'text.primary',
                backgroundColor: '#fff',
                '&:hover': { borderColor: 'primary.main', backgroundColor: 'grey.50' },
              }}
            >
              {i18n.language === 'ja' ? 'EN' : 'JA'}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <AdSlot label={t('ad.header')} size={isMobile ? '320 x 80' : '728 x 90'} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Stack spacing={3}>
            <Paper
              component="main"
              sx={{
                p: { xs: 2, sm: 3 },
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 24px 70px rgba(23, 35, 38, 0.10)',
              }}
            >
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography component="h1" variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
                      {t('app.heading')}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.75, fontSize: 14 }}>
                      {t('app.description')}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    <Chip icon={<WifiIcon />} label="Wi-Fi" sx={{ borderRadius: 999 }} />
                    <Chip icon={<LinkIcon />} label="URL" sx={{ borderRadius: 999 }} />
                  </Stack>
                </Stack>

                <Divider />

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 352px' },
                    gap: { xs: 3, md: 4 },
                    alignItems: 'start',
                  }}
                >
                  <Stack spacing={2.5}>
                    <ModeToggle defaultMode={mode} onChange={handleModeChange} />

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
                        <Alert
                          severity="info"
                          icon={<WifiIcon fontSize="inherit" />}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(20, 108, 108, 0.08)',
                            color: 'text.secondary',
                            '& .MuiAlert-icon': { color: 'primary.main' },
                          }}
                        >
                          {t('notice.wifi')}
                        </Alert>
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
                        <Alert
                          severity="info"
                          icon={<LinkIcon fontSize="inherit" />}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(227, 93, 69, 0.08)',
                            color: 'text.secondary',
                            '& .MuiAlert-icon': { color: 'secondary.main' },
                          }}
                        >
                          {t('notice.url')}
                        </Alert>
                      </Stack>
                    )}

                    <PrimaryButton onClick={downloadQR} disabled={!shouldShowQR}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <DownloadIcon sx={{ fontSize: 20 }} />
                        <span>{t('action.download')}</span>
                      </Stack>
                    </PrimaryButton>
                  </Stack>

                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: '#fff',
                      mx: 'auto',
                      width: '100%',
                      maxWidth: 352,
                      minHeight: { xs: 318, sm: 376 },
                      p: 2,
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: 'inset 0 0 0 8px rgba(20, 108, 108, 0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        width: previewSide,
                        height: previewSide,
                        maxWidth: '100%',
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
                          sx={{ width: '100%', height: '100%' }}
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
                          <Box
                            sx={{
                              width: 54,
                              height: 54,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              color: 'primary.main',
                              backgroundColor: 'rgba(20, 108, 108, 0.10)',
                            }}
                          >
                            <QrCode2Icon />
                          </Box>
                          <Typography sx={{ fontSize: 13, color: 'text.primary', fontWeight: 800 }}>
                            {t('qr.preview')}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                            {isMobile ? '256 x 256px' : '320 x 320px'}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <NoticeText>{t('notice.security')}</NoticeText>
              </Stack>
            </Paper>

            <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
              <AdSlot label={t('ad.inline')} size="320 x 100" />
            </Box>
          </Stack>

          <Stack spacing={2.5} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <AdSlot label={t('ad.sidebar_primary')} size="300 x 250" orientation="vertical" />
            <AdSlot label={t('ad.sidebar_secondary')} size="300 x 100" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
