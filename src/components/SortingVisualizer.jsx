import React from 'react';
import { BarChart3, Search, ArrowUpDown, Target, CheckCircle2 } from 'lucide-react';

export default function SortingVisualizer({
  algorithmId,
  array = [],
  highlightIndices = [],
  pivotIndex = -1,
  sortedIndices = [],
  comparisons = 0,
  swaps = 0,
  low = -1,
  high = -1,
  mid = -1,
  target = null,
  found = false,
  isFinished = false
}) {
  const isSearch = algorithmId === 'binary-search';
  const maxValue = Math.max(...array, 100);

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          {isSearch ? <Search size={16} color="var(--primary)" /> : <BarChart3 size={16} color="var(--primary)" />}
          <span>{isSearch ? `Binary Search Interval Visualizer (Target = ${target})` : 'Animated Array Partition & Comparison Bars'}</span>
        </h3>
        <div className="header-meta">
          {!isSearch ? (
            <>
              <span>Comparisons: <strong>{comparisons}</strong></span>
              <span style={{ margin: '0 6px' }}>•</span>
              <span>Swaps: <strong>{swaps}</strong></span>
            </>
          ) : (
            <>
              <span>Range: <strong>[{low} .. {high}]</strong></span>
              <span style={{ margin: '0 6px' }}>•</span>
              <span>Mid Index: <strong>{mid}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Main Bars Visualization */}
      <div className="bars-container">
        <div className="bars-track">
          {array.map((val, idx) => {
            const heightPct = Math.max((val / maxValue) * 100, 15);
            const isHighlight = highlightIndices.includes(idx);
            const isPivot = pivotIndex === idx;
            const isSorted = sortedIndices.includes(idx);
            const isMid = isSearch && mid === idx;
            const inSearchRange = isSearch && idx >= low && idx <= high;

            let barClass = 'array-bar';
            if (isSearch) {
              if (isMid) barClass += ' bar-mid';
              else if (inSearchRange) barClass += ' bar-in-range';
              else barClass += ' bar-out-range';
            } else {
              if (isPivot) barClass += ' bar-pivot';
              else if (isHighlight) barClass += ' bar-highlight';
              else if (isSorted) barClass += ' bar-sorted';
            }

            return (
              <div key={idx} className="bar-wrapper">
                <div
                  className={barClass}
                  style={{ height: `${heightPct}%` }}
                >
                  <span className="bar-value">{val}</span>
                </div>
                <span className="bar-index">
                  {idx}
                  {isMid && <span className="mid-tag">MID</span>}
                  {isPivot && <span className="pivot-tag">PIVOT</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Details */}
      <div className="bars-footer-meta">
        {isSearch ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {found ? (
              <span className="badge badge-success">
                <CheckCircle2 size={14} /> Target {target} found at index {mid}!
              </span>
            ) : isFinished ? (
              <span className="badge badge-danger">
                Target {target} not found in array.
              </span>
            ) : (
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Evaluating arr[{mid}] = {array[mid] ?? '-'} vs Target = {target}
              </span>
            )}
          </div>
        ) : (
          <div className="legend-pills">
            <span className="legend-item">
              <span className="legend-chip" style={{ background: 'var(--primary)' }} /> Comparing
            </span>
            <span className="legend-item">
              <span className="legend-chip" style={{ background: '#f59e0b' }} /> Pivot
            </span>
            <span className="legend-item">
              <span className="legend-chip" style={{ background: 'var(--success)' }} /> Sorted
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
