import { useState, useEffect } from 'react';

interface Post {
  title: string;
  description: string;
  url: string;
  date_published: string;
  tags: string[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const feedUrl = encodeURIComponent('https://medium.com/feed/@agimaulana');

      // Try multiple free CORS-friendly RSS-to-JSON endpoints (no account needed)
      const sources: Array<{
        url: string;
        parse: (data: unknown) => Post[];
      }> = [
        {
          url: `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`,
          parse: (data: unknown) => {
            const json = data as Record<string, unknown>;
            if (json.status !== 'ok') throw new Error(json.message as string);
            return (json.items as Array<Record<string, unknown>>).map((item) => ({
              title: item.title as string,
              description: item.description as string,
              url: item.link as string,
              date_published: item.pubDate as string,
              tags: (item.categories as string[]) || [],
            }));
          },
        },
        {
          url: `https://api.allorigins.win/raw?url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40agimaulana`,
          parse: (data: unknown) => {
            const text = data as string;
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            const items = xml.querySelectorAll('item');
            return Array.from(items).map((item) => ({
              title: item.querySelector('title')?.textContent || '',
              description: item.querySelector('description')?.textContent || '',
              url: item.querySelector('link')?.textContent || '',
              date_published: item.querySelector('pubDate')?.textContent || '',
              tags: Array.from(item.querySelectorAll('category')).map((c) => c.textContent || ''),
            }));
          },
        },
      ];

      let lastError: Error | unknown;

      for (const source of sources) {
        try {
          const res = await fetch(source.url);
          if (!res.ok) continue;

          const contentType = res.headers.get('content-type') || '';
          let parsed: unknown;

          if (contentType.includes('json')) {
            parsed = await res.json();
          } else {
            parsed = await res.text();
          }

          setPosts(source.parse(parsed).slice(0, 6));
          setLoading(false);
          return;
        } catch (e) {
          lastError = e;
          console.warn('Source failed:', source.url, e);
        }
      }

      console.error('All sources failed:', lastError);
      setError('Failed to load posts');
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="divide-y divide-[var(--border)]" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-6">
            <div className="h-5 bg-[var(--bg-subtle)] rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-[var(--bg-subtle)] rounded w-full mb-2"></div>
            <div className="h-4 bg-[var(--bg-subtle)] rounded w-2/3"></div>
          </div>
        ))}
        <p className="sr-only">Loading posts from Medium</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 border border-[var(--border)] rounded-md px-6">
        <p className="text-[var(--text-secondary)] mb-1">Posts could not be loaded from Medium.</p>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          The feed may be temporarily unavailable. You can retry, or read all posts directly on Medium.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary text-sm"
          >
            Retry
          </button>
          <a
            href="https://medium.com/@agimaulana"
            target="_blank"
            rel="noopener"
            className="btn-secondary text-sm"
          >
            Open Medium
          </a>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-8">
        <p className="text-[var(--text-secondary)] mb-1">No posts yet.</p>
        <p className="text-sm text-[var(--text-muted)]">
          New writing appears here. Until then, <a href="https://medium.com/@agimaulana" target="_blank" rel="noopener" className="hover-link">visit Medium</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {posts.map((post) => (
        <div key={post.url} className="py-6">
          <h2 className="text-lg font-semibold mb-1">
            <a href={post.url} target="_blank" rel="noopener" className="hover:text-[var(--accent)] transition-colors">
              {post.title}
            </a>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-3">
            {post.description?.replace(/<[^>]*>/g, '').slice(0, 250)}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <time dateTime={post.date_published}>
              {formatDate(post.date_published)}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
