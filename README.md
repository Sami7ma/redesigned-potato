# AlgoLab — Universal Algorithm Simulation & Visualization Suite

> 🌐 **Live Application**: **[https://algolab-eight.vercel.app/](https://algolab-eight.vercel.app/)**  
> An interactive visual simulation suite for **Operating Systems**, **Graph & Pathfinding**, **Sorting & Searching**, **Dynamic Programming**, **Array & String Techniques**, and **Backtracking & Greedy**. Built with React 18, Vite 6, and modern Vanilla CSS.

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Sami7ma/redesigned-potato.git
cd redesigned-potato

# 2. Install dependencies
npm install

# 3. Launch local interactive workbench
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🚀 6 Core Domains & 20+ Implemented Algorithms

### 1. 🖥️ Operating Systems (OS)
* **Contiguous Memory Allocation**:
  * **First Fit**: Fast sequential scanning (`O(N)`).
  * **Best Fit**: Smallest sufficient hole allocation (`O(N)`), minimizing residual fragmentation.
  * **Worst Fit**: Largest hole allocation (`O(N)`).
  * **Next Fit**: Circular continuous search pointer (`O(N)`).
* **CPU Process Scheduling**:
  * **Round Robin (RR)**: Preemptive time-slicing with time quantum $Q=2$.
  * **First-Come, First-Served (FCFS)**: Non-preemptive arrival queue order.
  * **Shortest Job First (SJF)**: Minimizes average waiting time.
  * **Priority Scheduling**: Priority-driven CPU dispatch.
* **Virtual Memory Page Replacement**:
  * **Least Recently Used (LRU)**: Optimal practical temporal locality heuristic.
  * **First-In, First-Out (FIFO)**: Queue-based replacement.
  * **Optimal (Bélády's OPT)**: Theoretical minimal page fault benchmark.

---

### 2. 🕸️ Graph & Pathfinding
* **2D Grid Traversal**:
  * **Breadth-First Search (BFS)**: Level-by-level shortest path guarantee in unweighted graphs (`O(V + E)`).
  * **Depth-First Search (DFS)**: Deep branch recursive traversal.
  * **Dijkstra's Algorithm**: Weighted shortest path with minimum priority expansion.
  * **A* (A-Star) Search**: Heuristic-guided shortest path using $f(n) = g(n) + h(n)$ Manhattan distance.
* **All-Pairs Shortest Path**:
  * **Floyd-Warshall**: 2D DP distance matrix relaxation across intermediate vertices (`O(V^3)`).
* **Minimum Spanning Trees (MST)**:
  * **Kruskal's Algorithm**: Edge sorting with Disjoint Set Union (DSU) cycle prevention.
  * **Prim's Algorithm**: Priority cut expansion growing the minimal tree.
* **Topology & Sets**:
  * **Topological Sort**: Kahn's in-degree queue ordering for Directed Acyclic Graphs (DAG).
  * **Union-Find / DSU**: Disjoint Set Union with rank heuristics and path compression.

---

### 3. 📊 Sorting & Searching
* **Comparative Sorting**:
  * **Quick Sort**: In-place divide-and-conquer partitioning around pivots (`O(N log N)` avg).
  * **Merge Sort**: Guaranteed stable divide-and-conquer (`O(N log N)`).
  * **Bubble Sort**: Adjacent element comparison and bubble swaps (`O(N^2)`).
* **Logarithmic Search**:
  * **Binary Search**: Logarithmic interval search (`O(log N)`) with active low/mid/high bracket range.

---

### 4. 🧮 Dynamic Programming (DP)
* **0/1 Knapsack Problem**: 2D tableau calculation with include/exclude choices and optimal subset traceback.
* **Longest Common Subsequence (LCS)**: 2D matching matrix with diagonal character match detection.
* **Kadane's Algorithm**: Linear time (`O(N)`) maximum contiguous subarray sum.

---

### 5. 🔍 Array & String Techniques
* **Sliding Window**: Maximum sum contiguous subarray of fixed size $K$.
* **Two Pointers**: Target pair sum exploration on sorted arrays.
* **KMP (Knuth-Morris-Pratt)**: Pattern search with precomputed Longest Proper Prefix Suffix (LPS) table.
* **Euclidean Algorithm (GCD)**: Step-by-step modulo division equations $a = b \cdot q + r$.

---

### 6. ♟️ Backtracking & Greedy
* **N-Queens Problem**: $N \times N$ chessboard state space exploration with row placement, ray conflict detection, and backtracking rollback.
* **Activity Selection (Greedy)**: Optimal interval scheduling maximizing non-overlapping task bookings.

---

## 🎨 Dual Theme Design System

AlgoLab provides a curated **frosted glassmorphic design system**:
1. 🪵 **Champagne Gold & Wood (`woody-gold` / Light Mode)**: Luminous ivory white parchment (`#fcfbfa`) with rich walnut text and bright champagne gold metallic accents.
2. 🌌 **Obsidian Gold Glass (`obsidian-gold` / Dark Mode)**: Deep midnight obsidian (`#0a0d14`) with translucent frosted cards and luminous gold border highlights.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| <kbd>Space</kbd> | Play / Pause Simulation |
| <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> | Step Backward / Forward |
| <kbd>R</kbd> | Reset Simulation to Initial State |
| <kbd>C</kbd> | Open Cross-Algorithm Comparison Matrix |
| <kbd>Esc</kbd> | Close Active Modal / Popover |
