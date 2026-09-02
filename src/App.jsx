import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  CATEGORIES, 
  ALGORITHMS_REGISTRY, 
  DEFAULT_HOLES, 
  DEFAULT_PROCESSES, 
  DEFAULT_CPU_PROCESSES, 
  DEFAULT_PAGE_REFERENCE, 
  DEFAULT_FRAME_COUNT, 
  DEFAULT_GRID_CONFIG, 
  DEFAULT_SORT_ARRAY, 
  DEFAULT_SEARCH_TARGET,
  DEFAULT_KNAPSACK_ITEMS,
  DEFAULT_KNAPSACK_CAPACITY,
  DEFAULT_LCS_STR1,
  DEFAULT_LCS_STR2,
  DEFAULT_SLIDING_WINDOW_ARRAY,
  DEFAULT_SLIDING_WINDOW_K,
  DEFAULT_TWO_POINTERS_ARRAY,
  DEFAULT_TWO_POINTERS_TARGET,
  DEFAULT_KMP_TEXT,
  DEFAULT_KMP_PATTERN,
  DEFAULT_EUCLIDEAN_A,
  DEFAULT_EUCLIDEAN_B,
  DEFAULT_NQUEENS_N
} from './types/data';

// Trace Generators
import { generateSimulationTrace as generateMemoryTrace } from './algorithms/memoryManager';
import { generateCpuScheduleTrace } from './algorithms/cpuScheduler';
import { generatePageReplacementTrace } from './algorithms/pageReplacement';
import { generateGraphTrace } from './algorithms/graphAlgorithms';
import { generateSortingTrace, generateBinarySearchTrace } from './algorithms/sortingAlgorithms';
import { generateKnapsackTrace, generateLcsTrace, generateKadanesTrace } from './algorithms/dpAlgorithms';
import { generateSlidingWindowTrace, generateTwoPointersTrace, generateKmpTrace, generateEuclideanTrace } from './algorithms/arrayStringAlgorithms';
import { generateNQueensTrace, generateActivitySelectionTrace } from './algorithms/backtrackingGreedyAlgorithms';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MemoryVisualizer from './components/MemoryVisualizer';
import CpuSchedulerVisualizer from './components/CpuSchedulerVisualizer';
import PageReplacementVisualizer from './components/PageReplacementVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import SortingVisualizer from './components/SortingVisualizer';
import MatrixDpVisualizer from './components/MatrixDpVisualizer';
import TreeGraphVisualizer from './components/TreeGraphVisualizer';
import ArrayTechniquesVisualizer from './components/ArrayTechniquesVisualizer';
import NQueensVisualizer from './components/NQueensVisualizer';
import StringSearchVisualizer from './components/StringSearchVisualizer';
import MathGeometryVisualizer from './components/MathGeometryVisualizer';

import MetricsPanel from './components/MetricsPanel';
import LiveNarrator from './components/LiveNarrator';
import ComparisonView from './components/ComparisonView';
import TheoryModal from './components/TheoryModal';
import CustomDataModal from './components/CustomDataModal';

// URL Route to Category / Algorithm Mapping for SEO & Deep Linking
const ROUTE_MAP = {
  '/algorithms/operating-systems': { category: 'OS', algo: 'first-fit' },
  '/algorithms/memory-allocation': { category: 'OS', algo: 'first-fit' },
  '/algorithms/cpu-scheduling': { category: 'OS', algo: 'round-robin' },
  '/algorithms/page-replacement': { category: 'OS', algo: 'lru' },
  '/algorithms/graphs': { category: 'GRAPH', algo: 'bfs' },
  '/algorithms/sorting': { category: 'SORT_SEARCH', algo: 'quick-sort' },
  '/algorithms/searching': { category: 'SORT_SEARCH', algo: 'binary-search' },
  '/algorithms/dynamic-programming': { category: 'DP', algo: 'knapsack-dp' },
  '/algorithms/array-strings': { category: 'ARRAY_STRING', algo: 'sliding-window' },
  '/algorithms/backtracking': { category: 'BACKTRACKING_GREEDY', algo: 'n-queens' },
};

const CATEGORY_TO_PATH = {
  OS: '/algorithms/operating-systems',
  GRAPH: '/algorithms/graphs',
  SORT_SEARCH: '/algorithms/sorting',
  DP: '/algorithms/dynamic-programming',
  ARRAY_STRING: '/algorithms/array-strings',
  BACKTRACKING_GREEDY: '/algorithms/backtracking',
};

const getPathForAlgo = (cat, algoId) => {
  if (cat === 'OS') {
    if (['first-fit', 'best-fit', 'worst-fit', 'next-fit'].includes(algoId)) return '/algorithms/memory-allocation';
    if (['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'].includes(algoId)) return '/algorithms/cpu-scheduling';
    if (['lru', 'fifo-paging', 'optimal-paging'].includes(algoId)) return '/algorithms/page-replacement';
  }
  if (cat === 'SORT_SEARCH' && algoId === 'binary-search') return '/algorithms/searching';
  return CATEGORY_TO_PATH[cat] || '/';
};

export default function App() {
  // Theme & Navigation State (Woody Champagne Gold & Obsidian Dark Glass)
  const [theme, setTheme] = useState('woody-gold');
  
  // Initial Route Check
  const initialRoute = ROUTE_MAP[typeof window !== 'undefined' ? window.location.pathname : ''] || { category: 'OS', algo: 'first-fit' };
  const [category, setCategory] = useState(initialRoute.category);
  const [selectedAlgo, setSelectedAlgo] = useState(initialRoute.algo);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme attribute to HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Synchronize URL path and document title on navigation
  useEffect(() => {
    const targetPath = getPathForAlgo(category, selectedAlgo);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ category, selectedAlgo }, '', targetPath);
    }
    const algoName = ALGORITHMS_REGISTRY[selectedAlgo]?.name || 'Algorithm';
    document.title = `${algoName} Visualizer — AlgoLab`;
  }, [category, selectedAlgo]);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = ROUTE_MAP[window.location.pathname];
      if (route) {
        setCategory(route.category);
        setSelectedAlgo(route.algo);
        setCurrentStepIndex(0);
        setIsRunning(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Category Switching
  const handleSelectCategory = (newCat) => {
    setCategory(newCat);
    const firstSub = CATEGORIES[newCat]?.subcategories[0];
    if (firstSub) {
      setSelectedAlgo(firstSub.defaultAlgo);
    }
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Handle Algorithm Switching
  const handleSelectAlgo = (newAlgo) => {
    setSelectedAlgo(newAlgo);
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Compute Active Simulation Trace (Pure Deterministic Trace Engine)
  const activeTrace = useMemo(() => {
    // 1. Operating Systems
    if (category === 'OS') {
      if (['first-fit', 'best-fit', 'worst-fit', 'next-fit'].includes(selectedAlgo)) {
        return generateMemoryTrace(selectedAlgo, holes, processes);
      }
      if (['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'].includes(selectedAlgo)) {
        return generateCpuScheduleTrace(selectedAlgo, cpuProcesses);
      }
      if (['lru', 'fifo-paging', 'optimal-paging'].includes(selectedAlgo)) {
        return generatePageReplacementTrace(selectedAlgo, referenceString, frameCount);
      }
    }

    // 2. Graph & Pathfinding
    if (category === 'GRAPH') {
      return generateGraphTrace(selectedAlgo, gridConfig);
    }

    // 3. Sorting & Searching
    if (category === 'SORT_SEARCH') {
      if (selectedAlgo === 'binary-search') {
        return generateBinarySearchTrace(sortArray, searchTarget);
      }
      return generateSortingTrace(selectedAlgo, sortArray);
    }

    // 4. Dynamic Programming
    if (category === 'DP') {
      if (selectedAlgo === 'knapsack-dp') return generateKnapsackTrace(knapsackItems, knapsackCapacity);
      if (selectedAlgo === 'lcs-dp') return generateLcsTrace(lcsStr1, lcsStr2);
      if (selectedAlgo === 'kadanes') return generateKadanesTrace(sortArray);
    }

    // 5. Array & String Techniques
    if (category === 'ARRAY_STRING') {
      if (selectedAlgo === 'sliding-window') return generateSlidingWindowTrace(slidingArr, slidingK);
      if (selectedAlgo === 'two-pointers') return generateTwoPointersTrace(twoPointersArr, twoPointersTarget);
      if (selectedAlgo === 'kmp-string') return generateKmpTrace(kmpText, kmpPattern);
      if (selectedAlgo === 'euclidean-gcd') return generateEuclideanTrace(euclideanA, euclideanB);
    }

    // 6. Backtracking & Greedy
    if (category === 'BACKTRACKING_GREEDY') {
      if (selectedAlgo === 'n-queens') return generateNQueensTrace(nQueensN);
      if (selectedAlgo === 'activity-selection') return generateActivitySelectionTrace();
    }

    return { algorithmId: selectedAlgo, steps: [] };
  }, [
    category, selectedAlgo, holes, processes, cpuProcesses, referenceString, frameCount,
    gridConfig, sortArray, searchTarget, knapsackItems, knapsackCapacity, lcsStr1, lcsStr2,
    slidingArr, slidingK, twoPointersArr, twoPointersTarget, kmpText, kmpPattern, euclideanA, euclideanB, nQueensN
  ]);

  const steps = activeTrace.steps || [];
  const totalSteps = Math.max(steps.length - 1, 0);
  const currentStepData = steps[currentStepIndex] || steps[0] || null;
  const isFinished = currentStepIndex >= totalSteps && totalSteps > 0;

  // Confetti on simulation finish
  useEffect(() => {
    if (isFinished && !isRunning && totalSteps > 2) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (e) {}
    }
  }, [isFinished, isRunning, totalSteps]);

  // Simulation Timer Interval
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      const delay = Math.max(800 / speed, 50);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < totalSteps) {
            return prev + 1;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed, totalSteps]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore inside inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (currentStepIndex < totalSteps && !isRunning) {
          setCurrentStepIndex(prev => prev + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (currentStepIndex > 0 && !isRunning) {
          setCurrentStepIndex(prev => prev - 1);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setCurrentStepIndex(0);
        setIsRunning(false);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowComparison(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowComparison(false);
        setShowTheory(false);
        setShowCustomData(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps, isRunning]);

  // Randomize active dataset
  const handleRandomizeActiveData = () => {
    if (category === 'SORT_SEARCH') {
      const randArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 10);
      setSortArray(randArr);
      setSearchTarget(randArr[Math.floor(Math.random() * randArr.length)]);
    } else if (category === 'GRAPH') {
      const newWalls = [];
      for (let r = 0; r < gridConfig.rows; r++) {
        for (let c = 0; c < gridConfig.cols; c++) {
          if (Math.random() < 0.22 && !(r === gridConfig.start.r && c === gridConfig.start.c) && !(r === gridConfig.target.r && c === gridConfig.target.c)) {
            newWalls.push({ r, c });
          }
        }
      }
      setGridConfig({ ...gridConfig, walls: newWalls });
    }
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Graph Cell Placement Tool
  const handleGraphCellClick = (r, c, editMode) => {
    if (editMode === 'start') {
      setGridConfig({ ...gridConfig, start: { r, c }, walls: gridConfig.walls.filter(w => !(w.r === r && w.c === c)) });
    } else if (editMode === 'target') {
      setGridConfig({ ...gridConfig, target: { r, c }, walls: gridConfig.walls.filter(w => !(w.r === r && w.c === c)) });
    } else if (editMode === 'wall') {
      const exists = gridConfig.walls.some(w => w.r === r && w.c === c);
      if (exists) {
        setGridConfig({ ...gridConfig, walls: gridConfig.walls.filter(w => !(w.r === r && w.c === c)) });
      } else {
        if (!(r === gridConfig.start.r && c === gridConfig.start.c) && !(r === gridConfig.target.r && c === gridConfig.target.c)) {
          setGridConfig({ ...gridConfig, walls: [...gridConfig.walls, { r, c }] });
        }
      }
    }
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  return (
    <div className="app-wrapper">
      {/* Header Bar */}
      <Header
        theme={theme}
        setTheme={setTheme}
        onOpenComparison={() => setShowComparison(true)}
        onOpenTheory={() => setShowTheory(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main 2-Column Responsive Layout */}
      <div className="app-layout">
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Sidebar Controls */}
        <Sidebar
          selectedCategory={category}
          onSelectCategory={handleSelectCategory}
          selectedAlgo={selectedAlgo}
          onSelectAlgo={handleSelectAlgo}
          isRunning={isRunning}
          onTogglePlay={() => setIsRunning(!isRunning)}
          onStepForward={() => currentStepIndex < totalSteps && setCurrentStepIndex(c => c + 1)}
          onStepBackward={() => currentStepIndex > 0 && setCurrentStepIndex(c => c - 1)}
          onReset={() => { setCurrentStepIndex(0); setIsRunning(false); }}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          speed={speed}
          setSpeed={setSpeed}
          canStepForward={currentStepIndex < totalSteps}
          canStepBackward={currentStepIndex > 0}
          onOpenCustomData={() => setShowCustomData(true)}
          onRandomizeData={handleRandomizeActiveData}
          isOpenOnMobile={isMobileMenuOpen}
        />

        {/* Visualizer & Analytics Canvas */}
        <main className="app-main">
          {/* 1. OS Memory Visualizer */}
          {category === 'OS' && ['first-fit', 'best-fit', 'worst-fit', 'next-fit'].includes(selectedAlgo) && currentStepData && (
            <MemoryVisualizer
              memoryBlocks={currentStepData.memoryBlocks}
              totalMemorySize={currentStepData.totalMemorySize}
              scannedHoleIds={currentStepData.scannedHoleIds}
              selectedHoleId={currentStepData.selectedHoleId}
              currentProcess={currentStepData.currentProcess}
            />
          )}

          {/* 2. OS CPU Scheduler Visualizer */}
          {category === 'OS' && ['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'].includes(selectedAlgo) && currentStepData && (
            <CpuSchedulerVisualizer
              ganttChart={currentStepData.ganttChart}
              readyQueue={currentStepData.readyQueue}
              runningProcess={currentStepData.runningProcess}
              currentTime={currentStepData.currentTime}
              completedProcesses={currentStepData.completedProcesses}
              allProcesses={cpuProcesses}
            />
          )}

          {/* 3. OS Page Replacement Visualizer */}
          {category === 'OS' && ['lru', 'fifo-paging', 'optimal-paging'].includes(selectedAlgo) && currentStepData && (
            <PageReplacementVisualizer
              referenceString={referenceString}
              currentStepIndex={currentStepIndex}
              frames={currentStepData.frames}
              isFault={currentStepData.isFault}
              isHit={currentStepData.isHit}
              replacedPage={currentStepData.replacedPage}
              currentPage={currentStepData.currentPage}
              pageFaults={currentStepData.pageFaults}
              pageHits={currentStepData.pageHits}
              hitRatio={currentStepData.hitRatio}
            />
          )}

          {/* 4. Graph Visualizer (Grid BFS, DFS, Dijkstra, A*) */}
          {category === 'GRAPH' && ['bfs', 'dfs', 'dijkstra', 'a-star'].includes(selectedAlgo) && currentStepData && (
            <GraphVisualizer
              gridConfig={gridConfig}
              currentCell={currentStepData.currentCell}
              visitedCells={currentStepData.visitedCells}
              frontierCells={currentStepData.frontierCells}
              pathCells={currentStepData.pathCells}
              targetFound={currentStepData.targetFound}
              onCellClick={handleGraphCellClick}
              onGenerateMaze={handleRandomizeActiveData}
              onClearWalls={() => { setGridConfig({ ...gridConfig, walls: [] }); setCurrentStepIndex(0); }}
              isFinished={isFinished}
            />
          )}

          {/* 5. Matrix DP Visualizer (Floyd-Warshall, 0/1 Knapsack, LCS) */}
          {(selectedAlgo === 'floyd-warshall' || selectedAlgo === 'knapsack-dp' || selectedAlgo === 'lcs-dp') && currentStepData && (
            <MatrixDpVisualizer
              algorithmId={selectedAlgo}
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* 6. Tree / Graph Node Visualizer (Kruskal, Prim, TopoSort, DSU) */}
          {category === 'GRAPH' && ['kruskal', 'prim', 'topological-sort', 'union-find'].includes(selectedAlgo) && currentStepData && (
            <TreeGraphVisualizer
              algorithmId={selectedAlgo}
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* 7. Sorting & Searching Visualizer */}
          {category === 'SORT_SEARCH' && currentStepData && (
            <SortingVisualizer
              algorithmId={selectedAlgo}
              array={currentStepData.array}
              highlightIndices={currentStepData.highlightIndices}
              pivotIndex={currentStepData.pivotIndex}
              sortedIndices={currentStepData.sortedIndices}
              comparisons={currentStepData.comparisons}
              swaps={currentStepData.swaps}
              low={currentStepData.low}
              high={currentStepData.high}
              mid={currentStepData.mid}
              target={searchTarget}
              found={currentStepData.found}
              isFinished={isFinished}
            />
          )}

          {/* 8. Array Techniques Visualizer (Sliding Window, Two Pointers, Kadanes) */}
          {(selectedAlgo === 'sliding-window' || selectedAlgo === 'two-pointers' || selectedAlgo === 'kadanes') && currentStepData && (
            <ArrayTechniquesVisualizer
              algorithmId={selectedAlgo}
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* 9. N-Queens Visualizer */}
          {selectedAlgo === 'n-queens' && currentStepData && (
            <NQueensVisualizer
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* 10. String Search Visualizer (KMP) */}
          {selectedAlgo === 'kmp-string' && currentStepData && (
            <StringSearchVisualizer
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* 11. Math Geometry Visualizer (Euclidean GCD) */}
          {selectedAlgo === 'euclidean-gcd' && currentStepData && (
            <MathGeometryVisualizer
              currentStepData={currentStepData}
              isFinished={isFinished}
            />
          )}

          {/* Interactive Workbench Ribbon Bar (Yellow Highlight Area) */}
          <div className="workbench-ribbon-bar">
            <div className="ribbon-left">
              <span className="ribbon-breadcrumb">
                <strong>{CATEGORIES[category]?.name}</strong> &rsaquo; {ALGORITHMS_REGISTRY[selectedAlgo]?.name}
              </span>
              <span className="complexity-badge">{ALGORITHMS_REGISTRY[selectedAlgo]?.timeComplexity}</span>
              <span className="complexity-badge" style={{ opacity: 0.85 }}>{ALGORITHMS_REGISTRY[selectedAlgo]?.spaceComplexity}</span>
            </div>

            <div className="ribbon-center">
              <input
                type="range"
                className="ribbon-scrubber"
                min={0}
                max={totalSteps}
                value={currentStepIndex}
                onChange={(e) => {
                  setCurrentStepIndex(Number(e.target.value));
                  setIsRunning(false);
                }}
                title="Drag to scrub timeline"
              />
              <span className="ribbon-step-tag">
                Step {currentStepIndex} / {totalSteps}
              </span>
            </div>

            <div className="ribbon-right">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => currentStepIndex > 0 && setCurrentStepIndex(c => c - 1)}
                disabled={currentStepIndex === 0 || isRunning}
                title="Step Backward"
              >
                Back
              </button>
              <button
                className={`btn btn-sm ${isRunning ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => setIsRunning(!isRunning)}
                disabled={totalSteps === 0}
              >
                {isRunning ? 'Pause' : 'Play'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => currentStepIndex < totalSteps && setCurrentStepIndex(c => c + 1)}
                disabled={currentStepIndex >= totalSteps || isRunning}
                title="Step Forward"
              >
                Step
              </button>
            </div>
          </div>

          {/* Analytics Instrument Panel (MetricsPanel + LiveNarrator) */}
          <div className="analytics-grid">
            <MetricsPanel
              category={category}
              algorithmId={selectedAlgo}
              currentStepData={currentStepData}
              totalSteps={totalSteps}
              isFinished={isFinished}
              algorithmName={ALGORITHMS_REGISTRY[selectedAlgo]?.name || selectedAlgo}
            />

            <LiveNarrator
              selectedAlgo={selectedAlgo}
              currentStepData={currentStepData}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <CustomDataModal
        isOpen={showCustomData}
        onClose={() => setShowCustomData(false)}
        category={category}
        holes={holes}
        processes={processes}
        cpuProcesses={cpuProcesses}
        referenceString={referenceString}
        frameCount={frameCount}
        gridConfig={gridConfig}
        sortArray={sortArray}
        searchTarget={searchTarget}
        knapsackItems={knapsackItems}
        knapsackCapacity={knapsackCapacity}
        lcsStr1={lcsStr1}
        lcsStr2={lcsStr2}
        slidingArr={slidingArr}
        slidingK={slidingK}
        twoPointersArr={twoPointersArr}
        twoPointersTarget={twoPointersTarget}
        kmpText={kmpText}
        kmpPattern={kmpPattern}
        euclideanA={euclideanA}
        euclideanB={euclideanB}
        nQueensN={nQueensN}
        onSaveMemory={(h, p) => { setHoles(h); setProcesses(p); }}
        onSaveCpu={(p) => setCpuProcesses(p)}
        onSavePaging={(ref, f) => { setReferenceString(ref); setFrameCount(f); }}
        onSaveGraph={(g) => setGridConfig(g)}
        onSaveSorting={(arr, t) => { setSortArray(arr); setSearchTarget(t); }}
        onSaveKnapsack={(it, c) => { setKnapsackItems(it); setKnapsackCapacity(c); }}
        onSaveLcs={(s1, s2) => { setLcsStr1(s1); setLcsStr2(s2); }}
        onSaveSlidingWindow={(arr, k) => { setSlidingArr(arr); setSlidingK(k); }}
        onSaveTwoPointers={(arr, t) => { setTwoPointersArr(arr); setTwoPointersTarget(t); }}
        onSaveKmp={(t, p) => { setKmpText(t); setKmpPattern(p); }}
        onSaveEuclidean={(a, b) => { setEuclideanA(a); setEuclideanB(b); }}
        onSaveNQueens={(n) => setNQueensN(n)}
      />

      <ComparisonView
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        category={category}
        onSelectAlgorithm={handleSelectAlgo}
        holes={holes}
        processes={processes}
        cpuProcesses={cpuProcesses}
        referenceString={referenceString}
        frameCount={frameCount}
        gridConfig={gridConfig}
        sortArray={sortArray}
        knapsackItems={knapsackItems}
        knapsackCapacity={knapsackCapacity}
      />

      <TheoryModal
        isOpen={showTheory}
        onClose={() => setShowTheory(false)}
      />
    </div>
  );
}
