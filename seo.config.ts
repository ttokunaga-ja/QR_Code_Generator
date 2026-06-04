import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

// ---------------------------------------------------------------------------
// Single source of truth for search / AI-search metadata.
//
// The app is a fully client-rendered SPA, so per-route <head> tags injected at
// runtime never reach OGP scrapers (X / Slack / LINE / Facebook) or AI crawlers
// that do not execute JavaScript. This plugin bakes the head — title, meta
// description, canonical, OGP, Twitter Card and JSON-LD — into static HTML for
// each route at build time, and emits AI-readable Markdown mirrors of the doc
// pages from the existing `content/` source.
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://qr.takumi-tokunaga.com';
export const APP_NAME = 'QR Code Generator';
const OG_IMAGE = `${SITE_URL}/og/qr-code-generator.png`;
const OG_IMAGE_SIZE = 320; // source image is 320x320

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: APP_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ja',
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: APP_NAME,
  url: `${SITE_URL}/`,
  description:
    'Wi-Fi・URL・テキストの QR コードをブラウザだけで生成できる無料ツール。入力内容はサーバーに送信されず端末内で処理されます。',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript.',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
};

export interface RouteSeo {
  /** Output path inside the build dir. */
  out: string;
  /** Canonical site path. */
  path: string;
  title: string;
  description: string;
  ogType: 'website' | 'article';
  jsonLd: object[];
}

export const routes: RouteSeo[] = [
  {
    out: 'index.html',
    path: '/',
    title: `${APP_NAME} | Wi-Fi・URL・テキストのQRコードを無料作成`,
    description:
      'Wi-Fi・URL・テキストのQRコードをブラウザだけで無料生成。入力内容はサーバーに送信されず端末内で完結します。インストール不要・ログイン不要・回数無制限、PNGダウンロード対応。',
    ogType: 'website',
    jsonLd: [webSiteJsonLd, webAppJsonLd],
  },
  {
    out: 'faq/index.html',
    path: '/faq',
    title: `よくある質問（FAQ） | ${APP_NAME}`,
    description:
      'QR Code Generator の使い方、入力したWi-Fiパスワードがサーバーに送信されないか、ダウンロード形式など、よくある質問に回答します。',
    ogType: 'article',
    jsonLd: [webSiteJsonLd],
  },
  {
    out: 'policy/index.html',
    path: '/policy',
    title: `安心して使うために（プライバシー・セキュリティ） | ${APP_NAME}`,
    description:
      'QR Code Generator は入力内容を端末内だけで処理し、サーバーへ送信しません。データの扱いと、QRコードを共有するときの注意点をまとめています。',
    ogType: 'article',
    jsonLd: [webSiteJsonLd],
  },
];

/** AI-readable Markdown mirrors, generated from the existing content sources. */
const markdownReturns = [
  { src: 'content/ja/faq.md', out: 'faq.md', canonical: '/faq' },
  { src: 'content/ja/security-policy.md', out: 'policy.md', canonical: '/policy' },
];

const SEO_START = '<!--seo:start-->';
const SEO_END = '<!--seo:end-->';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function canonicalUrl(routePath: string): string {
  return `${SITE_URL}${routePath === '/' ? '/' : routePath}`;
}

function headFor(route: RouteSeo): string {
  const canonical = canonicalUrl(route.path);
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${route.ogType}" />`,
    `<meta property="og:site_name" content="${escapeHtml(APP_NAME)}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_SIZE}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_SIZE}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...route.jsonLd.map(
      (entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`,
    ),
  ];
  return `${SEO_START}\n    ${tags.join('\n    ')}\n    ${SEO_END}`;
}

function toMarkdownReturn(raw: string): string {
  const trimmed = raw.trim();
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/u.exec(trimmed);
  const frontmatter = match?.[1] ?? '';
  const body = (match?.[2] ?? trimmed).trim();
  const meta = Object.fromEntries(
    frontmatter
      .split('\n')
      .map((line) => {
        const idx = line.indexOf(':');
        return idx < 0 ? null : [line.slice(0, idx).trim(), line.slice(idx + 1).trim().replace(/^"|"$/g, '')];
      })
      .filter((pair): pair is [string, string] => Boolean(pair)),
  );

  const header = [
    meta.title ? `# ${meta.title}` : '',
    meta.description ?? '',
    meta.updated ? `_Updated: ${meta.updated}_` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return `${header}\n\n${body}\n`;
}

/**
 * Vite plugin: injects the homepage head at dev/build time and, after the
 * bundle is written, emits route-specific HTML files plus Markdown mirrors.
 */
export function seoPlugin(): Plugin {
  let outDir = 'build';
  let root = process.cwd();

  return {
    name: 'seo-routes',
    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },
    transformIndexHtml(html) {
      return html.replace('<!-- SEO -->', headFor(routes[0]));
    },
    closeBundle() {
      const outPath = path.resolve(root, outDir);
      const indexHtmlPath = path.join(outPath, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return; // e.g. ssr / non-html builds
      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      const seoBlock = new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}`, 'u');

      // Pre-render the remaining routes by swapping just the SEO head block.
      for (const route of routes.slice(1)) {
        const html = indexHtml.replace(seoBlock, headFor(route));
        const dest = path.join(outPath, route.out);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, html);
      }

      // Markdown Return: AI-readable mirrors of the doc pages.
      for (const mirror of markdownReturns) {
        const raw = fs.readFileSync(path.resolve(root, mirror.src), 'utf8');
        fs.writeFileSync(path.join(outPath, mirror.out), toMarkdownReturn(raw));
      }
    },
  };
}
