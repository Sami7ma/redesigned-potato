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
  DEFAULT_SEARCH_TARGET
} from './types/data';

import { generateSimulationTrace as generateMemoryTrace } from './algorithms/memoryManager';
import { generateCpuScheduleTrace } from './algorithms/cpuScheduler';
import { generatePageReplacementTrace } from './algorithms/pageReplacement';
import { generateGraphTrace } from './algorithms/graphAlgorithms';
import { generateSortingTrace, generateBinarySearchTrace } from './algorithms/sortingAlgorithms';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MemoryVisualizer from './components/MemoryVisualizer';
import CpuSchedulerVisualizer from './components/CpuSchedulerVisualizer';
import PageReplacementVisualizer from './components/PageReplacementVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import SortingVisualizer from './components/SortingVisualizer';
import MetricsPanel from './components/MetricsPanel';
import LiveNarrator from './components/LiveNarrator';
import ComparisonView from './components/ComparisonView';
import TheoryModal from './components/TheoryModal';
import CustomDataModal from './components/CustomDataModal';

export default function App() {
  // Theme & Navigation State
  const [theme, setTheme] = useState('light');
  const [category, setCategory] = useState('OS'); // OS, GRAPH, SORT_SEARCH
  const [selectedAlgo, setSelectedAlgo] = useState('first-fit');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Playback State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Modals
  const [showComparison, setShowComparison] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [showCustomData, setShowCustomData] = useState(false);

  // Datasets for all algorithms
  const [holes, setHoles] = useState(DEFAULT_HOLES);
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [cpuProcesses, setCpuProcesses] = useState(DEFAULT_CPU_PROCESSES);
  const [referenceString, setReferenceString] = useState(DEFAULT_PAGE_REFERENCE);
  const [frameCount, setFrameCount] = useState(DEFAULT_FRAME_COUNT);
  const [gridConfig, setGridConfig] = useState(DEFAULT_GRID_CONFIG);
  const [sortArray, setSortArray] = useState(DEFAULT_SORT_ARRAY);
  const [searchTarget, setSearchTarget] = useState(DEFAULT_SEARCH_TARGET);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
  const handleSelectAlgo = (algoId) => {
    setSelectedAlgo(algoId);
    setCurrentStepIndex(0);
    setIsRunning(false);
    setIsMobileMenuOpen(false);
  };

  // Generate Active Simulation Trace
  const trace = useMemo(() => {
    if (category === 'OS') {
      if (['first-fit', 'best-fit', 'worst-fit', 'next-fit'].includes(selectedAlgo)) {
        return generateMemoryTrace(selectedAlgo, holes, processes);
      } else if (['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'].includes(selectedAlgo)) {
        return generateCpuScheduleTrace(selectedAlgo, cpuProcesses, 2);
      } else if (['lru', 'fifo-paging', 'optimal-paging'].includes(selectedAlgo)) {
        return generatePageReplacementTrace(selectedAlgo, referenceString, frameCount);
      }
    } else if (category === 'GRAPH') {
      return generateGraphTrace(selectedAlgo, gridConfig);
    } else if (category === 'SORT_SEARCH') {
      if (selectedAlgo === 'binary-search') {
        return generateBinarySearchTrace(sortArray, searchTarget);
      } else {
        return generateSortingTrace(selectedAlgo, sortArray);
      }
    }
    return generateMemoryTrace('first-fit', holes, processes);
  }, [category, selectedAlgo, holes, processes, cpuProcesses, referenceString, frameCount, gridConfig, sortArray, searchTarget]);

  const totalSteps = (trace.steps?.length || 1) - 1;
  const currentStepData = trace.steps ? (trace.steps[currentStepIndex] || trace.steps[0]) : null;
  const isFinished = currentStepIndex >= totalSteps;

  // Playback Handlers
  const handleStepForward = () => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (isFinished) {
      setCurrentStepIndex(0);
      setIsRunning(true);
    } else {
      setIsRunning(prev => !prev);
    }
  };

  // Auto-run Timer Effect
  useEffect(() => {
    let timer = null;
    if (isRunning) {
      if (currentStepIndex >= totalSteps) {
        setIsRunning(false);
      } else {
        const intervalTime = Math.round(900 / speed);
        timer = setTimeout(() => {
          handleStepForward();
        }, intervalTime);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStepIndex, totalSteps, speed]);

  // Celebration particle animation
  useEffect(() => {
    if (isFinished && (currentStepData?.allocatedCount === processes.length || currentStepData?.targetFound || currentStepData?.found)) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isFinished]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'c' || e.key === 'C') {
        setShowComparison(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowComparison(false);
        setShowTheory(false);
        setShowCustomData(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, currentStepIndex, totalSteps, isFinished]);

  // Randomize Data Generator
  const handleRandomizeData = () => {
    if (category === 'SORT_SEARCH') {
      const randomArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
      setSortArray(randomArr);
      setSearchTarget(randomArr[Math.floor(Math.random() * randomArr.length)]);
    } else if (category === 'OS' && (selectedAlgo.includes('paging') || selectedAlgo === 'lru')) {
      const randomPages = Array.from({ length: 18 }, () => Math.floor(Math.random() * 8));
      setReferenceString(randomPages);
    } else if (category === 'OS' && selectedAlgo.includes('cpu')) {
      const randomCpu = cpuProcesses.map((p, i) => ({
        ...p,
        arrival: i,
        burst: Math.floor(Math.random() * 8) + 2,
        priority: Math.floor(Math.random() * 3) + 1
      }));
      setCpuProcesses(randomCpu);
    } else if (category === 'GRAPH') {
      handleGenerateMaze();
    }
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Interactive Grid Cell Action (Start, Target, or Wall)
  const handleCellClick = (r, c, mode) => {
    if (mode === 'start') {
      // Don't place start on target
      if (gridConfig.target.r === r && gridConfig.target.c === c) return;
      // Remove wall if any at new start position
      const cleanWalls = gridConfig.walls.filter(w => !(w.r === r && w.c === c));
      setGridConfig({ ...gridConfig, start: { r, c }, walls: cleanWalls });
    } else if (mode === 'target') {
      // Don't place target on start
      if (gridConfig.start.r === r && gridConfig.start.c === c) return;
      const cleanWalls = gridConfig.walls.filter(w => !(w.r === r && w.c === c));
      setGridConfig({ ...gridConfig, target: { r, c }, walls: cleanWalls });
    } else {
      // Toggle wall
      if ((gridConfig.start.r === r && gridConfig.start.c === c) || (gridConfig.target.r === r && gridConfig.target.c === c)) return;
      const exists = gridConfig.walls.some(w => w.r === r && w.c === c);
      let newWalls;
      if (exists) {
        newWalls = gridConfig.walls.filter(w => !(w.r === r && w.c === c));
      } else {
        newWalls = [...gridConfig.walls, { r, c }];
      }
      setGridConfig({ ...gridConfig, walls: newWalls });
    }
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Procedural Random Maze Generator
  const handleGenerateMaze = () => {
    const randomWalls = [];
    for (let r = 0; r < gridConfig.rows; r++) {
      for (let c = 0; c < gridConfig.cols; c++) {
        const isStart = gridConfig.start.r === r && gridConfig.start.c === c;
        const isTarget = gridConfig.target.r === r && gridConfig.target.c === c;
        if (!isStart && !isTarget && Math.random() < 0.28) {
          randomWalls.push({ r, c });
        }
      }
    }
    setGridConfig({ ...gridConfig, walls: randomWalls });
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  // Clear All Obstacle Walls
  const handleClearWalls = () => {
    setGridConfig({ ...gridConfig, walls: [] });
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  const totalMemorySize = useMemo(() => holes.reduce((sum, h) => sum + h.size, 0), [holes]);
  const algoDetails = ALGORITHMS_REGISTRY[selectedAlgo] || ALGORITHMS_REGISTRY['first-fit'];

  return (
    <div className="app-wrapper">
      {/* Top Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        onOpenComparison={() => setShowComparison(true)}
        onOpenTheory={() => setShowTheory(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main 2-Column App Layout */}
      <div className="app-layout">
        {/* Sidebar (Side Addon) */}
        <Sidebar
          selectedCategory={category}
          onSelectCategory={handleSelectCategory}
          selectedAlgo={selectedAlgo}
          onSelectAlgo={handleSelectAlgo}
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          speed={speed}
          setSpeed={setSpeed}
          canStepForward={currentStepIndex < totalSteps}
          canStepBackward={currentStepIndex > 0}
          onOpenCustomData={() => setShowCustomData(true)}
          onRandomizeData={handleRandomizeData}
          isOpenOnMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Stage & Visualizer */}
        <main className="app-main">
          {/* Active Visualizer Canvas */}
          <div className="visualizer-stage">
            {category === 'OS' && ['first-fit', 'best-fit', 'worst-fit', 'next-fit'].includes(selectedAlgo) && (
              <MemoryVisualizer
                memoryBlocks={currentStepData?.memoryBlocks || []}
                totalMemorySize={totalMemorySize}
                scannedHoleIds={currentStepData?.scannedHoleIds || []}
                selectedHoleId={currentStepData?.selectedHoleId}
                currentProcess={currentStepData?.currentProcess}
              />
            )}

            {category === 'OS' && ['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'].includes(selectedAlgo) && (
              <CpuSchedulerVisualizer
                ganttChart={currentStepData?.ganttChart || []}
                currentTime={currentStepData?.currentTime || 0}
                runningProcess={currentStepData?.runningProcess}
                readyQueue={currentStepData?.readyQueue || []}
                processStates={currentStepData?.processStates || []}
              />
            )}

            {category === 'OS' && ['lru', 'fifo-paging', 'optimal-paging'].includes(selectedAlgo) && (
              <PageReplacementVisualizer
                referenceString={referenceString}
                currentStepIndex={currentStepIndex}
                frames={currentStepData?.frames || []}
                isFault={currentStepData?.isFault}
                isHit={currentStepData?.isHit}
                replacedPage={currentStepData?.replacedPage}
                currentPage={currentStepData?.currentPage}
                pageFaults={currentStepData?.pageFaults || 0}
                pageHits={currentStepData?.pageHits || 0}
                hitRatio={currentStepData?.hitRatio || 0}
              />
            )}

            {category === 'GRAPH' && (
              <GraphVisualizer
                gridConfig={gridConfig}
                currentCell={currentStepData?.currentCell}
                visitedCells={currentStepData?.visitedCells || []}
                frontierCells={currentStepData?.frontierCells || []}
                pathCells={currentStepData?.pathCells || []}
                targetFound={currentStepData?.targetFound}
                onCellClick={handleCellClick}
                onGenerateMaze={handleGenerateMaze}
                onClearWalls={handleClearWalls}
                isFinished={isFinished}
              />
            )}

            {category === 'SORT_SEARCH' && (
              <SortingVisualizer
                algorithmId={selectedAlgo}
                array={currentStepData?.array || []}
                highlightIndices={currentStepData?.highlightIndices || []}
                pivotIndex={currentStepData?.pivotIndex ?? -1}
                sortedIndices={currentStepData?.sortedIndices || []}
                comparisons={currentStepData?.comparisons || 0}
                swaps={currentStepData?.swaps || 0}
                low={currentStepData?.low ?? -1}
                high={currentStepData?.high ?? -1}
                mid={currentStepData?.mid ?? -1}
                target={searchTarget}
                found={currentStepData?.found}
                isFinished={isFinished}
              />
            )}
          </div>

          {/* Bottom Analytics & Live Explanation */}
          <div className="analytics-grid">
            <MetricsPanel
              category={category}
              algorithmId={selectedAlgo}
              currentStepData={currentStepData}
              totalSteps={totalSteps}
              isFinished={isFinished}
              algorithmName={algoDetails.name}
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

      {/* Comparison Modal */}
      {showComparison && (
        <ComparisonView
          category={category}
          holes={holes}
          processes={processes}
          cpuProcesses={cpuProcesses}
          referenceString={referenceString}
          frameCount={frameCount}
          gridConfig={gridConfig}
          sortArray={sortArray}
          onClose={() => setShowComparison(false)}
          onSelectAlgorithm={handleSelectAlgo}
        />
      )}

      {/* Theory & Principles Modal */}
      {showTheory && (
        <TheoryModal
          onClose={() => setShowTheory(false)}
        />
      )}

      {/* Universal Custom Dataset Editor Modal */}
      {showCustomData && (
        <CustomDataModal
          category={category}
          algorithmId={selectedAlgo}
          holes={holes}
          processes={processes}
          cpuProcesses={cpuProcesses}
          referenceString={referenceString}
          frameCount={frameCount}
          gridConfig={gridConfig}
          sortArray={sortArray}
          searchTarget={searchTarget}
          onSaveMemory={(h, p) => { setHoles(h); setProcesses(p); setCurrentStepIndex(0); setIsRunning(false); }}
          onSaveCpu={(p) => { setCpuProcesses(p); setCurrentStepIndex(0); setIsRunning(false); }}
          onSavePaging={(r, f) => { setReferenceString(r); setFrameCount(f); setCurrentStepIndex(0); setIsRunning(false); }}
          onSaveGraph={(g) => { setGridConfig(g); setCurrentStepIndex(0); setIsRunning(false); }}
          onSaveSorting={(arr, t) => { setSortArray(arr); setSearchTarget(t); setCurrentStepIndex(0); setIsRunning(false); }}
          onClose={() => setShowCustomData(false)}
        />
      )}
    </div>
  );
}
