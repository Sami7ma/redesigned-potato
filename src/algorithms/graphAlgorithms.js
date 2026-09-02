// Graph & Pathfinding Algorithms Engine
// Implements BFS, DFS, and Dijkstra on a 2D Grid Graph with step-by-step exploration trace.

export function generateGraphTrace(algorithmId, gridConfig) {
  const { rows, cols, start, target, walls } = gridConfig;
  const isWall = (r, c) => walls.some(w => w.r === r && w.c === c);

  const steps = [];
  const visited = new Set();
  const parent = {};
  const distance = {};
  const key = (r, c) => `${r},${c}`;
  const unkey = (k) => {
    const [r, c] = k.split(',').map(Number);
    return { r, c };
  };

  const startKey = key(start.r, start.c);
  const targetKey = key(target.r, target.c);

  // Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      distance[key(r, c)] = Infinity;
    }
  }
  distance[startKey] = 0;

  // Directions (Up, Right, Down, Left)
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];

  // Step 0: Initial State
  steps.push({
    stepIndex: 0,
    currentCell: null,
    visitedCells: [],
    frontierCells: [startKey],
    pathCells: [],
    targetFound: false,
    explanation: `Graph initialized: Start at (${start.r}, ${start.c}) and Target at (${target.r}, ${target.c}).`,
    isFinished: false,
    stats: { visitedCount: 0, pathLength: 0, cost: 0 }
  });

  let targetFound = false;
  const visitedOrder = [];

  if (algorithmId === 'bfs') {
    const queue = [startKey];
    visited.add(startKey);

    while (queue.length > 0) {
      const currKey = queue.shift();
      const { r, c } = unkey(currKey);
      visitedOrder.push(currKey);

      if (currKey === targetKey) {
        targetFound = true;
        break;
      }

      // Check neighbors
      for (let i = 0; i < 4; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        const nKey = key(nr, nc);

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visited.has(nKey)) {
          visited.add(nKey);
          parent[nKey] = currKey;
          queue.push(nKey);
        }
      }

      steps.push({
        stepIndex: steps.length,
        currentCell: { r, c },
        visitedCells: [...visitedOrder],
        frontierCells: [...queue],
        pathCells: [],
        targetFound: false,
        explanation: `BFS explored cell (${r}, ${c}). Queue size: ${queue.length}.`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: 0 }
      });
    }
  } else if (algorithmId === 'dfs') {
    const stack = [startKey];
    visited.add(startKey);

    while (stack.length > 0) {
      const currKey = stack.pop();
      const { r, c } = unkey(currKey);
      visitedOrder.push(currKey);

      if (currKey === targetKey) {
        targetFound = true;
        break;
      }

      // Check neighbors
      for (let i = 0; i < 4; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        const nKey = key(nr, nc);

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visited.has(nKey)) {
          visited.add(nKey);
          parent[nKey] = currKey;
          stack.push(nKey);
        }
      }

      steps.push({
        stepIndex: steps.length,
        currentCell: { r, c },
        visitedCells: [...visitedOrder],
        frontierCells: [...stack],
        pathCells: [],
        targetFound: false,
        explanation: `DFS traversed deep to cell (${r}, ${c}). Stack depth: ${stack.length}.`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: 0 }
      });
    }
  } else if (algorithmId === 'dijkstra') {
    const pq = [{ key: startKey, dist: 0 }];

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { key: currKey, dist: currDist } = pq.shift();
      if (visited.has(currKey)) continue;

      visited.add(currKey);
      visitedOrder.push(currKey);
      const { r, c } = unkey(currKey);

      if (currKey === targetKey) {
        targetFound = true;
        break;
      }

      for (let i = 0; i < 4; i++) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        const nKey = key(nr, nc);

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !isWall(nr, nc) && !visited.has(nKey)) {
          const weight = 1; // Uniform unit grid weight
          const newDist = currDist + weight;
          if (newDist < distance[nKey]) {
            distance[nKey] = newDist;
            parent[nKey] = currKey;
            pq.push({ key: nKey, dist: newDist });
          }
        }
      }

      steps.push({
        stepIndex: steps.length,
        currentCell: { r, c },
        visitedCells: [...visitedOrder],
        frontierCells: pq.map(item => item.key),
        pathCells: [],
        targetFound: false,
        explanation: `Dijkstra expanded minimum-cost node (${r}, ${c}) with distance ${currDist}.`,
        isFinished: false,
        stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: currDist }
      });
    }
  }

  // Reconstruct path if found
  const path = [];
  if (targetFound) {
    let curr = targetKey;
    while (curr && curr !== startKey) {
      path.unshift(curr);
      curr = parent[curr];
    }
    if (curr === startKey) path.unshift(startKey);

    // Final Success Step
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
      explanation: 'Search Complete: No path exists to the target node due to blocking walls.',
      isFinished: true,
      stats: { visitedCount: visitedOrder.length, pathLength: 0, cost: 0 }
    });
  }

  return {
    algorithmId,
    gridConfig,
    steps,
    totalSteps: steps.length - 1,
    finalStep: steps[steps.length - 1],
    targetFound,
    pathLength: path.length,
    visitedCount: visitedOrder.length,
  };
}
