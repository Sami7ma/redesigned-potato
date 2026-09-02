import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Plus, 
  Trash2,
  Layers,
  Cpu,
  Clock,
  Network,
  BarChart3,
  Grid,
  Code2,
  Boxes
} from 'lucide-react';
import { 
  DEFAULT_HOLES, 
  DEFAULT_PROCESSES, 
  DEFAULT_CPU_PROCESSES, 
  DEFAULT_PAGE_REFERENCE, 
  DEFAULT_FRAME_COUNT,
  DEFAULT_GRID_CONFIG,
  DEFAULT_SORT_ARRAY,
  DEFAULT_SEARCH_TARGET,
  DEFAULT_KNAPSACK_ITEMS,
  DEFAULT_KNAPSACK_CAPACITY,
  DEFAULT_LCS_STR1,
  DEFAULT_LCS_STR2,
  DEFAULT_SLIDING_WINDOW_ARRAY,
  DEFAULT_SLIDING_WINDOW_K,
  DEFAULT_TWO_POINTERS_ARRAY,
  DEFAULT_TWO_POINTERS_TARGET,
  DEFAULT_KMP_TEXT,
  DEFAULT_KMP_PATTERN,
  DEFAULT_EUCLIDEAN_A,
  DEFAULT_EUCLIDEAN_B,
  DEFAULT_NQUEENS_N
} from '../types/data';

const PROCESS_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function CustomDataModal({
  isOpen,
  onClose,
  category,
  holes,
  processes,
  cpuProcesses,
  referenceString,
  frameCount,
  gridConfig,
  sortArray,
  searchTarget,
  knapsackItems = DEFAULT_KNAPSACK_ITEMS,
  knapsackCapacity = DEFAULT_KNAPSACK_CAPACITY,
  lcsStr1 = DEFAULT_LCS_STR1,
  lcsStr2 = DEFAULT_LCS_STR2,
  slidingArr = DEFAULT_SLIDING_WINDOW_ARRAY,
  slidingK = DEFAULT_SLIDING_WINDOW_K,
  twoPointersArr = DEFAULT_TWO_POINTERS_ARRAY,
  twoPointersTarget = DEFAULT_TWO_POINTERS_TARGET,
  kmpText = DEFAULT_KMP_TEXT,
  kmpPattern = DEFAULT_KMP_PATTERN,
  euclideanA = DEFAULT_EUCLIDEAN_A,
  euclideanB = DEFAULT_EUCLIDEAN_B,
  nQueensN = DEFAULT_NQUEENS_N,
  onSaveMemory,
  onSaveCpu,
  onSavePaging,
  onSaveGraph,
  onSaveSorting,
  onSaveKnapsack,
  onSaveLcs,
  onSaveSlidingWindow,
  onSaveTwoPointers,
  onSaveKmp,
  onSaveEuclidean,
  onSaveNQueens
}) {
  if (!isOpen) return null;

  // Local state for all tabs
  const [activeTab, setActiveTab] = useState(
    category === 'OS' ? 'memory' :
    category === 'GRAPH' ? 'graph' :
    category === 'SORT_SEARCH' ? 'sorting' :
    category === 'DP' ? 'dp' :
    category === 'ARRAY_STRING' ? 'array-string' : 'backtracking'
  );

  const [localHoles, setLocalHoles] = useState(JSON.parse(JSON.stringify(holes)));
  const [localProcesses, setLocalProcesses] = useState(JSON.parse(JSON.stringify(processes)));
  const [localCpuProc, setLocalCpuProc] = useState(JSON.parse(JSON.stringify(cpuProcesses)));
  const [localRefStr, setLocalRefStr] = useState(referenceString.join(', '));
  const [localFrames, setLocalFrames] = useState(frameCount);
  const [localGrid, setLocalGrid] = useState(JSON.parse(JSON.stringify(gridConfig)));
  const [localSortArr, setLocalSortArr] = useState(sortArray.join(', '));
  const [localTarget, setLocalTarget] = useState(searchTarget);

  const [localKnapsackItems, setLocalKnapsackItems] = useState(JSON.parse(JSON.stringify(knapsackItems)));
  const [localKnapsackCap, setLocalKnapsackCap] = useState(knapsackCapacity);
  const [localLcs1, setLocalLcs1] = useState(lcsStr1);
  const [localLcs2, setLocalLcs2] = useState(lcsStr2);

  const [localSlidingArr, setLocalSlidingArr] = useState(slidingArr.join(', '));
  const [localSlidingK, setLocalSlidingK] = useState(slidingK);
  const [localTwoPointersArr, setLocalTwoPointersArr] = useState(twoPointersArr.join(', '));
  const [localTwoPointersTarget, setLocalTwoPointersTarget] = useState(twoPointersTarget);

  const [localKmpText, setLocalKmpText] = useState(kmpText);
  const [localKmpPattern, setLocalKmpPattern] = useState(kmpPattern);

  const [localEucA, setLocalEucA] = useState(euclideanA);
  const [localEucB, setLocalEucB] = useState(euclideanB);

  const [localNQueens, setLocalNQueens] = useState(nQueensN);

  const [error, setError] = useState(null);

  // Apply Changes
  const handleApply = () => {
    try {
      if (activeTab === 'memory') {
        onSaveMemory && onSaveMemory(localHoles, localProcesses);
      } else if (activeTab === 'cpu') {
        onSaveCpu && onSaveCpu(localCpuProc);
      } else if (activeTab === 'paging') {
        const parsed = localRefStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (parsed.length === 0) return setError('Please enter valid comma-separated page numbers.');
        onSavePaging && onSavePaging(parsed, parseInt(localFrames, 10) || 3);
      } else if (activeTab === 'graph') {
        onSaveGraph && onSaveGraph(localGrid);
      } else if (activeTab === 'sorting') {
        const parsed = localSortArr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        if (parsed.length === 0) return setError('Please enter valid comma-separated array numbers.');
        onSaveSorting && onSaveSorting(parsed, parseInt(localTarget, 10) || parsed[0]);
      } else if (activeTab === 'dp') {
        onSaveKnapsack && onSaveKnapsack(localKnapsackItems, parseInt(localKnapsackCap, 10) || 7);
        onSaveLcs && onSaveLcs(localLcs1.trim() || 'ABCDE', localLcs2.trim() || 'ACE');
      } else if (activeTab === 'array-string') {
        const parsedSliding = localSlidingArr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        onSaveSlidingWindow && onSaveSlidingWindow(parsedSliding, parseInt(localSlidingK, 10) || 3);

        const parsedTwo = localTwoPointersArr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        onSaveTwoPointers && onSaveTwoPointers(parsedTwo, parseInt(localTwoPointersTarget, 10) || 15);

        onSaveKmp && onSaveKmp(localKmpText.trim() || 'ABABDABACDABABCABAB', localKmpPattern.trim() || 'ABABCABAB');
        onSaveEuclidean && onSaveEuclidean(parseInt(localEucA, 10) || 252, parseInt(localEucB, 10) || 105);
      } else if (activeTab === 'backtracking') {
        onSaveNQueens && onSaveNQueens(parseInt(localNQueens, 10) || 4);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleResetDefaults = () => {
    setLocalHoles(JSON.parse(JSON.stringify(DEFAULT_HOLES)));
    setLocalProcesses(JSON.parse(JSON.stringify(DEFAULT_PROCESSES)));
    setLocalCpuProc(JSON.parse(JSON.stringify(DEFAULT_CPU_PROCESSES)));
    setLocalRefStr(DEFAULT_PAGE_REFERENCE.join(', '));
    setLocalFrames(DEFAULT_FRAME_COUNT);
    setLocalGrid(JSON.parse(JSON.stringify(DEFAULT_GRID_CONFIG)));
    setLocalSortArr(DEFAULT_SORT_ARRAY.join(', '));
    setLocalTarget(DEFAULT_SEARCH_TARGET);
    setLocalKnapsackItems(JSON.parse(JSON.stringify(DEFAULT_KNAPSACK_ITEMS)));
    setLocalKnapsackCap(DEFAULT_KNAPSACK_CAPACITY);
    setLocalLcs1(DEFAULT_LCS_STR1);
    setLocalLcs2(DEFAULT_LCS_STR2);
    setLocalSlidingArr(DEFAULT_SLIDING_WINDOW_ARRAY.join(', '));
    setLocalSlidingK(DEFAULT_SLIDING_WINDOW_K);
    setLocalTwoPointersArr(DEFAULT_TWO_POINTERS_ARRAY.join(', '));
    setLocalTwoPointersTarget(DEFAULT_TWO_POINTERS_TARGET);
    setLocalKmpText(DEFAULT_KMP_TEXT);
    setLocalKmpPattern(DEFAULT_KMP_PATTERN);
    setLocalEucA(DEFAULT_EUCLIDEAN_A);
    setLocalEucB(DEFAULT_EUCLIDEAN_B);
    setLocalNQueens(DEFAULT_NQUEENS_N);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={20} color="var(--primary)" />
            <h2>Edit Custom Simulation Dataset</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Category Subtabs */}
        <div style={{ padding: '0 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="theory-tab-nav" style={{ marginBottom: 0, paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
            <button className={`theory-tab-btn ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>
              1. Memory RAM
            </button>
            <button className={`theory-tab-btn ${activeTab === 'cpu' ? 'active' : ''}`} onClick={() => setActiveTab('cpu')}>
              2. CPU Burst
            </button>
            <button className={`theory-tab-btn ${activeTab === 'paging' ? 'active' : ''}`} onClick={() => setActiveTab('paging')}>
              3. Paging
            </button>
            <button className={`theory-tab-btn ${activeTab === 'graph' ? 'active' : ''}`} onClick={() => setActiveTab('graph')}>
              4. Graph Grid
            </button>
            <button className={`theory-tab-btn ${activeTab === 'sorting' ? 'active' : ''}`} onClick={() => setActiveTab('sorting')}>
              5. Sorting & Search
            </button>
            <button className={`theory-tab-btn ${activeTab === 'dp' ? 'active' : ''}`} onClick={() => setActiveTab('dp')}>
              6. Dynamic Prog (DP)
            </button>
            <button className={`theory-tab-btn ${activeTab === 'array-string' ? 'active' : ''}`} onClick={() => setActiveTab('array-string')}>
              7. Array & Strings
            </button>
            <button className={`theory-tab-btn ${activeTab === 'backtracking' ? 'active' : ''}`} onClick={() => setActiveTab('backtracking')}>
              8. Backtracking
            </button>
          </div>
        </div>

        <div className="modal-body">
          {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

          {/* TAB 1: MEMORY */}
          {activeTab === 'memory' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Contiguous Memory Holes & Processes</h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Adjust hole boundaries and process requests to test First/Best/Worst/Next Fit allocation and observe fragmentation.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {localHoles.map((h, i) => (
                  <div key={i} className="card" style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{h.label} (KB)</span>
                    <input
                      type="number"
                      className="modal-input"
                      style={{ marginTop: '4px' }}
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
          )}

          {/* TAB 2: CPU */}
          {activeTab === 'cpu' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>CPU Burst & Arrival Schedule</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                {localCpuProc.map((p, i) => (
                  <div key={i} className="card" style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)', borderLeft: `4px solid ${p.color}` }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: p.color }}>{p.name}</div>
                    <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Burst Time (ms)</label>
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
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAGING */}
          {activeTab === 'paging' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Page Reference Stream & Physical Frame Count</h4>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Comma-separated Page References:</label>
              <input
                type="text"
                className="modal-input"
                style={{ marginTop: '4px', marginBottom: '1rem' }}
                value={localRefStr}
                onChange={(e) => setLocalRefStr(e.target.value)}
              />
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Physical Frame Slots:</label>
              <input
                type="number"
                min="2"
                max="8"
                className="modal-input"
                style={{ width: '120px', marginTop: '4px' }}
                value={localFrames}
                onChange={(e) => setLocalFrames(parseInt(e.target.value, 10) || 3)}
              />
            </div>
          )}

          {/* TAB 4: GRAPH */}
          {activeTab === 'graph' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>2D Grid Coordinates</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Start Node (r, c):</label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input type="number" className="modal-input" value={localGrid.start.r} onChange={(e) => setLocalGrid({ ...localGrid, start: { ...localGrid.start, r: parseInt(e.target.value, 10) || 0 } })} />
                    <input type="number" className="modal-input" value={localGrid.start.c} onChange={(e) => setLocalGrid({ ...localGrid, start: { ...localGrid.start, c: parseInt(e.target.value, 10) || 0 } })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Target Node (r, c):</label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input type="number" className="modal-input" value={localGrid.target.r} onChange={(e) => setLocalGrid({ ...localGrid, target: { ...localGrid.target, r: parseInt(e.target.value, 10) || 0 } })} />
                    <input type="number" className="modal-input" value={localGrid.target.c} onChange={(e) => setLocalGrid({ ...localGrid, target: { ...localGrid.target, c: parseInt(e.target.value, 10) || 0 } })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SORTING */}
          {activeTab === 'sorting' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Array Values & Search Target</h4>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Comma-separated Array Numbers:</label>
              <input type="text" className="modal-input" style={{ marginTop: '4px', marginBottom: '1rem' }} value={localSortArr} onChange={(e) => setLocalSortArr(e.target.value)} />
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Binary Search Target:</label>
              <input type="number" className="modal-input" style={{ width: '140px', marginTop: '4px' }} value={localTarget} onChange={(e) => setLocalTarget(e.target.value)} />
            </div>
          )}

          {/* TAB 6: DYNAMIC PROGRAMMING */}
          {activeTab === 'dp' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Knapsack Capacity & LCS Strings</h4>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Knapsack Max Capacity W:</label>
              <input type="number" className="modal-input" style={{ width: '120px', marginTop: '4px', marginBottom: '1rem' }} value={localKnapsackCap} onChange={(e) => setLocalKnapsackCap(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>LCS String 1:</label>
                  <input type="text" className="modal-input" style={{ marginTop: '4px' }} value={localLcs1} onChange={(e) => setLocalLcs1(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>LCS String 2:</label>
                  <input type="text" className="modal-input" style={{ marginTop: '4px' }} value={localLcs2} onChange={(e) => setLocalLcs2(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ARRAY & STRINGS */}
          {activeTab === 'array-string' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Sliding Window, Two Pointers, KMP & GCD</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Sliding Window K:</label>
                  <input type="number" className="modal-input" style={{ marginTop: '4px' }} value={localSlidingK} onChange={(e) => setLocalSlidingK(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Two Pointers Target Sum:</label>
                  <input type="number" className="modal-input" style={{ marginTop: '4px' }} value={localTwoPointersTarget} onChange={(e) => setLocalTwoPointersTarget(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>KMP Search Pattern:</label>
                  <input type="text" className="modal-input" style={{ marginTop: '4px' }} value={localKmpPattern} onChange={(e) => setLocalKmpPattern(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Euclidean GCD (A, B):</label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input type="number" className="modal-input" value={localEucA} onChange={(e) => setLocalEucA(e.target.value)} />
                    <input type="number" className="modal-input" value={localEucB} onChange={(e) => setLocalEucB(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BACKTRACKING */}
          {activeTab === 'backtracking' && (
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>N-Queens Chessboard Dimension N</h4>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Grid Size N (e.g. 4 for 4×4 board, 8 for standard 8×8):</label>
              <input type="number" min="4" max="8" className="modal-input" style={{ width: '120px', marginTop: '4px' }} value={localNQueens} onChange={(e) => setLocalNQueens(e.target.value)} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleResetDefaults}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            <Check size={14} /> Apply & Re-simulate
          </button>
        </div>
      </div>
    </div>
  );
}
