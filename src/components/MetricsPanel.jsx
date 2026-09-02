import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Target, BarChart2 } from 'lucide-react';

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
        <span className="complexity-badge">{algorithmName}</span>
      </div>

      {/* OS Memory Allocation Metrics */}
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

      {/* OS CPU Scheduling Metrics */}
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

      {/* OS Paging Metrics */}
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

      {/* Graph / Pathfinding Metrics */}
      {category === 'GRAPH' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Nodes Visited</div>
            <div className="kpi-value">{currentStepData.stats?.visitedCount ?? 0}</div>
            <div className="kpi-sub">Explored Frontier</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Queue / Stack Depth</div>
            <div className="kpi-value">{currentStepData.frontierCells?.length ?? 0}</div>
            <div className="kpi-sub">Active Boundary</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Path Length</div>
            <div className="kpi-value">{currentStepData.stats?.pathLength ?? 0} <span className="kpi-unit">cells</span></div>
            <div className="kpi-sub">{currentStepData.targetFound ? 'Optimal Path' : 'Searching'}</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Target Status</div>
            <div className="kpi-value" style={{ color: currentStepData.targetFound ? 'var(--success-text)' : 'var(--text-primary)' }}>
              {currentStepData.targetFound ? 'Target Found' : 'Searching...'}
            </div>
            <div className="kpi-sub">Goal Reachability</div>
          </div>
        </div>
      )}

      {/* Sorting & Searching Metrics */}
      {category === 'SORT_SEARCH' && (
        <div className="kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">Comparisons</div>
            <div className="kpi-value">{currentStepData.comparisons ?? currentStepData.iterations ?? 0}</div>
            <div className="kpi-sub">Element Evaluations</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Swaps / Shifts</div>
            <div className="kpi-value">{currentStepData.swaps ?? 0}</div>
            <div className="kpi-sub">Array Reorderings</div>
          </div>
          <div className="kpi-box">
            <div className="kpi-label">Sorted Items</div>
            <div className="kpi-value">{currentStepData.sortedIndices?.length ?? (currentStepData.found ? 1 : 0)}</div>
            <div className="kpi-sub">In Final Position</div>
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

      {/* External Fragmentation Banner for Memory */}
      {currentStepData.isExternalFragmentation && (
        <div className="alert-banner alert-danger" style={{ marginTop: '1rem' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>External Fragmentation Detected</strong>
            <p style={{ marginTop: '3px', fontSize: '0.85rem' }}>
              Total free memory is <strong>{currentStepData.totalFreeMemory} KB</strong>, but largest contiguous block is only <strong>{currentStepData.largestFreeHole} KB</strong>. Cannot fit process {currentStepData.currentProcess?.name} ({currentStepData.currentProcess?.size} KB).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
