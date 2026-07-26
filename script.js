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
  atk: 5
};

// Pure Stat -> Power Level Formula
function calculatePowerLevel() {
  let pl = (player.stats.str * 1.5) + 
           (player.stats.con * 1.5) + 
           (player.stats.dex * 1.2) + 
           (player.stats.wil * 1.8);
  return Math.floor(pl);
}

// CON -> Max HP Formula
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

// Buy Stat & Immediately Recalculate Everything
function buyStat(stat) {
  let cost = getStatCost(player.stats[stat]);
  if (player.tp >= cost) {
    player.tp -= cost;
    player.stats[stat] += 1;
    
    // Recalculate Derived Values
    let oldMaxHp = player.maxHp;
    player.maxHp = calculateMaxHP();
    // Heal player by the newly gained max HP amount
    player.hp += (player.maxHp - oldMaxHp); 
    player.powerLevel = calculatePowerLevel();
    
    updateUI();
  }
}

// Attack Combat Loop
function attackEnemy() {
  // Deal damage based strictly on STR
  let damage = player.stats.str;
  enemy.hp -= damage;

  // Enemy defeated check
  if (enemy.hp <= 0) {
    enemy.maxHp = Math.floor(enemy.maxHp * 1.25);
    enemy.atk = Math.floor(enemy.atk * 1.2);
    enemy.hp = enemy.maxHp;
    player.hp = player.maxHp; // Full heal reward on victory
  } else {
    // Counter Attack
    enemyCounterAttack();
  }

  updateUI();
}

function enemyCounterAttack() {
  let dodgeChance = Math.min(player.stats.dex * 0.5, 50); // Max 50% cap
  let roll = Math.random() * 100;

  if (roll > dodgeChance) {
    player.hp -= enemy.atk;
  }

  // Player Defeat -> Reset Fight & Heal
  if (player.hp <= 0) {
    player.hp = player.maxHp;
    enemy.hp = enemy.maxHp;
  }
}

// Core Loop (1s Ticks)
setInterval(() => {
  if (player.isTraining) {
    player.tp += 1;
  }
  updateUI();
}, 1000);

// UI Renderer
function updateUI() {
  // Recalculate before rendering
  player.powerLevel = calculatePowerLevel();
  player.maxHp = calculateMaxHP();

  document.getElementById('power-level').innerText = player.powerLevel;
  document.getElementById('tp-count').innerText = player.tp;
  document.getElementById('player-hp').innerText = Math.max(0, player.hp);
  document.getElementById('player-max-hp').innerText = player.maxHp;

  // Stats Display
  ['str', 'con', 'dex', 'wil'].forEach(stat => {
    let statElem = document.getElementById(`stat-${stat}`);
    if (statElem) statElem.innerText = player.stats[stat];
    
    let btnElem = document.getElementById(`btn-buy-${stat}`);
    if (btnElem) {
      let cost = getStatCost(player.stats[stat]);
      btnElem.innerText = `+1 (${cost} TP)`;
    }
  });

  // Combat Display
  document.getElementById('enemy-hp').innerText = enemy.hp;
  document.getElementById('enemy-max-hp').innerText = enemy.maxHp;

  if (player.kaiokenUnlocked && document.getElementById('forms-section')) {
    document.getElementById('forms-section').style.display = 'block';
  }
}

// Initial State Setup
player.maxHp = calculateMaxHP();
player.hp = player.maxHp;
player.powerLevel = calculatePowerLevel();
