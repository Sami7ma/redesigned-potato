import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Layers, 
  Cpu, 
  Clock, 
  Network, 
  BarChart3, 
  Search,
  Grid,
  Code2,
  Boxes,
  Crown
} from 'lucide-react';
import { CATEGORIES, ALGORITHMS_REGISTRY } from '../types/data';

export default function TheoryModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('os');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            <h2>AlgoLab • Algorithm Theory & Principles Reference Manual</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: '0 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="theory-tab-nav" style={{ marginBottom: 0, paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
            <button className={`theory-tab-btn ${activeTab === 'os' ? 'active' : ''}`} onClick={() => setActiveTab('os')}>
              1. Operating Systems
            </button>
            <button className={`theory-tab-btn ${activeTab === 'graph' ? 'active' : ''}`} onClick={() => setActiveTab('graph')}>
              2. Graph & Pathfinding
            </button>
            <button className={`theory-tab-btn ${activeTab === 'sort' ? 'active' : ''}`} onClick={() => setActiveTab('sort')}>
              3. Sorting & Searching
            </button>
            <button className={`theory-tab-btn ${activeTab === 'dp' ? 'active' : ''}`} onClick={() => setActiveTab('dp')}>
              4. Dynamic Programming
            </button>
            <button className={`theory-tab-btn ${activeTab === 'array' ? 'active' : ''}`} onClick={() => setActiveTab('array')}>
              5. Array & Strings
            </button>
            <button className={`theory-tab-btn ${activeTab === 'backtrack' ? 'active' : ''}`} onClick={() => setActiveTab('backtrack')}>
              6. Backtracking & Greedy
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* TAB 1: OS */}
          {activeTab === 'os' && (
            <div>
              <div className="theory-title">Operating Systems: Memory, CPU & Virtual Paging</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800 }}>First Fit vs Best Fit vs Worst Fit</h4>
                  <p><strong>First Fit:</strong> Fast O(N), searches left-to-right, allocates in first hole with size &ge; process.</p>
                  <p><strong>Best Fit:</strong> Searches all holes, allocates in smallest hole with size &ge; process (minimizes leftover).</p>
                  <p><strong>Worst Fit:</strong> Allocates in largest hole, leaving large residual holes.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#06b6d4', fontWeight: 800 }}>CPU Scheduling: Round Robin & SJF</h4>
                  <p><strong>Round Robin (RR):</strong> Preemptive circular queue with time quantum Q=2 units. Prevents starvation.</p>
                  <p><strong>Shortest Job First (SJF):</strong> Non-preemptive optimal average waiting time scheduling.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800 }}>Virtual Memory: LRU vs Optimal</h4>
                  <p><strong>LRU:</strong> Evicts page unreferenced for longest past duration using temporal locality.</p>
                  <p><strong>Optimal (Bélády):</strong> Theoretical baseline that evicts page unreferenced for furthest future time.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRAPH */}
          {activeTab === 'graph' && (
            <div>
              <div className="theory-title">Graph Traversal, Shortest Paths & Minimum Spanning Trees</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800 }}>BFS vs DFS</h4>
                  <p><strong>BFS:</strong> Queue-based level-order search. Guarantees shortest path in unweighted graphs (O(V+E)).</p>
                  <p><strong>DFS:</strong> Stack-based recursive deep branch exploration for topological ordering and cycle detection.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800 }}>Dijkstra vs A* (A-Star)</h4>
                  <p><strong>Dijkstra:</strong> Uniform-cost expansion on non-negative weighted graphs (O((V+E) log V)).</p>
                  <p><strong>A* Search:</strong> Heuristic guided search using f(n) = g(n) + h(n) with Manhattan distance heuristic.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#8b5cf6', fontWeight: 800 }}>Floyd-Warshall & MSTs</h4>
                  <p><strong>Floyd-Warshall:</strong> All-pairs shortest path matrix DP (O(V³)).</p>
                  <p><strong>Kruskal / Prim:</strong> Minimum Spanning Trees using edge sorting + DSU or priority cut growth.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SORTING */}
          {activeTab === 'sort' && (
            <div>
              <div className="theory-title">Sorting & Binary Searching Complexities</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#8b5cf6', fontWeight: 800 }}>Quick Sort</h4>
                  <p><strong>Time:</strong> O(N log N) avg, O(N²) worst | Space: O(log N)</p>
                  <p>In-place divide-and-conquer partitioning elements around a pivot.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800 }}>Merge Sort</h4>
                  <p><strong>Time:</strong> O(N log N) guaranteed | Space: O(N)</p>
                  <p>Stable divide-and-conquer recursively splitting and merging sub-arrays.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#06b6d4', fontWeight: 800 }}>Binary Search</h4>
                  <p><strong>Time:</strong> O(log N) | Space: O(1)</p>
                  <p>Halves search interval at each step on sorted contiguous sequences.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DP */}
          {activeTab === 'dp' && (
            <div>
              <div className="theory-title">Dynamic Programming: 0/1 Knapsack, LCS & Kadane</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800 }}>0/1 Knapsack Problem</h4>
                  <p><strong>Recurrence:</strong> DP[i][w] = max(DP[i-1][w], val[i] + DP[i-1][w - wt[i]])</p>
                  <p>Determines maximum value subset fitting capacity W in pseudo-polynomial O(N·W) time.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800 }}>Longest Common Subsequence (LCS)</h4>
                  <p><strong>Recurrence:</strong> DP[i][j] = (s1[i]==s2[j]) ? 1+DP[i-1][j-1] : max(DP[i-1][j], DP[i][j-1])</p>
                  <p>Finds longest non-contiguous common character match in O(M·N) time.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#f59e0b', fontWeight: 800 }}>Kadane's Algorithm</h4>
                  <p><strong>Recurrence:</strong> currMax = max(x, currMax + x), maxSoFar = max(maxSoFar, currMax)</p>
                  <p>Finds optimal maximum contiguous subarray sum in single linear O(N) pass.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARRAY / STRINGS */}
          {activeTab === 'array' && (
            <div>
              <div className="theory-title">Sliding Window, Two Pointers, KMP & Euclidean GCD</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#06b6d4', fontWeight: 800 }}>Sliding Window & Two Pointers</h4>
                  <p><strong>Sliding Window:</strong> Maintains running window frame to avoid repeated O(N²) calculations.</p>
                  <p><strong>Two Pointers:</strong> Moves dual bounds inward on sorted sequences to find target pairs in O(N).</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#ec4899', fontWeight: 800 }}>KMP (Knuth-Morris-Pratt)</h4>
                  <p><strong>Time:</strong> O(N + M) | Space: O(M)</p>
                  <p>Precomputes Longest Proper Prefix which is Suffix (LPS) table to slide pattern without backtracking text pointer.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#10b981', fontWeight: 800 }}>Euclidean GCD</h4>
                  <p><strong>Principle:</strong> GCD(a, b) = GCD(b, a mod b)</p>
                  <p>Computes greatest common divisor in logarithmic O(log(min(a,b))) steps.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BACKTRACKING / GREEDY */}
          {activeTab === 'backtrack' && (
            <div>
              <div className="theory-title">State Space Backtracking & Greedy Choices</div>
              <div className="theory-card-grid">
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#f59e0b', fontWeight: 800 }}>N-Queens Problem</h4>
                  <p><strong>Strategy:</strong> Backtracking (Depth-First Search on State Space Tree)</p>
                  <p>Places N queens row by row. If an attack conflict occurs, prunes the search branch and rolls back.</p>
                </div>
                <div className="card theory-inner-card">
                  <h4 style={{ color: '#3b82f6', fontWeight: 800 }}>Activity Selection (Greedy)</h4>
                  <p><strong>Strategy:</strong> Greedy Choice Property (Sort by Finish Time)</p>
                  <p>Greedily selects non-overlapping activity with earliest finish time, provably maximizing total bookings.</p>
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
