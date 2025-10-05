'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === 'system' ? systemTheme : theme;

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {current === 'dark' ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.752 15.002A9 9 0 0 1 9 2.25a.75.75 0 0 0-.966.966 9 9 0 1 0 12.718 12.718.75.75 0 0 0 1-.932z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75zm6.22 2.53a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm8.25-6a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V12.75a.75.75 0 0 1 .75-.75zM4.5 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 4.5 12zm13.19 5.47a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0zM12 18.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75zM6.37 17.47a.75.75 0 0 1 0 1.06L5.31 19.6a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0zM6.37 5.47 5.31 4.41A.75.75 0 0 1 6.37 3.35l1.06 1.06A.75.75 0 0 1 6.37 5.47z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}


