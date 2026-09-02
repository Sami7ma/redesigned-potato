// Algorithm Simulator Suite - Comprehensive Definitions & Presets

export const CATEGORIES = {
  OS: {
    id: 'os',
    name: 'Operating Systems',
    icon: 'Cpu',
    description: 'Memory allocation, CPU process scheduling, and paging algorithms.',
    subcategories: [
      { id: 'memory', name: 'Memory Allocation', defaultAlgo: 'first-fit' },
      { id: 'cpu', name: 'CPU Scheduling', defaultAlgo: 'round-robin' },
      { id: 'paging', name: 'Page Replacement', defaultAlgo: 'lru' },
    ]
  },
  GRAPH: {
    id: 'graph',
    name: 'Graph & Pathfinding',
    icon: 'Network',
    description: 'Graph traversals, shortest path exploration, and search wavefronts.',
    subcategories: [
      { id: 'pathfinding', name: 'Graph Search & Pathfinding', defaultAlgo: 'bfs' },
    ]
  },
  SORT_SEARCH: {
    id: 'sort_search',
    name: 'Sorting & Searching',
    icon: 'BarChart3',
    description: 'Divide-and-conquer sorting, comparative sorting, and binary interval search.',
    subcategories: [
      { id: 'sorting', name: 'Sorting Algorithms', defaultAlgo: 'quicksort' },
      { id: 'searching', name: 'Searching Algorithms', defaultAlgo: 'binary-search' },
    ]
  }
};

// All Algorithm Metadata
export const ALGORITHMS_REGISTRY = {
  // Memory Allocation
  'first-fit': {
    id: 'first-fit',
    category: 'os',
    sub: 'memory',
    name: 'First Fit',
    shortDescription: 'Scans from the start and allocates the first hole that is large enough.',
    rule: 'First hole where size ≥ request',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    tag: 'Fastest Allocation',
    accentColor: '#3b82f6',
    detailedExplanation: 'First Fit allocates the first contiguous free hole that is large enough. It is fast because it halts traversal upon the first valid match, though it can leave small fragmented holes near the beginning of memory.'
  },
  'best-fit': {
    id: 'best-fit',
    category: 'os',
    sub: 'memory',
    name: 'Best Fit',
    shortDescription: 'Scans all holes and allocates the smallest hole that is large enough.',
    rule: 'min(hole_size - request) where size ≥ request',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    tag: 'Highest Utilization',
    accentColor: '#10b981',
    detailedExplanation: 'Best Fit minimizes leftover space by choosing the smallest hole that fits the requested process. This preserves larger contiguous blocks for later processes, though it may leave tiny unusable slivers.'
  },
  'worst-fit': {
    id: 'worst-fit',
    category: 'os',
    sub: 'memory',
    name: 'Worst Fit',
    shortDescription: 'Allocates the largest available hole to produce the largest remainder.',
    rule: 'max(hole_size) where size ≥ request',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    tag: 'Max Remainder',
    accentColor: '#f97316',
    detailedExplanation: 'Worst Fit places the process in the largest available memory hole so the leftover block remains relatively large. However, it rapidly fragments large memory areas needed by bigger processes.'
  },
  'next-fit': {
    id: 'next-fit',
    category: 'os',
    sub: 'memory',
    name: 'Next Fit',
    shortDescription: 'Continues scanning from the location of the last allocation.',
    rule: 'First hole ≥ request starting at last scan pointer',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    tag: 'Circular Search',
    accentColor: '#8b5cf6',
    detailedExplanation: 'Next Fit is a modification of First Fit that resumes searching where the previous search finished, spreading allocations more evenly across memory.'
  },

  // CPU Scheduling
  'round-robin': {
    id: 'round-robin',
    category: 'os',
    sub: 'cpu',
    name: 'Round Robin (RR)',
    shortDescription: 'Preemptive scheduling with fixed time quantum per process.',
    rule: 'Fixed Time Slice (Quantum = 2)',
    timeComplexity: 'O(1) per switch',
    spaceComplexity: 'O(N) queue',
    tag: 'Fair Time-Sharing',
    accentColor: '#06b6d4',
    detailedExplanation: 'Round Robin assigns a fixed time quantum to each process in a circular ready queue. If a process does not complete within the quantum, it is preempted and placed at the tail of the queue.'
  },
  'fcfs-cpu': {
    id: 'fcfs-cpu',
    category: 'os',
    sub: 'cpu',
    name: 'First-Come, First-Served (FCFS)',
    shortDescription: 'Non-preemptive scheduling in strict order of process arrival.',
    rule: 'Order of Arrival Queue',
    timeComplexity: 'O(1) dispatch',
    spaceComplexity: 'O(N)',
    tag: 'Simple FIFO',
    accentColor: '#3b82f6',
    detailedExplanation: 'FCFS executes processes strictly in arrival order. It is easy to implement but suffers from the Convoy Effect if a long process arrives early.'
  },
  'sjf-cpu': {
    id: 'sjf-cpu',
    category: 'os',
    sub: 'cpu',
    name: 'Shortest Job First (SJF)',
    shortDescription: 'Selects the process with the shortest burst time first.',
    rule: 'min(burst_time) among ready processes',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    tag: 'Optimal Avg Wait',
    accentColor: '#10b981',
    detailedExplanation: 'SJF gives the minimum average waiting time for a given set of processes by prioritizing the shortest remaining job.'
  },
  'priority-cpu': {
    id: 'priority-cpu',
    category: 'os',
    sub: 'cpu',
    name: 'Priority Scheduling',
    shortDescription: 'Executes processes based on explicit priority level.',
    rule: 'min(priority_number) = highest priority',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    tag: 'Priority Driven',
    accentColor: '#ec4899',
    detailedExplanation: 'CPU is allocated to the process with the highest priority (lower numerical value = higher priority). Can suffer from starvation without aging.'
  },

  // Page Replacement
  'lru': {
    id: 'lru',
    category: 'os',
    sub: 'paging',
    name: 'Least Recently Used (LRU)',
    shortDescription: 'Evicts the page in memory that has not been referenced for the longest time.',
    rule: 'Evict min(last_access_time)',
    timeComplexity: 'O(1) with stack/hash',
    spaceComplexity: 'O(Frames)',
    tag: 'Optimal Heuristic',
    accentColor: '#10b981',
    detailedExplanation: 'LRU replaces the page that has not been used for the longest period of time, approximating optimal page replacement using past history.'
  },
  'fifo-paging': {
    id: 'fifo-paging',
    category: 'os',
    sub: 'paging',
    name: 'First-In, First-Out (FIFO)',
    shortDescription: 'Evicts the oldest page loaded into physical frames.',
    rule: 'Evict oldest page loaded',
    timeComplexity: 'O(1) queue',
    spaceComplexity: 'O(Frames)',
    tag: 'Simple Queue',
    accentColor: '#3b82f6',
    detailedExplanation: 'FIFO keeps a queue of loaded pages and replaces the page at the head. It is susceptible to Belady\'s Anomaly where adding frames can increase page faults.'
  },
  'optimal-paging': {
    id: 'optimal-paging',
    category: 'os',
    sub: 'paging',
    name: 'Optimal Page Replacement (OPT)',
    shortDescription: 'Evicts the page that will not be used for the longest period in future.',
    rule: 'max(next_reference_time)',
    timeComplexity: 'O(N * Frames)',
    spaceComplexity: 'O(Frames)',
    tag: 'Theoretical Limit',
    accentColor: '#f59e0b',
    detailedExplanation: 'Optimal page replacement has the lowest possible page fault rate by replacing the page not needed for the longest future duration (used as a benchmark).'
  },

  // Graph / Pathfinding
  'bfs': {
    id: 'bfs',
    category: 'graph',
    sub: 'pathfinding',
    name: 'Breadth-First Search (BFS)',
    shortDescription: 'Explores neighbors level-by-level using a FIFO queue to guarantee shortest path on unweighted graphs.',
    rule: 'Queue (FIFO) frontier expansion',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    tag: 'Shortest Path (Unweighted)',
    accentColor: '#3b82f6',
    detailedExplanation: 'BFS explores all nodes at distance d before exploring nodes at distance d+1. It finds the optimal shortest path in unweighted graphs and grid mazes.'
  },
  'dfs': {
    id: 'dfs',
    category: 'graph',
    sub: 'pathfinding',
    name: 'Depth-First Search (DFS)',
    shortDescription: 'Explores as deep as possible along each branch before backtracking using a LIFO stack.',
    rule: 'Stack (LIFO) deep traversal',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    tag: 'Deep Exploration',
    accentColor: '#ec4899',
    detailedExplanation: 'DFS explores along branches to maximum depth before backtracking. Useful for topological sorting, cycle detection, and maze generation.'
  },
  'dijkstra': {
    id: 'dijkstra',
    category: 'graph',
    sub: 'pathfinding',
    name: "Dijkstra's Algorithm",
    shortDescription: 'Finds the shortest weighted path using a priority queue greedy selection.',
    rule: 'min(dist[u] + weight(u, v))',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    tag: 'Optimal Weighted Path',
    accentColor: '#10b981',
    detailedExplanation: 'Dijkstra maintains tentative distances and always expands the unvisited node with minimal accumulated cost, guaranteeing optimal weighted paths.'
  },

  // Sorting & Searching
  'quicksort': {
    id: 'quicksort',
    category: 'sort_search',
    sub: 'sorting',
    name: 'Quick Sort',
    shortDescription: 'Divide-and-conquer sorting by partitioning around a selected pivot element.',
    rule: 'Partitioning: elements < pivot left, elements > pivot right',
    timeComplexity: 'O(N log N) avg, O(N²) worst',
    spaceComplexity: 'O(log N) stack',
    tag: 'Divide & Conquer',
    accentColor: '#8b5cf6',
    detailedExplanation: 'Quick Sort chooses a pivot, partitions the array such that smaller elements move left and larger right, and recursively sorts sub-arrays in-place.'
  },
  'mergesort': {
    id: 'mergesort',
    category: 'sort_search',
    sub: 'sorting',
    name: 'Merge Sort',
    shortDescription: 'Stable divide-and-conquer sorting by halving arrays and merging sorted halves.',
    rule: 'Divide in halves, recursively merge sorted lists',
    timeComplexity: 'O(N log N) guaranteed',
    spaceComplexity: 'O(N)',
    tag: 'Guaranteed O(N log N)',
    accentColor: '#10b981',
    detailedExplanation: 'Merge Sort recursively splits the array into singletons and merges them back in sorted order, providing stable and predictable O(N log N) performance.'
  },
  'bubblesort': {
    id: 'bubblesort',
    category: 'sort_search',
    sub: 'sorting',
    name: 'Bubble Sort',
    shortDescription: 'Repeatedly steps through list, swaps adjacent elements that are out of order.',
    rule: 'if (A[i] > A[i+1]) swap',
    timeComplexity: 'O(N²) avg/worst, O(N) best',
    spaceComplexity: 'O(1)',
    tag: 'Educational Classic',
    accentColor: '#f97316',
    detailedExplanation: 'Bubble Sort compares adjacent elements and bubbles the largest item to the top in each pass. Ideal for understanding fundamental swap mechanics.'
  },
  'binary-search': {
    id: 'binary-search',
    category: 'sort_search',
    sub: 'searching',
    name: 'Binary Search',
    shortDescription: 'Logarithmic search on a sorted array by repeatedly dividing the search interval in half.',
    rule: 'mid = (low + high) / 2; narrow to left or right half',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    tag: 'Logarithmic Search',
    accentColor: '#06b6d4',
    detailedExplanation: 'Binary Search compares target with median element. If match, returns index; if smaller, searches left sub-interval; if larger, searches right sub-interval.'
  }
};

// Default Presets for Each Subcategory
export const DEFAULT_HOLES = [
  { id: 'H1', label: 'H1', size: 150, base: 0 },
  { id: 'H2', label: 'H2', size: 550, base: 150 },
  { id: 'H3', label: 'H3', size: 250, base: 700 },
  { id: 'H4', label: 'H4', size: 350, base: 950 },
  { id: 'H5', label: 'H5', size: 700, base: 1300 },
];

export const DEFAULT_PROCESSES = [
  { id: 'P1', name: 'P1', size: 220, color: '#3b82f6', bgLight: '#dbeafe', border: '#2563eb' },
  { id: 'P2', name: 'P2', size: 480, color: '#10b981', bgLight: '#d1fae5', border: '#059669' },
  { id: 'P3', name: 'P3', size: 140, color: '#f59e0b', bgLight: '#fef3c7', border: '#d97706' },
  { id: 'P4', name: 'P4', size: 520, color: '#8b5cf6', bgLight: '#ede9fe', border: '#7c3aed' },
];

export const DEFAULT_CPU_PROCESSES = [
  { id: 'P1', name: 'P1', arrival: 0, burst: 5, priority: 2, color: '#3b82f6' },
  { id: 'P2', name: 'P2', arrival: 1, burst: 3, priority: 1, color: '#10b981' },
  { id: 'P3', name: 'P3', arrival: 2, burst: 8, priority: 3, color: '#f59e0b' },
  { id: 'P4', name: 'P4', arrival: 3, burst: 6, priority: 2, color: '#8b5cf6' },
];

export const DEFAULT_PAGE_REFERENCE = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
export const DEFAULT_FRAME_COUNT = 3;

export const DEFAULT_SORT_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45, 78, 50];
export const DEFAULT_SEARCH_TARGET = 45;

export const DEFAULT_GRID_CONFIG = {
  rows: 10,
  cols: 14,
  start: { r: 1, c: 1 },
  target: { r: 8, c: 12 },
  walls: [
    { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }, { r: 6, c: 3 },
    { r: 4, c: 6 }, { r: 5, c: 6 }, { r: 6, c: 6 }, { r: 7, c: 6 }, { r: 8, c: 6 },
    { r: 2, c: 9 }, { r: 3, c: 9 }, { r: 4, c: 9 }, { r: 5, c: 9 },
  ]
};

// Backwards compatibility alias
export const ALGORITHMS = ALGORITHMS_REGISTRY;
