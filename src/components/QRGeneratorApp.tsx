import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { getDocumentPage, type DocumentPageContent, type DocumentPageKey } from '../content/documentPages';
import { MarkdownArticle } from './MarkdownArticle';
import { ModeToggle, type ModeValue } from './ui/ModeToggle';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

type QRMode = ModeValue;
type AppRoute = 'generator' | DocumentPageKey;

const routePaths: Record<AppRoute, string> = {
  generator: '/',
  policy: '/policy',
  faq: '/faq',
};

function routeFromPath(pathname: string): AppRoute {
  const normalized = pathname.replace(/\/+$/u, '') || '/';
  if (normalized === routePaths.policy) return 'policy';
  if (normalized === routePaths.faq) return 'faq';
  return 'generator';
}

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
        backgroundColor: 'color-mix(in srgb, var(--mui-palette-background-paper) 74%, transparent)',
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

interface HeaderNavButtonProps {
  active: boolean;
  icon: ReactElement;
  label: string;
  onClick: () => void;
}

function HeaderNavButton({ active, icon, label, onClick }: HeaderNavButtonProps) {
  return (
    <Tooltip title={label}>
      <Button
        aria-label={label}
        onClick={onClick}
        startIcon={icon}
        variant={active ? 'contained' : 'outlined'}
        sx={{
          minWidth: { xs: 42, md: 'auto' },
          width: { xs: 42, md: 'auto' },
          height: 42,
          px: { xs: 0, md: 1.75 },
          borderColor: active ? 'primary.main' : 'divider',
          color: active ? 'primary.contrastText' : 'text.primary',
          backgroundColor: active
            ? 'primary.main'
            : 'color-mix(in srgb, var(--mui-palette-background-paper) 92%, transparent)',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: active ? 'primary.dark' : 'grey.100',
          },
          '& .MuiButton-startIcon': {
            m: { xs: 0, md: '0 8px 0 -4px' },
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
          {label}
        </Box>
      </Button>
    </Tooltip>
  );
}

interface DocumentPageViewProps {
  page: DocumentPageContent;
  pageKey: DocumentPageKey;
  updatedLabel: string;
}

function DocumentPageView({ page, pageKey, updatedLabel }: DocumentPageViewProps) {
  const icon = pageKey === 'policy' ? <SecurityIcon /> : <HelpOutlineIcon />;

  return (
    <Paper
      component="main"
      sx={{
        p: { xs: 2.25, sm: 3, md: 4 },
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 24px 70px color-mix(in srgb, var(--mui-palette-common-black) 12%, transparent)',
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1.25}>
          <Chip
            icon={icon}
            label={page.title}
            sx={{
              alignSelf: 'flex-start',
              borderRadius: 999,
              color: 'primary.main',
              backgroundColor: 'grey.100',
              fontWeight: 800,
            }}
          />
          <Typography component="h1" variant="h4" sx={{ fontSize: { xs: 27, sm: 36 } }}>
            {page.title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{page.description}</Typography>
          {page.updated ? (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {updatedLabel}: {page.updated}
            </Typography>
          ) : null}
        </Stack>

        <Divider />
        <MarkdownArticle markdown={page.body} />
      </Stack>
    </Paper>
  );
}

export function QRGeneratorApp() {
  const { t, i18n } = useTranslation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [route, setRoute] = useState<AppRoute>(() => routeFromPath(window.location.pathname));
  const [mode, setMode] = useState<QRMode>('wifi');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [ssidError, setSsidError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrSize = isMobile ? 256 : 320;
  const activeLocale = i18n.resolvedLanguage === 'en' || i18n.language === 'en' ? 'en' : 'ja';
  const documentPageKey: DocumentPageKey | null = route === 'generator' ? null : route;
  const documentPage = documentPageKey ? getDocumentPage(activeLocale, documentPageKey) : null;

  useEffect(() => {
    const handlePopState = () => {
      setRoute(routeFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = activeLocale;
    document.title = documentPage
      ? `${documentPage.title} | ${t('app.title')}`
      : `${t('app.title')} | ${t('app.subtitle')}`;
  }, [activeLocale, documentPage, t]);

  useEffect(() => {
    if (mode === 'wifi') {
      if (ssid.trim()) {
        setSsidError('');
        generateWiFiQR();
      }
    } else if (mode === 'url' && url.trim()) {
      setUrlError('');
      generateURLQR();
    } else if (mode === 'text' && text.trim()) {
      generateTextQR();
    }
  }, [mode, ssid, password, url, text, qrSize]);

  const navigateTo = (nextRoute: AppRoute) => {
    const nextPath = routePaths[nextRoute];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const generateTextQR = async () => {
    const value = text.trim();
    if (!value) return;

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, value, {
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
    const nextLocale = activeLocale === 'ja' ? 'en' : 'ja';
    window.localStorage.setItem('qr-locale', nextLocale);
    i18n.changeLanguage(nextLocale);
  };

  const handleModeChange = (newMode: QRMode) => {
    setMode(newMode);
    setSsidError('');
    setUrlError('');
  };

  const trimmedSsid = ssid.trim();
  const trimmedUrl = url.trim();
  const trimmedText = text.trim();
  const trimmedPassword = password.trim();
  const hasWifiInput = mode === 'wifi' && Boolean(trimmedSsid);
  const hasUrlInput = mode === 'url' && Boolean(trimmedUrl) && !urlError;
  const hasTextInput = mode === 'text' && Boolean(trimmedText);
  const shouldShowQR = hasWifiInput || hasUrlInput || hasTextInput;
  const canTogglePassword = Boolean(trimmedPassword);
  const previewSide = isMobile ? 256 : 320;

  const passwordIcon = showPassword ? (
    <VisibilityOffIcon sx={{ fontSize: 18 }} />
  ) : (
    <VisibilityIcon sx={{ fontSize: 18 }} />
  );

  const generatorPanel = (
    <Paper
      component="main"
      sx={{
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 24px 70px color-mix(in srgb, var(--mui-palette-common-black) 12%, transparent)',
      }}
    >
      <Stack spacing={3}>
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
        >
          <Box sx={{ maxWidth: 640 }}>
            <Typography component="h1" variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
              {t('app.heading')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.75, fontSize: 14 }}>
              {t('app.description')}
            </Typography>
          </Box>
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
            <ModeToggle
              defaultMode={mode}
              labels={{
                wifi: t('mode.wifi'),
                url: t('mode.url'),
                text: t('mode.text'),
              }}
              onChange={handleModeChange}
            />

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
                    backgroundColor:
                      'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)',
                    color: 'text.secondary',
                    '& .MuiAlert-icon': { color: 'primary.main' },
                  }}
                >
                  {t('notice.wifi')}
                </Alert>
              </Stack>
            ) : mode === 'url' ? (
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
                    backgroundColor:
                      'color-mix(in srgb, var(--mui-palette-secondary-main) 10%, transparent)',
                    color: 'text.secondary',
                    '& .MuiAlert-icon': { color: 'secondary.main' },
                  }}
                >
                  {t('notice.url')}
                </Alert>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextInput
                  id="text-input"
                  label={t('label.text')}
                  placeholder={t('placeholder.text')}
                  value={text}
                  onChange={setText}
                  multiline
                  minRows={4}
                  maxRows={8}
                />
                <Alert
                  severity="info"
                  icon={<NotesIcon fontSize="inherit" />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor:
                      'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)',
                    color: 'text.secondary',
                    '& .MuiAlert-icon': { color: 'primary.main' },
                  }}
                >
                  {t('notice.text')}
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
                  <Typography sx={{ fontSize: 13, color: '#172326', fontWeight: 800 }}>
                    {t('qr.preview')}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#657174' }}>
                    {isMobile ? '256 x 256px' : '320 x 320px'}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, color-mix(in srgb, var(--mui-palette-primary-main) 14%, transparent), transparent 34%), linear-gradient(180deg, var(--mui-palette-background-default) 0%, color-mix(in srgb, var(--mui-palette-background-default) 88%, var(--mui-palette-primary-main) 12%) 100%)',
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor:
            'color-mix(in srgb, var(--mui-palette-background-paper) 88%, transparent)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 }, gap: 1.5 }}>
            <ButtonBase
              onClick={() => navigateTo('generator')}
              aria-label={t('nav.generator')}
              sx={{ borderRadius: 2, flexGrow: 1, minWidth: 0, justifyContent: 'flex-start' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    width: { xs: 38, sm: 42 },
                    height: { xs: 38, sm: 42 },
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                    boxShadow:
                      '0 12px 28px color-mix(in srgb, var(--mui-palette-primary-main) 28%, transparent)',
                    flexShrink: 0,
                  }}
                >
                  <QrCode2Icon />
                </Box>
                <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
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
            </ButtonBase>

            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
              <HeaderNavButton
                active={route === 'generator'}
                icon={<HomeRoundedIcon />}
                label={t('nav.generator')}
                onClick={() => navigateTo('generator')}
              />
              <HeaderNavButton
                active={route === 'policy'}
                icon={<SecurityIcon />}
                label={t('nav.policy')}
                onClick={() => navigateTo('policy')}
              />
              <HeaderNavButton
                active={route === 'faq'}
                icon={<HelpOutlineIcon />}
                label={t('nav.faq')}
                onClick={() => navigateTo('faq')}
              />
              <Tooltip title={t('action.toggle_language')}>
                <IconButton
                  onClick={toggleLanguage}
                  aria-label={t('action.toggle_language')}
                  sx={{
                    width: 42,
                    height: 42,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor:
                      'color-mix(in srgb, var(--mui-palette-background-paper) 92%, transparent)',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main', backgroundColor: 'grey.100' },
                  }}
                >
                  <Stack spacing={0} alignItems="center" sx={{ lineHeight: 1 }}>
                    <LanguageIcon sx={{ fontSize: 17 }} />
                    <Box component="span" sx={{ fontSize: 10, fontWeight: 900 }}>
                      {activeLocale === 'ja' ? 'EN' : 'JA'}
                    </Box>
                  </Stack>
                </IconButton>
              </Tooltip>
            </Stack>
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
            {documentPage && documentPageKey ? (
              <DocumentPageView
                page={documentPage}
                pageKey={documentPageKey}
                updatedLabel={t('page.updated')}
              />
            ) : (
              generatorPanel
            )}

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
