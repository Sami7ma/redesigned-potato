# AlgoLab — Universal Algorithm Simulation & Visualization Suite

> An interactive visual simulation suite for **Operating Systems Algorithms**, **Graph & Pathfinding**, and **Sorting & Searching**. Built with React, Vite, and modern Vanilla CSS.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Launch the local interactive development server
npm run dev
```

Visit `http://localhost:5173/` (or the port specified by Vite) in your browser.

---

## Algorithm Categories & Capabilities

### 1. Operating Systems (OS)
* **Contiguous Memory Allocation**:
  * **First Fit**: Fast sequential scanning (`O(N)`).
  * **Best Fit**: Smallest sufficient hole allocation (`O(N)`), preserving large blocks.
  * **Worst Fit**: Largest hole allocation (`O(N)`).
  * **Next Fit**: Circular continuous search pointer (`O(N)`).
  * *Features*: External fragmentation detector, proportional memory ruler, real-time block inspector.
* **CPU Process Scheduling**:
  * **Round Robin (RR)**: Preemptive time-slicing with configurable quantum.
  * **First-Come, First-Served (FCFS)**: Non-preemptive arrival queue order.
  * **Shortest Job First (SJF)**: Minimizes average waiting time.
  * **Priority Scheduling**: Priority-driven CPU dispatch.
  * *Features*: Interactive Gantt chart timeline, live Ready Queue, average waiting/turnaround time metrics.
* **Page Replacement Policies**:
  * **Least Recently Used (LRU)**: Optimal practical heuristic.
  * **First-In, First-Out (FIFO)**: Queue-based replacement.
  * **Optimal (Belady's OPT)**: Theoretical minimal page fault benchmark.
  * *Features*: Reference string stream indicator, frame slot animations, page fault & hit ratio counters.

---

### 2. Graph & Pathfinding
* **Breadth-First Search (BFS)**: Level-by-level FIFO frontier expansion; shortest path guarantee on unweighted graphs.
* **Depth-First Search (DFS)**: Deep branch LIFO traversal.
* **Dijkstra's Algorithm**: Weighted shortest path exploration with minimum priority queue.
* *Features*: Interactive 2D Grid canvas, click to place/remove Start (MapPin), Target (Flag), and Walls (BrickWall), live queue/stack depth counter, reconstructed shortest path.

---

### 3. Sorting & Searching
* **Quick Sort**: In-place divide-and-conquer partitioning around pivots.
* **Merge Sort**: Stable divide-and-conquer sorting by halving and merging.
* **Bubble Sort**: Adjacent element comparison and bubble swaps.
* **Binary Search**: Logarithmic interval search (`O(log N)`) with active low/mid/high range indicators.
* *Features*: Dynamic bar heights, color-coded swap highlights, comparisons counter, sorted state animations.

---

## Design & Layout Highlights

* **Sidebar Addon Architecture**: Clean 2-column desktop app shell with sticky control panel on the side.
* **Mobile Responsiveness**: Responsive drawer navigation, touch-friendly buttons, and horizontal scrolling for visualizers on phones and tablets.
* **Clean Light & Dark Modes**: Seamless toggle with Sun/Moon icons and consistent high-contrast colors.
* **Custom Dataset Editor (Edit Inputs)**: Live data customization for any algorithm with instant re-calculation.
* **Side-by-Side Comparator (Compare All)**: Multi-algorithm performance matrices and summary winner badges.
* **Theory Guide**: Comprehensive algorithm principles, complexity references, and pseudocode.

---

## Global Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Pause Auto-Simulation |
| `→` (Right Arrow) | Step Forward |
| `←` (Left Arrow) | Step Backward |
| `R` | Reset Simulation to Step 0 |
| `C` | Toggle Comparative Analysis Matrix |
| `Esc` | Close Open Modals / Mobile Drawer |

---

## Tech Stack

* **React 18** (Components & Hooks)
* **Vite 6** (Fast Build Tooling)
* **Lucide React** (Modern Icons)
* **Canvas Confetti** (Celebration particle animations)
* **Vanilla CSS** (Custom responsive design system with CSS custom properties)

---

## License

MIT License. Free to use for academic research, education, and development.
