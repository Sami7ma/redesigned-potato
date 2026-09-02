import React from 'react';
import { BookOpen, Volume2, Lightbulb, Code2 } from 'lucide-react';
import { ALGORITHMS_REGISTRY } from '../types/data';

export default function LiveNarrator({
  selectedAlgo,
  currentStepData,
  currentStepIndex,
  totalSteps
}) {
  const algoInfo = ALGORITHMS_REGISTRY[selectedAlgo] || ALGORITHMS_REGISTRY['first-fit'];
  const explanation = currentStepData?.explanation || 'Simulation step initialized.';

  return (
    <div className="card narrator-card">
      <div className="card-header">
        <h3 className="card-title">
          <BookOpen size={16} color="var(--primary)" />
          <span>Step-by-Step Educational Explanation</span>
        </h3>
        <span className="complexity-badge">
          Time: {algoInfo.timeComplexity} | Space: {algoInfo.spaceComplexity}
        </span>
      </div>

      {/* Dynamic Step Explanation Box */}
      <div className="narrator-box">
        <div className="narrator-title">
          <Volume2 size={16} color="var(--primary)" />
          <span>
            {currentStepIndex === 0 
              ? 'Initial State' 
              : `Step ${currentStepIndex} of ${totalSteps}: Execution Event`}
          </span>
        </div>
        <p className="narrator-text">
          {explanation}
        </p>
      </div>

      {/* Algorithm Principle Insight */}
      <div className="principle-box">
        <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div className="principle-text">
          <strong>{algoInfo.name} Core Rule:</strong> {algoInfo.detailedExplanation}
        </div>
      </div>
    </div>
  );
}
