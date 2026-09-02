import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sliders, 
  Shuffle, 
  Cpu, 
  Layers, 
  Network, 
  BarChart3, 
  Code2, 
  Search,
  Sparkles,
  Zap,
  Grid,
  TrendingUp,
  Activity,
  Boxes,
  HelpCircle,
  FolderTree,
  ChevronDown,
  Check
} from 'lucide-react';
import { CATEGORIES, ALGORITHMS_REGISTRY } from '../types/data';

const DOMAIN_ICON_MAP = {
  OS: <Cpu size={16} color="var(--primary)" />,
  GRAPH: <Network size={16} color="#10b981" />,
  SORT_SEARCH: <BarChart3 size={16} color="#8b5cf6" />,
  DP: <Grid size={16} color="var(--primary)" />,
  ARRAY_STRING: <Layers size={16} color="#06b6d4" />,
  BACKTRACKING_GREEDY: <Boxes size={16} color="#ec4899" />
};

const ALGO_ICON_MAP = {
  // OS
  'first-fit': <Zap size={14} color="var(--primary)" />,
  'best-fit': <Activity size={14} color="#10b981" />,
  'worst-fit': <Sliders size={14} color="#f59e0b" />,
  'next-fit': <RotateCcw size={14} color="#06b6d4" />,
  'round-robin': <RotateCcw size={14} color="var(--primary)" />,
  'fcfs-cpu': <ChevronRight size={14} color="#10b981" />,
  'sjf-cpu': <TrendingUp size={14} color="#f59e0b" />,
  'priority-cpu': <Sparkles size={14} color="#8b5cf6" />,
  'lru': <RotateCcw size={14} color="var(--primary)" />,
  'fifo-paging': <ChevronRight size={14} color="#10b981" />,
  'optimal-paging': <Sparkles size={14} color="#f59e0b" />,
  // Graph
  'bfs': <Network size={14} color="#3b82f6" />,
  'dfs': <FolderTree size={14} color="#8b5cf6" />,
  'dijkstra': <Zap size={14} color="#10b981" />,
  'a-star': <Sparkles size={14} color="#f59e0b" />,
  'floyd-warshall': <Grid size={14} color="#8b5cf6" />,
  'kruskal': <Network size={14} color="#10b981" />,
  'prim': <Network size={14} color="#06b6d4" />,
  'topological-sort': <FolderTree size={14} color="#3b82f6" />,
  'union-find': <Boxes size={14} color="#ec4899" />,
  // Sorting & Searching
  'quick-sort': <Zap size={14} color="#8b5cf6" />,
  'merge-sort': <Layers size={14} color="#10b981" />,
  'bubble-sort': <Sliders size={14} color="#f59e0b" />,
  'binary-search': <Search size={14} color="#06b6d4" />,
  // DP
  'knapsack-dp': <Boxes size={14} color="var(--primary)" />,
  'lcs-dp': <Grid size={14} color="#10b981" />,
  'kadanes': <TrendingUp size={14} color="#f59e0b" />,
  // Array & String
  'sliding-window': <Sliders size={14} color="#06b6d4" />,
  'two-pointers': <Layers size={14} color="#8b5cf6" />,
  'kmp-string': <Search size={14} color="#ec4899" />,
  'euclidean-gcd': <Code2 size={14} color="#10b981" />,
  // Backtracking & Greedy
  'n-queens': <Boxes size={14} color="#f59e0b" />,
  'activity-selection': <Activity size={14} color="#10b981" />
};

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  selectedAlgo,
  onSelectAlgo,
  isRunning,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  currentStepIndex,
  totalSteps,
  speed,
  setSpeed,
  canStepForward,
  canStepBackward,
  onOpenCustomData,
  onRandomizeData,
  isOpenOnMobile = false
}) {
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const domainDropdownRef = useRef(null);

  const currentCatObj = CATEGORIES[selectedCategory] || CATEGORIES.OS;
  const currentAlgoObj = ALGORITHMS_REGISTRY[selectedAlgo] || ALGORITHMS_REGISTRY['first-fit'];

  // Subcategories
  const subcategories = currentCatObj.subcategories || [];
  const activeSubcategory = subcategories.find(s => s.algos.includes(selectedAlgo)) || subcategories[0] || { algos: [] };

  // Close domain dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (domainDropdownRef.current && !domainDropdownRef.current.contains(e.target)) {
        setIsDomainDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className={`app-sidebar ${isOpenOnMobile ? 'sidebar-mobile-open' : ''}`}>
      {/* 1. Category Switcher (Pro Dropdown Selector) */}
      <div className="sidebar-section" ref={domainDropdownRef} style={{ position: 'relative' }}>
        <div className="sidebar-header-row">
          <label className="sidebar-label">Algorithm Domain</label>
          <span className="complexity-badge">6 Domains</span>
        </div>

        <button
          type="button"
          className="custom-select-trigger"
          onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
          disabled={isRunning}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {DOMAIN_ICON_MAP[selectedCategory]}
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentCatObj.name}
            </span>
          </div>
          <ChevronDown size={15} color="var(--primary)" style={{ transform: isDomainDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
        </button>

        {/* Dropdown Menu Popover */}
        {isDomainDropdownOpen && (
          <div className="custom-select-menu">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const isCatActive = selectedCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`custom-select-item ${isCatActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory(key);
                    setIsDomainDropdownOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {DOMAIN_ICON_MAP[key]}
                    <span style={{ fontWeight: isCatActive ? 800 : 600 }}>{cat.name}</span>
                  </div>
                  {isCatActive && <Check size={14} color="var(--primary)" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Subcategory Tabs & All Algorithms Listed Downwards Directly */}
      <div className="sidebar-section">
        <div className="sidebar-header-row">
          <label className="sidebar-label">Active Algorithm</label>
          <span className="complexity-badge">{currentAlgoObj.timeComplexity}</span>
        </div>

        {/* Subcategory tabs if domain has multiple subcategories */}
        {subcategories.length > 1 && (
          <div className="subcat-tab-row" style={{ marginBottom: '6px' }}>
            {subcategories.map(sub => {
              const isSubActive = activeSubcategory.id === sub.id;
              return (
                <button
                  key={sub.id}
                  className={`subcat-pill ${isSubActive ? 'active' : ''}`}
                  onClick={() => onSelectAlgo(sub.defaultAlgo)}
                  disabled={isRunning}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

        {/* All Algorithms Listed Downwards Directly (Always Visible!) */}
        <div className="compact-algo-grid">
          {activeSubcategory.algos.map((algoId) => {
            const algo = ALGORITHMS_REGISTRY[algoId];
            if (!algo) return null;
            const isSelected = selectedAlgo === algo.id;

            return (
              <button
                key={algo.id}
                type="button"
                className={`compact-algo-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectAlgo(algo.id)}
                disabled={isRunning}
              >
                <div className="compact-algo-title">
                  {ALGO_ICON_MAP[algo.id]}
                  <span>{algo.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Playback Controls Toolbar */}
      <div className="sidebar-section controls-section">
        <div className="sidebar-header-row">
          <label className="sidebar-label">Simulation Controls</label>
          <span className="step-counter">
            Step {currentStepIndex} / {totalSteps}
          </span>
        </div>

        <div className="sidebar-controls-grid">
          {/* Main Play / Pause Button */}
          <button
            className={`btn btn-block ${isRunning ? 'btn-danger' : 'btn-primary'}`}
            onClick={onTogglePlay}
            disabled={totalSteps === 0}
            title={isRunning ? 'Pause execution (Space)' : 'Start simulation (Space)'}
          >
            {isRunning ? <><Pause size={14} /> Pause Execution</> : <><Play size={14} /> Run Simulation</>}
          </button>

          {/* Stepping Actions */}
          <div className="controls-btn-row">
            <button
              className="btn btn-secondary btn-sm"
              onClick={onStepBackward}
              disabled={!canStepBackward || isRunning}
              title="Step Backward (Left Arrow)"
            >
              <ChevronLeft size={14} /> Back
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onStepForward}
              disabled={!canStepForward || isRunning}
              title="Step Forward (Right Arrow)"
            >
              Step <ChevronRight size={14} />
            </button>

            <button
              className="btn btn-outline btn-sm"
              onClick={onReset}
              disabled={isRunning && currentStepIndex === 0}
              title="Reset Simulation (R)"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="speed-row">
            <span className="speed-title">Speed:</span>
            <div className="speed-btns">
              {[0.5, 1, 1.5, 2].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`speed-pill ${speed === s ? 'active' : ''}`}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dataset Configuration Actions */}
      <div className="sidebar-section">
        <label className="sidebar-label">Dataset Configuration</label>
        <div className="dataset-actions-row">
          <button
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={onOpenCustomData}
            title="Configure custom arrays, memory holes, or strings"
          >
            <Sliders size={13} /> Edit Data
          </button>
          <button
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
            onClick={onRandomizeData}
            title="Generate random sample dataset"
          >
            <Shuffle size={13} /> Randomize
          </button>
        </div>
      </div>

      {/* 5. Keyboard Shortcuts Strip */}
      <div className="sidebar-shortcuts-strip">
        <div className="shortcuts-label">
          <HelpCircle size={12} /> Keyboard Controls
        </div>
        <div className="shortcuts-keys">
          <span><kbd className="kbd-chip">Space</kbd> Play</span>
          <span><kbd className="kbd-chip">&larr;/&rarr;</kbd> Step</span>
          <span><kbd className="kbd-chip">R</kbd> Reset</span>
          <span><kbd className="kbd-chip">C</kbd> Compare</span>
        </div>
      </div>
    </aside>
  );
}
