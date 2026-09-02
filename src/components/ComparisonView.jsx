import React from 'react';
import { 
  BarChart2, 
  X, 
  Trophy, 
  Layers, 
  Clock, 
  Cpu, 
  Network, 
  BarChart3, 
  Search,
  Grid,
  Code2,
  Boxes,
  Crown
} from 'lucide-react';
import { CATEGORIES, ALGORITHMS_REGISTRY } from '../types/data';

import { generateSimulationTrace as generateMemoryTrace } from '../algorithms/memoryManager';
import { generateCpuScheduleTrace } from '../algorithms/cpuScheduler';
import { generatePageReplacementTrace } from '../algorithms/pageReplacement';
import { generateGraphTrace } from '../algorithms/graphAlgorithms';
import { generateSortingTrace } from '../algorithms/sortingAlgorithms';
import { generateKnapsackTrace, generateLcsTrace, generateKadanesTrace } from '../algorithms/dpAlgorithms';
import { generateSlidingWindowTrace, generateTwoPointersTrace } from '../algorithms/arrayStringAlgorithms';
import { generateNQueensTrace, generateActivitySelectionTrace } from '../algorithms/backtrackingGreedyAlgorithms';

export default function ComparisonView({
  isOpen,
  onClose,
  category,
  onSelectAlgorithm,
  holes,
  processes,
  cpuProcesses,
  referenceString,
  frameCount,
  gridConfig,
  sortArray,
  knapsackItems,
  knapsackCapacity
}) {
  if (!isOpen) return null;

  const currentCategoryData = CATEGORIES[category] || CATEGORIES.OS;

  // OS Memory benchmark
  const memoryAlgos = ['first-fit', 'best-fit', 'worst-fit', 'next-fit'];
  const memoryComparison = memoryAlgos.reduce((acc, algoId) => {
    const trace = generateMemoryTrace(algoId, holes, processes);
    const finalStep = trace.steps[trace.steps.length - 1];
    acc[algoId] = {
      allocatedCount: finalStep.allocatedCount || 0,
      totalProcesses: processes.length,
      freeMemory: finalStep.totalFreeMemory,
      isAllAllocated: (finalStep.allocatedCount || 0) === processes.length
    };
    return acc;
  }, {});

  // OS CPU benchmark
  const cpuAlgos = ['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'];
  const cpuComparison = cpuAlgos.reduce((acc, algoId) => {
    const trace = generateCpuScheduleTrace(algoId, cpuProcesses);
    const finalStep = trace.steps[trace.steps.length - 1];
    acc[algoId] = {
      avgWaiting: finalStep.avgWaitingTime || 0,
      avgTurnaround: finalStep.avgTurnaroundTime || 0,
      totalTime: finalStep.currentTime || 0
    };
    return acc;
  }, {});

  // OS Paging benchmark
  const pagingAlgos = ['lru', 'fifo-paging', 'optimal-paging'];
  const pagingComparison = pagingAlgos.reduce((acc, algoId) => {
    const trace = generatePageReplacementTrace(algoId, referenceString, frameCount);
    const finalStep = trace.steps[trace.steps.length - 1];
    acc[algoId] = {
      faults: finalStep.pageFaults || 0,
      hits: finalStep.pageHits || 0,
      hitRatio: finalStep.hitRatio || 0
    };
    return acc;
  }, {});

  // Sorting benchmark
  const sortAlgos = ['quicksort', 'mergesort', 'bubblesort'];
  const sortComparison = sortAlgos.reduce((acc, algoId) => {
    const trace = generateSortingTrace(algoId, sortArray);
    const finalStep = trace.steps[trace.steps.length - 1];
    acc[algoId] = {
      comparisons: finalStep.comparisons || 0,
      swaps: finalStep.swaps || 0,
      steps: trace.steps.length
    };
    return acc;
  }, {});

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1080px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart2 size={20} color="var(--primary)" />
            <h2>Comparative Performance Matrix • {currentCategoryData.name}</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* OS MEMORY */}
          {category === 'OS' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="var(--primary)" /> Contiguous Memory Allocation
              </h3>
              <div className="comp-cards-grid">
                {memoryAlgos.map((id) => {
                  const trace = memoryComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];
                  const isWinner = trace.isAllAllocated;
                  return (
                    <div key={id} className={`comp-card ${isWinner ? 'winner-card' : ''}`}>
                      {isWinner && <span className="winner-badge"><Trophy size={11} /> OPTIMAL</span>}
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{details.name}</h4>
                      <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: '4px 0 6px 0' }}>{details.rule}</p>
                      <div className="comp-metric-num" style={{ color: isWinner ? 'var(--success)' : 'var(--text-primary)' }}>
                        {trace.allocatedCount} / {trace.totalProcesses} <span style={{ fontSize: '0.75rem' }}>Allocated</span>
                      </div>
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => { onSelectAlgorithm(id); onClose(); }}>
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OS CPU */}
          {category === 'OS' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} color="var(--primary)" /> CPU Scheduling Algorithms
              </h3>
              <div className="comp-cards-grid">
                {cpuAlgos.map((id) => {
                  const trace = cpuComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];
                  return (
                    <div key={id} className="comp-card">
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{details.name}</h4>
                      <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', margin: '4px 0 6px 0' }}>{details.tag}</p>
                      <div className="comp-metric-num">
                        {trace.avgWaiting} <span style={{ fontSize: '0.75rem' }}>avg wait</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Turnaround: {trace.avgTurnaround}</div>
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => { onSelectAlgorithm(id); onClose(); }}>
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OS PAGING */}
          {category === 'OS' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--primary)" /> Page Replacement Algorithms
              </h3>
              <div className="comp-cards-grid">
                {pagingAlgos.map((id) => {
                  const trace = pagingComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];
                  const isOptimal = id === 'optimal-paging';
                  return (
                    <div key={id} className={`comp-card ${isOptimal ? 'winner-card' : ''}`}>
                      {isOptimal && <span className="winner-badge"><Trophy size={11} /> THEORETICAL BEST</span>}
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{details.name}</h4>
                      <div className="comp-metric-num" style={{ color: 'var(--danger-text)' }}>
                        {trace.faults} <span style={{ fontSize: '0.75rem' }}>Page Faults</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 700 }}>Hit Ratio: {trace.hitRatio}%</div>
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => { onSelectAlgorithm(id); onClose(); }}>
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SORTING COMPARISON */}
          {category === 'SORT_SEARCH' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart3 size={16} color="var(--primary)" /> Comparative Sorting Performance
              </h3>
              <div className="comp-cards-grid">
                {sortAlgos.map((id) => {
                  const trace = sortComparison[id];
                  const details = ALGORITHMS_REGISTRY[id];
                  return (
                    <div key={id} className="comp-card">
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{details.name}</h4>
                      <div className="comp-metric-num">
                        {trace.comparisons} <span style={{ fontSize: '0.75rem' }}>comparisons</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Swaps: {trace.swaps}</div>
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.6rem' }} onClick={() => { onSelectAlgorithm(id); onClose(); }}>
                        Load in Visualizer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GRAPH / DP / ARRAY / BACKTRACKING OVERVIEW */}
          {(category === 'GRAPH' || category === 'DP' || category === 'ARRAY_STRING' || category === 'BACKTRACKING_GREEDY') && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {currentCategoryData.name} Complexity & Characteristics
              </h3>
              <div className="comparison-table-wrapper">
                <table className="comp-table">
                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Time Complexity</th>
                      <th>Space Complexity</th>
                      <th>Primary Domain & Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategoryData.subcategories.flatMap(s => s.algos).map(id => {
                      const algo = ALGORITHMS_REGISTRY[id];
                      if (!algo) return null;
                      return (
                        <tr key={id}>
                          <td><strong>{algo.name}</strong></td>
                          <td><span className="complexity-badge">{algo.timeComplexity}</span></td>
                          <td><code>{algo.spaceComplexity}</code></td>
                          <td>{algo.rule}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
