// CPU Scheduling Algorithm Engine
// Implements Round Robin, FCFS, SJF, and Priority Scheduling with timeline traces.

export function generateCpuScheduleTrace(algorithmId, processList, timeQuantum = 2) {
  const processes = JSON.parse(JSON.stringify(processList));
  // Sort initially by arrival time
  processes.sort((a, b) => a.arrival - b.arrival);

  const steps = [];
  const ganttChart = [];
  let currentTime = 0;
  let completedCount = 0;
  const n = processes.length;

  const procState = processes.map(p => ({
    ...p,
    remaining: p.burst,
    startTime: -1,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
    status: 'READY' // READY, RUNNING, COMPLETED
  }));

  // Step 0: Initial State
  steps.push({
    stepIndex: 0,
    currentTime: 0,
    runningProcess: null,
    readyQueue: procState.filter(p => p.arrival <= 0).map(p => p.name),
    ganttChart: [],
    processStates: JSON.parse(JSON.stringify(procState)),
    explanation: 'Initial state: CPU idle, processes arriving in queue.',
    isFinished: false,
    avgWaitingTime: 0,
    avgTurnaroundTime: 0,
    cpuUtilization: 100,
  });

  if (algorithmId === 'fcfs-cpu') {
    let q = [];
    let pIdx = 0;

    while (completedCount < n) {
      // Add newly arrived processes
      while (pIdx < n && processes[pIdx].arrival <= currentTime) {
        q.push(procState.find(p => p.id === processes[pIdx].id));
        pIdx++;
      }

      if (q.length === 0) {
        currentTime = processes[pIdx].arrival;
        continue;
      }

      const currentProc = q.shift();
      const startTime = currentTime;
      const duration = currentProc.remaining;
      currentTime += duration;
      currentProc.remaining = 0;
      currentProc.completionTime = currentTime;
      currentProc.turnaroundTime = currentProc.completionTime - currentProc.arrival;
      currentProc.waitingTime = currentProc.turnaroundTime - currentProc.burst;
      currentProc.status = 'COMPLETED';
      completedCount++;

      ganttChart.push({
        id: currentProc.id,
        name: currentProc.name,
        color: currentProc.color,
        start: startTime,
        end: currentTime,
        duration,
      });

      // Add newly arrived processes during execution
      while (pIdx < n && processes[pIdx].arrival <= currentTime) {
        q.push(procState.find(p => p.id === processes[pIdx].id));
        pIdx++;
      }

      const totalWait = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.waitingTime : 0), 0);
      const totalTat = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.turnaroundTime : 0), 0);

      steps.push({
        stepIndex: steps.length,
        currentTime,
        runningProcess: currentProc,
        readyQueue: q.map(p => p.name),
        ganttChart: JSON.parse(JSON.stringify(ganttChart)),
        processStates: JSON.parse(JSON.stringify(procState)),
        explanation: `${currentProc.name} executed from T=${startTime} to T=${currentTime} (Burst: ${currentProc.burst}). Waiting Time: ${currentProc.waitingTime}, Turnaround Time: ${currentProc.turnaroundTime}.`,
        isFinished: completedCount === n,
        avgWaitingTime: Math.round((totalWait / completedCount) * 10) / 10,
        avgTurnaroundTime: Math.round((totalTat / completedCount) * 10) / 10,
        cpuUtilization: 100,
      });
    }
  } else if (algorithmId === 'sjf-cpu') {
    while (completedCount < n) {
      // Find available arrived processes not completed
      const available = procState.filter(p => p.arrival <= currentTime && p.remaining > 0);

      if (available.length === 0) {
        const nextArrival = Math.min(...procState.filter(p => p.remaining > 0).map(p => p.arrival));
        currentTime = nextArrival;
        continue;
      }

      // Pick shortest burst time
      available.sort((a, b) => a.burst - b.burst);
      const currentProc = available[0];

      const startTime = currentTime;
      const duration = currentProc.remaining;
      currentTime += duration;
      currentProc.remaining = 0;
      currentProc.completionTime = currentTime;
      currentProc.turnaroundTime = currentProc.completionTime - currentProc.arrival;
      currentProc.waitingTime = currentProc.turnaroundTime - currentProc.burst;
      currentProc.status = 'COMPLETED';
      completedCount++;

      ganttChart.push({
        id: currentProc.id,
        name: currentProc.name,
        color: currentProc.color,
        start: startTime,
        end: currentTime,
        duration,
      });

      const totalWait = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.waitingTime : 0), 0);
      const totalTat = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.turnaroundTime : 0), 0);

      steps.push({
        stepIndex: steps.length,
        currentTime,
        runningProcess: currentProc,
        readyQueue: procState.filter(p => p.arrival <= currentTime && p.remaining > 0).map(p => p.name),
        ganttChart: JSON.parse(JSON.stringify(ganttChart)),
        processStates: JSON.parse(JSON.stringify(procState)),
        explanation: `${currentProc.name} selected (shortest burst = ${currentProc.burst}) and completed at T=${currentTime}.`,
        isFinished: completedCount === n,
        avgWaitingTime: Math.round((totalWait / completedCount) * 10) / 10,
        avgTurnaroundTime: Math.round((totalTat / completedCount) * 10) / 10,
        cpuUtilization: 100,
      });
    }
  } else if (algorithmId === 'priority-cpu') {
    while (completedCount < n) {
      const available = procState.filter(p => p.arrival <= currentTime && p.remaining > 0);

      if (available.length === 0) {
        const nextArrival = Math.min(...procState.filter(p => p.remaining > 0).map(p => p.arrival));
        currentTime = nextArrival;
        continue;
      }

      // Lowest priority number = highest priority
      available.sort((a, b) => a.priority - b.priority);
      const currentProc = available[0];

      const startTime = currentTime;
      const duration = currentProc.remaining;
      currentTime += duration;
      currentProc.remaining = 0;
      currentProc.completionTime = currentTime;
      currentProc.turnaroundTime = currentProc.completionTime - currentProc.arrival;
      currentProc.waitingTime = currentProc.turnaroundTime - currentProc.burst;
      currentProc.status = 'COMPLETED';
      completedCount++;

      ganttChart.push({
        id: currentProc.id,
        name: currentProc.name,
        color: currentProc.color,
        start: startTime,
        end: currentTime,
        duration,
      });

      const totalWait = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.waitingTime : 0), 0);
      const totalTat = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.turnaroundTime : 0), 0);

      steps.push({
        stepIndex: steps.length,
        currentTime,
        runningProcess: currentProc,
        readyQueue: procState.filter(p => p.arrival <= currentTime && p.remaining > 0).map(p => p.name),
        ganttChart: JSON.parse(JSON.stringify(ganttChart)),
        processStates: JSON.parse(JSON.stringify(procState)),
        explanation: `${currentProc.name} (Priority ${currentProc.priority}) allocated CPU and completed at T=${currentTime}.`,
        isFinished: completedCount === n,
        avgWaitingTime: Math.round((totalWait / completedCount) * 10) / 10,
        avgTurnaroundTime: Math.round((totalTat / completedCount) * 10) / 10,
        cpuUtilization: 100,
      });
    }
  } else {
    // Round Robin (Default)
    const queue = [];
    let pIdx = 0;

    while (pIdx < n && processes[pIdx].arrival <= currentTime) {
      queue.push(procState.find(p => p.id === processes[pIdx].id));
      pIdx++;
    }

    while (completedCount < n) {
      if (queue.length === 0) {
        if (pIdx < n) {
          currentTime = processes[pIdx].arrival;
          while (pIdx < n && processes[pIdx].arrival <= currentTime) {
            queue.push(procState.find(p => p.id === processes[pIdx].id));
            pIdx++;
          }
        }
        continue;
      }

      const currentProc = queue.shift();
      const startTime = currentTime;
      const slice = Math.min(timeQuantum, currentProc.remaining);
      currentTime += slice;
      currentProc.remaining -= slice;

      ganttChart.push({
        id: currentProc.id,
        name: currentProc.name,
        color: currentProc.color,
        start: startTime,
        end: currentTime,
        duration: slice,
      });

      // Check newly arrived processes during this quantum
      while (pIdx < n && processes[pIdx].arrival <= currentTime) {
        queue.push(procState.find(p => p.id === processes[pIdx].id));
        pIdx++;
      }

      if (currentProc.remaining === 0) {
        currentProc.completionTime = currentTime;
        currentProc.turnaroundTime = currentProc.completionTime - currentProc.arrival;
        currentProc.waitingTime = currentProc.turnaroundTime - currentProc.burst;
        currentProc.status = 'COMPLETED';
        completedCount++;
      } else {
        // Re-add to tail of queue
        queue.push(currentProc);
      }

      const totalWait = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.waitingTime : (currentTime - p.arrival - (p.burst - p.remaining))), 0);
      const totalTat = procState.reduce((s, p) => s + (p.status === 'COMPLETED' ? p.turnaroundTime : (currentTime - p.arrival)), 0);

      steps.push({
        stepIndex: steps.length,
        currentTime,
        runningProcess: currentProc,
        readyQueue: queue.map(p => p.name),
        ganttChart: JSON.parse(JSON.stringify(ganttChart)),
        processStates: JSON.parse(JSON.stringify(procState)),
        explanation: `${currentProc.name} ran for ${slice} time unit(s) [T=${startTime} to T=${currentTime}]. ${currentProc.remaining === 0 ? 'Process Completed! 🎉' : `Remaining burst: ${currentProc.remaining} (re-queued).`}`,
        isFinished: completedCount === n,
        avgWaitingTime: Math.round((totalWait / n) * 10) / 10,
        avgTurnaroundTime: Math.round((totalTat / n) * 10) / 10,
        cpuUtilization: 100,
      });
    }
  }

  return {
    algorithmId,
    steps,
    totalSteps: steps.length - 1,
    finalStep: steps[steps.length - 1],
    totalProcesses: n,
  };
}
