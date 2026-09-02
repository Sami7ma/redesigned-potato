import React from 'react';
import { SlidersHorizontal, ArrowLeftRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function ArrayTechniquesVisualizer({
  algorithmId,
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const isSliding = algorithmId === 'sliding-window';
  const isTwoPointers = algorithmId === 'two-pointers';
  const isKadanes = algorithmId === 'kadanes';

  const array = currentStepData.array || [];

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          {isSliding && <SlidersHorizontal size={16} color="var(--primary)" />}
          {isTwoPointers && <ArrowLeftRight size={16} color="var(--primary)" />}
          {isKadanes && <TrendingUp size={16} color="var(--primary)" />}
          <span>
            {isSliding && `Sliding Window Visualizer (Window Size K = ${currentStepData.k})`}
            {isTwoPointers && `Two Pointers Dual-Pointer Visualizer (Target = ${currentStepData.target})`}
            {isKadanes && `Kadane's Optimal Maximum Contiguous Subarray (O(N))`}
          </span>
        </h3>
        <div className="header-meta">
          {isSliding && <span>Current Sum: <strong>{currentStepData.windowSum}</strong> • Max Sum: <strong>{currentStepData.maxSum}</strong></span>}
          {isTwoPointers && <span>Current Pair Sum: <strong>{currentStepData.currentSum}</strong></span>}
          {isKadanes && <span>currMax: <strong>{currentStepData.currMax}</strong> • maxSoFar: <strong>{currentStepData.maxSoFar}</strong></span>}
        </div>
      </div>

      {/* ARRAY CELLS & POINTERS */}
      <div className="array-techniques-wrapper" style={{ margin: '1.25rem 0' }}>
        <div className="array-cells-track" style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {array.map((val, idx) => {
            const isWindow = isSliding && idx >= currentStepData.windowRange?.[0] && idx <= currentStepData.windowRange?.[1];
            const isMaxRange = isSliding && isFinished && idx >= currentStepData.maxRange?.[0] && idx <= currentStepData.maxRange?.[1];
            const isLeft = isTwoPointers && currentStepData.left === idx;
            const isRight = isTwoPointers && currentStepData.right === idx;
            const isKadaneSub = isKadanes && idx >= currentStepData.subarrayRange?.[0] && idx <= currentStepData.subarrayRange?.[1];
            const isKadaneCurr = isKadanes && currentStepData.currentIndex === idx;

            let cellClass = 'array-technique-cell';
            if (isWindow || isKadaneSub) cellClass += ' in-window';
            if (isMaxRange) cellClass += ' is-max-window';
            if (isLeft || isRight || isKadaneCurr) cellClass += ' is-pointer-active';

            return (
              <div key={idx} className="array-cell-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div className={cellClass}>
                  <span className="cell-num">{val}</span>
                </div>
                <span className="cell-idx" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  [{idx}]
                </span>
                {isLeft && <span className="pointer-tag tag-left">LEFT (L)</span>}
                {isRight && <span className="pointer-tag tag-right">RIGHT (R)</span>}
                {isKadaneCurr && <span className="pointer-tag tag-curr">CURR</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER RESULT */}
      <div className="bars-footer-meta">
        {isTwoPointers && currentStepData.foundPair && (
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Pair Found: {currentStepData.foundPair[0]} + {currentStepData.foundPair[1]} = {currentStepData.target}
          </span>
        )}
        {isKadanes && isFinished && (
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Max Subarray Sum: {currentStepData.maxSoFar} (Indices [{currentStepData.subarrayRange[0]}..{currentStepData.subarrayRange[1]}])
          </span>
        )}
        {isSliding && isFinished && (
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Max Window Sum of Size {currentStepData.k} = {currentStepData.maxSum}
          </span>
        )}
      </div>
    </div>
  );
}
