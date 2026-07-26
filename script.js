// CONFIG
const STAT_BASE_COST = 10;
const STAT_GROWTH_RATE = 1.15;

// Game State
let player = {
  powerLevel: 60,
  tp: 0,
  hp: 200,
  maxHp: 200,
  stats: { str: 10, con: 10, dex: 10, wil: 10 },
  isTraining: false,
  kaiokenUnlocked: false
};

// Enemy State
let enemy = {
  hp: 50,
  maxHp: 50,
  atk: 5, // Enemy hits back!
  isFighting: false
};

// Calculate Power Level dynamically from stats
function calculatePowerLevel() {
  let pl = (player.stats.str * 1.5) + 
           (player.stats.con * 1.5) + 
           (player.stats.dex * 1.2) + 
           (player.stats.wil * 1.8);
  return Math.floor(pl);
}

// Calculate Max HP dynamically from CON
function calculateMaxHP() {
  return 100 + (player.stats.con * 10);
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

function toggleTraining() {
  player.isTraining = !player.isTraining;
  document.getElementById('btn-train').innerText = player.isTraining ? "Stop Training" : "Start Training";
}

function getStatCost(currentValue) {
  let pointsBought = currentValue - 10;
  return Math.floor(STAT_BASE_COST * Math.pow(STAT_GROWTH_RATE, pointsBought));
}

function buyStat(stat) {
  let cost = getStatCost(player.stats[stat]);
  if (player.tp >= cost) {
    player.tp -= cost;
    player.stats[stat] += 1;
    
    // Recalculate derived stats
    player.maxHp = calculateMaxHP();
    player.hp = player.maxHp; // Heal to full on stat upgrade
    player.powerLevel = calculatePowerLevel();
    
    updateUI();
  }
}

// Player Attacks Enemy
function attackEnemy() {
  // Deal damage based on STR
  let damage = player.stats.str;
  enemy.hp -= damage;

  // Check if enemy defeated
  if (enemy.hp <= 0) {
    enemy.maxHp = Math.floor(enemy.maxHp * 1.25);
    enemy.atk = Math.floor(enemy.atk * 1.2);
    enemy.hp = enemy.maxHp;
    player.hp = player.maxHp; // Full heal reward
    alert("Target Defeated! The next Dummy gets stronger.");
  } else {
    // Enemy counter-attacks!
    enemyCounterAttack();
  }

  updateUI();
}

// Enemy Counter Attack Logic
function enemyCounterAttack() {
  // Chance to dodge based on DEX (caps at 50% dodge chance)
  let dodgeChance = Math.min(player.stats.dex * 0.5, 50);
  let roll = Math.random() * 100;

  if (roll > dodgeChance) {
    player.hp -= enemy.atk;
  }

  // Player Death Reset
  if (player.hp <= 0) {
    alert("You were defeated! Resetting fight...");
    player.hp = player.maxHp;
    enemy.hp = enemy.maxHp;
  }
}

// Core Loop (Every 1 second)
setInterval(() => {
  if (player.isTraining) {
    player.tp += 1;
  }
  updateUI();
}, 1000);

function updateUI() {
  document.getElementById('power-level').innerText = player.powerLevel;
  document.getElementById('tp-count').innerText = player.tp;
  document.getElementById('player-hp').innerText = Math.max(0, player.hp);
  document.getElementById('player-max-hp').innerText = player.maxHp;

  // Update Stats
  ['str', 'con', 'dex', 'wil'].forEach(stat => {
    document.getElementById(`stat-${stat}`).innerText = player.stats[stat];
    let cost = getStatCost(player.stats[stat]);
    document.getElementById(`btn-buy-${stat}`).innerText = `+1 (${cost} TP)`;
  });

  // Update Combat
  document.getElementById('enemy-hp').innerText = enemy.hp;
  document.getElementById('enemy-max-hp').innerText = enemy.maxHp;

  if (player.kaiokenUnlocked) {
    document.getElementById('forms-section').style.display = 'block';
  }
}

// Initial setup
player.maxHp = calculateMaxHP();
player.hp = player.maxHp;
player.powerLevel = calculatePowerLevel();
