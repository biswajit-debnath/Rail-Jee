'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

/**
 * Splits a string by inline math delimiters `$...$` and display math `$$...$$`.
 * Returns an array of segments: { type: 'text' | 'inline' | 'display', value: string }
 */
function parseSegments(input: string) {
  const segments: { type: 'text' | 'inline' | 'display'; value: string }[] = [];
  // Match $$...$$ first, then $...$
  const regex = /\$\$([\s\S]+?)\$\$|\$((?:[^$\\]|\\.)+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      // Display math $$...$$
      segments.push({ type: 'display', value: match[1] });
    } else if (match[2] !== undefined) {
      // Inline math $...$
      segments.push({ type: 'inline', value: match[2] });
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

/**
 * Normalise LaTeX stored in JSON: JSON stores `\cmd` as `\\cmd`,
 * so the JS string contains `\\cmd`; KaTeX needs `\cmd`.
 */
function normaliseLatex(raw: string): string {
  // Replace double-backslash sequences that represent LaTeX commands with a single backslash.
  // But we only do this when the string actually contains `\\` (two chars).
  return raw.replace(/\\\\/g, '\\');
}

function renderMath(latex: string, display: boolean): string {
  try {
    return katex.renderToString(normaliseLatex(latex), {
      displayMode: display,
      throwOnError: false,
      output: 'html',
    });
  } catch {
    return latex;
  }
}

export default function MathText({ text, className, inline = false }: MathTextProps) {
  const segments = useMemo(() => parseSegments(text), [text]);

  const Tag = inline ? 'span' : 'span';

  return (
    <Tag className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>;
        }
        const html = renderMath(seg.value, seg.type === 'display');
        return (
          <span
            key={i}
            // KaTeX generates safe HTML; we need dangerouslySetInnerHTML to render it
            dangerouslySetInnerHTML={{ __html: html }}
            className={seg.type === 'display' ? 'block my-1 text-center' : 'inline'}
          />
        );
      })}
    </Tag>
  );
}
