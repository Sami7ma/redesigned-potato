import React from 'react';
import { Network, GitFork, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TreeGraphVisualizer({
  algorithmId,
  currentStepData,
  isFinished = false
}) {
  if (!currentStepData) return null;

  const isKruskal = algorithmId === 'kruskal';
  const isPrim = algorithmId === 'prim';
  const isTopo = algorithmId === 'topological-sort';
  const isDsu = algorithmId === 'union-find';

  const nodes = currentStepData.nodes || [];
  const edges = currentStepData.edges || [];
  const mstEdges = currentStepData.mstEdges || [];
  const visitedNodes = currentStepData.visitedNodes || [];

  return (
    <div className="card visualizer-canvas-card">
      <div className="card-header">
        <h3 className="card-title">
          <Network size={16} color="var(--primary)" />
          <span>
            {isKruskal && "Kruskal's Minimum Spanning Tree (Edge Sorting & DSU)"}
            {isPrim && "Prim's Minimum Spanning Tree (Priority Cut Growth)"}
            {isTopo && "Topological Sort (Kahn's DAG Dependency In-Degree Resolution)"}
            {isDsu && "Disjoint Set Union (DSU / Union-Find Component Trees)"}
          </span>
        </h3>
        <div className="header-meta">
          {(isKruskal || isPrim) && <span>MST Weight: <strong>{currentStepData.stats?.totalWeight ?? 0}</strong></span>}
          {isTopo && <span>Processed: <strong>{currentStepData.topoOrder?.length ?? 0} / {nodes.length}</strong></span>}
          {isDsu && <span>Active Op: <strong>{currentStepData.op?.type ?? 'Ready'}</strong></span>}
        </div>
      </div>

      {/* NODE-LINK GRAPH CANVAS (Kruskal, Prim, TopoSort) */}
      {(isKruskal || isPrim || isTopo) && (
        <div className="graph-svg-container">
          <svg className="node-link-svg" viewBox="0 0 600 280">
            {/* Draw Edges */}
            {edges.map((e, idx) => {
              const uNode = nodes.find(n => n.id === e.u);
              const vNode = nodes.find(n => n.id === e.v);
              if (!uNode || !vNode) return null;

              const isMst = mstEdges.includes(`${e.u}-${e.v}`) || mstEdges.includes(`${e.v}-${e.u}`);
              const isCurrent = currentStepData.currentEdge && (
                (currentStepData.currentEdge.u === e.u && currentStepData.currentEdge.v === e.v) ||
                (currentStepData.currentEdge.u === e.v && currentStepData.currentEdge.v === e.u)
              );

              let edgeColor = 'var(--border-subtle)';
              let strokeWidth = 2;
              if (isMst) {
                edgeColor = 'var(--success)';
                strokeWidth = 4;
              } else if (isCurrent) {
                edgeColor = '#f59e0b';
                strokeWidth = 3;
              }

              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={edgeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isCurrent && !isMst ? '4 2' : undefined}
                  />
                  {/* Weight label */}
                  {e.weight && (
                    <circle cx={midX} cy={midY} r="10" fill="var(--bg-card)" stroke="var(--border-color)" />
                  )}
                  {e.weight && (
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="var(--text-secondary)"
                    >
                      {e.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((n) => {
              const isInMst = visitedNodes.includes(n.id) || mstEdges.some(e => e.includes(n.id));
              const isTopoProcessed = currentStepData.topoOrder?.includes(n.id);
              const inDeg = currentStepData.inDegree?.[n.id];

              let nodeFill = 'var(--bg-tertiary)';
              let nodeBorder = 'var(--border-color)';
              if (isInMst || isTopoProcessed) {
                nodeFill = 'var(--primary)';
                nodeBorder = 'var(--primary)';
              }

              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="20"
                    fill={nodeFill}
                    stroke={nodeBorder}
                    strokeWidth="2"
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fill={isInMst || isTopoProcessed ? 'white' : 'var(--text-primary)'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {n.label || n.id}
                  </text>
                  {isTopo && inDeg !== undefined && (
                    <text
                      x={n.x}
                      y={n.y + 32}
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                    >
                      in={inDeg}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* TOPOLOGICAL SORT SEQUENCE BAR */}
      {isTopo && (
        <div className="topo-order-bar" style={{ marginTop: '0.75rem' }}>
          <div className="topo-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Linear Topological Dependency Ordering:
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {currentStepData.topoOrder?.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="status-pill status-running">
                  {idx + 1}. {item}
                </span>
                {idx < currentStepData.topoOrder.length - 1 && <ArrowRight size={12} color="var(--text-muted)" />}
              </React.Fragment>
            ))}
            {currentStepData.topoOrder?.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resolving in-degrees...</span>
            )}
          </div>
        </div>
      )}

      {/* UNION-FIND DSU VIEW */}
      {isDsu && (
        <div className="dsu-container" style={{ margin: '1rem 0' }}>
          <div className="dsu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
            {currentStepData.elements?.map((el) => {
              const parent = currentStepData.parent?.[el];
              const isRoot = parent === el;

              return (
                <div key={el} className={`frame-slot ${isRoot ? 'slot-hit' : ''}`} style={{ padding: '0.65rem' }}>
                  <div className="slot-num">Node {el}</div>
                  <div className="slot-value" style={{ fontSize: '1.1rem' }}>
                    {parent}
                  </div>
                  <div className="slot-status">
                    {isRoot ? 'ROOT' : `POINTS TO ${parent}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MST Result */}
      {(isKruskal || isPrim) && isFinished && (
        <div style={{ marginTop: '0.65rem' }}>
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Minimum Spanning Tree formed: {mstEdges.length} edges • Total Weight = {currentStepData.stats?.totalWeight}
          </span>
        </div>
      )}
    </div>
  );
}
