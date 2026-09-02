import React from 'react';
import { Crown, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NQueensVisualizer({
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const { n = 4, board = [], currentRow = -1, currentCol = -1, action = 'START', solutionsCount = 0 } = currentStepData;

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Crown size={16} color="#f59e0b" />
          <span>N-Queens Recursive Backtracking ({n}×{n} Chessboard)</span>
        </h3>
        <div className="header-meta">
          <span>Row: <strong>{currentRow >= 0 ? currentRow : 'Done'}</strong></span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span>Col: <strong>{currentCol >= 0 ? currentCol : '—'}</strong></span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span>Solutions: <strong style={{ color: 'var(--success-text)' }}>{solutionsCount}</strong></span>
        </div>
      </div>

      {/* CHESSBOARD GRID */}
      <div className="chessboard-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <div
          className="chessboard-grid"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${n}, 54px)`,
            gridTemplateColumns: `repeat(${n}, 54px)`,
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {Array.from({ length: n }).map((_, r) => (
            Array.from({ length: n }).map((_, c) => {
              const isDarkSquare = (r + c) % 2 === 1;
              const hasQueen = board[r] === c;
              const isCurrentTry = currentRow === r && currentCol === c;
              const isConflict = isCurrentTry && action === 'CONFLICT';
              const isBacktracked = isCurrentTry && action === 'BACKTRACK';

              let squareBg = isDarkSquare ? 'var(--bg-tertiary)' : 'var(--bg-card)';
              if (isConflict) squareBg = 'var(--danger-light)';
              else if (isBacktracked) squareBg = 'var(--warning-light)';
              else if (hasQueen) squareBg = 'var(--primary-light)';

              return (
                <div
                  key={`${r}-${c}`}
                  className="chess-square"
                  style={{
                    backgroundColor: squareBg,
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: 2, left: 3, fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {r},{c}
                  </span>
                  {hasQueen && (
                    <Crown size={26} color="#f59e0b" fill="#f59e0b" />
                  )}
                  {isConflict && !hasQueen && (
                    <AlertTriangle size={20} color="var(--danger-text)" />
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="bars-footer-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {action === 'SOLUTION_FOUND' && (
            <span className="badge badge-success">
              <CheckCircle2 size={13} /> Valid {n}-Queens Solution #{solutionsCount} Discovered!
            </span>
          )}
          {action === 'CONFLICT' && (
            <span className="badge badge-danger">
              Attack Conflict Detected at ({currentRow}, {currentCol})
            </span>
          )}
          {action === 'BACKTRACK' && (
            <span className="badge badge-info">
              Backtracking: Pruning Branch & Removing Queen
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
