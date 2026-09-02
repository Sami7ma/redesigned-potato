import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Cpu, 
  Layers, 
  Network, 
  BarChart3, 
  Zap,
  Target,
  Maximize2,
  RotateCcw,
  Clock,
  Search
} from 'lucide-react';

export default function TheoryModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('os-memory');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '920px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Algorithm Theory & Principles Reference
            </h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Navigation Tabs */}
          <div className="theory-tab-nav">
            <button
              className={`theory-tab-btn ${activeTab === 'os-memory' ? 'active' : ''}`}
              onClick={() => setActiveTab('os-memory')}
            >
              1. OS Memory Allocation
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'os-cpu' ? 'active' : ''}`}
              onClick={() => setActiveTab('os-cpu')}
            >
              2. OS CPU Scheduling
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'os-paging' ? 'active' : ''}`}
              onClick={() => setActiveTab('os-paging')}
            >
              3. Page Replacement
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              4. Graph Search (BFS, DFS, Dijkstra)
            </button>
            <button
              className={`theory-tab-btn ${activeTab === 'sorting' ? 'active' : ''}`}
              onClick={() => setActiveTab('sorting')}
            >
              5. Sorting & Binary Search
            </button>
          </div>

          {/* TAB 1: OS MEMORY ALLOCATION */}
          {activeTab === 'os-memory' && (
            <div className="theory-content-block">
              <h3 className="theory-title">Contiguous Dynamic Storage-Allocation Problem</h3>
              <p className="theory-desc">
                Given physical memory split into variable-sized free blocks (holes), how should an operating system assign contiguous memory to arriving processes?
              </p>

              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} /> First Fit
                  </h4>
                  <p><strong>Rule:</strong> Scan sequentially and assign the first hole with size &ge; request.</p>
                  <p><strong>Tradeoff:</strong> Fast allocation time, but tends to accumulate small fragment holes near the beginning of memory.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={16} /> Best Fit
                  </h4>
                  <p><strong>Rule:</strong> Scan all holes and assign the smallest hole with size &ge; request (<code>min(hole.size - request)</code>).</p>
                  <p><strong>Tradeoff:</strong> Preserves large contiguous blocks for future large processes, but produces tiny leftover fragments.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#f97316', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Maximize2 size={16} /> Worst Fit
                  </h4>
                  <p><strong>Rule:</strong> Assign the largest available hole (<code>max(hole.size)</code>).</p>
                  <p><strong>Tradeoff:</strong> Leaves largest possible remainder, but quickly fragments large regions needed by subsequent large processes.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#8b5cf6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RotateCcw size={16} /> Next Fit
                  </h4>
                  <p><strong>Rule:</strong> Circular scan starting from the location of the previous allocation.</p>
                  <p><strong>Tradeoff:</strong> Avoids clustering at the beginning of memory; distributes fragmentation evenly.</p>
                </div>
              </div>

              <div className="alert-banner alert-danger" style={{ marginTop: '1rem' }}>
                <div>
                  <strong>External Fragmentation:</strong> Occurs when total free memory across RAM is large enough to satisfy a request, but the memory is not contiguous. Paging and compaction are the standard solutions.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OS CPU SCHEDULING */}
          {activeTab === 'os-cpu' && (
            <div className="theory-content-block">
              <h3 className="theory-title">CPU Scheduling Disciplines</h3>
              <p className="theory-desc">
                Determines which ready process in the queue receives CPU execution time when the processor becomes available.
              </p>

              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#06b6d4', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> Round Robin (RR)
                  </h4>
                  <p>Preemptive time-sharing. Each process gets a fixed time slice (quantum). If unfinished, it is rotated to the back of the ready queue.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} /> First-Come, First-Served (FCFS)
                  </h4>
                  <p>Non-preemptive FIFO queue. Simple but vulnerable to the Convoy Effect where short jobs wait behind a CPU-intensive job.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={16} /> Shortest Job First (SJF)
                  </h4>
                  <p>Selects the process with the shortest CPU burst time. Mathematically optimal for minimizing average waiting time.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#ec4899', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={16} /> Priority Scheduling
                  </h4>
                  <p>Assigns CPU based on numerical priority ranks. Higher priority jobs run first. Requires aging to prevent process starvation.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAGE REPLACEMENT */}
          {activeTab === 'os-paging' && (
            <div className="theory-content-block">
              <h3 className="theory-title">Virtual Memory Page Replacement</h3>
              <p className="theory-desc">
                When a page fault occurs and all physical memory frames are occupied, the operating system must choose which page frame to evict.
              </p>

              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} /> LRU (Least Recently Used)
                  </h4>
                  <p>Replaces the frame that has not been referenced for the longest period in the past. High performance heuristic approximating optimal.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> FIFO (First-In, First-Out)
                  </h4>
                  <p>Replaces the oldest loaded page. Simple queue implementation, but subject to Belady's Anomaly where more frames can cause more faults.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={16} /> Optimal (Belady's OPT)
                  </h4>
                  <p>Replaces the page that will not be referenced for the longest time in the future. Theoretical lower bound on page faults.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GRAPH SEARCH */}
          {activeTab === 'graph' && (
            <div className="theory-content-block">
              <h3 className="theory-title">Graph Traversal & Pathfinding Algorithms</h3>
              <p className="theory-desc">
                Methods for exploring graphs, tree structures, and 2D grid mazes from a starting node to a target node.
              </p>

              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Network size={16} /> Breadth-First Search (BFS)
                  </h4>
                  <p><strong>Data Structure:</strong> Queue (FIFO)</p>
                  <p><strong>Time/Space:</strong> O(V + E) / O(V)</p>
                  <p>Explores neighbors level-by-level. Guarantees the shortest path on unweighted graphs.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#ec4899', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Network size={16} /> Depth-First Search (DFS)
                  </h4>
                  <p><strong>Data Structure:</strong> Stack (LIFO) or Recursion</p>
                  <p><strong>Time/Space:</strong> O(V + E) / O(V)</p>
                  <p>Explores as deep as possible along each branch before backtracking. Ideal for cycle detection and maze generation.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={16} /> Dijkstra's Algorithm
                  </h4>
                  <p><strong>Data Structure:</strong> Min-Priority Queue</p>
                  <p><strong>Time/Space:</strong> O((V + E) log V) / O(V)</p>
                  <p>Always visits the unvisited node with smallest cumulative distance. Guarantees optimal path on graphs with non-negative edge weights.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SORTING & SEARCHING */}
          {activeTab === 'sorting' && (
            <div className="theory-content-block">
              <h3 className="theory-title">Sorting & Searching Fundamentals</h3>
              <p className="theory-desc">
                Core algorithmic techniques for organizing and retrieving data efficiently.
              </p>

              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#8b5cf6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={16} /> QuickSort
                  </h4>
                  <p><strong>Complexity:</strong> O(N log N) average, O(N^2) worst | Space: O(log N)</p>
                  <p>Selects a pivot, partitions elements into smaller and larger subsets, and recursively sorts sub-arrays in place.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={16} /> Merge Sort
                  </h4>
                  <p><strong>Complexity:</strong> O(N log N) guaranteed | Space: O(N)</p>
                  <p>Divide-and-conquer algorithm that recursively splits arrays into halves and merges sorted sub-arrays.</p>
                </div>

                <div className="card theory-inner-card">
                  <h4 style={{ color: '#06b6d4', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Search size={16} /> Binary Search
                  </h4>
                  <p><strong>Complexity:</strong> O(log N) | Space: O(1)</p>
                  <p>Finds target in a sorted array by halving the search window at each comparison step.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Reference Guide
          </button>
        </div>
      </div>
    </div>
  );
}
