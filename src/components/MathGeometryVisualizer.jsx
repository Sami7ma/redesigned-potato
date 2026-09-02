import React from 'react';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MathGeometryVisualizer({
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const { a = 0, b = 0, equations = [], gcd = null } = currentStepData;

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Calculator size={16} color="var(--primary)" />
          <span>Euclidean Algorithm for Greatest Common Divisor (GCD)</span>
        </h3>
        <div className="header-meta">
          <span>Current A: <strong>{a}</strong> • Current B: <strong>{b}</strong></span>
          {gcd !== null && (
            <>
              <span style={{ margin: '0 6px' }}>•</span>
              <span>Final GCD: <strong style={{ color: 'var(--success-text)' }}>{gcd}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* EQUATION STEP CARDS */}
      <div className="euclidean-equations-container" style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {equations.map((eq, idx) => {
          const isLatest = idx === equations.length - 1;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: '0.65rem 1rem',
                background: isLatest ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                borderColor: isLatest ? 'var(--primary)' : 'var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700 }}>
                Step {idx + 1}: <span style={{ color: 'var(--primary)' }}>{eq.text}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Remainder: <strong>{eq.r}</strong>
              </div>
            </div>
          );
        })}
        {equations.length === 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
            Beginning division steps...
          </div>
        )}
      </div>

      {/* RESULT */}
      {isFinished && gcd !== null && (
        <div style={{ marginTop: '0.75rem' }}>
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> GCD Resolved: Greatest Common Divisor is {gcd}!
          </span>
        </div>
      )}
    </div>
  );
}
