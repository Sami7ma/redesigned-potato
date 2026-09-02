// Dynamic Programming (DP) Algorithms Engine:
// 1. 0/1 Knapsack Problem (2D DP Table & Subset Traceback)
// 2. Longest Common Subsequence (LCS 2D Matching Grid)
// 3. Kadane's Algorithm (Maximum Contiguous Subarray - O(N))

// ==========================================
// 1. 0/1 KNAPSACK PROBLEM
// ==========================================
export function generateKnapsackTrace(items = [
  { id: 1, name: 'Item 1', weight: 1, value: 1 },
  { id: 2, name: 'Item 2', weight: 2, value: 6 },
  { id: 3, name: 'Item 3', weight: 3, value: 10 },
  { id: 4, name: 'Item 4', weight: 5, value: 16 }
], capacity = 7) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'KNAPSACK_DP',
    dpTable: dp.map(r => [...r]),
    items,
    capacity,
    currentItem: null,
    currentW: -1,
    selectedItems: [],
    explanation: `0/1 Knapsack initialized. ${n} items with max capacity W = ${capacity}.`,
    isFinished: false,
    stats: { maxValue: 0, totalWeight: 0 }
  });

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.weight <= w) {
        const include = item.value + dp[i - 1][w - item.weight];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);

        steps.push({
          stepIndex: steps.length,
          type: 'KNAPSACK_DP',
          dpTable: dp.map(r => [...r]),
          items,
          capacity,
          currentItem: i,
          currentW: w,
          selectedItems: [],
          explanation: `Evaluating ${item.name} (wt=${item.weight}, val=${item.value}) at capacity ${w}: max(Exclude=${exclude}, Include=${include}) = ${dp[i][w]}.`,
          isFinished: false,
          stats: { maxValue: dp[i][w], totalWeight: w }
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        steps.push({
          stepIndex: steps.length,
          type: 'KNAPSACK_DP',
          dpTable: dp.map(r => [...r]),
          items,
          capacity,
          currentItem: i,
          currentW: w,
          selectedItems: [],
          explanation: `${item.name} weight (${item.weight}) exceeds capacity ${w}. Inherit dp[${i-1}][${w}] = ${dp[i][w]}.`,
          isFinished: false,
          stats: { maxValue: dp[i][w], totalWeight: w }
        });
      }
    }
  }

  // Traceback selected items
  let res = dp[n][capacity];
  let w = capacity;
  const selected = [];
  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      res -= items[i - 1].value;
      w -= items[i - 1].weight;
    }
  }

  const finalWeight = selected.reduce((sum, item) => sum + item.weight, 0);

  steps.push({
    stepIndex: steps.length,
    type: 'KNAPSACK_DP',
    dpTable: dp.map(r => [...r]),
    items,
    capacity,
    currentItem: n,
    currentW: capacity,
    selectedItems: selected,
    explanation: `Knapsack DP Complete: Maximum Value = ${dp[n][capacity]} using [${selected.map(s => s.name).join(', ')}] (Weight = ${finalWeight}/${capacity}).`,
    isFinished: true,
    stats: { maxValue: dp[n][capacity], totalWeight: finalWeight }
  });

  return { algorithmId: 'knapsack-dp', steps };
}

// ==========================================
// 2. LONGEST COMMON SUBSEQUENCE (LCS)
// ==========================================
export function generateLcsTrace(str1 = "ABCDE", str2 = "ACE") {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'LCS_DP',
    dpTable: dp.map(r => [...r]),
    str1,
    str2,
    i: 0,
    j: 0,
    lcsString: '',
    explanation: `LCS initialized for String A="${str1}" (length ${m}) and String B="${str2}" (length ${n}).`,
    isFinished: false
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = str1[i - 1];
      const char2 = str2[j - 1];

      if (char1 === char2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          stepIndex: steps.length,
          type: 'LCS_DP',
          dpTable: dp.map(r => [...r]),
          str1,
          str2,
          i,
          j,
          lcsString: '',
          explanation: `Match found: '${char1}' == '${char2}'. dp[${i}][${j}] = 1 + dp[${i-1}][${j-1}] = ${dp[i][j]}.`,
          isFinished: false
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          stepIndex: steps.length,
          type: 'LCS_DP',
          dpTable: dp.map(r => [...r]),
          str1,
          str2,
          i,
          j,
          lcsString: '',
          explanation: `Mismatch '${char1}' ≠ '${char2}'. dp[${i}][${j}] = max(top=${dp[i-1][j]}, left=${dp[i][j-1]}) = ${dp[i][j]}.`,
          isFinished: false
        });
      }
    }
  }

  // Reconstruct LCS string
  let i = m, j = n;
  let lcsChars = [];
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcsChars.unshift(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const finalLcs = lcsChars.join('');

  steps.push({
    stepIndex: steps.length,
    type: 'LCS_DP',
    dpTable: dp.map(r => [...r]),
    str1,
    str2,
    i: m,
    j: n,
    lcsString: finalLcs,
    explanation: `LCS Computed: Length = ${dp[m][n]}, Longest Subsequence = "${finalLcs}".`,
    isFinished: true
  });

  return { algorithmId: 'lcs-dp', steps };
}

// ==========================================
// 3. KADANE'S ALGORITHM (MAX SUBARRAY)
// ==========================================
export function generateKadanesTrace(arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {
  const steps = [];
  let maxSoFar = arr[0];
  let currMax = arr[0];
  let start = 0, end = 0, tempStart = 0;

  steps.push({
    stepIndex: 0,
    type: 'KADANES',
    array: [...arr],
    currentIndex: 0,
    currMax: arr[0],
    maxSoFar: arr[0],
    subarrayRange: [0, 0],
    explanation: `Kadane's algorithm initialized at index 0 (value = ${arr[0]}).`,
    isFinished: false
  });

  for (let i = 1; i < arr.length; i++) {
    const val = arr[i];
    if (val > currMax + val) {
      currMax = val;
      tempStart = i;
    } else {
      currMax = currMax + val;
    }

    if (currMax > maxSoFar) {
      maxSoFar = currMax;
      start = tempStart;
      end = i;
    }

    steps.push({
      stepIndex: steps.length,
      type: 'KADANES',
      array: [...arr],
      currentIndex: i,
      currMax,
      maxSoFar,
      subarrayRange: [start, end],
      explanation: `Index ${i} (${val}): currMax = max(${val}, ${currMax - val} + ${val}) = ${currMax}. Global maxSoFar = ${maxSoFar}.`,
      isFinished: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'KADANES',
    array: [...arr],
    currentIndex: arr.length - 1,
    currMax,
    maxSoFar,
    subarrayRange: [start, end],
    explanation: `Kadane Complete: Maximum contiguous subarray sum is ${maxSoFar} spanning indices [${start} .. ${end}] [${arr.slice(start, end + 1).join(', ')}].`,
    isFinished: true
  });

  return { algorithmId: 'kadanes', steps };
}
