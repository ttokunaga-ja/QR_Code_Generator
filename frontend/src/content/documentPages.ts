import faqEn from '../../content/en/faq.md?raw';
import securityPolicyEn from '../../content/en/security-policy.md?raw';
import faqJa from '../../content/ja/faq.md?raw';
import securityPolicyJa from '../../content/ja/security-policy.md?raw';

export type DocumentPageKey = 'policy' | 'faq';
export type SupportedLocale = 'ja' | 'en';

export interface DocumentPageContent {
  title: string;
  description: string;
  updated: string;
  body: string;
}

function parseMarkdownDocument(markdown: string): DocumentPageContent {
  const trimmed = markdown.trim();
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/u.exec(trimmed);
  const frontmatter = match?.[1] ?? '';
  const body = (match?.[2] ?? trimmed).trim();
  const meta = Object.fromEntries(
    frontmatter
      .split('\n')
      .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/u))
      .filter((item): item is RegExpMatchArray => Boolean(item))
      .map((item) => [item[1], item[2].replace(/^"|"$/g, '')]),
  );

  return {
    title: meta.title ?? 'Document',
    description: meta.description ?? '',
    updated: meta.updated ?? '',
    body,
  };
}

const documentPages: Record<SupportedLocale, Record<DocumentPageKey, DocumentPageContent>> = {
  ja: {
    policy: parseMarkdownDocument(securityPolicyJa),
    faq: parseMarkdownDocument(faqJa),
  },
  en: {
    policy: parseMarkdownDocument(securityPolicyEn),
    faq: parseMarkdownDocument(faqEn),
  },
};

export function getDocumentPage(locale: string, page: DocumentPageKey): DocumentPageContent {
  return documentPages[locale === 'en' ? 'en' : 'ja'][page];
}

