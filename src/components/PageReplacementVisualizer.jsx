import React from 'react';
import { Layers, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PageReplacementVisualizer({
  referenceString = [],
  currentStepIndex = 0,
  frames = [],
  isFault = false,
  isHit = false,
  replacedPage = null,
  currentPage = null,
  pageFaults = 0,
  pageHits = 0,
  hitRatio = 0
}) {
  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Layers size={16} color="var(--primary)" />
          <span>Page Reference Stream & Physical Frame Allocations</span>
        </h3>
        <div className="header-meta">
          <span>Faults: <strong style={{ color: 'var(--danger-text)' }}>{pageFaults}</strong></span>
          <span style={{ margin: '0 5px' }}>•</span>
          <span>Hits: <strong style={{ color: 'var(--success-text)' }}>{pageHits}</strong></span>
          <span style={{ margin: '0 5px' }}>•</span>
          <span>Hit Ratio: <strong>{hitRatio}%</strong></span>
        </div>
      </div>

      {/* Reference String Pill Sequence */}
      <div className="ref-stream-container">
        <div className="ref-stream-label">Page Reference Sequence:</div>
        <div className="ref-stream-list">
          {referenceString.map((page, idx) => {
            const isProcessed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex - 1;

            return (
              <div
                key={idx}
                className={`ref-pill ${isCurrent ? 'pill-current' : ''} ${isProcessed ? 'pill-done' : ''}`}
              >
                {page}
                {isCurrent && (
                  <div className="ref-indicator">
                    <ArrowDown size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical Memory Frames */}
      <div className="frames-container">
        <div className="frames-header">
          <span>Physical Frame Slots ({frames.length} Total):</span>
          {currentPage !== null && (
            <span className={`badge ${isHit ? 'badge-success' : 'badge-danger'}`}>
              {isHit ? `HIT on Page ${currentPage}` : `PAGE FAULT on Page ${currentPage}`}
            </span>
          )}
        </div>

        <div className="frames-grid">
          {frames.map((framePage, fIdx) => {
            const isFrameCurrent = framePage === currentPage;
            const hasPage = framePage !== null;

            return (
              <div
                key={fIdx}
                className={`frame-slot ${hasPage ? 'has-page' : 'empty'} ${
                  isFrameCurrent ? (isHit ? 'slot-hit' : 'slot-fault') : ''
                }`}
              >
                <div className="slot-num">Frame #{fIdx}</div>
                <div className="slot-value">
                  {hasPage ? framePage : '—'}
                </div>
                <div className="slot-status">
                  {hasPage ? (isFrameCurrent ? (isHit ? 'ACCESSED' : 'LOADED') : 'OCCUPIED') : 'FREE'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frame Status Banner */}
      {replacedPage !== null && (
        <div className="alert-banner alert-warning" style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem' }}>
          <AlertTriangle size={15} />
          <span>Evicted Victim Page <strong>{replacedPage}</strong> to allocate Page <strong>{currentPage}</strong>.</span>
        </div>
      )}
    </div>
  );
}
