import React from 'react';
import { Cpu, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CpuSchedulerVisualizer({
  ganttChart = [],
  currentTime = 0,
  runningProcess = null,
  readyQueue = [],
  processStates = []
}) {
  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Cpu size={16} color="var(--primary)" />
          <span>Interactive CPU Gantt Timeline & Ready Queue</span>
        </h3>
        <div className="header-meta">
          <span>Current Time: <strong>T = {currentTime}</strong></span>
        </div>
      </div>

      {/* Gantt Chart Timeline */}
      <div className="gantt-container">
        <div className="gantt-title">Execution Gantt Chart:</div>
        <div className="gantt-track">
          {ganttChart.length === 0 ? (
            <div className="gantt-empty">Simulation Ready. Click Play to start CPU execution.</div>
          ) : (
            ganttChart.map((item, idx) => (
              <div
                key={idx}
                className="gantt-block"
                style={{
                  flexGrow: item.duration,
                  backgroundColor: item.color || '#3b82f6',
                  minWidth: `${Math.max(item.duration * 28, 45)}px`
                }}
              >
                <span className="gantt-proc-name">{item.name}</span>
                <span className="gantt-time-range">{item.start} - {item.end}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Ready Queue & Status */}
      <div className="cpu-status-grid">
        <div className="queue-box">
          <div className="queue-label">
            <Clock size={14} /> Ready Queue (FIFO):
          </div>
          <div className="queue-items">
            {readyQueue.length === 0 ? (
              <span className="empty-tag">Empty (CPU idle or all done)</span>
            ) : (
              readyQueue.map((name, i) => (
                <span key={i} className="queue-proc-pill">
                  {name} {i < readyQueue.length - 1 && <ArrowRight size={12} />}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="running-box">
          <div className="running-label">Active on CPU:</div>
          <div className="running-value" style={{ color: runningProcess?.color || 'var(--text-muted)' }}>
            {runningProcess ? (
              <span>Process {runningProcess.name} (Remaining: {runningProcess.remaining})</span>
            ) : (
              <span>None (Idle)</span>
            )}
          </div>
        </div>
      </div>

      {/* Process Completion Table */}
      <div className="process-table-wrapper">
        <table className="mini-data-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Priority</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Wait Time</th>
              <th>Turnaround</th>
            </tr>
          </thead>
          <tbody>
            {processStates.map((p) => (
              <tr key={p.id} className={runningProcess?.id === p.id ? 'row-active' : ''}>
                <td>
                  <strong style={{ color: p.color }}>{p.name}</strong>
                </td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                <td>{p.priority ?? '-'}</td>
                <td>{p.remaining}</td>
                <td>
                  <span className={`status-pill status-${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.waitingTime}</td>
                <td>{p.turnaroundTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
