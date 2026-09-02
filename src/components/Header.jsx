import React from 'react';
import { 
  Cpu, 
  Sun, 
  Moon, 
  BarChart2, 
  BookOpen, 
  Menu,
  X
} from 'lucide-react';

export default function Header({
  theme,
  setTheme,
  onOpenComparison,
  onOpenTheory,
  isMobileMenuOpen,
  onToggleMobileMenu
}) {
  const isDark = theme === 'dark' || theme === 'dark-tech';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* Brand & Mobile Drawer Toggle */}
        <div className="brand-section">
          <button 
            className="mobile-menu-toggle btn btn-outline btn-sm"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Sidebar"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="brand-icon">
            <Cpu size={18} />
          </div>
          <div className="brand-text-container">
            <h1 className="brand-title">AlgoLab • Algorithm Simulation Workbench</h1>
            <p className="brand-subtitle">
              OS Memory & CPU • Graph Pathfinding • Sorting & Searching
            </p>
          </div>
        </div>

        {/* Action Controls & Light / Dark Toggle */}
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

          <button
            className="btn btn-outline btn-sm theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#3b82f6" />}
            <span className="btn-text-hide-mobile">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
