import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Clock, 
  SlidersHorizontal, 
  Zap,
  Target,
  Maximize2,
  Cpu,
  Layers,
  Network,
  BarChart3,
  Search,
  Shuffle,
  Keyboard
} from 'lucide-react';
import { CATEGORIES, ALGORITHMS_REGISTRY } from '../types/data';

const ALGO_ICON_MAP = {
  'first-fit': <Zap size={14} color="#3b82f6" />,
  'best-fit': <Target size={14} color="#10b981" />,
  'worst-fit': <Maximize2 size={14} color="#f97316" />,
  'next-fit': <RotateCcw size={14} color="#8b5cf6" />,
  'round-robin': <Cpu size={14} color="#06b6d4" />,
  'fcfs-cpu': <Clock size={14} color="#3b82f6" />,
  'sjf-cpu': <Target size={14} color="#10b981" />,
  'priority-cpu': <Target size={14} color="#ec4899" />,
  'lru': <Layers size={14} color="#10b981" />,
  'fifo-paging': <Clock size={14} color="#3b82f6" />,
  'optimal-paging': <Target size={14} color="#f59e0b" />,
  'bfs': <Network size={14} color="#3b82f6" />,
  'dfs': <Network size={14} color="#ec4899" />,
  'dijkstra': <Target size={14} color="#10b981" />,
  'quicksort': <BarChart3 size={14} color="#8b5cf6" />,
  'mergesort': <BarChart3 size={14} color="#10b981" />,
  'bubblesort': <BarChart3 size={14} color="#f97316" />,
  'binary-search': <Search size={14} color="#06b6d4" />
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
  isOpenOnMobile = false,
  onCloseMobile = () => {}
}) {
  const currentCatObj = CATEGORIES[selectedCategory] || CATEGORIES.OS;
  const currentAlgoObj = ALGORITHMS_REGISTRY[selectedAlgo] || ALGORITHMS_REGISTRY['first-fit'];

  // Current subcategories
  const subcategories = currentCatObj.subcategories;
  const activeSubcategory = subcategories.find(s => s.algos.includes(selectedAlgo)) || subcategories[0];

  return (
    <aside className={`app-sidebar ${isOpenOnMobile ? 'sidebar-mobile-open' : ''}`}>
      {/* 1. Category Switcher (Segmented Option Bar) */}
      <div className="sidebar-section">
        <label className="sidebar-label">Algorithm Domain</label>
        <div className="segmented-category-bar">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const isCatActive = selectedCategory === key;
            return (
              <button
                key={key}
                className={`segmented-cat-btn ${isCatActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(key)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subcategory & Algorithm Selection Dropdown/Pills */}
      <div className="sidebar-section">
        <div className="sidebar-header-row">
          <label className="sidebar-label">Active Algorithm</label>
          <span className="complexity-badge">{currentAlgoObj.timeComplexity}</span>
        </div>

        {/* Subcategory tabs if more than 1 */}
        {subcategories.length > 1 && (
          <div className="subcat-tab-row">
            {subcategories.map(sub => {
              const isSubActive = activeSubcategory.id === sub.id;
              return (
                <button
                  key={sub.id}
                  className={`subcat-pill ${isSubActive ? 'active' : ''}`}
                  onClick={() => onSelectAlgo(sub.defaultAlgo)}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Algorithm Option Grid */}
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
                <span className="compact-algo-tag">{algo.tag}</span>
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
          <button
            className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'} btn-block`}
            onClick={onTogglePlay}
            title={isRunning ? 'Pause Simulation (Space)' : 'Run Simulation (Space)'}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? 'Pause' : 'Run Simulation'}</span>
          </button>

          <div className="controls-btn-row">
            <button
              className="btn btn-secondary"
              onClick={onStepBackward}
              disabled={!canStepBackward || isRunning}
              title="Previous Step (Left Arrow)"
            >
              <ChevronLeft size={15} /> Back
            </button>

            <button
              className="btn btn-secondary"
              onClick={onStepForward}
              disabled={!canStepForward || isRunning}
              title="Next Step (Right Arrow)"
            >
              Step <ChevronRight size={15} />
            </button>

            <button
              className="btn btn-outline"
              onClick={onReset}
              title="Reset Simulation (R)"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Speed Bar */}
        <div className="speed-row">
          <span className="speed-title">
            <Clock size={12} /> Speed:
          </span>
          <div className="speed-btns">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                className={`speed-pill ${speed === s ? 'active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Dataset Actions */}
      <div className="sidebar-section">
        <label className="sidebar-label">Dataset Configuration</label>
        <div className="dataset-actions-row">
          <button className="btn btn-secondary btn-sm" onClick={onOpenCustomData} style={{ flex: 1 }}>
            <SlidersHorizontal size={13} /> Edit Inputs
          </button>
          {onRandomizeData && (
            <button className="btn btn-outline btn-sm" onClick={onRandomizeData} title="Randomize values for active algorithm">
              <Shuffle size={13} /> Randomize
            </button>
          )}
        </div>
      </div>

      {/* 5. Keyboard Shortcuts Strip */}
      <div className="sidebar-shortcuts-strip">
        <div className="shortcuts-label">
          <Keyboard size={12} /> Shortcuts:
        </div>
        <div className="shortcuts-keys">
          <span><kbd className="kbd-chip">Space</kbd> Play</span>
          <span><kbd className="kbd-chip">→</kbd> Step</span>
          <span><kbd className="kbd-chip">R</kbd> Reset</span>
          <span><kbd className="kbd-chip">C</kbd> Comp</span>
        </div>
      </div>
    </aside>
  );
}
