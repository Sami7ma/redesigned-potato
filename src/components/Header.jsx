import React from 'react';
import { 
  Sun, 
  Moon, 
  BarChart2, 
  BookOpen, 
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Header({
  theme,
  setTheme,
  onOpenComparison,
  onOpenTheory,
  isMobileMenuOpen,
  onToggleMobileMenu
}) {
  const isDark = theme === 'obsidian-gold' || theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'woody-gold' : 'obsidian-gold');
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* Brand & DSA Algorithm Icon */}
        <div className="brand-section">
          <button 
            className="mobile-menu-toggle btn btn-outline btn-sm"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Sidebar"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Custom DSA / Algorithm SVG Logo */}
          <div className="brand-icon dsa-brand-icon" title="AlgoLab CS Laboratory & Visualizer Workbench">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </div>

          <div className="brand-text-container">
            <h1 className="brand-title">AlgoLab • Algorithm Simulation Workbench</h1>
            <p className="brand-subtitle">
              OS Core • Graph & MST • Dynamic Programming • Sorting • Array & String • Backtracking
            </p>
          </div>
        </div>

        {/* Action Controls & Two-Theme Switcher */}
        <div className="header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenTheory}
            title="Algorithm Theory, Principles & Pseudocode"
          >
            <BookOpen size={13} /> <span className="btn-text-hide-mobile">Theory Guide</span>
          </button>

          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenComparison}
            title="Compare category algorithms side-by-side (C)"
          >
            <BarChart2 size={13} /> <span className="btn-text-hide-mobile">Compare All</span>
          </button>

          {/* Classy Gold/Obsidian Theme Toggle */}
          <button
            className="btn btn-outline btn-sm theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Champagne Gold & Wood (Light)' : 'Switch to Obsidian Gold Glass (Dark)'}
          >
            {isDark ? (
              <>
                <Sun size={14} color="#f59e0b" />
                <span className="btn-text-hide-mobile">Wood & Gold</span>
              </>
            ) : (
              <>
                <Moon size={14} color="#c99738" />
                <span className="btn-text-hide-mobile">Obsidian Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
