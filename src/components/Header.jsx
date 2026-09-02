import React, { useState } from 'react';
import { 
  Code2, 
  Binary, 
  Network, 
  Sparkles, 
  Compass, 
  Moon, 
  Sun, 
  BarChart2, 
  BookOpen, 
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { THEMES } from '../types/data';

export default function Header({
  theme,
  setTheme,
  onOpenComparison,
  onOpenTheory,
  isMobileMenuOpen,
  onToggleMobileMenu
}) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const currentThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  const getThemeIcon = (id) => {
    switch (id) {
      case 'chameleon-glass': return <Sparkles size={13} color="#10b981" />;
      case 'warm-wood': return <Compass size={13} color="#d97706" />;
      case 'obsidian-dark': return <Moon size={13} color="#38bdf8" />;
      case 'clean-lab': return <Sun size={13} color="#f59e0b" />;
      default: return <Sparkles size={13} />;
    }
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Action Controls & Classy 4-Theme Selector */}
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

          {/* Classy Theme Selector Popover */}
          <div className="theme-selector-wrapper" style={{ position: 'relative' }}>
            <button
              className="btn btn-outline btn-sm theme-toggle-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Select Classy Theme Style"
            >
              {getThemeIcon(theme)}
              <span className="btn-text-hide-mobile">{currentThemeObj.name}</span>
              <ChevronDown size={11} />
            </button>

            {showThemeMenu && (
              <div 
                className="theme-dropdown-menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '6px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-xl)',
                  minWidth: '220px',
                  zIndex: 100,
                  padding: '4px'
                }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-option-btn ${theme === t.id ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      border: 'none',
                      background: theme === t.id ? 'var(--primary-light)' : 'transparent',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: theme === t.id ? 700 : 500
                    }}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                  >
                    {getThemeIcon(t.id)}
                    <div>
                      <div>{t.name}</div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
