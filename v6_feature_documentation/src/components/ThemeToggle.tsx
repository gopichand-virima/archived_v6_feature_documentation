/**
 * Theme Toggle Button
 * Single click toggles between Light and Dark themes.
 * Uses the View Transition API for a smooth animated switch.
 */

import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../lib/theme/theme-provider';

export function ThemeToggle() {
  const { actualTheme, setTheme } = useTheme();

  const toggle = () => {
    const next = actualTheme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    document.startViewTransition(() => {
      setTheme(next);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-9 w-9 px-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {actualTheme === 'dark' ? (
        <Sun className="h-4 w-4 text-slate-300" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
