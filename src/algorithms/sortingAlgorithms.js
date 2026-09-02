// Sorting & Searching Algorithm Engine
// Implements QuickSort, MergeSort, BubbleSort, and Binary Search with step-by-step array traces.

export function generateSortingTrace(algorithmId, initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;

  // Step 0: Initial Array
  steps.push({
    stepIndex: 0,
    array: [...arr],
    highlightIndices: [],
    pivotIndex: -1,
    sortedIndices: [],
    comparisons: 0,
    swaps: 0,
    explanation: `Initial array loaded (${arr.length} elements): [${arr.join(', ')}].`,
    isFinished: false,
  });

  if (algorithmId === 'bubblesort') {
    const n = arr.length;
    const sorted = [];

    for (let i = 0; i < n; i++) {
      let swappedInPass = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        const isSwapping = arr[j] > arr[j + 1];

        steps.push({
          stepIndex: steps.length,
          array: [...arr],
          highlightIndices: [j, j + 1],
          pivotIndex: -1,
          sortedIndices: [...sorted],
          comparisons,
          swaps,
          explanation: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${isSwapping ? 'Out of order -> Swapping!' : 'In correct order.'}`,
          isFinished: false,
        });

        if (isSwapping) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          swappedInPass = true;

          steps.push({
            stepIndex: steps.length,
            array: [...arr],
            highlightIndices: [j, j + 1],
            pivotIndex: -1,
            sortedIndices: [...sorted],
            comparisons,
            swaps,
            explanation: `Swapped: [${arr.join(', ')}].`,
            isFinished: false,
          });
        }
      }
      sorted.push(n - i - 1);
      if (!swappedInPass) break;
    }

    steps.push({
      stepIndex: steps.length,
      array: [...arr],
      highlightIndices: [],
      pivotIndex: -1,
      sortedIndices: arr.map((_, idx) => idx),
      comparisons,
      swaps,
      explanation: `Bubble Sort Complete! Array fully sorted in ${comparisons} comparisons and ${swaps} swaps.`,
      isFinished: true,
    });
  } else if (algorithmId === 'quicksort') {
    const sorted = new Set();

    function partition(low, high) {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        stepIndex: steps.length,
        array: [...arr],
        highlightIndices: [low, high],
        pivotIndex: high,
        sortedIndices: Array.from(sorted),
        comparisons,
        swaps,
        explanation: `Partitioning sub-array [${low}..${high}] with Pivot = ${pivot} (index ${high}).`,
        isFinished: false,
      });

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          stepIndex: steps.length,
          array: [...arr],
          highlightIndices: [j, high],
          pivotIndex: high,
          sortedIndices: Array.from(sorted),
          comparisons,
          swaps,
          explanation: `Checking arr[${j}] (${arr[j]}) against Pivot (${pivot}).`,
          isFinished: false,
        });

        if (arr[j] < pivot) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            swaps++;

            steps.push({
              stepIndex: steps.length,
              array: [...arr],
              highlightIndices: [i, j],
              pivotIndex: high,
              sortedIndices: Array.from(sorted),
              comparisons,
              swaps,
              explanation: `Swapped arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]}).`,
              isFinished: false,
            });
          }
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      swaps++;
      sorted.add(i + 1);

      steps.push({
        stepIndex: steps.length,
        array: [...arr],
        highlightIndices: [i + 1],
        pivotIndex: i + 1,
        sortedIndices: Array.from(sorted),
        comparisons,
        swaps,
        explanation: `Pivot ${pivot} placed at final sorted position index ${i + 1}.`,
        isFinished: false,
      });

      return i + 1;
    }

    function quickSortHelper(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      } else if (low === high) {
        sorted.add(low);
      }
    }

    quickSortHelper(0, arr.length - 1);

    steps.push({
      stepIndex: steps.length,
      array: [...arr],
      highlightIndices: [],
      pivotIndex: -1,
      sortedIndices: arr.map((_, idx) => idx),
      comparisons,
      swaps,
      explanation: `QuickSort Complete! Array sorted in ${comparisons} comparisons and ${swaps} swaps.`,
      isFinished: true,
    });
  } else if (algorithmId === 'mergesort') {
    function merge(start, mid, end) {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
          swaps++;
        }
        k++;
        steps.push({
          stepIndex: steps.length,
          array: [...arr],
          highlightIndices: [k - 1],
          pivotIndex: -1,
          sortedIndices: [],
          comparisons,
          swaps,
          explanation: `Merging sub-arrays [${start}..${mid}] and [${mid + 1}..${end}].`,
          isFinished: false,
        });
      }

      while (i < left.length) {
        arr[k] = left[i];
        i++;
        k++;
      }
      while (j < right.length) {
        arr[k] = right[j];
        j++;
        k++;
      }
    }

    function mergeSortHelper(start, end) {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      mergeSortHelper(start, mid);
      mergeSortHelper(mid + 1, end);
      merge(start, mid, end);
    }

    mergeSortHelper(0, arr.length - 1);

    steps.push({
      stepIndex: steps.length,
      array: [...arr],
      highlightIndices: [],
      pivotIndex: -1,
      sortedIndices: arr.map((_, idx) => idx),
      comparisons,
      swaps,
      explanation: `Merge Sort Complete! Sorted in ${comparisons} comparisons.`,
      isFinished: true,
    });
  }

  return {
    algorithmId,
    steps,
    totalSteps: steps.length - 1,
    finalStep: steps[steps.length - 1],
    comparisons,
    swaps,
  };
}

export function generateBinarySearchTrace(sortedArray, targetValue) {
  // Ensure array is sorted for binary search
  const arr = [...sortedArray].sort((a, b) => a - b);
  const steps = [];
  let low = 0;
  let high = arr.length - 1;
  let foundIndex = -1;
  let iterations = 0;

  // Step 0
  steps.push({
    stepIndex: 0,
    array: [...arr],
    low,
    high,
    mid: Math.floor((low + high) / 2),
    target: targetValue,
    found: false,
    explanation: `Searching for Target = ${targetValue} across sorted range [index 0 to ${high}].`,
    isFinished: false,
  });

  while (low <= high) {
    iterations++;
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    if (midVal === targetValue) {
      foundIndex = mid;
      steps.push({
        stepIndex: steps.length,
        array: [...arr],
        low,
        high,
        mid,
        target: targetValue,
        found: true,
        explanation: `Target Found! 🎯 arr[${mid}] === ${targetValue} in ${iterations} iteration(s).`,
        isFinished: true,
      });
      break;
    } else if (midVal < targetValue) {
      steps.push({
        stepIndex: steps.length,
        array: [...arr],
        low,
        high,
        mid,
        target: targetValue,
        found: false,
        explanation: `arr[${mid}] (${midVal}) < Target (${targetValue}). Discarding left half; updating low = ${mid + 1}.`,
        isFinished: false,
      });
      low = mid + 1;
    } else {
      steps.push({
        stepIndex: steps.length,
        array: [...arr],
        low,
        high,
        mid,
        target: targetValue,
        found: false,
        explanation: `arr[${mid}] (${midVal}) > Target (${targetValue}). Discarding right half; updating high = ${mid - 1}.`,
        isFinished: false,
      });
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      stepIndex: steps.length,
      array: [...arr],
      low,
      high,
      mid: -1,
      target: targetValue,
      found: false,
      explanation: `Target ${targetValue} was not found in the array.`,
      isFinished: true,
    });
  }

  return {
    algorithmId: 'binary-search',
    steps,
    totalSteps: steps.length - 1,
    finalStep: steps[steps.length - 1],
    target: targetValue,
    found: foundIndex !== -1,
    foundIndex,
    iterations,
  };
}
