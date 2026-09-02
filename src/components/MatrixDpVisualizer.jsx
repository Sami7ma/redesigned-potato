import React from 'react';
import { Grid, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MatrixDpVisualizer({
  algorithmId,
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const isFloyd = algorithmId === 'floyd-warshall';
  const isKnapsack = algorithmId === 'knapsack-dp';
  const isLcs = algorithmId === 'lcs-dp';

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Grid size={16} color="var(--primary)" />
          <span>
            {isFloyd && 'Floyd-Warshall All-Pairs Distance Matrix DP'}
            {isKnapsack && '0/1 Knapsack Dynamic Programming Tableau (DP[i][w])'}
            {isLcs && 'Longest Common Subsequence (LCS) 2D Grid DP'}
          </span>
        </h3>
        <div className="header-meta">
          {isFloyd && <span>Intermediate Vertex: <strong>{currentStepData.headers?.[currentStepData.k] ?? 'Init'}</strong></span>}
          {isKnapsack && <span>Capacity W: <strong>{currentStepData.capacity}</strong></span>}
          {isLcs && <span>String A: <strong>"{currentStepData.str1}"</strong> • String B: <strong>"{currentStepData.str2}"</strong></span>}
        </div>
      </div>

      {/* FLOYD-WARSHALL MATRIX VIEW */}
      {isFloyd && (
        <div className="dp-matrix-container">
          <div className="dp-table-wrapper">
            <table className="dp-table">
              <thead>
                <tr>
                  <th className="th-corner">From \ To</th>
                  {currentStepData.headers?.map((h, idx) => (
                    <th key={idx} className={currentStepData.j === idx ? 'th-active' : ''}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStepData.matrix?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className={`td-header ${currentStepData.i === rIdx ? 'td-active-row' : ''}`}>
                      {currentStepData.headers?.[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isCurrent = currentStepData.i === rIdx && currentStepData.j === cIdx;
                      const isKCol = currentStepData.k === cIdx;
                      const isKRow = currentStepData.k === rIdx;

                      let cellClass = 'dp-cell';
                      if (isCurrent) cellClass += ' cell-evaluating';
                      else if (isKRow || isKCol) cellClass += ' cell-k-pivot';

                      return (
                        <td key={cIdx} className={cellClass}>
                          {val >= 999 ? '∞' : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 0/1 KNAPSACK DP TABLE VIEW */}
      {isKnapsack && (
        <div className="dp-matrix-container">
          <div className="dp-table-wrapper">
            <table className="dp-table">
              <thead>
                <tr>
                  <th className="th-corner">Item \ Capacity</th>
                  {Array.from({ length: currentStepData.capacity + 1 }).map((_, w) => (
                    <th key={w} className={currentStepData.currentW === w ? 'th-active' : ''}>W={w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStepData.dpTable?.map((row, i) => {
                  const item = i > 0 ? currentStepData.items?.[i - 1] : null;
                  return (
                    <tr key={i}>
                      <td className="td-header">
                        {i === 0 ? '0 (Empty)' : `${item?.name} (w=${item?.weight}, v=${item?.value})`}
                      </td>
                      {row.map((val, w) => {
                        const isCellCurrent = currentStepData.currentItem === i && currentStepData.currentW === w;
                        return (
                          <td
                            key={w}
                            className={`dp-cell ${isCellCurrent ? 'cell-evaluating' : ''} ${val > 0 ? 'cell-has-val' : ''}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Optimal Items */}
          {isFinished && currentStepData.selectedItems?.length > 0 && (
            <div className="selected-items-row" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Optimal Subset:
              </span>
              {currentStepData.selectedItems.map((it, idx) => (
                <span key={idx} className="status-pill status-running">
                  {it.name} (+{it.value} pts, {it.weight} kg)
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LCS DP TABLE VIEW */}
      {isLcs && (
        <div className="dp-matrix-container">
          <div className="dp-table-wrapper">
            <table className="dp-table">
              <thead>
                <tr>
                  <th className="th-corner">A \ B</th>
                  <th className="th-active">Ø</th>
                  {currentStepData.str2?.split('').map((char, idx) => (
                    <th key={idx} className={currentStepData.j === idx + 1 ? 'th-active' : ''}>{char}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStepData.dpTable?.map((row, i) => (
                  <tr key={i}>
                    <td className="td-header">
                      {i === 0 ? 'Ø' : currentStepData.str1?.[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isCurrent = currentStepData.i === i && currentStepData.j === j;
                      const isMatch = i > 0 && j > 0 && currentStepData.str1?.[i - 1] === currentStepData.str2?.[j - 1];

                      return (
                        <td
                          key={j}
                          className={`dp-cell ${isCurrent ? 'cell-evaluating' : ''} ${isMatch ? 'cell-match' : ''}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isFinished && currentStepData.lcsString && (
            <div style={{ marginTop: '0.75rem' }}>
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Longest Common Subsequence: <strong>"{currentStepData.lcsString}"</strong> (Length = {currentStepData.lcsString.length})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
