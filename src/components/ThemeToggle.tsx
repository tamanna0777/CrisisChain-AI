import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  return (
    <div
      id="theme-toggle-container"
      className={`flex items-center p-0.5 rounded-lg bg-[#07172A] border border-[#1E4370] shadow-inner ${className}`}
      role="group"
      aria-label="Theme selection"
    >
      {/* Light Button */}
      <button
        id="theme-toggle-light-btn"
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
          theme === 'light'
            ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-100'
            : 'text-slate-300 hover:text-white hover:bg-[#122A4A]/60'
        }`}
        title="Switch to Light Theme"
        aria-pressed={theme === 'light'}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold">Light</span>
      </button>

      {/* Dark Button */}
      <button
        id="theme-toggle-dark-btn"
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
          theme === 'dark'
            ? 'bg-blue-600 text-white font-bold shadow-md scale-100'
            : 'text-slate-300 hover:text-white hover:bg-[#122A4A]/60'
        }`}
        title="Switch to Dark Theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold">Dark</span>
      </button>
    </div>
  );
};
