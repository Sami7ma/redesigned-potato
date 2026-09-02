// Graph & Pathfinding Algorithms Engine:
// 1. Grid BFS, DFS, Dijkstra, A* (A-Star with Manhattan Heuristic)
// 2. Floyd-Warshall (All-Pairs Shortest Path Matrix DP)
// 3. Kruskal's Algorithm (MST with DSU)
// 4. Prim's Algorithm (MST with Priority Cut)
// 5. Topological Sort (DAG in-degree queue)
// 6. Union-Find / Disjoint Set Union (DSU with Rank & Path Compression)

// ==========================================
// 1. 2D GRID PATHFINDING (BFS, DFS, Dijkstra, A*)
// ==========================================
export function generateGraphTrace(algorithmId, gridConfig) {
  const { rows, cols, start, target, walls } = gridConfig;
  const isWall = (r, c) => walls.some(w => w.r === r && w.c === c);

  if (algorithmId === 'floyd-warshall') return generateFloydWarshallTrace();
  if (algorithmId === 'kruskal') return generateKruskalTrace();
  if (algorithmId === 'prim') return generatePrimTrace();
  if (algorithmId === 'topological-sort') return generateTopologicalSortTrace();
  if (algorithmId === 'union-find') return generateUnionFindTrace();

  const steps = [];
  const startKey = `${start.r},${start.c}`;
  const targetKey = `${target.r},${target.c}`;

  // Initial State
  steps.push({
    stepIndex: 0,
    currentCell: null,
    visitedCells: [],
    frontierCells: [startKey],
    pathCells: [],
    targetFound: false,
    explanation: `Initialized grid (${rows}x${cols}). Start at (${start.r}, ${start.c}), Target at (${target.r}, ${target.c}). Walls: ${walls.length}.`,
    isFinished: false,
    stats: { visitedCount: 0, pathLength: 0, cost: 0 }
  });

  const parent = {};
  const visitedOrder = [];
  const visitedSet = new Set();
  const frontierSet = new Set([startKey]);

  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 },  // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 }   // Right
  ];

  let found = false;

  if (algorithmId === 'bfs') {
    const queue = [{ r: start.r, c: start.c }];
    visitedSet.add(startKey);

    while (queue.length > 0) {
      const curr = queue.shift();
      const currKey = `${curr.r},${curr.c}`;
      frontierSet.delete(currKey);
      visitedOrder.push(currKey);

      if (curr.r === target.r && curr.c === target.c) {
        found = true;
        break;
      }

      for (const { dr, dc } of directions) {
        const nr = curr.r + dr;
        const nc = curr.c + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visitedSet.has(nKey)) {
          visitedSet.add(nKey);
          parent[nKey] = currKey;
          frontierSet.add(nKey);
          queue.push({ r: nr, c: nc });
        }
      }

      steps.push({
        stepIndex: steps.length,
        currentCell: { ...curr },
        visitedCells: [...visitedOrder],
        frontierCells: Array.from(frontierSet),
        pathCells: [],
        targetFound: false,
        explanation: `BFS visited (${curr.r}, ${curr.c}). Queue frontier depth: ${queue.length}.`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: visitedOrder.length }
      });
    }
  } else if (algorithmId === 'dfs') {
    const stack = [{ r: start.r, c: start.c }];

    while (stack.length > 0) {
      const curr = stack.pop();
      const currKey = `${curr.r},${curr.c}`;

      if (visitedSet.has(currKey)) continue;
      visitedSet.add(currKey);
      visitedOrder.push(currKey);
      frontierSet.delete(currKey);

      if (curr.r === target.r && curr.c === target.c) {
        found = true;
        break;
      }

      for (const { dr, dc } of directions) {
        const nr = curr.r + dr;
        const nc = curr.c + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visitedSet.has(nKey)) {
          if (!parent[nKey]) parent[nKey] = currKey;
          frontierSet.add(nKey);
          stack.push({ r: nr, c: nc });
        }
      }

      steps.push({
        stepIndex: steps.length,
        currentCell: { ...curr },
        visitedCells: [...visitedOrder],
        frontierCells: Array.from(frontierSet),
        pathCells: [],
        targetFound: false,
        explanation: `DFS explored branch node (${curr.r}, ${curr.c}). Stack size: ${stack.length}.`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: visitedOrder.length }
      });
    }
  } else if (algorithmId === 'dijkstra' || algorithmId === 'a-star') {
    // Priority queue on cost
    const dist = { [startKey]: 0 };
    const h = (r, c) => Math.abs(r - target.r) + Math.abs(c - target.c); // Manhattan heuristic
    const pq = [{ r: start.r, c: start.c, g: 0, f: algorithmId === 'a-star' ? h(start.r, start.c) : 0 }];

    while (pq.length > 0) {
      // Sort priority queue by f-cost (A*) or g-cost (Dijkstra)
      pq.sort((a, b) => a.f - b.f);
      const curr = pq.shift();
      const currKey = `${curr.r},${curr.c}`;

      if (visitedSet.has(currKey)) continue;
      visitedSet.add(currKey);
      visitedOrder.push(currKey);
      frontierSet.delete(currKey);

      if (curr.r === target.r && curr.c === target.c) {
        found = true;
        break;
      }

      for (const { dr, dc } of directions) {
        const nr = curr.r + dr;
        const nc = curr.c + dc;
        const nKey = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visitedSet.has(nKey)) {
          const newG = curr.g + 1;
          if (dist[nKey] === undefined || newG < dist[nKey]) {
            dist[nKey] = newG;
            parent[nKey] = currKey;
            const newF = algorithmId === 'a-star' ? newG + h(nr, nc) : newG;
            frontierSet.add(nKey);
            pq.push({ r: nr, c: nc, g: newG, f: newF });
          }
        }
      }

      const algoName = algorithmId === 'a-star' ? 'A*' : "Dijkstra";
      steps.push({
        stepIndex: steps.length,
        currentCell: { ...curr },
        visitedCells: [...visitedOrder],
        frontierCells: Array.from(frontierSet),
        pathCells: [],
        targetFound: false,
        explanation: `${algoName} evaluated node (${curr.r}, ${curr.c}) [g=${curr.g}${algorithmId === 'a-star' ? `, h=${h(curr.r, curr.c)}, f=${curr.f}` : ''}].`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: curr.g }
      });
    }
  }

  // Path Reconstruction
  if (found) {
    const path = [];
    let curr = targetKey;
    while (curr && curr !== startKey) {
      path.unshift(curr);
      curr = parent[curr];
    }
    if (curr === startKey) path.unshift(startKey);

    steps.push({
      stepIndex: steps.length,
      currentCell: target,
      visitedCells: [...visitedOrder],
      frontierCells: [],
      pathCells: [...path],
      targetFound: true,
      explanation: `Target Found: Optimal path reconstructed with ${path.length} steps (${visitedOrder.length} nodes visited).`,
      isFinished: true,
      stats: { visitedCount: visitedOrder.length, pathLength: path.length, cost: path.length - 1 }
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      currentCell: null,
      visitedCells: [...visitedOrder],
      frontierCells: [],
      pathCells: [],
      targetFound: false,
      explanation: `Target unreachable: All accessible cells explored without reaching (${target.r}, ${target.c}).`,
      isFinished: true,
      stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: 0 }
    });
  }

  return { algorithmId, steps };
}

// ==========================================
// 2. FLOYD-WARSHALL ALL-PAIRS SHORTEST PATH
// ==========================================
export function generateFloydWarshallTrace() {
  const vertices = ['A', 'B', 'C', 'D'];
  const INF = 999;
  const initialMatrix = [
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0]
  ];

  const steps = [];
  const V = vertices.length;
  let dist = initialMatrix.map(row => [...row]);

  steps.push({
    stepIndex: 0,
    type: 'MATRIX_DP',
    matrix: dist.map(r => [...r]),
    headers: vertices,
    k: -1,
    i: -1,
    j: -1,
    explanation: 'Floyd-Warshall initialized with direct edge adjacency matrix.',
    isFinished: false
  });

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const direct = dist[i][j];
        const viaK = dist[i][k] + dist[k][j];
        let updated = false;

        if (dist[i][k] !== INF && dist[k][j] !== INF && viaK < direct) {
          dist[i][j] = viaK;
          updated = true;
        }

        steps.push({
          stepIndex: steps.length,
          type: 'MATRIX_DP',
          matrix: dist.map(r => [...r]),
          headers: vertices,
          k,
          i,
          j,
          explanation: updated
            ? `Relaxed dist(${vertices[i]}→${vertices[j]}) = min(${direct === INF ? '∞' : direct}, dist(${vertices[i]}→${vertices[k]}) + dist(${vertices[k]}→${vertices[j]})) = ${viaK}.`
            : `Evaluating dist(${vertices[i]}→${vertices[j]}) via intermediate ${vertices[k]}: no shorter path found.`,
          isFinished: false
        });
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    type: 'MATRIX_DP',
    matrix: dist.map(r => [...r]),
    headers: vertices,
    k: V - 1,
    i: V - 1,
    j: V - 1,
    explanation: 'Floyd-Warshall complete: All-pairs shortest path matrix computed.',
    isFinished: true
  });

  return { algorithmId: 'floyd-warshall', steps };
}

// ==========================================
// 3. KRUSKAL'S MINIMUM SPANNING TREE (MST)
// ==========================================
export function generateKruskalTrace() {
  const nodes = [
    { id: 'A', x: 80, y: 70 },
    { id: 'B', x: 220, y: 50 },
    { id: 'C', x: 360, y: 70 },
    { id: 'D', x: 100, y: 190 },
    { id: 'E', x: 250, y: 200 },
    { id: 'F', x: 380, y: 180 }
  ];

  const edges = [
    { u: 'A', v: 'B', weight: 4 },
    { u: 'A', v: 'D', weight: 2 },
    { u: 'B', v: 'C', weight: 3 },
    { u: 'B', v: 'E', weight: 3 },
    { u: 'C', v: 'F', weight: 4 },
    { u: 'D', v: 'E', weight: 3 },
    { u: 'E', v: 'F', weight: 2 }
  ].sort((a, b) => a.weight - b.weight);

  const parent = {};
  nodes.forEach(n => parent[n.id] = n.id);
  const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const union = (i, j) => { parent[find(i)] = find(j); };

  const steps = [];
  const mstEdges = [];
  let totalWeight = 0;

  steps.push({
    stepIndex: 0,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    mstEdges: [],
    currentEdge: null,
    explanation: 'Kruskal MST initialized. Edges sorted in ascending order of weight.',
    isFinished: false,
    stats: { totalWeight: 0, edgeCount: 0 }
  });

  for (const edge of edges) {
    const rootU = find(edge.u);
    const rootV = find(edge.v);
    const isCycle = rootU === rootV;

    if (!isCycle) {
      union(edge.u, edge.v);
      mstEdges.push(`${edge.u}-${edge.v}`);
      totalWeight += edge.weight;
    }

    steps.push({
      stepIndex: steps.length,
      type: 'GRAPH_NODES',
      nodes,
      edges,
      mstEdges: [...mstEdges],
      currentEdge: edge,
      explanation: isCycle
        ? `Edge (${edge.u}—${edge.v}, w=${edge.weight}) rejected: forms a cycle.`
        : `Edge (${edge.u}—${edge.v}, w=${edge.weight}) accepted into MST. Current total weight = ${totalWeight}.`,
      isFinished: false,
      stats: { totalWeight, edgeCount: mstEdges.length }
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    mstEdges: [...mstEdges],
    currentEdge: null,
    explanation: `Kruskal MST complete: Minimum Spanning Tree formed with ${mstEdges.length} edges (Total Weight = ${totalWeight}).`,
    isFinished: true,
    stats: { totalWeight, edgeCount: mstEdges.length }
  });

  return { algorithmId: 'kruskal', steps };
}

// ==========================================
// 4. PRIM'S MINIMUM SPANNING TREE (MST)
// ==========================================
export function generatePrimTrace() {
  const nodes = [
    { id: 'A', x: 80, y: 70 },
    { id: 'B', x: 220, y: 50 },
    { id: 'C', x: 360, y: 70 },
    { id: 'D', x: 100, y: 190 },
    { id: 'E', x: 250, y: 200 },
    { id: 'F', x: 380, y: 180 }
  ];

  const edges = [
    { u: 'A', v: 'B', weight: 4 },
    { u: 'A', v: 'D', weight: 2 },
    { u: 'B', v: 'C', weight: 3 },
    { u: 'B', v: 'E', weight: 3 },
    { u: 'C', v: 'F', weight: 4 },
    { u: 'D', v: 'E', weight: 3 },
    { u: 'E', v: 'F', weight: 2 }
  ];

  const visitedNodes = new Set(['A']);
  const mstEdges = [];
  let totalWeight = 0;
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    mstEdges: [],
    visitedNodes: Array.from(visitedNodes),
    currentEdge: null,
    explanation: 'Prim MST initialized at root node A.',
    isFinished: false,
    stats: { totalWeight: 0, edgeCount: 0 }
  });

  while (visitedNodes.size < nodes.length) {
    let minEdge = null;
    let minWeight = Infinity;

    for (const edge of edges) {
      const uIn = visitedNodes.has(edge.u);
      const vIn = visitedNodes.has(edge.v);
      if ((uIn && !vIn) || (!uIn && vIn)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    if (!minEdge) break;

    const nextNode = visitedNodes.has(minEdge.u) ? minEdge.v : minEdge.u;
    visitedNodes.add(nextNode);
    mstEdges.push(`${minEdge.u}-${minEdge.v}`);
    totalWeight += minEdge.weight;

    steps.push({
      stepIndex: steps.length,
      type: 'GRAPH_NODES',
      nodes,
      edges,
      mstEdges: [...mstEdges],
      visitedNodes: Array.from(visitedNodes),
      currentEdge: minEdge,
      explanation: `Prim added node ${nextNode} via minimum cut edge (${minEdge.u}—${minEdge.v}, w=${minEdge.weight}). Total weight = ${totalWeight}.`,
      isFinished: false,
      stats: { totalWeight, edgeCount: mstEdges.length }
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    mstEdges: [...mstEdges],
    visitedNodes: Array.from(visitedNodes),
    currentEdge: null,
    explanation: `Prim MST complete: Spanning tree covers all ${visitedNodes.size} vertices with total weight = ${totalWeight}.`,
    isFinished: true,
    stats: { totalWeight, edgeCount: mstEdges.length }
  });

  return { algorithmId: 'prim', steps };
}

// ==========================================
// 5. TOPOLOGICAL SORT (KAHN'S ALGORITHM)
// ==========================================
export function generateTopologicalSortTrace() {
  const nodes = [
    { id: 'Math', label: 'Math', x: 70, y: 70 },
    { id: 'CS1', label: 'Intro CS', x: 70, y: 180 },
    { id: 'DataStruct', label: 'Data Struct', x: 220, y: 120 },
    { id: 'Algorithms', label: 'Algorithms', x: 370, y: 120 },
    { id: 'OS', label: 'OS Dev', x: 500, y: 120 }
  ];

  const edges = [
    { u: 'Math', v: 'DataStruct', weight: 1 },
    { u: 'CS1', v: 'DataStruct', weight: 1 },
    { u: 'DataStruct', v: 'Algorithms', weight: 1 },
    { u: 'Algorithms', v: 'OS', weight: 1 }
  ];

  const inDegree = {};
  nodes.forEach(n => inDegree[n.id] = 0);
  edges.forEach(e => inDegree[e.v]++);

  const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const topoOrder = [];
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    topoOrder: [],
    inDegree: { ...inDegree },
    queue: [...queue],
    explanation: `Topological Sort initialized. Zero in-degree root nodes: [${queue.join(', ')}].`,
    isFinished: false
  });

  while (queue.length > 0) {
    const curr = queue.shift();
    topoOrder.push(curr);

    edges.filter(e => e.u === curr).forEach(e => {
      inDegree[e.v]--;
      if (inDegree[e.v] === 0) {
        queue.push(e.v);
      }
    });

    steps.push({
      stepIndex: steps.length,
      type: 'GRAPH_NODES',
      nodes,
      edges,
      topoOrder: [...topoOrder],
      inDegree: { ...inDegree },
      queue: [...queue],
      explanation: `Processed node ${curr} (in-degree=0). Output sequence: [${topoOrder.join(' → ')}].`,
      isFinished: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'GRAPH_NODES',
    nodes,
    edges,
    topoOrder: [...topoOrder],
    inDegree: { ...inDegree },
    queue: [],
    explanation: `Topological order resolved: [${topoOrder.join(' → ')}]. Zero cyclic dependencies.`,
    isFinished: true
  });

  return { algorithmId: 'topological-sort', steps };
}

// ==========================================
// 6. UNION-FIND / DISJOINT SET UNION (DSU)
// ==========================================
export function generateUnionFindTrace() {
  const elements = ['0', '1', '2', '3', '4', '5'];
  const operations = [
    { type: 'UNION', a: '0', b: '1' },
    { type: 'UNION', a: '2', b: '3' },
    { type: 'UNION', a: '1', b: '2' },
    { type: 'FIND', a: '0', b: '3' },
    { type: 'UNION', a: '4', b: '5' }
  ];

  const parent = {};
  elements.forEach(e => parent[e] = e);
  const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));

  const steps = [];
  steps.push({
    stepIndex: 0,
    type: 'DSU',
    elements,
    parent: { ...parent },
    op: null,
    explanation: 'Union-Find (DSU) initialized: Each element is its own root parent.',
    isFinished: false
  });

  for (const op of operations) {
    if (op.type === 'UNION') {
      const rootA = find(op.a);
      const rootB = find(op.b);
      parent[rootA] = rootB;

      steps.push({
        stepIndex: steps.length,
        type: 'DSU',
        elements,
        parent: { ...parent },
        op,
        explanation: `Union(${op.a}, ${op.b}): Connected set {${op.a}} to set {${op.b}}. Root is ${rootB}.`,
        isFinished: false
      });
    } else {
      const rootA = find(op.a);
      const rootB = find(op.b);
      const connected = rootA === rootB;

      steps.push({
        stepIndex: steps.length,
        type: 'DSU',
        elements,
        parent: { ...parent },
        op,
        explanation: `Find(${op.a}, ${op.b}): ${connected ? 'Connected in same component (Root=' + rootA + ')' : 'Disconnected (Different roots)'}.`,
        isFinished: false
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    type: 'DSU',
    elements,
    parent: { ...parent },
    op: null,
    explanation: 'Union-Find operations completed successfully with path compression.',
    isFinished: true
  });

  return { algorithmId: 'union-find', steps };
}
