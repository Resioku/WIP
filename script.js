// Game State
let player = {
  powerLevel: 10,
  tp: 0,
  stats: { str: 10, wil: 10 },
  isTraining: false,
  formActive: false,
  kaiokenMastery: 1
};

// Tab Controller
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Training Logic
function toggleTraining() {
  player.isTraining = !player.isTraining;
  document.getElementById('btn-train').innerText = player.isTraining ? "Stop Training" : "Start Training";
}

// Stat Purchasing
function buyStat(stat) {
  let cost = 10;
  if (player.tp >= cost) {
    player.tp -= cost;
    player.stats[stat] += 1;
    updateUI();
  }
}

// Core Game Loop (runs every 1 second)
setInterval(() => {
  if (player.isTraining) {
    player.tp += 1;
  }
  updateUI();
}, 1000);

// UI Renderer
function updateUI() {
  document.getElementById('power-level').innerText = player.powerLevel;
  document.getElementById('tp-count').innerText = player.tp;
  document.getElementById('stat-str').innerText = player.stats.str;
  document.getElementById('stat-wil').innerText = player.stats.wi
    l;
}
