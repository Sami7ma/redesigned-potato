// Backtracking & Greedy Algorithms Engine:
// 1. N-Queens Backtracking (Chessboard Conflict Checking & Backtrack Rollback)
// 2. Activity Selection / Interval Scheduling (Greedy Choice Property)

// ==========================================
// 1. N-QUEENS BACKTRACKING
// ==========================================
export function generateNQueensTrace(n = 4) {
  const steps = [];
  const board = Array(n).fill(-1); // board[row] = col
  let solutions = [];

  steps.push({
    stepIndex: 0,
    type: 'N_QUEENS',
    n,
    board: [...board],
    currentRow: 0,
    currentCol: 0,
    action: 'START',
    conflictCells: [],
    solutionsCount: 0,
    explanation: `N-Queens Backtracking initialized for a ${n}×${n} chessboard. Goal: Place ${n} non-attacking queens.`,
    isFinished: false
  });

  const isSafe = (row, col) => {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
        return false;
      }
    }
    return true;
  };

  const solve = (row) => {
    if (row === n) {
      solutions.push([...board]);
      steps.push({
        stepIndex: steps.length,
        type: 'N_QUEENS',
        n,
        board: [...board],
        currentRow: row,
        currentCol: -1,
        action: 'SOLUTION_FOUND',
        conflictCells: [],
        solutionsCount: solutions.length,
        explanation: `Valid Solution Found! All ${n} queens placed without mutual attack.`,
        isFinished: false
      });
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        steps.push({
          stepIndex: steps.length,
          type: 'N_QUEENS',
          n,
          board: [...board],
          currentRow: row,
          currentCol: col,
          action: 'PLACE_QUEEN',
          conflictCells: [],
          solutionsCount: solutions.length,
          explanation: `Placed Queen at Row ${row}, Col ${col}. Moving to row ${row + 1}.`,
          isFinished: false
        });

        solve(row + 1);

        // Backtrack
        board[row] = -1;
        steps.push({
          stepIndex: steps.length,
          type: 'N_QUEENS',
          n,
          board: [...board],
          currentRow: row,
          currentCol: col,
          action: 'BACKTRACK',
          conflictCells: [],
          solutionsCount: solutions.length,
          explanation: `Backtracking from Row ${row}, Col ${col}: Removed queen to explore alternative branches.`,
          isFinished: false
        });
      } else {
        steps.push({
          stepIndex: steps.length,
          type: 'N_QUEENS',
          n,
          board: [...board],
          currentRow: row,
          currentCol: col,
          action: 'CONFLICT',
          conflictCells: [{ row, col }],
          solutionsCount: solutions.length,
          explanation: `Conflict at Row ${row}, Col ${col}: Under attack along row, column, or diagonal.`,
          isFinished: false
        });
      }
    }
  };

  solve(0);

  steps.push({
    stepIndex: steps.length,
    type: 'N_QUEENS',
    n,
    board: solutions.length > 0 ? solutions[0] : board,
    currentRow: -1,
    currentCol: -1,
    action: 'COMPLETE',
    conflictCells: [],
    solutionsCount: solutions.length,
    explanation: `N-Queens Complete: Discovered ${solutions.length} total distinct solution(s) on ${n}×${n} grid.`,
    isFinished: true
  });

  return { algorithmId: 'n-queens', steps };
}

// ==========================================
// 2. ACTIVITY SELECTION (GREEDY)
// ==========================================
export function generateActivitySelectionTrace(activities = [
  { id: 'A1', name: 'Meeting 1', start: 1, finish: 4 },
  { id: 'A2', name: 'Meeting 2', start: 3, finish: 5 },
  { id: 'A3', name: 'Meeting 3', start: 0, finish: 6 },
  { id: 'A4', name: 'Meeting 4', start: 5, finish: 7 },
  { id: 'A5', name: 'Meeting 5', start: 3, finish: 9 },
  { id: 'A6', name: 'Meeting 6', start: 5, finish: 9 },
  { id: 'A7', name: 'Meeting 7', start: 6, finish: 10 },
  { id: 'A8', name: 'Meeting 8', start: 8, finish: 11 },
  { id: 'A9', name: 'Meeting 9', start: 8, finish: 12 },
  { id: 'A10', name: 'Meeting 10', start: 2, finish: 14 },
  { id: 'A11', name: 'Meeting 11', start: 12, finish: 16 }
]) {
  const steps = [];
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const selected = [sorted[0]];
  let lastFinish = sorted[0].finish;

  steps.push({
    stepIndex: 0,
    type: 'GREEDY_ACTIVITY',
    activities: sorted,
    selectedActivities: [sorted[0].id],
    currentActivity: sorted[0],
    lastFinish: sorted[0].finish,
    explanation: `Activity Selection: Sorted ${sorted.length} intervals by finish time. Greedily selected earliest finish: ${sorted[0].name} [${sorted[0].start}..${sorted[0].finish}].`,
    isFinished: false
  });

  for (let i = 1; i < sorted.length; i++) {
    const act = sorted[i];
    const isCompatible = act.start >= lastFinish;

    if (isCompatible) {
      selected.push(act);
      lastFinish = act.finish;
    }

    steps.push({
      stepIndex: steps.length,
      type: 'GREEDY_ACTIVITY',
      activities: sorted,
      selectedActivities: selected.map(s => s.id),
      currentActivity: act,
      lastFinish,
      explanation: isCompatible
        ? `Selected ${act.name} [${act.start}..${act.finish}]: start (${act.start}) >= previous finish (${lastFinish - (act.finish - lastFinish)}). Total selected: ${selected.length}.`
        : `Rejected ${act.name} [${act.start}..${act.finish}]: overlaps with ongoing activity (start ${act.start} < finish ${lastFinish}).`,
      isFinished: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'GREEDY_ACTIVITY',
    activities: sorted,
    selectedActivities: selected.map(s => s.id),
    currentActivity: null,
    lastFinish,
    explanation: `Activity Selection Complete: Maximized non-overlapping intervals: ${selected.length} activities [${selected.map(s => s.name).join(', ')}].`,
    isFinished: true
  });

  return { algorithmId: 'activity-selection', steps };
}
