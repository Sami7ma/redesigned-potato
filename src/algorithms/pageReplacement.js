// Page Replacement Algorithm Engine
// Implements LRU, FIFO, and Optimal algorithms with full frames trace.

export function generatePageReplacementTrace(algorithmId, referenceString, frameCount = 3) {
  const steps = [];
  const frames = Array(frameCount).fill(null);
  let pageFaults = 0;
  let pageHits = 0;
  const history = []; // for LRU (tracks last used time)
  const fifoQueue = []; // for FIFO

  // Step 0
  steps.push({
    stepIndex: 0,
    currentPage: null,
    frames: [...frames],
    isFault: false,
    pageFaults: 0,
    pageHits: 0,
    hitRatio: 0,
    explanation: `Initial state: ${frameCount} empty memory page frames.`,
    isFinished: false,
  });

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);
    let replacedPage = null;

    if (isHit) {
      pageHits++;
      if (algorithmId === 'lru') {
        const hIdx = history.indexOf(page);
        if (hIdx > -1) history.splice(hIdx, 1);
        history.push(page);
      }
    } else {
      pageFaults++;
      const emptySlotIdx = frames.indexOf(null);

      if (emptySlotIdx !== -1) {
        // Empty slot exists
        frames[emptySlotIdx] = page;
        if (algorithmId === 'lru') history.push(page);
        if (algorithmId === 'fifo-paging') fifoQueue.push(page);
      } else {
        // Replacement needed
        let replaceIndex = 0;

        if (algorithmId === 'fifo-paging') {
          const oldestPage = fifoQueue.shift();
          replaceIndex = frames.indexOf(oldestPage);
          replacedPage = oldestPage;
          frames[replaceIndex] = page;
          fifoQueue.push(page);
        } else if (algorithmId === 'lru') {
          const lruPage = history.shift();
          replaceIndex = frames.indexOf(lruPage);
          replacedPage = lruPage;
          frames[replaceIndex] = page;
          history.push(page);
        } else if (algorithmId === 'optimal-paging') {
          // Find page in frames with furthest next occurrence
          let furthest = -1;
          let victimFrame = 0;

          for (let f = 0; f < frames.length; f++) {
            const p = frames[f];
            const nextUse = referenceString.slice(i + 1).indexOf(p);
            if (nextUse === -1) {
              victimFrame = f;
              break;
            } else if (nextUse > furthest) {
              furthest = nextUse;
              victimFrame = f;
            }
          }

          replacedPage = frames[victimFrame];
          frames[victimFrame] = page;
        }
      }
    }

    const hitRatio = Math.round((pageHits / (i + 1)) * 100);

    let explanation = '';
    if (isHit) {
      explanation = `Page ${page} referenced: Page HIT! ✅ Already present in physical memory frames.`;
    } else if (replacedPage !== null) {
      explanation = `Page ${page} referenced: Page FAULT! ⚠️ Replaced victim page ${replacedPage} using ${algorithmId.toUpperCase()}.`;
    } else {
      explanation = `Page ${page} referenced: Page FAULT! ⚠️ Loaded into empty frame slot.`;
    }

    steps.push({
      stepIndex: i + 1,
      currentPage: page,
      frames: [...frames],
      isFault: !isHit,
      isHit,
      replacedPage,
      pageFaults,
      pageHits,
      hitRatio,
      totalReferences: i + 1,
      explanation,
      isFinished: i === referenceString.length - 1,
    });
  }

  return {
    algorithmId,
    steps,
    totalSteps: steps.length - 1,
    finalStep: steps[steps.length - 1],
    referenceString,
    frameCount,
    pageFaults,
    pageHits,
    hitRatio: Math.round((pageHits / referenceString.length) * 100),
  };
}
