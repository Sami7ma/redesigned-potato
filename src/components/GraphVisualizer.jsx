import React, { useState } from 'react';
import { 
  Network, 
  MapPin, 
  Flag, 
  BrickWall, 
  Shuffle, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

export default function GraphVisualizer({
  gridConfig,
  currentCell = null,
  visitedCells = [],
  frontierCells = [],
  pathCells = [],
  targetFound = false,
  onCellClick = () => {},
  onGenerateMaze = () => {},
  onClearWalls = () => {},
  isFinished = false
}) {
  const { rows, cols, start, target, walls } = gridConfig;
  const [editMode, setEditMode] = useState('wall'); // 'start' | 'target' | 'wall'
  const isWall = (r, c) => walls.some(w => w.r === r && w.c === c);

  const handleCellAction = (r, c) => {
    onCellClick(r, c, editMode);
    // Ergonomic auto-reset: switch back to wall mode after placing start or target
    if (editMode === 'start' || editMode === 'target') {
      setEditMode('wall');
    }
  };

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Network size={16} color="var(--primary)" />
          <span>Interactive 2D Grid Graph & Wavefront Traversal</span>
        </h3>
        <div className="header-meta">
          <span>Start: <strong>({start.r}, {start.c})</strong></span>
          <span style={{ margin: '0 5px' }}>•</span>
          <span>Target: <strong>({target.r}, {target.c})</strong></span>
          <span style={{ margin: '0 5px' }}>•</span>
          <span>Walls: <strong>{walls.length}</strong></span>
        </div>
      </div>

      {/* Interactive Edit Tools Toolbar */}
      <div className="graph-toolbar">
        <div className="edit-mode-group">
          <span className="toolbar-label">Tool:</span>
          <button
            className={`btn btn-sm ${editMode === 'start' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setEditMode('start')}
            title="Click any cell on grid to reposition Start Node"
          >
            <MapPin size={13} />
            <span>Place Start</span>
          </button>

          <button
            className={`btn btn-sm ${editMode === 'target' ? 'btn-danger' : 'btn-outline'}`}
            onClick={() => setEditMode('target')}
            title="Click any cell on grid to reposition Target Node"
          >
            <Flag size={13} />
            <span>Place Target</span>
          </button>

          <button
            className={`btn btn-sm ${editMode === 'wall' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setEditMode('wall')}
            title="Click cells to add or remove obstacle walls"
          >
            <BrickWall size={13} />
            <span>Draw / Erase Walls</span>
          </button>
        </div>

        <div className="graph-action-btns">
          <button className="btn btn-outline btn-sm" onClick={onGenerateMaze} title="Generate procedural random obstacle maze">
            <Shuffle size={12} /> Random Maze
          </button>
          <button className="btn btn-outline btn-sm" onClick={onClearWalls} title="Clear all obstacle walls">
            <Trash2 size={12} color="var(--danger-text)" /> Clear Walls
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid-wrapper">
        <div
          className="path-grid"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(26px, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(26px, 1fr))`
          }}
        >
          {Array.from({ length: rows }).map((_, r) => (
            Array.from({ length: cols }).map((_, c) => {
              const cellKey = `${r},${c}`;
              const isStart = start.r === r && start.c === c;
              const isTarget = target.r === r && target.c === c;
              const wall = isWall(r, c);
              const isVisited = visitedCells.includes(cellKey);
              const isFrontier = frontierCells.includes(cellKey);
              const isPath = pathCells.includes(cellKey);
              const isCurrent = currentCell && currentCell.r === r && currentCell.c === c;

              let cellClass = 'grid-cell';
              if (isStart) cellClass += ' cell-start';
              else if (isTarget) cellClass += ' cell-target';
              else if (wall) cellClass += ' cell-wall';
              else if (isPath) cellClass += ' cell-path';
              else if (isCurrent) cellClass += ' cell-current';
              else if (isFrontier) cellClass += ' cell-frontier';
              else if (isVisited) cellClass += ' cell-visited';

              return (
                <div
                  key={cellKey}
                  className={cellClass}
                  onClick={() => handleCellAction(r, c)}
                  title={`(${r}, ${c}) ${isStart ? 'Start Node' : isTarget ? 'Target Node' : wall ? 'Wall Obstacle' : 'Empty Cell'}`}
                >
                  {isStart && <MapPin size={15} />}
                  {isTarget && <Flag size={15} />}
                  {isPath && !isStart && !isTarget && <span className="path-dot" />}
                </div>
              );
            })
          ))}
        </div>
      </div>

      <div className="grid-helper-bar">
        <div className="legend-pills">
          <span className="legend-item">
            <span className="legend-chip chip-start" /> Start
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-target" /> Target
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-wall" /> Wall
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-visited" /> Visited
          </span>
          <span className="legend-item">
            <span className="legend-chip chip-path" /> Shortest Path
          </span>
        </div>

        {isFinished && targetFound && (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> Path Reconstructed: {pathCells.length} steps ({visitedCells.length} visited)
          </span>
        )}
      </div>
    </div>
  );
}
