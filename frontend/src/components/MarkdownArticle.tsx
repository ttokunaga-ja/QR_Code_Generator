import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: 'list', items: listItems });
    listItems = [];
  };

  markdown.split(/\r?\n/u).forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = /^(#{2,3})\s+(.+)$/u.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: heading[1].length as 2 | 3,
        text: heading[2],
      });
      return;
    }

    const listItem = /^[-*]\s+(.+)$/u.exec(line);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}

function renderInline(text: string) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/gu;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  text.replace(pattern, (match, _capture, offset: number) => {
    if (offset > lastIndex) {
      nodes.push(text.slice(lastIndex, offset));
    }

    if (match.startsWith('**')) {
      nodes.push(
        <Box component="strong" key={`${offset}-bold`}>
          {match.slice(2, -2)}
        </Box>,
      );
    } else if (match.startsWith('`')) {
      nodes.push(
        <Box component="code" key={`${offset}-code`}>
          {match.slice(1, -1)}
        </Box>,
      );
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/u.exec(match);
      if (link) {
        const href = link[2];
        const external = /^https?:\/\//u.test(href);
        nodes.push(
          <Link
            href={href}
            key={`${offset}-link`}
            rel={external ? 'noreferrer' : undefined}
            target={external ? '_blank' : undefined}
          >
            {link[1]}
          </Link>,
        );
      }
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface MarkdownArticleProps {
  markdown: string;
}

export function MarkdownArticle({ markdown }: MarkdownArticleProps) {
  const blocks = parseMarkdown(markdown);

  return (
    <Box
      className="markdown-article"
      sx={{
        color: 'text.primary',
        '& h2': { mt: 4, mb: 1.25, fontSize: { xs: 22, sm: 26 }, lineHeight: 1.25 },
        '& h3': { mt: 3, mb: 1, fontSize: { xs: 18, sm: 20 }, lineHeight: 1.3 },
        '& p': { my: 1.35, color: 'text.secondary', lineHeight: 1.85 },
        '& ul': { pl: 3, my: 1.5 },
        '& li': { mb: 0.75, color: 'text.secondary', lineHeight: 1.75 },
        '& a': { color: 'primary.main', fontWeight: 800 },
        '& code': {
          px: 0.75,
          py: 0.2,
          borderRadius: 1,
          color: 'primary.main',
          backgroundColor: 'grey.100',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: '0.92em',
        },
        '& > *:first-of-type': { mt: 0 },
      }}
    >
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <Typography component={`h${block.level}`} key={`${block.type}-${index}`}>
              {renderInline(block.text)}
            </Typography>
          );
        }

        if (block.type === 'list') {
          return (
            <Box component="ul" key={`${block.type}-${index}`}>
              {block.items.map((item) => (
                <Box component="li" key={item}>
                  {renderInline(item)}
                </Box>
              ))}
            </Box>
          );
        }

        return (
          <Typography key={`${block.type}-${index}`}>{renderInline(block.text)}</Typography>
        );
      })}
    </Box>
  );
}
