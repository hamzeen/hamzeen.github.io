'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SearchItem = {
  type: 'page' | 'blog' | 'topic';
  title: string;
  url: string;
  summary: string;
  keywords: string[];
  date?: string;
};

type Props = {
  variant?: 'compact' | 'large';
};

export default function SearchBox({ variant = 'large' }: Props) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/search-index.json`)
      .then((response) => response.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    return items
      .map((item) => {
        const haystack = [item.title, item.summary, item.type, ...item.keywords]
          .join(' ')
          .toLowerCase();
        const score = item.title.toLowerCase().includes(value)
          ? 3
          : item.keywords.some((keyword) => keyword.toLowerCase().includes(value))
            ? 2
            : haystack.includes(value)
              ? 1
              : 0;
        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, variant === 'compact' ? 5 : 12)
      .map((entry) => entry.item);
  }, [items, query, variant]);

  return (
    <div className={`search-shell search-${variant}`}>
      <label className="sr-only" htmlFor={`global-search-${variant}`}>
        Search portfolio and blog
      </label>
      <input
        id={`global-search-${variant}`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search blogs, keywords..."
        className="search-input"
      />

      {query && (
        <div className="search-results" role="listbox">
          {results.length > 0 ? (
            results.map((result) => (
              <Link key={result.url} href={result.url} className="search-result" onClick={() => setQuery('')}>
                <span className="eyebrow">{result.type}</span>
                <strong>{result.title}</strong>
                <small>{result.summary}</small>
                <span className="tag-row">
                  {result.keywords.slice(0, 4).map((keyword) => (
                    <em key={keyword}>{keyword}</em>
                  ))}
                </span>
              </Link>
            ))
          ) : (
            <p className="search-empty">No matching pages or blogs.</p>
          )}
        </div>
      )}
    </div>
  );
}
