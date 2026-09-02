import React, { useState } from 'react';
import { Database, Info } from 'lucide-react';

export default function MemoryVisualizer({
  memoryBlocks = [],
  totalMemorySize = 2000,
  scannedHoleIds = [],
  selectedHoleId = null,
  currentProcess = null,
  isPresentation = false
}) {
  const [hoveredBlock, setHoveredBlock] = useState(null);

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Database size={16} color="var(--primary)" />
          <span>Contiguous Physical Memory Layout ({totalMemorySize} KB)</span>
        </h3>
        <div className="legend-pills">
          <span className="legend-item">
            <span className="legend-chip chip-free" />
            Free Hole
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-allocated" />
            Allocated
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-selected" />
            Selected
          </span>
        </div>
      </div>

      <div className="memory-track-scroll-wrapper">
        {/* Address Ruler (Top) */}
        <div className="memory-ruler-top">
          <span>0 KB</span>
          <span>{Math.round(totalMemorySize / 4)} KB</span>
          <span>{Math.round(totalMemorySize / 2)} KB</span>
          <span>{Math.round((totalMemorySize * 3) / 4)} KB</span>
          <span>{totalMemorySize} KB</span>
        </div>

        {/* Main Proportional Track */}
        <div className={`memory-track ${isPresentation ? 'pres-memory-track' : ''}`}>
          {memoryBlocks.map((block) => {
            const widthPercentage = (block.size / totalMemorySize) * 100;
            const isAllocated = block.type === 'ALLOCATED';
            const isScanned = scannedHoleIds.includes(block.label) || scannedHoleIds.includes(block.originalHoleId);
            const isSelected = selectedHoleId === block.label || selectedHoleId === block.originalHoleId;

            return (
              <div
                key={block.id}
                className={`memory-block ${isAllocated ? 'is-allocated' : 'is-free'} ${
                  isScanned ? 'is-scanned' : ''
                } ${isSelected ? 'is-selected' : ''}`}
                style={{
                  width: `${Math.max(widthPercentage, 6)}%`,
                  flexGrow: widthPercentage,
                  backgroundColor: isAllocated ? block.process?.color : undefined,
                }}
                onMouseEnter={() => setHoveredBlock(block)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => setHoveredBlock(block)}
              >
                <span className="block-tag">
                  {isAllocated ? block.process?.name : block.label}
                </span>

                <span className="block-size">
                  {block.size} KB
                </span>

                <span className="block-status">
                  {isAllocated ? 'USED' : 'FREE'}
                </span>

                <span className="address-marker">
                  {block.base}K
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspector Details Box (Fixed height container for zero layout shift) */}
      <div className="inspector-box">
        {hoveredBlock ? (
          <>
            <div className="inspector-left">
              <strong>{hoveredBlock.label}</strong>: {hoveredBlock.size} KB • Range [{hoveredBlock.base}K – {hoveredBlock.limit}K] • Status: <strong>{hoveredBlock.type}</strong>
            </div>
            {hoveredBlock.type === 'ALLOCATED' && hoveredBlock.process && (
              <div className="inspector-right" style={{ color: hoveredBlock.process.color, fontWeight: 700 }}>
                Process {hoveredBlock.process.name} ({hoveredBlock.process.size} KB)
              </div>
            )}
          </>
        ) : (
          <div className="inspector-left" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Info size={13} /> Hover over or click any memory block to inspect its base address, limit, and allocation status.
          </div>
        )}
      </div>
    </div>
  );
}
