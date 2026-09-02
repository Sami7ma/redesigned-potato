import React from 'react';
import { Search, CheckCircle2, ArrowDown } from 'lucide-react';

export default function StringSearchVisualizer({
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const { text = '', pattern = '', lps = [], textIndex = 0, patternIndex = 0, matches = [] } = currentStepData;

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Search size={16} color="var(--primary)" />
          <span>Knuth-Morris-Pratt (KMP) String Search & LPS Table</span>
        </h3>
        <div className="header-meta">
          <span>Matches Found: <strong style={{ color: 'var(--success-text)' }}>{matches.length}</strong></span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span>Text Ptr: <strong>{textIndex} / {text.length}</strong></span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span>Pattern Ptr: <strong>{patternIndex} / {pattern.length}</strong></span>
        </div>
      </div>

      {/* TEXT STREAM DISPLAY */}
      <div className="kmp-stream-container" style={{ margin: '1rem 0' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
          Text Stream T[{text.length}]:
        </div>
        <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '4px' }}>
          {text.split('').map((char, idx) => {
            const isMatch = matches.some(m => idx >= m && idx < m + pattern.length);
            const isCurrent = idx === textIndex;

            return (
              <div
                key={idx}
                className={`ref-pill ${isCurrent ? 'pill-current' : ''} ${isMatch ? 'pill-done' : ''}`}
                style={{
                  width: '28px',
                  height: '32px',
                  backgroundColor: isMatch ? 'var(--success-light)' : undefined,
                  borderColor: isMatch ? 'var(--success)' : undefined
                }}
              >
                {char}
                {isCurrent && (
                  <div className="ref-indicator">
                    <ArrowDown size={11} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PATTERN & LPS TABLE */}
      <div className="kmp-lps-container" style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
          Pattern P[{pattern.length}] & Precomputed LPS Array (Longest Proper Prefix Which is Suffix):
        </div>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {pattern.split('').map((char, idx) => {
            const isPatternActive = idx === patternIndex;
            return (
              <div
                key={idx}
                className="frame-slot"
                style={{
                  minWidth: '46px',
                  padding: '4px',
                  borderColor: isPatternActive ? 'var(--primary)' : undefined,
                  backgroundColor: isPatternActive ? 'var(--primary-light)' : undefined
                }}
              >
                <div className="slot-num">P[{idx}]</div>
                <div className="slot-value" style={{ fontSize: '1rem', margin: '1px 0' }}>{char}</div>
                <div className="slot-status" style={{ color: 'var(--primary)', fontWeight: 800 }}>
                  LPS={lps[idx] ?? 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      {isFinished && (
        <div style={{ marginTop: '0.75rem' }}>
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Pattern Search Completed: {matches.length} full match(es) at index {matches.join(', ')}.
          </span>
        </div>
      )}
    </div>
  );
}
