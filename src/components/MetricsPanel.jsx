import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Target, BarChart2, Zap, Grid, Crown, Sparkles } from 'lucide-react';

export default function MetricsPanel({
  category,
  algorithmId,
  currentStepData,
  totalSteps,
  isFinished,
  algorithmName
}) {
  if (!currentStepData) return null;

  return (
    <div className="card metrics-card">
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={16} color="var(--primary)" />
          <span>Execution Analytics & Real-Time Metrics</span>
        </h3>
      </div>

      {/* 1. OS Memory Allocation Metrics */}
      {category === 'OS' && (algorithmId.includes('fit')) && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Current Process</div>
            <div className="kpi-value" style={{ color: currentStepData.currentProcess?.color || 'var(--text-primary)' }}>
              {currentStepData.currentProcess ? currentStepData.currentProcess.name : 'Ready'}
            </div>
            <div className="kpi-sub">
              {currentStepData.currentProcess ? `${currentStepData.currentProcess.size} KB requested` : 'Initial State'}
            </div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">Selected Hole</div>
            <div className="kpi-value">
              {currentStepData.selectedHoleId || (currentStepData.outcome === 'FAILED' ? 'None' : '—')}
            </div>
            <div className="kpi-sub">
              {currentStepData.outcome === 'ALLOCATED' ? 'Allocated & Partitioned' : 'Searching'}
            </div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">Total Free RAM</div>
            <div className="kpi-value">
              {currentStepData.totalFreeMemory} <span className="kpi-unit">KB</span>
            </div>
            <div className="kpi-sub">Available Space</div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">Largest Free Hole</div>
            <div className="kpi-value" style={{ color: currentStepData.largestFreeHole < 500 && isFinished ? 'var(--danger-text)' : 'var(--text-primary)' }}>
              {currentStepData.largestFreeHole} <span className="kpi-unit">KB</span>
            </div>
            <div className="kpi-sub">Max Contiguous Block</div>
          </div>
        </div>
      )}

      {/* 2. OS CPU Scheduling Metrics */}
      {category === 'OS' && (algorithmId.includes('cpu') || algorithmId === 'round-robin') && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Current Time</div>
            <div className="kpi-value">T = {currentStepData.currentTime}</div>
            <div className="kpi-sub">Timeline Progress</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Active Process</div>
            <div className="kpi-value" style={{ color: currentStepData.runningProcess?.color || 'var(--text-primary)' }}>
              {currentStepData.runningProcess ? currentStepData.runningProcess.name : 'Idle'}
            </div>
            <div className="kpi-sub">On CPU Core</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Avg Waiting Time</div>
            <div className="kpi-value">{currentStepData.avgWaitingTime ?? 0} <span className="kpi-unit">units</span></div>
            <div className="kpi-sub">Queue Delay</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Avg Turnaround</div>
            <div className="kpi-value">{currentStepData.avgTurnaroundTime ?? 0} <span className="kpi-unit">units</span></div>
            <div className="kpi-sub">Total Lifecycle</div>
          </div>
        </div>
      )}

      {/* 3. OS Paging Metrics */}
      {category === 'OS' && (algorithmId.includes('paging') || algorithmId === 'lru') && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Referenced Page</div>
            <div className="kpi-value">Page {currentStepData.currentPage ?? '—'}</div>
            <div className="kpi-sub">{currentStepData.isHit ? 'Cache Hit' : 'Page Fault'}</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Page Faults</div>
            <div className="kpi-value" style={{ color: 'var(--danger-text)' }}>{currentStepData.pageFaults ?? 0}</div>
            <div className="kpi-sub">Disk Swaps Required</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Page Hits</div>
            <div className="kpi-value" style={{ color: 'var(--success-text)' }}>{currentStepData.pageHits ?? 0}</div>
            <div className="kpi-sub">Frames Matched</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Hit Ratio</div>
            <div className="kpi-value">{currentStepData.hitRatio ?? 0}%</div>
            <div className="kpi-sub">Cache Efficiency</div>
          </div>
        </div>
      )}

      {/* 4. Graph / Pathfinding Metrics */}
      {category === 'GRAPH' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Nodes Explored</div>
            <div className="kpi-value">{currentStepData.visitedCells?.length ?? currentStepData.topoOrder?.length ?? currentStepData.stats?.visitedCount ?? 0}</div>
            <div className="kpi-sub">Frontier Traversal</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Frontier / Queue</div>
            <div className="kpi-value">{currentStepData.frontierCells?.length ?? currentStepData.queue?.length ?? 0}</div>
            <div className="kpi-sub">Active Boundary</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Path / MST Metric</div>
            <div className="kpi-value">{currentStepData.pathCells?.length || currentStepData.mstEdges?.length || (currentStepData.k >= 0 ? `k=${currentStepData.k}` : '0')}</div>
            <div className="kpi-sub">{currentStepData.targetFound ? 'Target Found' : 'Cost / Edge Count'}</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Status</div>
            <div className="kpi-value" style={{ color: isFinished ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {isFinished ? 'Complete' : 'Processing...'}
            </div>
            <div className="kpi-sub">Convergence State</div>
          </div>
        </div>
      )}

      {/* 5. Sorting & Searching Metrics */}
      {category === 'SORT_SEARCH' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Comparisons</div>
            <div className="kpi-value">{currentStepData.comparisons ?? currentStepData.iterations ?? 0}</div>
            <div className="kpi-sub">Evaluations</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Swaps / Shifts</div>
            <div className="kpi-value">{currentStepData.swaps ?? 0}</div>
            <div className="kpi-sub">Array Reorderings</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Sorted / Found</div>
            <div className="kpi-value">{currentStepData.sortedIndices?.length ?? (currentStepData.found ? 1 : 0)}</div>
            <div className="kpi-sub">Final Placement</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Status</div>
            <div className="kpi-value" style={{ color: isFinished ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {isFinished ? 'Complete' : 'Processing...'}
            </div>
            <div className="kpi-sub">Step Progress</div>
          </div>
        </div>
      )}

      {/* 6. Dynamic Programming Metrics */}
      {category === 'DP' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Optimal Value</div>
            <div className="kpi-value" style={{ color: 'var(--success-text)' }}>
              {currentStepData.stats?.maxValue ?? currentStepData.maxSoFar ?? currentStepData.lcsString?.length ?? 0}
            </div>
            <div className="kpi-sub">Global Optimum</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Subproblem Cell</div>
            <div className="kpi-value">
              {currentStepData.currentItem !== undefined ? `dp[${currentStepData.currentItem}][${currentStepData.currentW}]` : (currentStepData.i !== undefined ? `dp[${currentStepData.i}][${currentStepData.j}]` : `idx=${currentStepData.currentIndex}`)}
            </div>
            <div className="kpi-sub">Active State</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Selected Items / Length</div>
            <div className="kpi-value">{currentStepData.selectedItems?.length ?? currentStepData.lcsString?.length ?? (currentStepData.subarrayRange ? currentStepData.subarrayRange[1] - currentStepData.subarrayRange[0] + 1 : 0)}</div>
            <div className="kpi-sub">Subset Traceback</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Status</div>
            <div className="kpi-value" style={{ color: isFinished ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {isFinished ? 'Complete' : 'Tabulating...'}
            </div>
            <div className="kpi-sub">DP Recurrence</div>
          </div>
        </div>
      )}

      {/* 7. Array & String Techniques Metrics */}
      {category === 'ARRAY_STRING' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Window / Pointers</div>
            <div className="kpi-value">
              {currentStepData.windowSum !== undefined ? `Sum=${currentStepData.windowSum}` : (currentStepData.currentSum !== undefined ? `Sum=${currentStepData.currentSum}` : `P=${currentStepData.patternIndex}`)}
            </div>
            <div className="kpi-sub">Active State Metric</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Max / Target / Matches</div>
            <div className="kpi-value" style={{ color: 'var(--primary)' }}>
              {currentStepData.maxSum ?? currentStepData.target ?? currentStepData.matches?.length ?? (currentStepData.gcd ?? currentStepData.a)}
            </div>
            <div className="kpi-sub">Goal Metric</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Step Index</div>
            <div className="kpi-value">Step {currentStepData.stepIndex}</div>
            <div className="kpi-sub">Execution Track</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Status</div>
            <div className="kpi-value" style={{ color: isFinished ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {isFinished ? 'Complete' : 'Scanning...'}
            </div>
            <div className="kpi-sub">Algorithm Lifecycle</div>
          </div>
        </div>
      )}

      {/* 8. Backtracking & Greedy Metrics */}
      {category === 'BACKTRACKING_GREEDY' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Solutions / Picked</div>
            <div className="kpi-value" style={{ color: 'var(--success-text)' }}>
              {currentStepData.solutionsCount ?? currentStepData.selectedActivities?.length ?? 0}
            </div>
            <div className="kpi-sub">Count Discovered</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Current Action</div>
            <div className="kpi-value">{currentStepData.action ?? (currentStepData.currentActivity?.id ?? 'Scan')}</div>
            <div className="kpi-sub">Branch State</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Decisions Explored</div>
            <div className="kpi-value">{currentStepData.stepIndex}</div>
            <div className="kpi-sub">State Tree Steps</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Status</div>
            <div className="kpi-value" style={{ color: isFinished ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {isFinished ? 'Complete' : 'Pruning & Solving'}
            </div>
            <div className="kpi-sub">Backtrack Search</div>
          </div>
        </div>
      )}

      {/* External Fragmentation Alert */}
      {currentStepData.isExternalFragmentation && (
        <div className="alert-banner alert-danger" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>External Fragmentation Detected</strong>
            <p style={{ marginTop: '2px', fontSize: '0.8rem' }}>
              Total free memory is <strong>{currentStepData.totalFreeMemory} KB</strong>, but largest contiguous block is only <strong>{currentStepData.largestFreeHole} KB</strong>. Cannot fit process {currentStepData.currentProcess?.name} ({currentStepData.currentProcess?.size} KB).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
