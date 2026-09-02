import React from 'react';
import { 
  BarChart2, 
  X, 
  Trophy,
  Layers,
  Cpu,
  Network,
  BarChart3
} from 'lucide-react';
import { runAllAlgorithmsComparison } from '../algorithms/memoryManager';
import { generateCpuScheduleTrace } from '../algorithms/cpuScheduler';
import { generatePageReplacementTrace } from '../algorithms/pageReplacement';
import { generateGraphTrace } from '../algorithms/graphAlgorithms';
import { generateSortingTrace } from '../algorithms/sortingAlgorithms';
import { ALGORITHMS_REGISTRY, CATEGORIES } from '../types/data';

export default function ComparisonView({
  category,
  holes,
  processes,
  cpuProcesses,
  referenceString,
  frameCount,
  gridConfig,
  sortArray,
  onClose,
  onSelectAlgorithm
}) {
  const currentCategoryData = CATEGORIES[category] || CATEGORIES.OS;

  let memoryComparison = null;
  let cpuComparison = null;
  let pagingComparison = null;
  let graphComparison = null;
  let sortComparison = null;

  if (category === 'OS') {
    memoryComparison = runAllAlgorithmsComparison(holes, processes);
    cpuComparison = {
      'fcfs-cpu': generateCpuScheduleTrace('fcfs-cpu', cpuProcesses),
      'sjf-cpu': generateCpuScheduleTrace('sjf-cpu', cpuProcesses),
      'round-robin': generateCpuScheduleTrace('round-robin', cpuProcesses, 2),
      'priority-cpu': generateCpuScheduleTrace('priority-cpu', cpuProcesses),
    };
    pagingComparison = {
      'lru': generatePageReplacementTrace('lru', referenceString, frameCount),
      'fifo-paging': generatePageReplacementTrace('fifo-paging', referenceString, frameCount),
      'optimal-paging': generatePageReplacementTrace('optimal-paging', referenceString, frameCount),
    };
  } else if (category === 'GRAPH') {
    graphComparison = {
      'bfs': generateGraphTrace('bfs', gridConfig),
      'dfs': generateGraphTrace('dfs', gridConfig),
      'dijkstra': generateGraphTrace('dijkstra', gridConfig),
    };
  } else if (category === 'SORT_SEARCH') {
    sortComparison = {
      'quicksort': generateSortingTrace('quicksort', sortArray),
      'mergesort': generateSortingTrace('mergesort', sortArray),
      'bubblesort': generateSortingTrace('bubblesort', sortArray),
    };
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1080px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart2 size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Comparative Performance Analysis • {currentCategoryData.name}
            </h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* OS MEMORY COMPARISON */}
          {category === 'OS' && memoryComparison && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--primary)" /> Contiguous Memory Allocation Comparison
              </h3>

              <div className="comp-cards-grid">
                {['first-fit', 'best-fit', 'worst-fit', 'next-fit'].map((id) => {
                  const trace = memoryComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];
                  const isWinner = trace.isAllAllocated;

                  return (
                    <div key={id} className={`comp-card ${isWinner ? 'winner-card' : ''}`}>
                      {isWinner && (
                        <span className="winner-badge">
                          <Trophy size={11} /> OPTIMAL
                        </span>
                      )}
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{details.name}</h4>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>{details.rule}</p>
                      <div className="comp-metric-num" style={{ color: isWinner ? 'var(--success)' : 'var(--text-primary)' }}>
                        {trace.allocatedCount} / {trace.totalProcesses}
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '6px' }}>Allocated</span>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                        onClick={() => { onSelectAlgorithm(id); onClose(); }}
                      >
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OS CPU SCHEDULING COMPARISON */}
          {category === 'OS' && cpuComparison && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="#06b6d4" /> CPU Scheduling Policies Comparison
              </h3>
              <div className="comparison-table-wrapper">
                <table className="comp-table">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Selection Rule</th>
                      <th>Time Quantum</th>
                      <th>Avg Waiting Time</th>
                      <th>Avg Turnaround</th>
                      <th>Optimal Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['fcfs-cpu', 'sjf-cpu', 'round-robin', 'priority-cpu'].map((id) => {
                      const trace = cpuComparison[id];
                      const details = ALGORITHMS_REGISTRY[id];
                      const isBestWait = id === 'sjf-cpu';

                      return (
                        <tr key={id} className={isBestWait ? 'highlight-winner' : ''}>
                          <td><strong>{details.name}</strong></td>
                          <td><code>{details.rule}</code></td>
                          <td>{id === 'round-robin' ? '2 units' : 'N/A (Non-preemptive)'}</td>
                          <td><strong>{trace.finalStep.avgWaitingTime}</strong> units</td>
                          <td><strong>{trace.finalStep.avgTurnaroundTime}</strong> units</td>
                          <td>
                            {isBestWait ? (
                              <span className="badge-success">
                                <Trophy size={11} /> Min Avg Wait Time
                              </span>
                            ) : (
                              <span className="badge-info">{details.tag}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OS PAGING COMPARISON */}
          {category === 'OS' && pagingComparison && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#f59e0b" /> Page Replacement Policies (3 Frames)
              </h3>
              <div className="comparison-table-wrapper">
                <table className="comp-table">
                  <thead>
                    <tr>
                      <th>Policy</th>
                      <th>Eviction Rule</th>
                      <th>Page Faults</th>
                      <th>Page Hits</th>
                      <th>Hit Ratio</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['lru', 'fifo-paging', 'optimal-paging'].map((id) => {
                      const trace = pagingComparison[id];
                      const details = ALGORITHMS_REGISTRY[id];
                      const isOpt = id === 'optimal-paging';

                      return (
                        <tr key={id} className={isOpt ? 'highlight-winner' : ''}>
                          <td><strong>{details.name}</strong></td>
                          <td><code>{details.rule}</code></td>
                          <td><strong style={{ color: 'var(--danger-text)' }}>{trace.pageFaults}</strong></td>
                          <td><strong style={{ color: 'var(--success-text)' }}>{trace.pageHits}</strong></td>
                          <td><strong>{trace.hitRatio}%</strong></td>
                          <td>
                            {isOpt ? (
                              <span className="badge-success">
                                <Trophy size={11} /> Theoretical Optimal
                              </span>
                            ) : (
                              <span className="badge-info">{details.tag}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRAPH COMPARISON */}
          {category === 'GRAPH' && graphComparison && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Network size={18} color="var(--primary)" /> Graph Search Traversal & Pathfinding
              </h3>
              <div className="comp-cards-grid">
                {['bfs', 'dfs', 'dijkstra'].map((id) => {
                  const trace = graphComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];

                  return (
                    <div key={id} className="comp-card">
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{details.name}</h4>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>{details.rule}</p>
                      <div className="comp-metric-num">
                        {trace.pathLength} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>path steps</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Nodes Explored: <strong>{trace.visitedCount}</strong>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                        onClick={() => { onSelectAlgorithm(id); onClose(); }}
                      >
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SORTING COMPARISON */}
          {category === 'SORT_SEARCH' && sortComparison && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} color="#8b5cf6" /> Sorting Algorithms Comparison (10 Elements)
              </h3>
              <div className="comp-cards-grid">
                {['quicksort', 'mergesort', 'bubblesort'].map((id) => {
                  const trace = sortComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];

                  return (
                    <div key={id} className="comp-card">
                      <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{details.name}</h4>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>{details.timeComplexity}</p>
                      <div className="comp-metric-num">
                        {trace.comparisons} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>comparisons</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Swaps/Shifts: <strong>{trace.swaps}</strong>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                        onClick={() => { onSelectAlgorithm(id); onClose(); }}
                      >
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
