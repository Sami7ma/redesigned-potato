import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  RotateCcw, 
  X, 
  Check, 
  Shuffle,
  Layers,
  Cpu,
  Network,
  BarChart3,
  Search
} from 'lucide-react';
import { 
  DEFAULT_HOLES, 
  DEFAULT_PROCESSES, 
  DEFAULT_CPU_PROCESSES, 
  DEFAULT_PAGE_REFERENCE, 
  DEFAULT_FRAME_COUNT,
  DEFAULT_GRID_CONFIG,
  DEFAULT_SORT_ARRAY,
  DEFAULT_SEARCH_TARGET
} from '../types/data';

const PROCESS_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function CustomDataModal({
  category,
  algorithmId,
  holes,
  processes,
  cpuProcesses,
  referenceString,
  frameCount,
  gridConfig,
  sortArray,
  searchTarget,
  onSaveMemory,
  onSaveCpu,
  onSavePaging,
  onSaveGraph,
  onSaveSorting,
  onClose
}) {
  // Determine initial active tab based on what algorithm is currently active
  const getInitialTab = () => {
    if (category === 'OS') {
      if (algorithmId.includes('cpu') || algorithmId === 'round-robin') return 'cpu';
      if (algorithmId.includes('paging') || algorithmId === 'lru') return 'paging';
      return 'memory';
    } else if (category === 'GRAPH') {
      return 'graph';
    } else if (category === 'SORT_SEARCH') {
      if (algorithmId === 'binary-search') return 'binary-search';
      return 'sorting';
    }
    return 'memory';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Form states
  const [localHoles, setLocalHoles] = useState(JSON.parse(JSON.stringify(holes)));
  const [localProcesses, setLocalProcesses] = useState(JSON.parse(JSON.stringify(processes)));
  const [localCpuProc, setLocalCpuProc] = useState(JSON.parse(JSON.stringify(cpuProcesses)));
  const [localRefStr, setLocalRefStr] = useState(referenceString.join(', '));
  const [localFrames, setLocalFrames] = useState(frameCount);
  const [localGrid, setLocalGrid] = useState(JSON.parse(JSON.stringify(gridConfig)));
  const [localSortArr, setLocalSortArr] = useState(sortArray.join(', '));
  const [localTarget, setLocalTarget] = useState(searchTarget);
  const [error, setError] = useState(null);

  // Memory Handlers
  const handleAddHole = () => {
    const nextNum = localHoles.length + 1;
    setLocalHoles([...localHoles, { id: `H${nextNum}`, label: `H${nextNum}`, size: 200, base: 0 }]);
  };

  const handleRemoveHole = (idx) => {
    if (localHoles.length <= 1) return setError('At least one hole required');
    setLocalHoles(localHoles.filter((_, i) => i !== idx));
  };

  const handleAddProcess = () => {
    const nextNum = localProcesses.length + 1;
    const color = PROCESS_COLORS[(nextNum - 1) % PROCESS_COLORS.length];
    setLocalProcesses([...localProcesses, { id: `P${nextNum}`, name: `P${nextNum}`, size: 200, color, bgLight: `${color}20`, border: color }]);
  };

  const handleRemoveProcess = (idx) => {
    if (localProcesses.length <= 1) return setError('At least one process required');
    setLocalProcesses(localProcesses.filter((_, i) => i !== idx));
  };

  // CPU Handlers
  const handleAddCpuProc = () => {
    const nextNum = localCpuProc.length + 1;
    const color = PROCESS_COLORS[(nextNum - 1) % PROCESS_COLORS.length];
    setLocalCpuProc([...localCpuProc, { id: `P${nextNum}`, name: `P${nextNum}`, arrival: nextNum - 1, burst: 4, priority: 2, color }]);
  };

  const handleRemoveCpuProc = (idx) => {
    if (localCpuProc.length <= 1) return setError('At least one CPU process required');
    setLocalCpuProc(localCpuProc.filter((_, i) => i !== idx));
  };

  // Apply Changes
  const handleApply = () => {
    try {
      if (activeTab === 'memory') {
        onSaveMemory(localHoles, localProcesses);
      } else if (activeTab === 'cpu') {
        onSaveCpu(localCpuProc);
      } else if (activeTab === 'paging') {
        const parsed = localRefStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (parsed.length === 0) return setError('Please enter valid comma-separated page numbers.');
        onSavePaging(parsed, parseInt(localFrames, 10) || 3);
      } else if (activeTab === 'graph') {
        onSaveGraph(localGrid);
      } else if (activeTab === 'sorting' || activeTab === 'binary-search') {
        const parsed = localSortArr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (parsed.length === 0) return setError('Please enter valid comma-separated array numbers.');
        onSaveSorting(parsed, parseInt(localTarget, 10) || parsed[0]);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleResetDefaults = () => {
    if (activeTab === 'memory') {
      setLocalHoles(JSON.parse(JSON.stringify(DEFAULT_HOLES)));
      setLocalProcesses(JSON.parse(JSON.stringify(DEFAULT_PROCESSES)));
    } else if (activeTab === 'cpu') {
      setLocalCpuProc(JSON.parse(JSON.stringify(DEFAULT_CPU_PROCESSES)));
    } else if (activeTab === 'paging') {
      setLocalRefStr(DEFAULT_PAGE_REFERENCE.join(', '));
      setLocalFrames(DEFAULT_FRAME_COUNT);
    } else if (activeTab === 'graph') {
      setLocalGrid(JSON.parse(JSON.stringify(DEFAULT_GRID_CONFIG)));
    } else if (activeTab === 'sorting' || activeTab === 'binary-search') {
      setLocalSortArr(DEFAULT_SORT_ARRAY.join(', '));
      setLocalTarget(DEFAULT_SEARCH_TARGET);
    }
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              Edit Custom Simulation Dataset
            </h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dataset Category Subtabs */}
        <div style={{ padding: '0 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="theory-tab-nav" style={{ marginBottom: 0, paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
            <button
              className={`theory-tab-btn ${activeTab === 'memory' ? 'active' : ''}`}
              onClick={() => setActiveTab('memory')}
            >
              1. Memory Holes & Processes
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'cpu' ? 'active' : ''}`}
              onClick={() => setActiveTab('cpu')}
            >
              2. CPU Processes
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'paging' ? 'active' : ''}`}
              onClick={() => setActiveTab('paging')}
            >
              3. Page Reference & Frames
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              4. Graph Grid & Coordinates
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'sorting' || activeTab === 'binary-search' ? 'active' : ''}`}
              onClick={() => setActiveTab('sorting')}
            >
              5. Array & Search Target
            </button>
          </div>
        </div>

        <div className="modal-body">
          {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* TAB 1: MEMORY DATASET */}
          {activeTab === 'memory' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 800 }}>Free Memory Holes ({localHoles.reduce((s, h) => s + Number(h.size), 0)} KB Total)</h4>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddHole}>
                    <Plus size={14} /> Add Hole
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {localHoles.map((h, i) => (
                    <div key={i} className="card" style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{h.label}</span>
                        <button className="btn btn-outline btn-sm" style={{ padding: '1px 4px', border: 'none' }} onClick={() => handleRemoveHole(i)}>
                          <Trash2 size={13} color="var(--danger-text)" />
                        </button>
                      </div>
                      <input
                        type="number"
                        className="modal-input"
                        value={h.size}
                        onChange={(e) => {
                          const updated = [...localHoles];
                          updated[i].size = parseInt(e.target.value, 10) || 0;
                          setLocalHoles(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 800 }}>Process Queue ({localProcesses.reduce((s, p) => s + Number(p.size), 0)} KB Requested)</h4>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddProcess}>
                    <Plus size={14} /> Add Process
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {localProcesses.map((p, i) => (
                    <div key={i} className="card" style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)', borderLeft: `4px solid ${p.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: p.color }}>{p.name}</span>
                        <button className="btn btn-outline btn-sm" style={{ padding: '1px 4px', border: 'none' }} onClick={() => handleRemoveProcess(i)}>
                          <Trash2 size={13} color="var(--danger-text)" />
                        </button>
                      </div>
                      <input
                        type="number"
                        className="modal-input"
                        value={p.size}
                        onChange={(e) => {
                          const updated = [...localProcesses];
                          updated[i].size = parseInt(e.target.value, 10) || 0;
                          setLocalProcesses(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CPU DATASET */}
          {activeTab === 'cpu' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontWeight: 800 }}>CPU Process Specifications</h4>
                <button className="btn btn-secondary btn-sm" onClick={handleAddCpuProc}>
                  <Plus size={14} /> Add CPU Process
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {localCpuProc.map((p, i) => (
                  <div key={i} className="card" style={{ padding: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
                    <strong style={{ minWidth: '40px', color: p.color }}>{p.name}</strong>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Arrival:</label>
                      <input
                        type="number"
                        className="modal-input"
                        value={p.arrival}
                        onChange={(e) => {
                          const updated = [...localCpuProc];
                          updated[i].arrival = parseInt(e.target.value, 10) || 0;
                          setLocalCpuProc(updated);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Burst:</label>
                      <input
                        type="number"
                        className="modal-input"
                        value={p.burst}
                        onChange={(e) => {
                          const updated = [...localCpuProc];
                          updated[i].burst = parseInt(e.target.value, 10) || 1;
                          setLocalCpuProc(updated);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Priority:</label>
                      <input
                        type="number"
                        className="modal-input"
                        value={p.priority}
                        onChange={(e) => {
                          const updated = [...localCpuProc];
                          updated[i].priority = parseInt(e.target.value, 10) || 1;
                          setLocalCpuProc(updated);
                        }}
                      />
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => handleRemoveCpuProc(i)}>
                      <Trash2 size={14} color="var(--danger-text)" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAGING DATASET */}
          {activeTab === 'paging' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="sidebar-label">Page Reference Stream (Comma separated):</label>
                <input
                  type="text"
                  className="modal-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.95rem' }}
                  value={localRefStr}
                  onChange={(e) => setLocalRefStr(e.target.value)}
                  placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4, 2, 3"
                />
              </div>
              <div>
                <label className="sidebar-label">Physical Frame Slots (2 to 8 frames):</label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  className="modal-input"
                  style={{ width: '120px' }}
                  value={localFrames}
                  onChange={(e) => setLocalFrames(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: GRAPH GRID CONFIG */}
          {activeTab === 'graph' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="sidebar-label">Start Row & Column:</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="number"
                      min="0"
                      max={localGrid.rows - 1}
                      className="modal-input"
                      value={localGrid.start.r}
                      onChange={(e) => setLocalGrid({ ...localGrid, start: { ...localGrid.start, r: parseInt(e.target.value, 10) || 0 } })}
                    />
                    <input
                      type="number"
                      min="0"
                      max={localGrid.cols - 1}
                      className="modal-input"
                      value={localGrid.start.c}
                      onChange={(e) => setLocalGrid({ ...localGrid, start: { ...localGrid.start, c: parseInt(e.target.value, 10) || 0 } })}
                    />
                  </div>
                </div>

                <div>
                  <label className="sidebar-label">Target Row & Column:</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="number"
                      min="0"
                      max={localGrid.rows - 1}
                      className="modal-input"
                      value={localGrid.target.r}
                      onChange={(e) => setLocalGrid({ ...localGrid, target: { ...localGrid.target, r: parseInt(e.target.value, 10) || 0 } })}
                    />
                    <input
                      type="number"
                      min="0"
                      max={localGrid.cols - 1}
                      className="modal-input"
                      value={localGrid.target.c}
                      onChange={(e) => setLocalGrid({ ...localGrid, target: { ...localGrid.target, c: parseInt(e.target.value, 10) || 0 } })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="sidebar-label">Active Obstacle Walls ({localGrid.walls.length} cells):</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Tip: You can also click directly on the visualizer grid canvas in "Draw / Erase Walls" mode to place or remove obstacle walls!
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: SORTING & SEARCHING */}
          {(activeTab === 'sorting' || activeTab === 'binary-search') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="sidebar-label">Array Numbers (Comma separated):</label>
                <input
                  type="text"
                  className="modal-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.95rem' }}
                  value={localSortArr}
                  onChange={(e) => setLocalSortArr(e.target.value)}
                  placeholder="e.g. 64, 34, 25, 12, 22, 11, 90, 45"
                />
              </div>
              <div>
                <label className="sidebar-label">Search Target Value (for Binary Search):</label>
                <input
                  type="number"
                  className="modal-input"
                  style={{ width: '160px' }}
                  value={localTarget}
                  onChange={(e) => setLocalTarget(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleResetDefaults}>
            <RotateCcw size={14} /> Reset Tab Defaults
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            <Check size={14} /> Apply & Re-simulate
          </button>
        </div>
      </div>
    </div>
  );
}
