const STORAGE_KEY = "rise-to-riches-max-v1";
const DAY_MS = 24 * 60 * 60 * 1000;

const ranks = [
  { name: "Poor", min: 0 },
  { name: "Worker", min: 1000 },
  { name: "Skilled", min: 10000 },
  { name: "Rich", min: 100000 },
  { name: "Millionaire", min: 1000000 },
  { name: "Billionaire", min: 1000000000 },
  { name: "Elite", min: 10000000000 }
];

const rarityClass = {
  Common: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  Rare: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  Epic: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200",
  Legendary: "border-amber-300/50 bg-amber-300/12 text-amber-200"
};

const jobs = [
  { id: "cleaner", icon: "🧹", name: "Cleaner", level: 1, worth: 0, basePay: 28, xp: 14 },
  { id: "delivery", icon: "🛵", name: "Delivery Driver", level: 2, worth: 500, basePay: 55, xp: 22 },
  { id: "office", icon: "💻", name: "Office Worker", level: 4, worth: 2500, basePay: 110, xp: 36 },
  { id: "engineer", icon: "🛠️", name: "Engineer", level: 8, worth: 12000, basePay: 280, xp: 62 },
  { id: "manager", icon: "📋", name: "Operations Manager", level: 12, worth: 55000, basePay: 720, xp: 92 },
  { id: "ceo", icon: "👔", name: "CEO", level: 18, worth: 250000, basePay: 2100, xp: 160 }
];

const actions = [
  { id: "resell", group: "Side Hustle", icon: "📦", title: "Resell Items", subtitle: "Thrift finds, fast flips", level: 1, reward: [35, 95], xp: 16, risk: 0.08, loss: [8, 30] },
  { id: "freelance", group: "Side Hustle", icon: "🎨", title: "Freelance Gig", subtitle: "Creative work for clients", level: 1, reward: [55, 160], xp: 24, risk: 0.1, loss: [10, 45] },
  { id: "content", group: "Side Hustle", icon: "🎥", title: "Content Creation", subtitle: "Chase views and sponsors", level: 2, reward: [70, 260], xp: 34, risk: 0.18, loss: [20, 80] },
  { id: "shop", group: "Side Hustle", icon: "🛒", title: "Small Online Shop", subtitle: "Pack orders, build traffic", level: 3, reward: [120, 420], xp: 46, risk: 0.2, loss: [40, 140] },
  { id: "carFlip", group: "Side Hustle", icon: "🚗", title: "Car Flipping", subtitle: "Buy low, sell fast", level: 4, reward: [300, 950], xp: 70, risk: 0.32, loss: [120, 420] },
  { id: "stockTrade", group: "Investing", icon: "📈", title: "Stock Trade", subtitle: "Low/medium risk market play", level: 3, reward: [160, 720], xp: 48, risk: 0.28, loss: [80, 320] },
  { id: "cryptoTrade", group: "Investing", icon: "🪙", title: "Crypto Swing", subtitle: "High volatility rush", level: 6, reward: [550, 2600], xp: 86, risk: 0.48, loss: [240, 1200] },
  { id: "realEstate", group: "Investing", icon: "🏠", title: "Real Estate Deal", subtitle: "Large deals, larger swings", level: 9, reward: [1800, 7200], xp: 130, risk: 0.36, loss: [900, 3400] },
  { id: "startupBet", group: "Investing", icon: "🚀", title: "Startup Angel Bet", subtitle: "One pitch could explode", level: 13, reward: [5000, 30000], xp: 220, risk: 0.55, loss: [2600, 13000] },
  { id: "gambling", group: "Risk", icon: "🎰", title: "High-Stakes Gambling", subtitle: "Double or disaster", level: 5, reward: [450, 2100], xp: 65, risk: 0.5, loss: [280, 1600] },
  { id: "illegalDeal", group: "Risk", icon: "🕶️", title: "Illegal Deal", subtitle: "Huge payout, brutal consequences", level: 10, reward: [3500, 16000], xp: 155, risk: 0.58, loss: [1800, 9000], heat: 12 }
];

const shopItems = {
  cars: [
    ["old-bike", "🚲", "Old Bike", 120, 0.04, 1, "Common"], ["beater", "🚙", "Beater Hatchback", 450, 0.11, 1, "Common"],
    ["sedan", "🚗", "Used Sedan", 900, 0.22, 2, "Common"], ["taxi", "🚕", "Taxi Car", 1800, 0.42, 3, "Common"],
    ["pickup", "🛻", "Pickup Truck", 3500, 0.85, 4, "Rare"], ["coupe", "🚘", "Sport Coupe", 7200, 1.5, 5, "Rare"],
    ["muscle", "🏁", "Muscle Car", 11500, 2.2, 6, "Rare"], ["tesla", "⚡", "Electric Sedan", 18000, 3.1, 7, "Rare"],
    ["bmw", "🚘", "Executive BMW", 30000, 5.2, 9, "Epic"], ["benz", "🚘", "Luxury Mercedes", 47000, 7.5, 10, "Epic"],
    ["porsche", "🏎️", "Porsche 911", 78000, 11, 12, "Epic"], ["gtr", "🏎️", "Nissan GTR", 105000, 15, 13, "Epic"],
    ["ferrari", "🐎", "Ferrari Roma", 220000, 28, 16, "Legendary"], ["lambo", "🐂", "Lamborghini Huracan", 300000, 38, 18, "Legendary"],
    ["rolls", "👑", "Rolls-Royce Ghost", 460000, 55, 20, "Legendary"], ["mclaren", "🚀", "McLaren 720S", 520000, 68, 22, "Legendary"],
    ["bugatti", "💎", "Bugatti Chiron", 3200000, 260, 28, "Legendary"], ["koenig", "🔥", "Koenigsegg Jesko", 4100000, 320, 30, "Legendary"],
    ["gold-car", "🏆", "Gold Hypercar", 15000000, 980, 38, "Legendary"], ["space-car", "🛸", "Prototype Hovercar", 80000000, 4200, 50, "Legendary"]
  ],
  properties: [
    ["shared-room", "🛏️", "Shared Room", 300, 0.08, 1, "Common"], ["studio", "🏢", "Studio Apartment", 1500, 0.3, 2, "Common"],
    ["apartment", "🏠", "Small Apartment", 4200, 0.9, 3, "Common"], ["duplex", "🏘️", "Duplex", 11000, 2.1, 5, "Rare"],
    ["townhouse", "🏡", "Townhouse", 26000, 4.3, 7, "Rare"], ["rental", "🏠", "Rental House", 55000, 8.4, 9, "Rare"],
    ["villa", "🏖️", "Beach Villa", 140000, 18, 13, "Epic"], ["penthouse", "🌆", "Skyscraper Penthouse", 450000, 48, 18, "Epic"],
    ["mansion", "🏰", "Modern Mansion", 1200000, 115, 24, "Legendary"], ["hotel", "🏨", "Boutique Hotel", 4000000, 360, 30, "Legendary"],
    ["island", "🌴", "Private Island", 18000000, 1200, 40, "Legendary"], ["tower", "🏙️", "Downtown Tower", 90000000, 6000, 52, "Legendary"]
  ],
  luxury: [
    ["sneakers", "👟", "Rare Sneakers", 220, 0.03, 1, "Common"], ["chain", "⛓️", "Silver Chain", 600, 0.08, 2, "Common"],
    ["phone", "📱", "Flagship Phone", 1300, 0.16, 3, "Common"], ["bag", "👜", "Designer Bag", 2600, 0.34, 4, "Rare"],
    ["suit", "🤵", "Tailored Suit", 5200, 0.72, 5, "Rare"], ["watch", "⌚", "Luxury Watch", 15000, 2.2, 8, "Epic"],
    ["diamond", "💍", "Diamond Ring", 60000, 6.8, 12, "Epic"], ["art", "🖼️", "Blue-Chip Art", 240000, 24, 17, "Legendary"],
    ["yacht", "🛥️", "Private Yacht", 1500000, 135, 25, "Legendary"], ["jet", "✈️", "Private Jet", 25000000, 1600, 43, "Legendary"]
  ],
  special: [
    ["founder-card", "⭐", "Founder Card", 1000, 0.5, 2, "Rare"], ["gold-phone", "📱", "Gold Phone", 12000, 3.5, 8, "Epic"],
    ["limited-watch", "⌚", "Limited Watch", 90000, 15, 14, "Epic"], ["event-car", "🏎️", "Event Supercar", 650000, 80, 20, "Legendary"],
    ["ai-orb", "🔮", "AI Wealth Orb", 2500000, 260, 30, "Legendary"], ["empire-crown", "👑", "Empire Crown", 50000000, 3500, 48, "Legendary"]
  ]
};

Object.keys(shopItems).forEach(category => {
  shopItems[category] = shopItems[category].map(([id, icon, name, price, income, level, rarity]) => ({ id, icon, name, price, income, level, rarity }));
});

const businessTypes = [
  { id: "dealership", icon: "🚗", name: "Car Dealership", cost: 2500, baseIncome: 1.8, level: 3 },
  { id: "restaurant", icon: "🍜", name: "Restaurant", cost: 6000, baseIncome: 3.8, level: 5 },
  { id: "clothing", icon: "👕", name: "Clothing Brand", cost: 14000, baseIncome: 7.5, level: 8 },
  { id: "agency", icon: "📣", name: "Marketing Agency", cost: 32000, baseIncome: 15, level: 10 },
  { id: "startup", icon: "💻", name: "Tech Startup", cost: 90000, baseIncome: 42, level: 14 },
  { id: "realty", icon: "🏗️", name: "Real Estate Firm", cost: 260000, baseIncome: 115, level: 19 },
  { id: "bank", icon: "🏦", name: "Private Bank", cost: 2000000, baseIncome: 850, level: 30 }
];

const investments = [
  { id: "stocks", icon: "📈", name: "Index Stocks", risk: "Low", price: 120, volatility: 0.05, level: 3 },
  { id: "crypto", icon: "🪙", name: "Crypto Coin", risk: "High", price: 90, volatility: 0.16, level: 6 },
  { id: "reit", icon: "🏠", name: "Real Estate Fund", risk: "Medium", price: 300, volatility: 0.08, level: 8 },
  { id: "startups", icon: "🚀", name: "Startup Basket", risk: "Extreme", price: 700, volatility: 0.22, level: 12 }
];

const missions = [
  { id: "cash1k", text: "Reach $1,000", reward: 250, xp: 55, done: s => s.money >= 1000 },
  { id: "cash10k", text: "Earn $10,000", reward: 1500, xp: 140, done: s => s.totalEarned >= 10000 },
  { id: "firstCar", text: "Buy your first car", reward: 600, xp: 80, done: s => s.inventory.cars.length >= 1 },
  { id: "fiveCars", text: "Own 5 cars", reward: 3500, xp: 220, done: s => s.inventory.cars.length >= 5 },
  { id: "firstBiz", text: "Start a business", reward: 2200, xp: 180, done: s => Object.keys(s.businesses).length >= 1 },
  { id: "tenBiz", text: "Own 10 business levels total", reward: 20000, xp: 500, done: s => Object.values(s.businesses).reduce((sum, b) => sum + b.level, 0) >= 10 },
  { id: "investor", text: "Own 20 investment units", reward: 12000, xp: 360, done: s => Object.values(s.holdings).reduce((sum, n) => sum + n, 0) >= 20 },
  { id: "millionaire", text: "Become a Millionaire", reward: 100000, xp: 1400, done: s => getNetWorth(s) >= 1000000 },
  { id: "billionaire", text: "Become a Billionaire", reward: 5000000, xp: 5000, done: s => getNetWorth(s) >= 1000000000 }
];

const dailyTemplates = [
  { id: "dailyActions", text: "Do 10 actions today", reward: 800, xp: 90, target: 10, get: s => s.daily.actions },
  { id: "dailyEarn", text: "Earn $2,500 today", reward: 1200, xp: 120, target: 2500, get: s => s.daily.earned },
  { id: "dailyBuy", text: "Buy 1 item today", reward: 900, xp: 100, target: 1, get: s => s.daily.bought },
  { id: "dailyRisk", text: "Try 2 risk actions today", reward: 1500, xp: 130, target: 2, get: s => s.daily.risk }
];

const events = [
  { title: "Found a Deal", text: "A local seller offers a cheap car. Flip it?", yes: () => chance(0.72, [500, 1800], [180, 550], 90, "Car deal"), no: () => gain(100, 20, "Skipped the deal and saved time") },
  { title: "Market Crash", text: "Markets are red. Buy the fear?", yes: () => chance(0.5, [1400, 6000], [700, 2600], 150, "Crash trade"), no: () => gain(180, 30, "Kept cash during the crash") },
  { title: "Viral Moment", text: "Your content is trending. Spend money to boost it?", yes: () => chance(0.68, [900, 4200], [250, 900], 110, "Viral boost"), no: () => log("You let the trend cool off.", "neutral") },
  { title: "Car Repair", text: "A surprise repair hits. Pay premium to protect status?", yes: () => lose(Math.min(state.money, rand(160, 520)), "Premium repair", 35), no: () => chance(0.45, [120, 420], [300, 900], 35, "Cheap repair gamble") },
  { title: "Investor Meeting", text: "A serious investor wants a pitch. Go all in?", yes: () => chance(0.55, [3500, 16000], [1500, 6500], 220, "Investor pitch"), no: () => gain(250, 45, "Prepared slowly instead") },
  { title: "Police Heat", text: "A risky contact offers a huge illegal payout. Take it?", yes: () => chance(0.42, [7000, 28000], [3500, 16000], 260, "Illegal contact"), no: () => gain(400, 50, "Stayed clean and focused") }
];

const state = {
  money: 100,
  displayedMoney: 100,
  xp: 0,
  level: 1,
  totalEarned: 0,
  totalSpent: 0,
  actionsTaken: 0,
  currentPage: "actionsPage",
  currentJob: "cleaner",
  jobLevels: { cleaner: 1 },
  heat: 0,
  shopCategory: "cars",
  inventory: { cars: [], properties: [], luxury: [], special: [] },
  businesses: {},
  holdings: { stocks: 0, crypto: 0, reit: 0, startups: 0 },
  prices: Object.fromEntries(investments.map(i => [i.id, i.price])),
  completedMissions: [],
  completedDaily: [],
  achievements: [],
  daily: { date: todayKey(), actions: 0, earned: 0, bought: 0, risk: 0 },
  history: [],
  lastDailyReward: 0,
  lastSaved: Date.now(),
  activeEvent: null
};

const el = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindElements();
  load();
  rollDailyIfNeeded();
  applyOfflineIncome();
  bindEvents();
  renderAll();
  setInterval(tickIdle, 1000);
  setInterval(moveMarkets, 4500);
  setInterval(save, 5000);
}

function bindElements() {
  [
    "gameRoot", "dashCard", "moneyDisplay", "rankDisplay", "levelDisplay", "idleDisplay", "netWorthDisplay", "xpText", "xpBar",
    "dailyBtn", "jobPanel", "actionList", "missionCount", "missionList", "mysteryBtn", "shopList", "businessSummary",
    "businessList", "investmentList", "earnedDisplay", "spentDisplay", "actionsDisplay", "ownedDisplay",
    "achievementList", "activityList", "resetBtn", "eventModal", "eventTag", "eventTitle", "eventText", "eventYes", "eventNo", "toastHost"
  ].forEach(id => { el[id] = document.getElementById(id); });
}

function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => activatePage(btn.dataset.page)));
  document.querySelectorAll(".shop-tab").forEach(btn => btn.addEventListener("click", () => {
    tap(btn);
    state.shopCategory = btn.dataset.category;
    renderShop();
  }));
  el.actionList.addEventListener("click", event => {
    const btn = event.target.closest("[data-action]");
    if (btn) doAction(btn.dataset.action, btn);
  });
  el.jobPanel.addEventListener("click", event => {
    const actionBtn = event.target.closest("[data-action]");
    const jobBtn = event.target.closest("[data-job]");
    const upgradeBtn = event.target.closest("[data-job-upgrade]");
    if (actionBtn) doAction(actionBtn.dataset.action, actionBtn);
    if (jobBtn) applyJob(jobBtn.dataset.job, jobBtn);
    if (upgradeBtn) upgradeJob(upgradeBtn.dataset.jobUpgrade, upgradeBtn);
  });
  el.shopList.addEventListener("click", event => {
    const btn = event.target.closest("[data-buy]");
    if (btn) buyItem(btn.dataset.buy, btn);
  });
  el.businessList.addEventListener("click", event => {
    const startBtn = event.target.closest("[data-start-business]");
    const upgradeBtn = event.target.closest("[data-upgrade-business]");
    const hireBtn = event.target.closest("[data-hire-business]");
    if (startBtn) startBusiness(startBtn.dataset.startBusiness, startBtn);
    if (upgradeBtn) upgradeBusiness(upgradeBtn.dataset.upgradeBusiness, upgradeBtn);
    if (hireBtn) hireEmployee(hireBtn.dataset.hireBusiness, hireBtn);
  });
  el.investmentList.addEventListener("click", event => {
    const buyBtn = event.target.closest("[data-invest-buy]");
    const sellBtn = event.target.closest("[data-invest-sell]");
    if (buyBtn) buyInvestment(buyBtn.dataset.investBuy, buyBtn);
    if (sellBtn) sellInvestment(sellBtn.dataset.investSell, sellBtn);
  });
  el.dailyBtn.addEventListener("click", () => claimDailyReward(true));
  el.mysteryBtn.addEventListener("click", () => openMysteryBox(el.mysteryBtn));
  el.eventYes.addEventListener("click", () => resolveEvent(true));
  el.eventNo.addEventListener("click", () => resolveEvent(false));
  el.resetBtn.addEventListener("click", () => {
    if (!confirm("Reset your Rise to Riches save?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    Object.assign(state, saved);
    state.displayedMoney = state.money;
    state.activeEvent = null;
    state.inventory = { cars: [], properties: [], luxury: [], special: [], ...state.inventory };
    state.holdings = { stocks: 0, crypto: 0, reit: 0, startups: 0, ...state.holdings };
    state.prices = { ...Object.fromEntries(investments.map(i => [i.id, i.price])), ...state.prices };
    state.daily = { date: todayKey(), actions: 0, earned: 0, bought: 0, risk: 0, ...state.daily };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function save() {
  state.lastSaved = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function rollDailyIfNeeded() {
  if (state.daily.date === todayKey()) return;
  state.daily = { date: todayKey(), actions: 0, earned: 0, bought: 0, risk: 0 };
  state.completedDaily = [];
}

function applyOfflineIncome() {
  const seconds = Math.min(21600, Math.floor((Date.now() - (state.lastSaved || Date.now())) / 1000));
  const earned = Math.floor(getIdleIncome() * seconds);
  if (earned <= 0) return;
  state.money += earned;
  state.totalEarned += earned;
  state.daily.earned += earned;
  log(`Idle empire earned ${money(earned)} while you were away.`, "good");
}

function currentJob() {
  return jobs.find(job => job.id === state.currentJob) || jobs[0];
}

function doJob(btn) {
  const job = currentJob();
  const jobLevel = state.jobLevels[job.id] || 1;
  const amount = Math.floor((job.basePay + rand(0, Math.floor(job.basePay * 0.5))) * (1 + (jobLevel - 1) * 0.24) * (1 + getStatusBoost()));
  gain(amount, job.xp + jobLevel * 3, `${job.icon} ${job.name} paycheck`);
  tap(btn);
}

function doAction(id, btn) {
  if (id === "job") {
    doJob(btn);
  } else {
    const action = actions.find(a => a.id === id);
    if (!action || state.level < action.level) return;
    tap(btn);
    state.actionsTaken += 1;
    state.daily.actions += 1;
    if (action.group === "Risk") state.daily.risk += 1;
    const heatPenalty = action.heat ? Math.min(0.18, state.heat / 180) : 0;
    if (Math.random() < action.risk + heatPenalty) {
      const amount = Math.min(state.money, rand(action.loss[0], action.loss[1]));
      lose(amount, `${action.icon} ${action.title} went wrong`, Math.floor(action.xp * 0.45));
      if (action.heat) state.heat = Math.min(100, state.heat + action.heat);
    } else {
      const amount = Math.floor(rand(action.reward[0], action.reward[1]) * (1 + getStatusBoost()));
      gain(amount, action.xp, `${action.icon} ${action.title}`);
      spawnCoins(btn, amount > 4000 ? 6 : 3);
      if (action.heat) state.heat = Math.min(100, state.heat + Math.floor(action.heat / 2));
    }
  }
  state.actionsTaken += id === "job" ? 1 : 0;
  state.daily.actions += id === "job" ? 1 : 0;
  maybeEvent();
  checkProgress();
  renderAll();
  save();
}

function applyJob(id, btn) {
  const job = jobs.find(j => j.id === id);
  if (!job || !canUse(job)) return;
  tap(btn);
  state.currentJob = id;
  state.jobLevels[id] = state.jobLevels[id] || 1;
  addXP(35);
  log(`New job: ${job.name}.`, "level");
  toast(`💼 Hired as ${job.name}`, "level");
  renderAll();
  save();
}

function upgradeJob(id, btn) {
  const job = jobs.find(j => j.id === id);
  if (!job || state.currentJob !== id) return;
  const lvl = state.jobLevels[id] || 1;
  const cost = Math.floor(job.basePay * 12 * lvl * 1.45);
  if (!pay(cost, "Need more cash for job training.")) return;
  tap(btn);
  state.jobLevels[id] = lvl + 1;
  gain(0, 45 + lvl * 8, `Trained ${job.name} to level ${lvl + 1}`, false);
  toast(`📚 Job upgraded to Lv ${lvl + 1}`, "level");
  renderAll();
  save();
}

function buyItem(id, btn) {
  const category = state.shopCategory;
  const item = shopItems[category].find(i => i.id === id);
  if (!item || owns(category, id) || !canUse(item)) return;
  if (!pay(item.price, `Need ${money(item.price - state.money)} more.`)) return;
  tap(btn);
  state.inventory[category].push(id);
  state.daily.bought += 1;
  addXP(item.price > 1000000 ? 900 : item.price > 100000 ? 360 : 80);
  log(`✨ Bought ${item.name} (${item.rarity}).`, "good");
  toast(`✨ Bought ${item.name}!`, item.rarity === "Legendary" ? "level" : "good");
  play(item.rarity === "Legendary" ? "level" : "success");
  checkProgress();
  renderAll();
  save();
}

function startBusiness(id, btn) {
  const biz = businessTypes.find(b => b.id === id);
  if (!biz || state.businesses[id] || !canUse(biz)) return;
  if (!pay(biz.cost, `Need ${money(biz.cost - state.money)} to start ${biz.name}.`)) return;
  tap(btn);
  state.businesses[id] = { level: 1, employees: 0, automated: false };
  addXP(120 + biz.level * 12);
  log(`🏢 Started ${biz.name}.`, "level");
  toast(`🏢 ${biz.name} launched!`, "level");
  checkProgress();
  renderAll();
  save();
}

function upgradeBusiness(id, btn) {
  const biz = businessTypes.find(b => b.id === id);
  const owned = state.businesses[id];
  if (!biz || !owned) return;
  const cost = Math.floor(biz.cost * Math.pow(1.52, owned.level));
  if (!pay(cost, "Need more money to upgrade.")) return;
  tap(btn);
  owned.level += 1;
  addXP(100 + owned.level * 24);
  log(`Upgraded ${biz.name} to level ${owned.level}.`, "good");
  toast(`⬆️ ${biz.name} Lv ${owned.level}`, "good");
  checkProgress();
  renderAll();
  save();
}

function hireEmployee(id, btn) {
  const biz = businessTypes.find(b => b.id === id);
  const owned = state.businesses[id];
  if (!biz || !owned) return;
  const cost = Math.floor(biz.cost * 0.7 * (owned.employees + 1));
  if (!pay(cost, "Need more money to hire.")) return;
  tap(btn);
  owned.employees += 1;
  if (owned.employees >= 3) owned.automated = true;
  addXP(70 + owned.employees * 20);
  log(`Hired employee #${owned.employees} for ${biz.name}.`, "good");
  toast(owned.automated ? `🤖 ${biz.name} automated` : `👥 Employee hired`, "good");
  renderAll();
  save();
}

function buyInvestment(id, btn) {
  const inv = investments.find(i => i.id === id);
  const price = Math.ceil(state.prices[id]);
  if (!inv || state.level < inv.level || !pay(price, `Need ${money(price - state.money)} to buy.`)) return;
  tap(btn);
  state.holdings[id] += 1;
  addXP(30 + inv.level * 3);
  log(`Bought 1 ${inv.name} at ${money(price)}.`, "neutral");
  checkProgress();
  renderAll();
  save();
}

function sellInvestment(id, btn) {
  const inv = investments.find(i => i.id === id);
  if (!inv || state.holdings[id] <= 0) return;
  tap(btn);
  const price = Math.floor(state.prices[id]);
  state.holdings[id] -= 1;
  gain(price, 28 + inv.level * 3, `Sold 1 ${inv.name}`);
  renderAll();
  save();
}

function moveMarkets() {
  investments.forEach(inv => {
    const drift = (Math.random() - 0.47) * inv.volatility;
    const shock = Math.random() < 0.08 ? (Math.random() - 0.5) * inv.volatility * 4 : 0;
    const next = state.prices[inv.id] * (1 + drift + shock);
    state.prices[inv.id] = Math.max(inv.price * 0.35, Math.min(inv.price * 8, next));
  });
  if (state.currentPage === "businessPage") renderInvestments();
}

function claimDailyReward(manual) {
  if (Date.now() - state.lastDailyReward < DAY_MS) {
    if (manual) toast("Daily reward already claimed.", "neutral");
    return;
  }
  const amount = 400 + state.level * 120 + Math.floor(getIdleIncome() * 90);
  state.lastDailyReward = Date.now();
  gain(amount, 90, "🎁 Daily reward");
  toast(`🎁 Daily reward ${money(amount)}`, "level");
  renderAll();
  save();
}

function openMysteryBox(btn) {
  const cost = Math.max(250, Math.floor(350 * Math.pow(1.09, state.level)));
  if (!pay(cost, `Need ${money(cost - state.money)} for a mystery box.`)) return;
  tap(btn);
  const roll = Math.random();
  if (roll < 0.12) {
    const category = Math.random() < 0.5 ? "special" : "luxury";
    const pool = shopItems[category].filter(item => !owns(category, item.id) && item.level <= state.level + 4);
    if (pool.length) {
      const item = pool[rand(0, pool.length - 1)];
      state.inventory[category].push(item.id);
      state.daily.bought += 1;
      addXP(220);
      log(`Mystery box dropped ${item.name}!`, "level");
      toast(`🎲 Rare drop: ${item.name}!`, "level");
      play("level");
    } else {
      gain(cost * 2, 140, "Mystery box cash jackpot");
    }
  } else if (roll < 0.72) {
    gain(rand(cost, cost * 4), 90, "Mystery box cash");
  } else {
    lose(Math.min(state.money, Math.floor(cost * 0.55)), "Mystery box dud", 45);
  }
  checkProgress();
  renderAll();
  save();
}

function gain(amount, xp, label, addCash = true) {
  if (addCash && amount > 0) {
    state.money += amount;
    state.totalEarned += amount;
    state.daily.earned += amount;
  }
  addXP(xp);
  log(`${label}${amount > 0 ? `: +${money(amount)}` : ""} and +${xp} XP`, amount > 0 ? "good" : "neutral");
  animateMoney();
  play(amount > 0 ? "coin" : "success");
}

function lose(amount, label, xp = 0) {
  state.money = Math.max(0, state.money - amount);
  state.totalSpent += amount;
  addXP(xp);
  log(`${label}: -${money(amount)} but +${xp} XP`, "bad");
  flashLoss();
  animateMoney();
  play("loss");
}

function pay(amount, message) {
  if (state.money < amount) {
    toast(message, "bad");
    flashLoss();
    play("loss");
    return false;
  }
  state.money -= amount;
  state.totalSpent += amount;
  animateMoney();
  return true;
}

function addXP(amount) {
  state.xp += amount;
  while (state.xp >= xpNeed()) {
    state.xp -= xpNeed();
    state.level += 1;
    const bonus = state.level * 160;
    state.money += bonus;
    state.totalEarned += bonus;
    state.daily.earned += bonus;
    log(`Level up! Level ${state.level} reward: ${money(bonus)}.`, "level");
    toast(`🚀 Level ${state.level}! +${money(bonus)}`, "level");
    play("level");
    glowDash();
  }
}

function xpNeed() {
  return 100 + (state.level - 1) * 70;
}

function tickIdle() {
  const income = getIdleIncome();
  if (income <= 0) return;
  const amount = Math.max(1, Math.floor(income));
  state.money += amount;
  state.totalEarned += amount;
  state.daily.earned += amount;
  state.heat = Math.max(0, state.heat - 0.05);
  animateMoney();
  checkProgress(false);
  renderHeader();
}

function getIdleIncome(s = state) {
  let itemIncome = Object.entries(s.inventory).reduce((sum, [category, ids]) => {
    return sum + ids.reduce((catSum, id) => {
      const item = shopItems[category].find(i => i.id === id);
      return catSum + (item ? item.income : 0);
    }, 0);
  }, 0);
  let bizIncome = Object.entries(s.businesses).reduce((sum, [id, owned]) => {
    const biz = businessTypes.find(b => b.id === id);
    if (!biz) return sum;
    const employeeBoost = 1 + owned.employees * 0.22;
    const autoBoost = owned.automated ? 1.35 : 1;
    return sum + biz.baseIncome * owned.level * employeeBoost * autoBoost;
  }, 0);
  return itemIncome + bizIncome;
}

function getStatusBoost() {
  const luxury = state.inventory.luxury.length * 0.025;
  const cars = state.inventory.cars.length * 0.018;
  const rank = ranks.findIndex(r => r.name === getRank()) * 0.025;
  return luxury + cars + rank;
}

function getNetWorth(s = state) {
  const items = Object.entries(s.inventory).reduce((sum, [category, ids]) => {
    return sum + ids.reduce((catSum, id) => {
      const item = shopItems[category].find(i => i.id === id);
      return catSum + (item ? item.price : 0);
    }, 0);
  }, 0);
  const businesses = Object.entries(s.businesses).reduce((sum, [id, owned]) => {
    const biz = businessTypes.find(b => b.id === id);
    if (!biz) return sum;
    return sum + biz.cost + biz.cost * 0.45 * owned.level + biz.cost * 0.18 * owned.employees;
  }, 0);
  const market = Object.entries(s.holdings).reduce((sum, [id, qty]) => sum + qty * (s.prices[id] || 0), 0);
  return Math.floor(s.money + items + businesses + market);
}

function getRank() {
  return ranks.slice().reverse().find(rank => getNetWorth() >= rank.min).name;
}

function canUse(item) {
  return state.level >= item.level && getNetWorth() >= (item.worth || 0);
}

function maybeEvent() {
  if (state.activeEvent || state.actionsTaken < 3) return;
  const odds = state.heat > 45 ? 0.42 : 0.27;
  if (Math.random() > odds) return;
  const event = events[rand(0, events.length - 1)];
  state.activeEvent = event.title;
  el.eventTitle.textContent = event.title;
  el.eventText.textContent = event.text;
  el.eventModal.classList.remove("hidden");
  el.eventModal.classList.add("flex");
  play("success");
}

function resolveEvent(accepted) {
  const event = events.find(e => e.title === state.activeEvent);
  el.eventModal.classList.add("hidden");
  el.eventModal.classList.remove("flex");
  state.activeEvent = null;
  if (!event) return;
  accepted ? event.yes() : event.no();
  checkProgress();
  renderAll();
  save();
}

function chance(successRate, rewardRange, lossRange, xp, label) {
  if (Math.random() < successRate) gain(rand(rewardRange[0], rewardRange[1]), xp, label);
  else lose(Math.min(state.money, rand(lossRange[0], lossRange[1])), label, Math.floor(xp * 0.45));
}

function checkProgress(render = true) {
  rollDailyIfNeeded();
  missions.forEach(mission => {
    if (state.completedMissions.includes(mission.id) || !mission.done(state)) return;
    state.completedMissions.push(mission.id);
    state.money += mission.reward;
    state.totalEarned += mission.reward;
    addXP(mission.xp);
    log(`Mission complete: ${mission.text}. Reward ${money(mission.reward)}!`, "level");
    toast(`🏆 ${mission.text}`, "level");
  });
  dailyTemplates.forEach(mission => {
    if (state.completedDaily.includes(mission.id) || mission.get(state) < mission.target) return;
    state.completedDaily.push(mission.id);
    state.money += mission.reward;
    state.totalEarned += mission.reward;
    addXP(mission.xp);
    log(`Daily complete: ${mission.text}.`, "level");
    toast(`✅ Daily: ${mission.text}`, "level");
  });
  if (render) renderAll();
}

function renderAll() {
  renderHeader();
  renderJobs();
  renderActions();
  renderShop();
  renderBusinesses();
  renderInvestments();
  renderMissions();
  renderProfile();
  updateNav();
}

function renderHeader() {
  animateMoney();
  el.rankDisplay.textContent = getRank();
  el.levelDisplay.textContent = state.level;
  el.idleDisplay.textContent = `${money(getIdleIncome())}`;
  el.netWorthDisplay.textContent = money(getNetWorth());
  el.xpText.textContent = `${state.xp} / ${xpNeed()} XP`;
  el.xpBar.style.width = `${Math.min(100, Math.round((state.xp / xpNeed()) * 100))}%`;
  const canDaily = Date.now() - state.lastDailyReward >= DAY_MS;
  el.dailyBtn.classList.toggle("opacity-50", !canDaily);
  el.dailyBtn.textContent = canDaily ? "🎁 Daily" : "✅ Claimed";
}

function renderJobs() {
  const job = currentJob();
  const lvl = state.jobLevels[job.id] || 1;
  const trainCost = Math.floor(job.basePay * 12 * lvl * 1.45);
  el.jobPanel.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Current Job</p>
        <h3 class="mt-1 text-lg font-black">${job.icon} ${job.name} Lv ${lvl}</h3>
        <p class="mt-1 text-xs text-slate-400">Pay scales with training, rank, cars, and luxury status.</p>
      </div>
      <button data-action="job" class="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 active:scale-95">Work</button>
    </div>
    <button data-job-upgrade="${job.id}" class="mt-3 w-full rounded-2xl bg-cyan-400/14 px-4 py-3 text-sm font-black text-cyan-200 active:scale-95">Train Job Skill - ${money(trainCost)}</button>
    <div class="mt-3 grid gap-2">
      ${jobs.map(j => {
        const unlocked = canUse(j);
        const active = j.id === state.currentJob;
        return `<button data-job="${j.id}" class="rounded-2xl px-3 py-3 text-left text-sm font-black ${active ? "bg-emerald-400 text-slate-950" : unlocked ? "bg-slate-900 text-slate-100" : "bg-slate-950/70 text-slate-500"}" ${!unlocked ? "disabled" : ""}>
          ${j.icon} ${j.name} ${active ? "• Active" : unlocked ? `• ${money(j.basePay)}+` : `• Lv ${j.level} / ${money(j.worth)} worth`}
        </button>`;
      }).join("")}
    </div>`;
}

function renderActions() {
  const groups = [...new Set(actions.map(a => a.group))];
  el.actionList.innerHTML = groups.map(group => `
    <div class="space-y-3">
      <h3 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">${group}</h3>
      ${actions.filter(a => a.group === group).map(actionCard).join("")}
    </div>`).join("");
}

function actionCard(action) {
  const locked = state.level < action.level;
  return `<button data-action="${action.id}" class="w-full rounded-[24px] border border-white/10 ${locked ? "bg-slate-900/55 opacity-60" : "glass"} p-4 text-left shadow-xl shadow-black/25 active:scale-[0.98]" ${locked ? "disabled" : ""}>
    <div class="flex items-center gap-3">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 text-2xl">${action.icon}</div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <h3 class="truncate font-black text-white">${action.title}</h3>
          <span class="text-xs font-black ${action.risk > 0.45 ? "text-rose-300" : "text-emerald-300"}">${locked ? `LV ${action.level}` : `+${action.xp} XP`}</span>
        </div>
        <p class="mt-1 text-xs text-slate-400">${action.subtitle}</p>
        <p class="mt-2 text-sm font-black text-emerald-200">${locked ? "Locked" : `${money(action.reward[0])} - ${money(action.reward[1])}`}</p>
      </div>
    </div>
  </button>`;
}

function renderShop() {
  document.querySelectorAll(".shop-tab").forEach(btn => {
    const active = btn.dataset.category === state.shopCategory;
    btn.className = `shop-tab rounded-2xl px-2 py-3 text-xs font-black ${active ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-200"}`;
  });
  el.shopList.innerHTML = shopItems[state.shopCategory].map(item => {
    const owned = owns(state.shopCategory, item.id);
    const locked = !canUse(item);
    const canBuy = !owned && !locked && state.money >= item.price;
    return `<article class="glass rounded-[24px] border border-white/10 p-4 shadow-xl shadow-black/25">
      <div class="flex items-start gap-3">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 text-3xl">${item.icon}</div>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="font-black text-white">${item.name}</h3>
              <span class="mt-2 inline-flex rounded-full border px-2 py-1 text-[11px] font-black ${rarityClass[item.rarity]}">${item.rarity}</span>
            </div>
            <p class="text-right text-sm font-black text-emerald-200">${money(item.price)}</p>
          </div>
          <p class="mt-3 text-xs text-slate-400">Passive +${money(item.income)}/sec • Unlock Lv ${item.level}</p>
          <button data-buy="${item.id}" class="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-black active:scale-95 ${owned ? "bg-slate-700 text-slate-300" : canBuy ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}" ${owned || locked ? "disabled" : ""}>
            ${owned ? "Owned" : locked ? `Unlocks at Lv ${item.level}` : "Buy Now"}
          </button>
        </div>
      </div>
    </article>`;
  }).join("");
}

function renderBusinesses() {
  el.businessSummary.textContent = `${money(getIdleIncome())}/sec`;
  el.businessList.innerHTML = businessTypes.map(biz => {
    const owned = state.businesses[biz.id];
    const unlocked = canUse(biz);
    if (!owned) {
      return `<article class="glass rounded-[24px] border border-white/10 p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="font-black">${biz.icon} ${biz.name}</h3>
            <p class="mt-1 text-xs text-slate-400">Base income ${money(biz.baseIncome)}/sec • Unlock Lv ${biz.level}</p>
          </div>
          <button data-start-business="${biz.id}" class="rounded-2xl px-4 py-3 text-sm font-black ${unlocked && state.money >= biz.cost ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}" ${!unlocked ? "disabled" : ""}>${money(biz.cost)}</button>
        </div>
      </article>`;
    }
    const income = biz.baseIncome * owned.level * (1 + owned.employees * 0.22) * (owned.automated ? 1.35 : 1);
    const upgradeCost = Math.floor(biz.cost * Math.pow(1.52, owned.level));
    const hireCost = Math.floor(biz.cost * 0.7 * (owned.employees + 1));
    return `<article class="glass rounded-[24px] border border-white/10 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-black">${biz.icon} ${biz.name}</h3>
          <p class="mt-1 text-xs text-slate-400">Lv ${owned.level} • ${owned.employees} employees • ${owned.automated ? "Automated" : "Manual"}</p>
          <p class="mt-2 text-sm font-black text-cyan-200">${money(income)}/sec</p>
        </div>
        <span class="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-black text-emerald-200">Owned</span>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button data-upgrade-business="${biz.id}" class="rounded-2xl bg-emerald-400 px-3 py-3 text-xs font-black text-slate-950 active:scale-95">Upgrade ${money(upgradeCost)}</button>
        <button data-hire-business="${biz.id}" class="rounded-2xl bg-cyan-400/14 px-3 py-3 text-xs font-black text-cyan-200 active:scale-95">Hire ${money(hireCost)}</button>
      </div>
    </article>`;
  }).join("");
}

function renderInvestments() {
  el.investmentList.innerHTML = investments.map(inv => {
    const qty = state.holdings[inv.id] || 0;
    const price = Math.ceil(state.prices[inv.id]);
    const locked = state.level < inv.level;
    const up = price >= inv.price;
    return `<article class="rounded-[22px] bg-slate-950/70 p-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h4 class="font-black">${inv.icon} ${inv.name}</h4>
          <p class="mt-1 text-xs text-slate-400">${inv.risk} risk • Owned ${qty} • Lv ${inv.level}</p>
        </div>
        <p class="text-right text-sm font-black ${up ? "text-emerald-200" : "text-rose-200"}">${money(price)}</p>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button data-invest-buy="${inv.id}" class="rounded-2xl px-3 py-3 text-xs font-black ${!locked && state.money >= price ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}" ${locked ? "disabled" : ""}>Buy</button>
        <button data-invest-sell="${inv.id}" class="rounded-2xl px-3 py-3 text-xs font-black ${qty > 0 ? "bg-amber-300 text-slate-950" : "bg-slate-800 text-slate-500"}" ${qty <= 0 ? "disabled" : ""}>Sell</button>
      </div>
    </article>`;
  }).join("");
}

function renderMissions() {
  const allCount = missions.length + dailyTemplates.length;
  const doneCount = state.completedMissions.length + state.completedDaily.length;
  el.missionCount.textContent = `${doneCount}/${allCount}`;
  const dailyHtml = dailyTemplates.map(m => missionRow(m, state.completedDaily.includes(m.id), m.get(state), m.target, "Daily")).join("");
  const longHtml = missions.map(m => missionRow(m, state.completedMissions.includes(m.id), m.done(state) ? 1 : 0, 1, "Goal")).join("");
  el.missionList.innerHTML = dailyHtml + longHtml;
}

function missionRow(mission, done, progress, target, type) {
  const pct = Math.min(100, Math.round((progress / target) * 100));
  return `<div class="rounded-2xl bg-slate-950/70 p-3">
    <div class="flex items-center justify-between gap-3">
      <p class="min-w-0 truncate text-sm font-bold ${done ? "text-emerald-200" : "text-white"}">${done ? "✅" : type === "Daily" ? "📅" : "🎯"} ${mission.text}</p>
      <span class="text-xs font-black ${done ? "text-emerald-300" : "text-slate-500"}">${done ? "Done" : `${Math.floor(progress)}/${target}`}</span>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div class="h-full rounded-full bg-emerald-400 transition-all" style="width:${done ? 100 : pct}%"></div></div>
    <p class="mt-2 text-xs text-slate-500">Reward ${money(mission.reward)} • +${mission.xp} XP</p>
  </div>`;
}

function renderProfile() {
  el.earnedDisplay.textContent = money(state.totalEarned);
  el.spentDisplay.textContent = money(state.totalSpent);
  el.actionsDisplay.textContent = state.actionsTaken.toLocaleString();
  el.ownedDisplay.textContent = Object.values(state.inventory).reduce((sum, ids) => sum + ids.length, 0);
  el.achievementList.innerHTML = ranks.map(rank => {
    const hit = getNetWorth() >= rank.min;
    return `<div class="flex items-center justify-between rounded-2xl bg-slate-950/70 p-3">
      <span class="text-sm font-bold">${hit ? "✅" : "🔒"} ${rank.name}</span>
      <span class="text-xs font-black text-slate-400">${money(rank.min)}</span>
    </div>`;
  }).join("");
  el.activityList.innerHTML = state.history.length
    ? state.history.map(item => `<div class="rounded-2xl bg-slate-950/70 p-3 text-sm ${item.tone === "bad" ? "text-rose-200" : item.tone === "level" ? "text-amber-200" : item.tone === "good" ? "text-emerald-200" : "text-slate-300"}">${item.text}<p class="mt-1 text-[11px] text-slate-500">${item.time}</p></div>`).join("")
    : `<p class="rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-500">No activity yet.</p>`;
}

function activatePage(pageId) {
  state.currentPage = pageId;
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.id === pageId));
  updateNav();
}

function updateNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    const active = btn.dataset.page === state.currentPage;
    btn.className = `nav-btn rounded-2xl px-2 py-3 text-xs font-black ${active ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-200"}`;
  });
}

function animateMoney() {
  const start = state.displayedMoney;
  const end = state.money;
  if (start === end) {
    el.moneyDisplay.textContent = money(end);
    return;
  }
  const started = performance.now();
  const duration = 420;
  el.moneyDisplay.classList.remove("pop");
  void el.moneyDisplay.offsetWidth;
  el.moneyDisplay.classList.add("pop");
  function frame(now) {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    state.displayedMoney = Math.round(start + (end - start) * eased);
    el.moneyDisplay.textContent = money(state.displayedMoney);
    if (progress < 1) requestAnimationFrame(frame);
    else {
      state.displayedMoney = end;
      el.moneyDisplay.textContent = money(end);
    }
  }
  requestAnimationFrame(frame);
}

function tap(node) {
  node.classList.remove("press");
  void node.offsetWidth;
  node.classList.add("press");
}

function flashLoss() {
  document.body.classList.remove("loss-flash");
  el.gameRoot.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("loss-flash");
  el.gameRoot.classList.add("shake");
}

function glowDash() {
  el.dashCard.classList.remove("big-glow");
  void el.dashCard.offsetWidth;
  el.dashCard.classList.add("big-glow");
}

function spawnCoins(anchor, count) {
  const rect = anchor.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("div");
    node.className = "float-coin text-2xl";
    node.textContent = "💰";
    node.style.left = `${rect.left + rect.width * Math.random()}px`;
    node.style.top = `${rect.top + rect.height * 0.35}px`;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 840);
  }
}

function toast(text, tone = "good") {
  const node = document.createElement("div");
  const color = tone === "bad"
    ? "border-rose-400/30 bg-rose-500/15 text-rose-100"
    : tone === "level"
      ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
      : tone === "neutral"
        ? "border-slate-400/30 bg-slate-700/50 text-slate-100"
        : "border-emerald-400/30 bg-emerald-400/15 text-emerald-100";
  node.className = `rounded-2xl border px-4 py-3 text-sm font-black shadow-xl shadow-black/30 backdrop-blur-xl ${color}`;
  node.textContent = text;
  el.toastHost.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

function log(text, tone = "neutral") {
  state.history.unshift({ text, tone, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  state.history = state.history.slice(0, 24);
}

function owns(category, id) {
  return state.inventory[category].includes(id);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function money(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  if (abs >= 1000000000) return `$${(n / 1000000000).toFixed(2)}B`;
  if (abs >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (abs >= 10000) return `$${Math.round(n).toLocaleString()}`;
  if (abs < 10 && n % 1 !== 0) return `$${n.toFixed(2)}`;
  return `$${Math.round(n).toLocaleString()}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play(type) {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gainNode = audio.createGain();
    const sounds = {
      coin: [660, 0.06, "triangle"],
      success: [880, 0.1, "sine"],
      level: [523, 0.18, "triangle"],
      loss: [130, 0.16, "sawtooth"]
    };
    const [freq, seconds, wave] = sounds[type] || sounds.coin;
    osc.frequency.value = freq;
    osc.type = wave;
    gainNode.gain.setValueAtTime(0.001, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + seconds);
    osc.connect(gainNode);
    gainNode.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + seconds);
  } catch {
    // Browser audio can be blocked until user interaction.
  }
}
