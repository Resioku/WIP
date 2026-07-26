// CONFIG: Change stat costs easily here!
const STAT_BASE_COST = 10;
const STAT_GROWTH_RATE = 1.15; // 1.15 = 15% increase per level (nice idle game balance)

// Game State
let player = {
  powerLevel: 10,
  tp: 0,
  stats: { str: 10, wil: 10, dex: 10, con: 10 },
  isTraining: false,
  kaiokenUnlocked: false // Forms hidden by default!
};

// Enemy State
let enemy = {
  hp: 50,
  maxHp: 50,
  plReward: 5
};

// Tab Switching
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Training Logic
function toggleTraining() {
  player.isTraining = !player.isTraining;
  document.getElementById('btn-train').innerText = player.isTraining ? "Stop Training" : "Start Training";
}

// Formula to calculate stat upgrade cost
function getStatCost(currentValue) {
  // Calculates cost based on how many points above base (10) you have
  let pointsBought = currentValue - 10;
  return Math.floor(STAT_BASE_COST * Math.pow(STAT_GROWTH_RATE, pointsBought));
}

// Buy Stats
function buyStat(stat) {
  let cost = getStatCost(player.stats[stat]);
  if (player.tp >= cost) {
    player.tp -= cost;
    player.stats[stat] += 1;
    updateUI();
  }
}

// Combat: Attack Dummy
function attackEnemy() {
  let damage = player.stats.str; // Damage scales with STR
  enemy.hp -= damage;

  if (enemy.hp <= 0) {
    // Beat enemy! Reward PL and scale enemy HP
    player.powerLevel += enemy.plReward;
    enemy.maxHp = Math.floor(enemy.maxHp * 1.2);
    enemy.hp = enemy.maxHp;
    enemy.plReward = Math.floor(enemy.plReward * 1.2);
  }

  updateUI();
}

// Game Loop (Every 1 second)
setInterval(() => {
  if (player.isTraining) {
    player.tp += 1;
  }
  updateUI();
}, 1000);

// Update UI
function updateUI() {
  document.getElementById('power-level').innerText = player.powerLevel;
  document.getElementById('tp-count').innerText = player.tp;

  // Update Stats
  ['str', 'wil', 'dex', 'con'].forEach(stat => {
    document.getElementById(`stat-${stat}`).innerText = player.stats[stat];
    let cost = getStatCost(player.stats[stat]);
    document.getElementById(`btn-buy-${stat}`).innerText = `+1 (${cost} TP)`;
  });

  // Update Combat
  document.getElementById('enemy-hp').innerText = enemy.hp;
  document.getElementById('enemy-max-hp').innerText = enemy.maxHp;

  // Unlocks
  if (player.kaiokenUnlocked) {
    document.getElementById('forms-section').style.display = 
      'block';
  }
}
