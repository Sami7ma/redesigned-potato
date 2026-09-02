// ==========================================================================
// AlgoLab • 20+ Algorithm Registry, Domains, Presets & Themes
// ==========================================================================

export const THEMES = [
  { id: 'chameleon-glass', name: 'Chameleon Glass', icon: 'Sparkles', desc: 'Shimmering emerald-cyan glassmorphism' },
  { id: 'warm-wood', name: 'Warm Studio Wood', icon: 'Compass', desc: 'Walnut, cedar & warm parchment study' },
  { id: 'obsidian-dark', name: 'Obsidian Dark Glass', icon: 'Moon', desc: 'Deep obsidian slate & electric blue' },
  { id: 'clean-lab', name: 'Clean Technical Lab', icon: 'Sun', desc: 'High-contrast academic laboratory light' }
];

export const CATEGORIES = {
  OS: {
    id: 'OS',
    name: 'Operating Systems',
    shortName: 'OS',
    icon: 'Cpu',
    color: 'var(--domain-os)',
    subcategories: [
      { id: 'memory', name: 'Memory Allocation', defaultAlgo: 'first-fit', algos: ['first-fit', 'best-fit', 'worst-fit', 'next-fit'] },
      { id: 'cpu', name: 'CPU Scheduling', defaultAlgo: 'round-robin', algos: ['round-robin', 'fcfs-cpu', 'sjf-cpu', 'priority-cpu'] },
      { id: 'paging', name: 'Page Replacement', defaultAlgo: 'lru', algos: ['lru', 'fifo-paging', 'optimal-paging'] }
    ]
  },
  GRAPH: {
    id: 'GRAPH',
    name: 'Graph & Pathfinding',
    shortName: 'Graph',
    icon: 'Network',
    color: 'var(--domain-graph)',
    subcategories: [
      { id: 'grid-search', name: 'Grid Pathfinding', defaultAlgo: 'bfs', algos: ['bfs', 'dfs', 'dijkstra', 'a-star'] },
      { id: 'all-pairs', name: 'All-Pairs Shortest Path', defaultAlgo: 'floyd-warshall', algos: ['floyd-warshall'] },
      { id: 'mst', name: 'Minimum Spanning Tree', defaultAlgo: 'kruskal', algos: ['kruskal', 'prim'] },
      { id: 'dag-dsu', name: 'Topology & Sets', defaultAlgo: 'topological-sort', algos: ['topological-sort', 'union-find'] }
    ]
  },
  SORT_SEARCH: {
    id: 'SORT_SEARCH',
    name: 'Sorting & Searching',
    shortName: 'Sort/Search',
    icon: 'BarChart3',
    color: 'var(--domain-sort)',
    subcategories: [
      { id: 'sorting', name: 'Comparative Sorting', defaultAlgo: 'quicksort', algos: ['quicksort', 'mergesort', 'bubblesort'] },
      { id: 'searching', name: 'Logarithmic Search', defaultAlgo: 'binary-search', algos: ['binary-search'] }
    ]
  },
  DP: {
    id: 'DP',
    name: 'Dynamic Programming',
    shortName: 'DP',
    icon: 'Grid',
    color: 'var(--domain-dp)',
    subcategories: [
      { id: 'table-dp', name: '2D Tableau DP', defaultAlgo: 'knapsack-dp', algos: ['knapsack-dp', 'lcs-dp'] },
      { id: 'linear-dp', name: 'Linear Sequence DP', defaultAlgo: 'kadanes', algos: ['kadanes'] }
    ]
  },
  ARRAY_STRING: {
    id: 'ARRAY_STRING',
    name: 'Array & String Techniques',
    shortName: 'Array/String',
    icon: 'Code2',
    color: 'var(--domain-array)',
    subcategories: [
      { id: 'pointers-window', name: 'Window & Pointers', defaultAlgo: 'sliding-window', algos: ['sliding-window', 'two-pointers'] },
      { id: 'string-math', name: 'Matching & Math', defaultAlgo: 'kmp-string', algos: ['kmp-string', 'euclidean-gcd'] }
    ]
  },
  BACKTRACKING_GREEDY: {
    id: 'BACKTRACKING_GREEDY',
    name: 'Backtracking & Greedy',
    shortName: 'Backtrack/Greedy',
    icon: 'Boxes',
    color: 'var(--domain-greedy)',
    subcategories: [
      { id: 'backtracking', name: 'State Space Search', defaultAlgo: 'n-queens', algos: ['n-queens'] },
      { id: 'greedy', name: 'Greedy Heuristics', defaultAlgo: 'activity-selection', algos: ['activity-selection'] }
    ]
  }
};

export const ALGORITHMS_REGISTRY = {
  // OS Memory
  'first-fit': {
    id: 'first-fit',
    name: 'First Fit Allocation',
    category: 'OS',
    subcat: 'memory',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Allocates the first hole that is large enough.',
    detailedExplanation: 'Scans contiguous memory holes from left to right and allocates the process into the very first hole whose size >= process request.'
  },
  'best-fit': {
    id: 'best-fit',
    name: 'Best Fit Allocation',
    category: 'OS',
    subcat: 'memory',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Allocates the smallest hole that is large enough.',
    detailedExplanation: 'Evaluates all available memory holes to find the one that minimizes leftover residual memory (internal fragmentation).'
  },
  'worst-fit': {
    id: 'worst-fit',
    name: 'Worst Fit Allocation',
    category: 'OS',
    subcat: 'memory',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Allocates the largest available hole.',
    detailedExplanation: 'Allocates process into the largest free block in the system, leaving behind large leftover holes usable by subsequent processes.'
  },
  'next-fit': {
    id: 'next-fit',
    name: 'Next Fit Allocation',
    category: 'OS',
    subcat: 'memory',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Continues search from the last allocated position.',
    detailedExplanation: 'Maintains a rotating pointer from the last allocation point to distribute block allocations evenly across the physical address track.'
  },

  // OS CPU
  'round-robin': {
    id: 'round-robin',
    name: 'Round Robin (RR)',
    category: 'OS',
    subcat: 'cpu',
    tag: 'Q = 2',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    rule: 'Preemptive time-sliced circular scheduling.',
    detailedExplanation: 'Grants each ready process a fixed CPU time quantum (Q=2 units). If unfinished, the process is preempted and pushed to the back of the queue.'
  },
  'fcfs-cpu': {
    id: 'fcfs-cpu',
    name: 'First-Come First-Served',
    category: 'OS',
    subcat: 'cpu',
    tag: 'Non-preempt',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    rule: 'Schedules processes strictly in arrival order.',
    detailedExplanation: 'Executes processes non-preemptively based on their arrival time. Can cause the Convoy Effect if long burst jobs arrive early.'
  },
  'sjf-cpu': {
    id: 'sjf-cpu',
    name: 'Shortest Job First',
    category: 'OS',
    subcat: 'cpu',
    tag: 'Min Burst',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    rule: 'Executes the process with the smallest burst time.',
    detailedExplanation: 'Selects the ready process with the minimal CPU burst time, provably minimizing average waiting time.'
  },
  'priority-cpu': {
    id: 'priority-cpu',
    name: 'Priority Scheduling',
    category: 'OS',
    subcat: 'cpu',
    tag: 'Ranked',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    rule: 'Executes the highest priority process first.',
    detailedExplanation: 'Dispatches processes according to priority rank (1 = highest priority).'
  },

  // OS Paging
  'lru': {
    id: 'lru',
    name: 'Least Recently Used (LRU)',
    category: 'OS',
    subcat: 'paging',
    tag: 'O(1) Stack',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(K)',
    rule: 'Evicts page unused for the longest past interval.',
    detailedExplanation: 'Leverages temporal locality by tracking past access timestamps and evicting the page unreferenced for the longest past time.'
  },
  'fifo-paging': {
    id: 'fifo-paging',
    name: 'First-In First-Out (FIFO)',
    category: 'OS',
    subcat: 'paging',
    tag: 'O(1) Queue',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(K)',
    rule: 'Evicts oldest loaded frame in physical memory.',
    detailedExplanation: 'Replaces the page that was brought into memory earliest regardless of how frequently it was accessed.'
  },
  'optimal-paging': {
    id: 'optimal-paging',
    name: "Optimal (Bélády's)",
    category: 'OS',
    subcat: 'paging',
    tag: 'Theoretical',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    rule: 'Evicts page unreferenced for longest future time.',
    detailedExplanation: 'Theoretical benchmark that inspects future reference strings and replaces the page that will not be accessed for the furthest duration.'
  },

  // Graph & Pathfinding
  'bfs': {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'GRAPH',
    subcat: 'grid-search',
    tag: 'O(V + E)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    rule: 'Level-order wavefront traversal guaranteeing shortest path in unweighted graphs.',
    detailedExplanation: 'Explores graph neighbors uniformly layer by layer using a FIFO queue, finding the minimum hop path.'
  },
  'dfs': {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'GRAPH',
    subcat: 'grid-search',
    tag: 'O(V + E)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    rule: 'Deep branch traversal using LIFO stack / recursion.',
    detailedExplanation: 'Dives deeply along each graph branch until a dead end is reached, then backtracks.'
  },
  'dijkstra': {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'GRAPH',
    subcat: 'grid-search',
    tag: 'O((V+E) log V)',
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    rule: 'Greedy shortest path on non-negative weighted graphs.',
    detailedExplanation: 'Maintains tentative distances and continually relaxes edges with minimal known cumulative cost.'
  },
  'a-star': {
    id: 'a-star',
    name: 'A* (A-Star) Pathfinding',
    category: 'GRAPH',
    subcat: 'grid-search',
    tag: 'f = g + h',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    rule: 'Heuristic-guided shortest path using f(n) = g(n) + h(n).',
    detailedExplanation: 'Combines actual distance from start g(n) with Manhattan heuristic h(n) to focus wavefront expansion directly toward the target node.'
  },
  'floyd-warshall': {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'GRAPH',
    subcat: 'all-pairs',
    tag: 'O(V³)',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    rule: 'All-pairs shortest path dynamic programming matrix.',
    detailedExplanation: 'Iterates through all intermediate vertices k and relaxes dist(i,j) = min(dist(i,j), dist(i,k) + dist(k,j)).'
  },
  'kruskal': {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'GRAPH',
    subcat: 'mst',
    tag: 'O(E log E)',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    rule: 'Minimum Spanning Tree by sorting edges and avoiding cycles with DSU.',
    detailedExplanation: 'Sorts all edges by weight and greedily includes edges that connect disjoint components using Union-Find.'
  },
  'prim': {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'GRAPH',
    subcat: 'mst',
    tag: 'O(E log V)',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    rule: 'Minimum Spanning Tree by growing a cut tree from a root vertex.',
    detailedExplanation: 'Grows a single connected component by picking the minimum weight cut edge connected to unvisited nodes.'
  },
  'topological-sort': {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'GRAPH',
    subcat: 'dag-dsu',
    tag: 'O(V + E)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    rule: "Linear ordering of DAG vertices using Kahn's in-degree queue.",
    detailedExplanation: 'Resolves task dependencies by repeatedly removing nodes with 0 incoming dependencies (in-degree=0).'
  },
  'union-find': {
    id: 'union-find',
    name: 'Union-Find / DSU',
    category: 'GRAPH',
    subcat: 'dag-dsu',
    tag: 'O(α(N))',
    timeComplexity: 'O(α(N))',
    spaceComplexity: 'O(N)',
    rule: 'Disjoint Set Union with rank heuristics and path compression.',
    detailedExplanation: 'Maintains partitioned sets supporting near constant-time Find(x) and Union(x,y) operations.'
  },

  // Sorting & Searching
  'quicksort': {
    id: 'quicksort',
    name: 'Quick Sort',
    category: 'SORT_SEARCH',
    subcat: 'sorting',
    tag: 'O(N log N)',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(log N)',
    rule: 'Divide-and-conquer partition around a pivot element.',
    detailedExplanation: 'Partitions an array around a chosen pivot, ensuring smaller elements are on the left and larger on the right.'
  },
  'mergesort': {
    id: 'mergesort',
    name: 'Merge Sort',
    category: 'SORT_SEARCH',
    subcat: 'sorting',
    tag: 'O(N log N)',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    rule: 'Stable divide-and-conquer recursive split and merge.',
    detailedExplanation: 'Recursively divides array into halves until singletons, then merges sorted sub-arrays stably.'
  },
  'bubblesort': {
    id: 'bubblesort',
    name: 'Bubble Sort',
    category: 'SORT_SEARCH',
    subcat: 'sorting',
    tag: 'O(N²)',
    timeComplexity: 'O(N²)',
    spaceComplexity: 'O(1)',
    rule: 'Repeatedly swaps adjacent out-of-order elements.',
    detailedExplanation: 'Iterates through the list repeatedly, bubbling the largest unsorted element to its final position.'
  },
  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'SORT_SEARCH',
    subcat: 'searching',
    tag: 'O(log N)',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    rule: 'Halves the search space at each comparison on sorted arrays.',
    detailedExplanation: 'Compares target value with middle element and eliminates half of the remaining interval each step.'
  },

  // Dynamic Programming
  'knapsack-dp': {
    id: 'knapsack-dp',
    name: '0/1 Knapsack Problem',
    category: 'DP',
    subcat: 'table-dp',
    tag: 'O(N · W)',
    timeComplexity: 'O(N · W)',
    spaceComplexity: 'O(N · W)',
    rule: '2D DP table: max value subset fitting weight capacity W.',
    detailedExplanation: 'Builds DP table DP[i][w] = max(exclude, include + DP[i-1][w-wt]) and reconstructs the optimal item subset.'
  },
  'lcs-dp': {
    id: 'lcs-dp',
    name: 'Longest Common Subsequence (LCS)',
    category: 'DP',
    subcat: 'table-dp',
    tag: 'O(M · N)',
    timeComplexity: 'O(M · N)',
    spaceComplexity: 'O(M · N)',
    rule: '2D matching grid for longest non-contiguous substring match.',
    detailedExplanation: 'Constructs matching tableau DP[i][j] where matching characters increment diagonal by 1 and mismatches take max(top, left).'
  },
  'kadanes': {
    id: 'kadanes',
    name: "Kadane's Algorithm",
    category: 'DP',
    subcat: 'linear-dp',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Optimal contiguous subarray sum in linear time.',
    detailedExplanation: 'Iterates through array computing currMax = max(x, currMax + x) and updating global maxSoFar window.'
  },

  // Array & String
  'sliding-window': {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'ARRAY_STRING',
    subcat: 'pointers-window',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Maintains running subarray window bounds to avoid O(N²) recalculation.',
    detailedExplanation: 'Slides a fixed or dynamic window across array, adding incoming and subtracting outgoing elements in O(1).'
  },
  'two-pointers': {
    id: 'two-pointers',
    name: 'Two Pointers Technique',
    category: 'ARRAY_STRING',
    subcat: 'pointers-window',
    tag: 'O(N)',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    rule: 'Converges Left and Right bounds inward on sorted arrays.',
    detailedExplanation: 'Pointers move toward each other based on sum comparison vs target, finding pairs in single linear pass.'
  },
  'kmp-string': {
    id: 'kmp-string',
    name: 'KMP Pattern Search',
    category: 'ARRAY_STRING',
    subcat: 'string-math',
    tag: 'O(N + M)',
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(M)',
    rule: 'Precomputes LPS prefix table to skip redundant character comparisons.',
    detailedExplanation: 'Uses Longest Proper Prefix which is also Suffix array to slide pattern intelligently without backtracking text pointer.'
  },
  'euclidean-gcd': {
    id: 'euclidean-gcd',
    name: 'Euclidean Algorithm (GCD)',
    category: 'ARRAY_STRING',
    subcat: 'string-math',
    tag: 'O(log(min(A, B)))',
    timeComplexity: 'O(log(min(A, B)))',
    spaceComplexity: 'O(1)',
    rule: 'Computes Greatest Common Divisor via repeated modulo division.',
    detailedExplanation: 'Applies GCD(a, b) = GCD(b, a mod b) until remainder reaches 0, yielding the exact greatest common divisor.'
  },

  // Backtracking & Greedy
  'n-queens': {
    id: 'n-queens',
    name: 'N-Queens Backtracking',
    category: 'BACKTRACKING_GREEDY',
    subcat: 'backtracking',
    tag: 'O(N!)',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    rule: 'Places N queens on N×N board without mutual row/col/diagonal attack.',
    detailedExplanation: 'Recursively places queens row by row, pruning conflict branches immediately and backtracking upon dead ends.'
  },
  'activity-selection': {
    id: 'activity-selection',
    name: 'Activity Selection (Greedy)',
    category: 'BACKTRACKING_GREEDY',
    subcat: 'greedy',
    tag: 'O(N log N)',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(1)',
    rule: 'Maximizes non-overlapping interval bookings by sorting by finish time.',
    detailedExplanation: 'Greedily selects the compatible activity that finishes earliest, leaving maximum remaining time for subsequent tasks.'
  }
};

// Default Presets
export const DEFAULT_HOLES = [
  { id: 1, label: 'Hole 1', base: 0, limit: 100, size: 100 },
  { id: 2, label: 'Hole 2', base: 100, limit: 600, size: 500 },
  { id: 3, label: 'Hole 3', base: 600, limit: 800, size: 200 },
  { id: 4, label: 'Hole 4', base: 800, limit: 1100, size: 300 },
  { id: 5, label: 'Hole 5', base: 1100, limit: 1700, size: 600 }
];

export const DEFAULT_PROCESSES = [
  { id: 'P1', name: 'P1', size: 212, color: '#3b82f6' },
  { id: 'P2', name: 'P2', size: 417, color: '#10b981' },
  { id: 'P3', name: 'P3', size: 112, color: '#f59e0b' },
  { id: 'P4', name: 'P4', size: 426, color: '#8b5cf6' }
];

export const DEFAULT_CPU_PROCESSES = [
  { id: 'P1', name: 'P1', arrival: 0, burst: 5, priority: 2, color: '#3b82f6' },
  { id: 'P2', name: 'P2', arrival: 1, burst: 3, priority: 1, color: '#10b981' },
  { id: 'P3', name: 'P3', arrival: 2, burst: 8, priority: 3, color: '#f59e0b' },
  { id: 'P4', name: 'P4', arrival: 3, burst: 6, priority: 2, color: '#8b5cf6' }
];

export const DEFAULT_PAGE_REFERENCE = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
export const DEFAULT_FRAME_COUNT = 3;

export const DEFAULT_GRID_CONFIG = {
  rows: 10,
  cols: 16,
  start: { r: 1, c: 1 },
  target: { r: 8, c: 14 },
  walls: [
    { r: 1, c: 5 }, { r: 2, c: 5 }, { r: 3, c: 5 }, { r: 4, c: 5 }, { r: 5, c: 5 },
    { r: 4, c: 10 }, { r: 5, c: 10 }, { r: 6, c: 10 }, { r: 7, c: 10 }, { r: 8, c: 10 }
  ]
};

export const DEFAULT_SORT_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45, 78, 50];
export const DEFAULT_SEARCH_TARGET = 45;

export const DEFAULT_KNAPSACK_ITEMS = [
  { id: 1, name: 'Item 1', weight: 1, value: 1 },
  { id: 2, name: 'Item 2', weight: 2, value: 6 },
  { id: 3, name: 'Item 3', weight: 3, value: 10 },
  { id: 4, name: 'Item 4', weight: 5, value: 16 }
];
export const DEFAULT_KNAPSACK_CAPACITY = 7;

export const DEFAULT_LCS_STR1 = "ABCDE";
export const DEFAULT_LCS_STR2 = "ACE";

export const DEFAULT_KADANES_ARRAY = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
export const DEFAULT_SLIDING_WINDOW_ARRAY = [2, 1, 5, 1, 3, 2, 8, 4];
export const DEFAULT_SLIDING_WINDOW_K = 3;

export const DEFAULT_TWO_POINTERS_ARRAY = [1, 2, 4, 6, 8, 9, 14, 15];
export const DEFAULT_TWO_POINTERS_TARGET = 15;

export const DEFAULT_KMP_TEXT = "ABABDABACDABABCABAB";
export const DEFAULT_KMP_PATTERN = "ABABCABAB";

export const DEFAULT_EUCLIDEAN_A = 252;
export const DEFAULT_EUCLIDEAN_B = 105;

export const DEFAULT_NQUEENS_N = 4;
