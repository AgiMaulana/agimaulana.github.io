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
      const sources = [
        {
          url: `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`,
          parse: (data: Record<string, unknown>) => {
            if (data.status !== 'ok') throw new Error(data.message as string);
            return (data.items as Array<Record<string, unknown>>).map((item) => ({
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
          parse: (text: string) => {
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
          let posts: Post[];

          if (contentType.includes('json')) {
            const json = await res.json();
            posts = source.parse(json);
          } else {
            const text = await res.text();
            posts = source.parse(text);
          }

          setPosts(posts.slice(0, 6));
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
      <div class="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} class="card animate-pulse">
            <div class="h-6 bg-[var(--bg-tertiary)] rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-[var(--bg-tertiary)] rounded w-full mb-2"></div>
            <div class="h-4 bg-[var(--bg-tertiary)] rounded w-2/3 mb-4"></div>
            <div class="flex gap-2">
              <div class="h-5 w-16 bg-[var(--bg-tertiary)] rounded"></div>
              <div class="h-5 w-20 bg-[var(--bg-tertiary)] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div class="text-center py-8">
        <p class="text-[var(--text-muted)]">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          class="mt-4 btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      {posts.map((post, index) => (
        <a 
          key={post.url}
          href={post.url} 
          target="_blank"
          rel="noopener"
          class="card block group opacity-0 animate-slide-up"
          style={`animation-delay: ${(index + 2) * 0.1}s`}
        >
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div class="flex-1">
              <h2 class="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
              <p class="text-[var(--text-secondary)] mb-3 line-clamp-3">
                {post.description?.replace(/<[^>]*>/g, '').slice(0, 250)}
              </p>
              <div class="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                <time datetime={post.date_published}>
                  {formatDate(post.date_published)}
                </time>
                {post.tags && post.tags.length > 0 && (
                  <div class="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span class="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
              class="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all shrink-0"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}