const defaultExercises = [
  "Push ups", "Sit ups", "Squats", "Pike push ups",
  "Plank (sec)", "Knee raises", "Dips", "Lunges"
];

let availableExercises = JSON.parse(localStorage.getItem('availableExercises')) || [...defaultExercises];
let totalStats = JSON.parse(localStorage.getItem('totalStats')) || {};
let historyLog = JSON.parse(localStorage.getItem('historyLog')) || [];

let currentSession = {
  durationSeconds: 0,
  elapsedSeconds: 0,
  exercises: {}
};

let timerInterval = null;

// DOM Elements
const setupView = document.getElementById('setupView');
const workoutView = document.getElementById('workoutView');
const summaryView = document.getElementById('summaryView');
const exerciseCheckboxes = document.getElementById('exerciseCheckboxes');
const customExerciseInput = document.getElementById('customExerciseInput');
const addCustomBtn = document.getElementById('addCustomBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timerDisplay');
const counterList = document.getElementById('counterList');
const summaryList = document.getElementById('summaryList');
const summaryTime = document.getElementById('summaryTime');
const totalsGrid = document.getElementById('totalsGrid');
const historyTimeline = document.getElementById('historyTimeline');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Initialize UI
function init() {
  renderExerciseCheckboxes();
  renderTotals();
  renderHistory();
}

function renderExerciseCheckboxes() {
  exerciseCheckboxes.innerHTML = '';
  availableExercises.forEach(ex => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" value="${ex}" checked>
      <span>${ex}</span>
    `;
    exerciseCheckboxes.appendChild(label);
  });
}

addCustomBtn.addEventListener('click', () => {
  const name = customExerciseInput.value.trim();
  if (name && !availableExercises.includes(name)) {
    availableExercises.push(name);
    localStorage.setItem('availableExercises', JSON.stringify(availableExercises));
    renderExerciseCheckboxes();
    customExerciseInput.value = '';
  }
});

startBtn.addEventListener('click', () => {
  const checkedBoxes = Array.from(exerciseCheckboxes.querySelectorAll('input:checked'));
  if (checkedBoxes.length === 0) {
    alert('Please select at least one exercise.');
    return;
  }

  const mins = parseInt(document.getElementById('timerMinutes').value) || 1;
  currentSession.durationSeconds = mins * 60;
  currentSession.elapsedSeconds = 0;
  currentSession.exercises = {};

  checkedBoxes.forEach(cb => {
    currentSession.exercises[cb.value] = 0;
  });

  setupView.classList.add('hidden');
  workoutView.classList.remove('hidden');

  renderCounterList();
  startTimer();
});

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    currentSession.elapsedSeconds++;
    updateTimerDisplay();

    if (currentSession.elapsedSeconds >= currentSession.durationSeconds) {
      endSession();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const remaining = Math.max(0, currentSession.durationSeconds - currentSession.elapsedSeconds);
  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function renderCounterList() {
  counterList.innerHTML = '';
  for (const [ex, count] of Object.entries(currentSession.exercises)) {
    const item = document.createElement('div');
    item.className = 'counter-item';
    item.innerHTML = `
      <span>${ex}</span>
      <div class="counter-controls">
        <button class="btn-counter" onclick="adjustCount('${ex}', -1)">-</button>
        <span class="counter-value">${count}</span>
        <button class="btn-counter" onclick="adjustCount('${ex}', 1)">+</button>
      </div>
    `;
    counterList.appendChild(item);
  }
}

window.adjustCount = function(exercise, amount) {
  if (currentSession.exercises[exercise] + amount >= 0) {
    currentSession.exercises[exercise] += amount;
    renderCounterList();
  }
};

stopBtn.addEventListener('click', () => {
  endSession();
});

function endSession() {
  clearInterval(timerInterval);

  // Save stats to totals & history entry
  const sessionCopy = {
    timestamp: new Date().toLocaleString(),
    elapsedSeconds: currentSession.elapsedSeconds,
    exercises: { ...currentSession.exercises }
  };

  for (const [ex, count] of Object.entries(currentSession.exercises)) {
    totalStats[ex] = (totalStats[ex] || 0) + count;
  }

  historyLog.unshift(sessionCopy); // add to top of timeline

  localStorage.setItem('totalStats', JSON.stringify(totalStats));
  localStorage.setItem('historyLog', JSON.stringify(historyLog));

  workoutView.classList.add('hidden');
  summaryView.classList.remove('hidden');

  renderSummary();
  renderTotals();
  renderHistory();
}

function renderSummary() {
  const minsSpent = Math.floor(currentSession.elapsedSeconds / 60);
  const secsSpent = currentSession.elapsedSeconds % 60;
  summaryTime.textContent = `Time Completed: ${minsSpent}m ${secsSpent}s`;

  summaryList.innerHTML = '';
  for (const [ex, count] of Object.entries(currentSession.exercises)) {
    const item = document.createElement('div');
    item.className = 'counter-item';
    item.innerHTML = `
      <span>${ex}</span>
      <span class="counter-value" style="color: var(--success);">${count}</span>
    `;
    summaryList.appendChild(item);
  }
}

function renderTotals() {
  totalsGrid.innerHTML = '';
  const keys = Object.keys(totalStats);
  if (keys.length === 0) {
    totalsGrid.innerHTML = '<p style="grid-column: span 2; text-align: center; color: var(--text-muted);">No completed exercises yet.</p>';
    return;
  }

  for (const [ex, count] of Object.entries(totalStats)) {
    const card = document.createElement('div');
    card.className = 'total-card';
    card.innerHTML = `
      <div style="font-size: 0.9rem; color: var(--text-muted);">${ex}</div>
      <div class="total-card-count">${count}</div>
    `;
    totalsGrid.appendChild(card);
  }
}

function renderHistory() {
  historyTimeline.innerHTML = '';
  if (historyLog.length === 0) {
    historyTimeline.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No history yet.</p>';
    return;
  }

  historyLog.forEach(session => {
    const mins = Math.floor(session.elapsedSeconds / 60);
    const secs = session.elapsedSeconds % 60;

    let exRows = '';
    for (const [ex, count] of Object.entries(session.exercises)) {
      exRows += `
        <div class="timeline-exercise-row">
          <span>${ex}</span>
          <span style="font-weight: bold; color: var(--success);">${count}</span>
        </div>
      `;
    }

    const eventNode = document.createElement('div');
    eventNode.className = 'timeline-event';
    eventNode.innerHTML = `
      <div class="timeline-time">${session.timestamp}</div>
      <div class="timeline-duration">${mins}m ${secs}s Session</div>
      <div class="timeline-exercises">${exRows}</div>
    `;
    historyTimeline.appendChild(eventNode);
  });
}

clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your workout history?')) {
    historyLog = [];
    localStorage.removeItem('historyLog');
    renderHistory();
  }
});

resetBtn.addEventListener('click', () => {
  summaryView.classList.add('hidden');
  setupView.classList.remove('hidden');
});

init();