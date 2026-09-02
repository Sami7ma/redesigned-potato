// Memory Allocation Algorithms Engine
// Implements First Fit, Best Fit, Worst Fit, and Next Fit with step-by-step trace simulation.

export function initializeMemoryBlocks(holes) {
  let currentBase = 0;
  return holes.map((h, idx) => {
    const block = {
      id: `block-init-${idx}`,
      originalHoleId: h.id || `H${idx + 1}`,
      label: h.label || `H${idx + 1}`,
      base: currentBase,
      limit: currentBase + h.size,
      size: h.size,
      type: 'FREE',
      process: null,
    };
    currentBase += h.size;
    return block;
  });
}

export function allocateProcess(algorithmId, currentBlocks, process, lastScanIndex = 0) {
  const freeBlocks = currentBlocks
    .map((block, index) => ({ block, index }))
    .filter(item => item.block.type === 'FREE');

  let selectedItem = null;
  const scannedHoleIds = [];
  const candidateList = [];
  let nextScanIndex = lastScanIndex;

  if (algorithmId === 'first-fit') {
    for (const item of freeBlocks) {
      scannedHoleIds.push(item.block.label || item.block.originalHoleId);
      if (item.block.size >= process.size) {
        selectedItem = item;
        candidateList.push({ ...item, remainder: item.block.size - process.size });
        break;
      }
    }
  } else if (algorithmId === 'next-fit') {
    // Next Fit starts from lastScanIndex circularly
    const count = freeBlocks.length;
    let found = false;
    for (let i = 0; i < count; i++) {
      const idx = (lastScanIndex + i) % count;
      const item = freeBlocks[idx];
      scannedHoleIds.push(item.block.label || item.block.originalHoleId);
      if (item.block.size >= process.size) {
        selectedItem = item;
        candidateList.push({ ...item, remainder: item.block.size - process.size });
        nextScanIndex = (idx + 1) % count;
        found = true;
        break;
      }
    }
    if (!found) nextScanIndex = lastScanIndex;
  } else if (algorithmId === 'best-fit') {
    let minRemainder = Infinity;
    for (const item of freeBlocks) {
      scannedHoleIds.push(item.block.label || item.block.originalHoleId);
      if (item.block.size >= process.size) {
        const remainder = item.block.size - process.size;
        candidateList.push({ ...item, remainder });
        if (remainder < minRemainder) {
          minRemainder = remainder;
          selectedItem = item;
        }
      }
    }
  } else if (algorithmId === 'worst-fit') {
    let maxRemainder = -1;
    for (const item of freeBlocks) {
      scannedHoleIds.push(item.block.label || item.block.originalHoleId);
      if (item.block.size >= process.size) {
        const remainder = item.block.size - process.size;
        candidateList.push({ ...item, remainder });
        if (remainder > maxRemainder) {
          maxRemainder = remainder;
          selectedItem = item;
        }
      }
    }
  }

  const totalFreeMemory = currentBlocks
    .filter(b => b.type === 'FREE')
    .reduce((sum, b) => sum + b.size, 0);

  const largestFreeHole = currentBlocks
    .filter(b => b.type === 'FREE')
    .reduce((max, b) => Math.max(max, b.size), 0);

  if (!selectedItem) {
    const isExternalFragmentation = totalFreeMemory >= process.size;
    return {
      success: false,
      newBlocks: currentBlocks,
      scannedHoleIds,
      candidateList,
      selectedBlock: null,
      selectedHoleId: null,
      remainderSize: null,
      totalFreeMemory,
      largestFreeHole,
      isExternalFragmentation,
      nextScanIndex,
      explanation: isExternalFragmentation
        ? `Allocation FAILED for ${process.name} (${process.size} KB). Total free memory is ${totalFreeMemory} KB (> ${process.size} KB), but the largest contiguous hole is only ${largestFreeHole} KB. External fragmentation detected.`
        : `Allocation FAILED for ${process.name} (${process.size} KB). Total free memory (${totalFreeMemory} KB) is insufficient for request (${process.size} KB).`,
    };
  }

  const targetBlock = selectedItem.block;
  const targetIndex = selectedItem.index;
  const remainder = targetBlock.size - process.size;

  const allocatedBlock = {
    id: `alloc-${process.id}-${Date.now()}`,
    originalHoleId: targetBlock.originalHoleId,
    label: `${targetBlock.label} (${process.name})`,
    base: targetBlock.base,
    limit: targetBlock.base + process.size,
    size: process.size,
    type: 'ALLOCATED',
    process: {
      id: process.id,
      name: process.name,
      size: process.size,
      color: process.color,
      bgLight: process.bgLight,
      border: process.border,
    },
  };

  let newBlocks = [];
  if (remainder > 0) {
    const remainderBlock = {
      id: `free-${targetBlock.originalHoleId}-rem-${Date.now()}`,
      originalHoleId: targetBlock.originalHoleId,
      label: `${targetBlock.originalHoleId}'`,
      base: targetBlock.base + process.size,
      limit: targetBlock.limit,
      size: remainder,
      type: 'FREE',
      process: null,
    };
    newBlocks = [
      ...currentBlocks.slice(0, targetIndex),
      allocatedBlock,
      remainderBlock,
      ...currentBlocks.slice(targetIndex + 1),
    ];
  } else {
    newBlocks = [
      ...currentBlocks.slice(0, targetIndex),
      allocatedBlock,
      ...currentBlocks.slice(targetIndex + 1),
    ];
  }

  const newTotalFree = newBlocks
    .filter(b => b.type === 'FREE')
    .reduce((sum, b) => sum + b.size, 0);

  const newLargestHole = newBlocks
    .filter(b => b.type === 'FREE')
    .reduce((max, b) => Math.max(max, b.size), 0);

  let explanation = '';
  if (algorithmId === 'first-fit') {
    explanation = `${process.name} (${process.size} KB) scanned [${scannedHoleIds.join(', ')}] and found first fit in ${targetBlock.label} (${targetBlock.size} KB) at [${targetBlock.base} - ${targetBlock.base + process.size} KB]. Remainder is ${remainder} KB.`;
  } else if (algorithmId === 'next-fit') {
    explanation = `${process.name} (${process.size} KB) scanned from previous pointer across [${scannedHoleIds.join(', ')}] and matched ${targetBlock.label} (${targetBlock.size} KB). Remainder is ${remainder} KB.`;
  } else if (algorithmId === 'best-fit') {
    explanation = `${process.name} (${process.size} KB) evaluated candidates [${candidateList.map(c => `${c.block.label}:${c.block.size}KB`).join(', ')}] and chose BEST FIT ${targetBlock.label} (${targetBlock.size} KB), minimizing leftover to ${remainder} KB.`;
  } else if (algorithmId === 'worst-fit') {
    explanation = `${process.name} (${process.size} KB) selected WORST FIT ${targetBlock.label} (${targetBlock.size} KB), the largest available hole, leaving ${remainder} KB.`;
  }

  return {
    success: true,
    newBlocks,
    scannedHoleIds,
    candidateList,
    selectedBlock: targetBlock,
    selectedHoleId: targetBlock.label || targetBlock.originalHoleId,
    remainderSize: remainder,
    totalFreeMemory: newTotalFree,
    largestFreeHole: newLargestHole,
    isExternalFragmentation: false,
    nextScanIndex,
    explanation,
  };
}

export function generateSimulationTrace(algorithmId, initialHoles, processList) {
  let currentBlocks = initializeMemoryBlocks(initialHoles);
  const steps = [];
  let lastScanIndex = 0;

  const processStatuses = processList.map(p => ({
    id: p.id,
    name: p.name,
    size: p.size,
    color: p.color,
    status: 'WAITING',
    allocatedHole: null,
    baseAddress: null,
    limitAddress: null,
    remainder: null,
  }));

  const initialTotalFree = currentBlocks.reduce((sum, b) => sum + b.size, 0);
  const initialLargestHole = currentBlocks.reduce((max, b) => Math.max(max, b.size), 0);

  steps.push({
    stepIndex: 0,
    currentProcess: null,
    processStatuses: JSON.parse(JSON.stringify(processStatuses)),
    memoryBlocks: JSON.parse(JSON.stringify(currentBlocks)),
    scannedHoleIds: [],
    candidateList: [],
    selectedHoleId: null,
    outcome: 'INITIAL',
    success: true,
    totalFreeMemory: initialTotalFree,
    largestFreeHole: initialLargestHole,
    allocatedCount: 0,
    failedCount: 0,
    isExternalFragmentation: false,
    explanation: 'Initial memory configuration ready. Free contiguous holes loaded.',
  });

  let allocatedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < processList.length; i++) {
    const p = processList[i];
    const result = allocateProcess(algorithmId, currentBlocks, p, lastScanIndex);
    lastScanIndex = result.nextScanIndex || 0;

    if (result.success) {
      currentBlocks = result.newBlocks;
      allocatedCount++;
      processStatuses[i].status = 'ALLOCATED';
      processStatuses[i].allocatedHole = result.selectedHoleId;
      processStatuses[i].baseAddress = result.selectedBlock.base;
      processStatuses[i].limitAddress = result.selectedBlock.base + p.size;
      processStatuses[i].remainder = result.remainderSize;
    } else {
      failedCount++;
      processStatuses[i].status = 'FAILED';
      processStatuses[i].failReason = result.isExternalFragmentation
        ? 'External Fragmentation'
        : 'Out of Memory';
    }

    steps.push({
      stepIndex: i + 1,
      currentProcess: p,
      processStatuses: JSON.parse(JSON.stringify(processStatuses)),
      memoryBlocks: JSON.parse(JSON.stringify(currentBlocks)),
      scannedHoleIds: result.scannedHoleIds,
      candidateList: result.candidateList,
      selectedHoleId: result.selectedHoleId,
      outcome: result.success ? 'ALLOCATED' : 'FAILED',
      success: result.success,
      totalFreeMemory: result.totalFreeMemory,
      largestFreeHole: result.largestFreeHole,
      allocatedCount,
      failedCount,
      isExternalFragmentation: result.isExternalFragmentation,
      explanation: result.explanation,
    });
  }

  return {
    algorithmId,
    steps,
    finalStep: steps[steps.length - 1],
    totalProcesses: processList.length,
    allocatedCount,
    failedCount,
    successRate: `${allocatedCount}/${processList.length}`,
    isAllAllocated: allocatedCount === processList.length,
  };
}

export function runAllAlgorithmsComparison(initialHoles, processList) {
  const algorithms = ['first-fit', 'best-fit', 'worst-fit', 'next-fit'];
  const results = {};
  algorithms.forEach(algoId => {
    results[algoId] = generateSimulationTrace(algoId, initialHoles, processList);
  });
  return results;
}
