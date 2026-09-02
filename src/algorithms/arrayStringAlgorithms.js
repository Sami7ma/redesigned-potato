// Array & String Techniques Algorithms Engine:
// 1. Sliding Window (Maximum Sum of Subarray of Size K)
// 2. Two Pointers (Target Pair Sum in Sorted Array)
// 3. KMP (Knuth-Morris-Pratt String Pattern Matching with LPS Table)
// 4. Euclidean Algorithm (Greatest Common Divisor - GCD Modulo Steps)

// ==========================================
// 1. SLIDING WINDOW (MAX SUM K-SUBARRAY)
// ==========================================
export function generateSlidingWindowTrace(arr = [2, 1, 5, 1, 3, 2, 8, 4], k = 3) {
  const steps = [];
  let windowSum = 0;
  let maxSum = 0;
  let maxStart = 0;

  // Initial window sum
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  steps.push({
    stepIndex: 0,
    type: 'SLIDING_WINDOW',
    array: [...arr],
    windowRange: [0, k - 1],
    k,
    windowSum,
    maxSum,
    maxRange: [0, k - 1],
    explanation: `Sliding Window initialized with window size K=${k}. Initial window sum [${arr.slice(0, k).join(' + ')}] = ${windowSum}.`,
    isFinished: false
  });

  for (let right = k; right < arr.length; right++) {
    const left = right - k + 1;
    const outgoing = arr[left - 1];
    const incoming = arr[right];
    windowSum = windowSum - outgoing + incoming;

    let updated = false;
    if (windowSum > maxSum) {
      maxSum = windowSum;
      maxStart = left;
      updated = true;
    }

    steps.push({
      stepIndex: steps.length,
      type: 'SLIDING_WINDOW',
      array: [...arr],
      windowRange: [left, right],
      k,
      windowSum,
      maxSum,
      maxRange: [maxStart, maxStart + k - 1],
      explanation: `Shifted window to [${left}..${right}]: subtracted ${outgoing}, added ${incoming} = ${windowSum}.${updated ? ` New maximum found: ${maxSum}!` : ''}`,
      isFinished: false
    });
  }

  steps.push({
    stepIndex: steps.length,
    type: 'SLIDING_WINDOW',
    array: [...arr],
    windowRange: [maxStart, maxStart + k - 1],
    k,
    windowSum: maxSum,
    maxSum,
    maxRange: [maxStart, maxStart + k - 1],
    explanation: `Sliding Window Complete: Maximum sum of size K=${k} is ${maxSum} at window [${maxStart}..${maxStart + k - 1}] [${arr.slice(maxStart, maxStart + k).join(', ')}].`,
    isFinished: true
  });

  return { algorithmId: 'sliding-window', steps };
}

// ==========================================
// 2. TWO POINTERS (TARGET PAIR SUM)
// ==========================================
export function generateTwoPointersTrace(arr = [1, 2, 4, 6, 8, 9, 14, 15], target = 15) {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps = [];
  let left = 0;
  let right = sorted.length - 1;
  let found = false;

  steps.push({
    stepIndex: 0,
    type: 'TWO_POINTERS',
    array: sorted,
    left,
    right,
    target,
    currentSum: sorted[left] + sorted[right],
    foundPair: null,
    explanation: `Two Pointers initialized with Left=0 (${sorted[left]}) and Right=${right} (${sorted[right]}). Target = ${target}.`,
    isFinished: false
  });

  while (left < right) {
    const sum = sorted[left] + sorted[right];

    if (sum === target) {
      found = true;
      steps.push({
        stepIndex: steps.length,
        type: 'TWO_POINTERS',
        array: sorted,
        left,
        right,
        target,
        currentSum: sum,
        foundPair: [sorted[left], sorted[right]],
        explanation: `Target Pair Found: arr[${left}] (${sorted[left]}) + arr[${right}] (${sorted[right]}) = ${target}!`,
        isFinished: true
      });
      break;
    } else if (sum < target) {
      steps.push({
        stepIndex: steps.length,
        type: 'TWO_POINTERS',
        array: sorted,
        left,
        right,
        target,
        currentSum: sum,
        foundPair: null,
        explanation: `Current sum ${sum} < target ${target}: Increment Left pointer to increase sum.`,
        isFinished: false
      });
      left++;
    } else {
      steps.push({
        stepIndex: steps.length,
        type: 'TWO_POINTERS',
        array: sorted,
        left,
        right,
        target,
        currentSum: sum,
        foundPair: null,
        explanation: `Current sum ${sum} > target ${target}: Decrement Right pointer to decrease sum.`,
        isFinished: false
      });
      right--;
    }
  }

  if (!found) {
    steps.push({
      stepIndex: steps.length,
      type: 'TWO_POINTERS',
      array: sorted,
      left,
      right,
      target,
      currentSum: 0,
      foundPair: null,
      explanation: `No two elements in array sum to target ${target}.`,
      isFinished: true
    });
  }

  return { algorithmId: 'two-pointers', steps };
}

// ==========================================
// 3. KMP STRING PATTERN SEARCH (WITH LPS)
// ==========================================
export function generateKmpTrace(text = "ABABDABACDABABCABAB", pattern = "ABABCABAB") {
  const steps = [];
  const M = pattern.length;
  const N = text.length;

  // 1. Build LPS array
  const lps = Array(M).fill(0);
  let len = 0;
  let i = 1;

  steps.push({
    stepIndex: 0,
    type: 'KMP_STRING',
    text,
    pattern,
    lps: [...lps],
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    phase: 'LPS_BUILD',
    explanation: `KMP: Building Longest Proper Prefix which is Suffix (LPS) table for pattern "${pattern}".`,
    isFinished: false
  });

  while (i < M) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    type: 'KMP_STRING',
    text,
    pattern,
    lps: [...lps],
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    phase: 'SEARCH',
    explanation: `LPS Table Computed: [${lps.join(', ')}]. Beginning text scan for pattern match.`,
    isFinished: false
  });

  // 2. Search pattern in text
  let ti = 0; // index for text
  let pi = 0; // index for pattern
  const matchIndices = [];

  while (ti < N) {
    if (pattern[pi] === text[ti]) {
      ti++;
      pi++;
      steps.push({
        stepIndex: steps.length,
        type: 'KMP_STRING',
        text,
        pattern,
        lps: [...lps],
        textIndex: ti,
        patternIndex: pi,
        matches: [...matchIndices],
        phase: 'SEARCH',
        explanation: `Character matched: text[${ti-1}]=='${text[ti-1]}' vs pattern[${pi-1}]. Advanced pointer to ${pi}/${M}.`,
        isFinished: false
      });
    }

    if (pi === M) {
      const matchIdx = ti - pi;
      matchIndices.push(matchIdx);
      steps.push({
        stepIndex: steps.length,
        type: 'KMP_STRING',
        text,
        pattern,
        lps: [...lps],
        textIndex: ti,
        patternIndex: pi,
        matches: [...matchIndices],
        phase: 'MATCH_FOUND',
        explanation: `Full Pattern Match Found at text index ${matchIdx}! Using LPS to skip redundant comparisons.`,
        isFinished: false
      });
      pi = lps[pi - 1];
    } else if (ti < N && pattern[pi] !== text[ti]) {
      if (pi !== 0) {
        const prevPi = pi;
        pi = lps[pi - 1];
        steps.push({
          stepIndex: steps.length,
          type: 'KMP_STRING',
          text,
          pattern,
          lps: [...lps],
          textIndex: ti,
          patternIndex: pi,
          matches: [...matchIndices],
          phase: 'SEARCH',
          explanation: `Mismatch text[${ti}] ('${text[ti]}') ≠ pattern[${prevPi}] ('${pattern[prevPi]}'). Shifted pattern pointer via LPS[${prevPi-1}] = ${pi}.`,
          isFinished: false
        });
      } else {
        ti++;
        steps.push({
          stepIndex: steps.length,
          type: 'KMP_STRING',
          text,
          pattern,
          lps: [...lps],
          textIndex: ti,
          patternIndex: 0,
          matches: [...matchIndices],
          phase: 'SEARCH',
          explanation: `Mismatch at pattern start. Advanced text pointer to ${ti}.`,
          isFinished: false
        });
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    type: 'KMP_STRING',
    text,
    pattern,
    lps: [...lps],
    textIndex: N,
    patternIndex: 0,
    matches: [...matchIndices],
    phase: 'COMPLETE',
    explanation: `KMP String Search Complete: Found ${matchIndices.length} occurrence(s) at indices [${matchIndices.join(', ')}].`,
    isFinished: true
  });

  return { algorithmId: 'kmp-string', steps };
}

// ==========================================
// 4. EUCLIDEAN ALGORITHM (GCD)
// ==========================================
export function generateEuclideanTrace(numA = 252, numB = 105) {
  let a = Math.max(numA, numB);
  let b = Math.min(numA, numB);
  const steps = [];
  const equations = [];

  steps.push({
    stepIndex: 0,
    type: 'EUCLIDEAN_GCD',
    a,
    b,
    q: 0,
    r: 0,
    equations: [],
    gcd: null,
    explanation: `Euclidean Algorithm initialized for GCD(${a}, ${b}). Principle: GCD(a, b) = GCD(b, a mod b).`,
    isFinished: false
  });

  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    equations.push({ a, b, q, r, text: `${a} = ${b} × ${q} + ${r}` });

    steps.push({
      stepIndex: steps.length,
      type: 'EUCLIDEAN_GCD',
      a,
      b,
      q,
      r,
      equations: [...equations],
      gcd: r === 0 ? b : null,
      explanation: `Step: ${a} = ${b} × ${q} + ${r} (Remainder = ${r}). Next: a=${b}, b=${r}.`,
      isFinished: false
    });

    a = b;
    b = r;
  }

  const finalGcd = a;

  steps.push({
    stepIndex: steps.length,
    type: 'EUCLIDEAN_GCD',
    a,
    b: 0,
    q: 0,
    r: 0,
    equations: [...equations],
    gcd: finalGcd,
    explanation: `Euclidean Algorithm Complete: Remainder reached 0. Greatest Common Divisor is GCD(${numA}, ${numB}) = ${finalGcd}.`,
    isFinished: true
  });

  return { algorithmId: 'euclidean-gcd', steps };
}
