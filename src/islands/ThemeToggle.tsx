import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

// Resolves the effective theme: saved choice, else system preference, else dark.
function resolveTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const initial = resolveTheme();
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');

    // Follow live system changes only while the user has no saved choice.
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      const next: Theme = e.matches ? 'light' : 'dark';
      setTheme(next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
