const STORAGE_KEY = "rise-to-riches-v2";
const DAY_MS = 24 * 60 * 60 * 1000;

const ranks = [
  { name: "Poor", min: 0 },
  { name: "Worker", min: 1000 },
  { name: "Businessman", min: 25000 },
  { name: "Millionaire", min: 1000000 },
  { name: "Billionaire", min: 1000000000 }
];

const rarityStyles = {
  Common: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  Rare: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  Epic: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200",
  Legendary: "border-amber-300/50 bg-amber-300/12 text-amber-200"
};

const actions = [
  { id: "job", icon: "💼", title: "Work a Job", subtitle: "Low risk, steady cash", reward: [25, 55], xp: 14, risk: 0, unlock: 1 },
  { id: "side", icon: "🛵", title: "Side Hustle", subtitle: "Fast gigs with surprise tips", reward: [55, 140], xp: 24, risk: 0.14, loss: [10, 35], unlock: 1 },
  { id: "cars", icon: "🚗", title: "Flip a Car", subtitle: "Buy cheap, sell higher", reward: [220, 650], xp: 45, risk: 0.3, loss: [80, 260], unlock: 3 },
  { id: "stocks", icon: "📈", title: "Stock Trade", subtitle: "Balanced market risk", reward: [260, 900], xp: 50, risk: 0.32, loss: [120, 420], unlock: 4 },
  { id: "crypto", icon: "🪙", title: "Crypto Bet", subtitle: "Big swings, big dopamine", reward: [600, 2200], xp: 78, risk: 0.48, loss: [260, 950], unlock: 6 },
  { id: "property", icon: "🏠", title: "Property Deal", subtitle: "Flip contracts for profit", reward: [1300, 4800], xp: 110, risk: 0.38, loss: [600, 1800], unlock: 9 },
  { id: "gamble", icon: "🎲", title: "High Roller", subtitle: "Double or disaster", reward: [5000, 16000], xp: 160, risk: 0.56, loss: [2500, 9000], unlock: 13 }
];

const shopItems = {
  cars: [
    { id: "bike", icon: "🚲", name: "Delivery Bike", price: 180, income: 0.08, xp: 20, rarity: "Common", level: 1 },
    { id: "sedan", icon: "🚗", name: "Used Sedan", price: 750, income: 0.28, xp: 38, rarity: "Common", level: 2 },
    { id: "sports", icon: "🏎️", name: "Sports Coupe", price: 8500, income: 1.7, xp: 95, rarity: "Rare", level: 6 },
    { id: "lambo", icon: "🐂", name: "Lamborghini", price: 85000, income: 9.5, xp: 260, rarity: "Epic", level: 12 },
    { id: "hypercar", icon: "🚀", name: "Golden Hypercar", price: 900000, income: 58, xp: 700, rarity: "Legendary", level: 20 }
  ],
  houses: [
    { id: "room", icon: "🛏️", name: "Tiny Room", price: 400, income: 0.12, xp: 24, rarity: "Common", level: 1 },
    { id: "apartment", icon: "🏢", name: "Apartment", price: 3500, income: 0.8, xp: 70, rarity: "Rare", level: 4 },
    { id: "house", icon: "🏠", name: "Suburban House", price: 28000, income: 4.2, xp: 160, rarity: "Rare", level: 9 },
    { id: "mansion", icon: "🏰", name: "Mansion", price: 250000, income: 22, xp: 420, rarity: "Epic", level: 16 },
    { id: "island", icon: "🌴", name: "Private Island", price: 5000000, income: 210, xp: 1200, rarity: "Legendary", level: 28 }
  ],
  fashion: [
    { id: "chain", icon: "⛓️", name: "Silver Chain", price: 120, income: 0.03, xp: 18, rarity: "Common", level: 1 },
    { id: "bag", icon: "👜", name: "Designer Bag", price: 1400, income: 0.35, xp: 44, rarity: "Rare", level: 3 },
    { id: "watch", icon: "⌚", name: "Luxury Watch", price: 12000, income: 2.5, xp: 120, rarity: "Epic", level: 8 },
    { id: "crown", icon: "👑", name: "Diamond Crown", price: 450000, income: 38, xp: 620, rarity: "Legendary", level: 19 }
  ],
  businesses: [
    { id: "cart", icon: "🌭", name: "Food Cart", price: 950, income: 0.65, xp: 45, rarity: "Common", level: 2 },
    { id: "garage", icon: "🔧", name: "Car Garage", price: 9500, income: 3.2, xp: 130, rarity: "Rare", level: 7 },
    { id: "coffee", icon: "☕", name: "Coffee Chain", price: 65000, income: 13, xp: 300, rarity: "Epic", level: 12 },
    { id: "startup", icon: "💻", name: "Tech Startup", price: 600000, income: 75, xp: 850, rarity: "Legendary", level: 22 },
    { id: "empire", icon: "🏦", name: "Global Holdings", price: 12000000, income: 520, xp: 2200, rarity: "Legendary", level: 34 }
  ]
};

const missions = [
  { id: "cash1k", text: "Reach $1,000", reward: 250, xp: 50, done: s => s.money >= 1000 },
  { id: "firstCar", text: "Buy your first car", reward: 500, xp: 70, done: s => s.inventory.cars.length >= 1 },
  { id: "level5", text: "Reach Level 5", reward: 900, xp: 90, done: s => s.level >= 5 },
  { id: "business", text: "Own a business", reward: 1800, xp: 140, done: s => s.inventory.businesses.length >= 1 },
  { id: "millionaire", text: "Become a Millionaire", reward: 100000, xp: 1200, done: s => getNetWorth(s) >= 1000000 }
];

const randomEvents = [
  {
    title: "Car Flip Lead",
    text: "A mechanic found an underpriced car. Buy it and try to flip?",
    yes: () => chanceOutcome(0.68, [420, 1100], [120, 360], 65, "Flipped a car"),
    no: () => log("Skipped a risky car flip.", "neutral")
  },
  {
    title: "Market Crash",
    text: "Crypto is crashing. Buy the dip?",
    yes: () => chanceOutcome(0.44, [900, 3000], [280, 1200], 95, "Bought the dip"),
    no: () => reward(80, 18, "Stayed calm and saved capital", "neutral")
  },
  {
    title: "Rich Client",
    text: "A wealthy client wants urgent work. Accept the job?",
    yes: () => reward(rand(350, 900), 72, "Rich client paid you", "good"),
    no: () => log("You protected your energy and passed.", "neutral")
  },
  {
    title: "Bad Contract",
    text: "A contract looks suspicious but pays well. Sign it?",
    yes: () => chanceOutcome(0.52, [700, 1800], [350, 900], 80, "Contract gamble"),
    no: () => reward(120, 22, "Avoided a bad contract", "neutral")
  }
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
  shopCategory: "cars",
  inventory: { cars: [], houses: [], fashion: [], businesses: [] },
  completedMissions: [],
  history: [],
  lastDaily: 0,
  lastSaved: Date.now(),
  activeEvent: null
};

const el = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  bindElements();
  load();
  applyOfflineIncome();
  bindEvents();
  renderAll();
  setInterval(tickIdleIncome, 1000);
  setInterval(save, 5000);
}

function bindElements() {
  [
    "gameRoot", "moneyDisplay", "rankDisplay", "levelDisplay", "idleDisplay", "netWorthDisplay", "xpText", "xpBar",
    "dailyBtn", "actionList", "missionCount", "missionList", "shopList", "earnedDisplay", "spentDisplay",
    "actionsDisplay", "ownedDisplay", "achievementList", "activityList", "resetBtn", "eventModal", "eventTag",
    "eventTitle", "eventText", "eventYes", "eventNo", "toastHost"
  ].forEach(id => { el[id] = document.getElementById(id); });
}

function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach(btn => btn.addEventListener("click", () => activatePage(btn.dataset.page)));
  document.querySelectorAll(".shop-tab").forEach(btn => btn.addEventListener("click", () => {
    state.shopCategory = btn.dataset.category;
    tap(btn);
    renderShop();
  }));
  el.actionList.addEventListener("click", event => {
    const btn = event.target.closest("[data-action]");
    if (btn) performAction(btn.dataset.action, btn);
  });
  el.shopList.addEventListener("click", event => {
    const btn = event.target.closest("[data-buy]");
    if (btn) buyItem(btn.dataset.buy, btn);
  });
  el.dailyBtn.addEventListener("click", () => claimDaily(true));
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
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function save() {
  state.lastSaved = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyOfflineIncome() {
  const seconds = Math.min(7200, Math.floor((Date.now() - (state.lastSaved || Date.now())) / 1000));
  const income = Math.floor(getIdleIncome() * seconds);
  if (income > 0) {
    state.money += income;
    state.totalEarned += income;
    log(`Idle empire earned ${money(income)} while away.`, "good");
  }
}

function performAction(actionId, btn) {
  const action = actions.find(item => item.id === actionId);
  if (!action || state.level < action.unlock) return;
  tap(btn);
  state.actionsTaken += 1;

  const lost = action.risk && Math.random() < action.risk;
  if (lost) {
    const loss = Math.min(state.money, rand(action.loss[0], action.loss[1]));
    spend(loss, `${action.title} failed`, action.xp);
    play("loss");
  } else {
    const bonus = 1 + getIncomeBoost();
    const amount = Math.floor(rand(action.reward[0], action.reward[1]) * bonus);
    reward(amount, action.xp, action.title, "good");
    spawnCoins(btn, amount > 1000 ? 5 : 3);
  }

  maybeRandomEvent();
  checkMissions();
  renderAll();
  save();
}

function buyItem(itemId, btn) {
  const category = state.shopCategory;
  const item = shopItems[category].find(entry => entry.id === itemId);
  if (!item || owns(category, item.id) || state.level < item.level) return;
  if (state.money < item.price) {
    flashLoss();
    toast(`Need ${money(item.price - state.money)} more`, "bad");
    play("loss");
    return;
  }

  tap(btn);
  state.money -= item.price;
  state.totalSpent += item.price;
  state.inventory[category].push(item.id);
  addXP(item.xp);
  log(`✨ You bought ${item.name}!`, "good");
  toast(`✨ You bought ${item.name}!`, "good");
  play(item.rarity === "Legendary" ? "level" : "success");
  checkMissions();
  renderAll();
  save();
}

function reward(amount, xp, label, tone = "good") {
  state.money += amount;
  state.totalEarned += amount;
  addXP(xp);
  log(`${label}: +${money(amount)} and +${xp} XP`, tone);
  animateMoney();
  play("coin");
}

function spend(amount, label, xp = 0) {
  state.money = Math.max(0, state.money - amount);
  state.totalSpent += amount;
  addXP(xp);
  log(`${label}: -${money(amount)} but gained +${xp} XP`, "bad");
  flashLoss();
  animateMoney();
}

function addXP(amount) {
  state.xp += amount;
  while (state.xp >= xpNeeded()) {
    state.xp -= xpNeeded();
    state.level += 1;
    const bonus = state.level * 125;
    state.money += bonus;
    state.totalEarned += bonus;
    log(`LEVEL UP! Level ${state.level} reward: ${money(bonus)}`, "level");
    toast(`🚀 Level ${state.level}! +${money(bonus)}`, "level");
    play("level");
  }
}

function xpNeeded() {
  return 100 + (state.level - 1) * 55;
}

function tickIdleIncome() {
  const idle = getIdleIncome();
  if (idle <= 0) return;
  const amount = Math.max(1, Math.floor(idle));
  state.money += amount;
  state.totalEarned += amount;
  animateMoney();
  checkMissions(false);
  renderHeader();
}

function getIdleIncome() {
  return Object.entries(state.inventory).reduce((sum, [category, ids]) => {
    return sum + ids.reduce((catSum, id) => {
      const item = shopItems[category].find(entry => entry.id === id);
      return catSum + (item ? item.income : 0);
    }, 0);
  }, 0);
}

function getIncomeBoost() {
  const fashionCount = state.inventory.fashion.length;
  const carCount = state.inventory.cars.length;
  return fashionCount * 0.03 + carCount * 0.02;
}

function getNetWorth(s = state) {
  return Math.floor(s.money + Object.entries(s.inventory).reduce((sum, [category, ids]) => {
    return sum + ids.reduce((catSum, id) => {
      const item = shopItems[category].find(entry => entry.id === id);
      return catSum + (item ? item.price : 0);
    }, 0);
  }, 0));
}

function getRank() {
  return ranks.slice().reverse().find(rank => getNetWorth() >= rank.min).name;
}

function maybeRandomEvent() {
  if (state.activeEvent || state.actionsTaken < 2) return;
  if (Math.random() > 0.28) return;
  state.activeEvent = randomEvents[rand(0, randomEvents.length - 1)].title;
  const event = randomEvents.find(item => item.title === state.activeEvent);
  el.eventTitle.textContent = event.title;
  el.eventText.textContent = event.text;
  el.eventModal.classList.remove("hidden");
  el.eventModal.classList.add("flex");
  play("success");
}

function resolveEvent(yes) {
  const event = randomEvents.find(item => item.title === state.activeEvent);
  el.eventModal.classList.add("hidden");
  el.eventModal.classList.remove("flex");
  state.activeEvent = null;
  if (!event) return;
  if (yes) event.yes();
  else event.no();
  checkMissions();
  renderAll();
  save();
}

function chanceOutcome(chance, gainRange, lossRange, xp, label) {
  if (Math.random() < chance) {
    reward(rand(gainRange[0], gainRange[1]), xp, label, "good");
  } else {
    spend(Math.min(state.money, rand(lossRange[0], lossRange[1])), label, Math.floor(xp * 0.45));
  }
}

function claimDaily(manual = false) {
  const now = Date.now();
  if (now - state.lastDaily < DAY_MS) {
    if (manual) toast("Daily reward already claimed", "neutral");
    return;
  }
  const amount = 250 + state.level * 75 + Math.floor(getIdleIncome() * 120);
  state.lastDaily = now;
  reward(amount, 60, "Daily reward", "level");
  toast(`🎁 Daily reward: ${money(amount)}`, "level");
  renderAll();
  save();
}

function checkMissions(render = true) {
  missions.forEach(mission => {
    if (state.completedMissions.includes(mission.id) || !mission.done(state)) return;
    state.completedMissions.push(mission.id);
    state.money += mission.reward;
    state.totalEarned += mission.reward;
    addXP(mission.xp);
    log(`Mission complete: ${mission.text}. Reward ${money(mission.reward)}!`, "level");
    toast(`🏆 ${mission.text}`, "level");
    play("level");
  });
  if (render) renderAll();
}

function renderAll() {
  renderHeader();
  renderActions();
  renderShop();
  renderStats();
  renderMissions();
  updateNav();
}

function renderHeader() {
  animateMoney();
  el.rankDisplay.textContent = getRank();
  el.levelDisplay.textContent = state.level;
  el.idleDisplay.textContent = `${money(getIdleIncome())}`;
  el.netWorthDisplay.textContent = money(getNetWorth());
  el.xpText.textContent = `${state.xp} / ${xpNeeded()} XP`;
  el.xpBar.style.width = `${Math.min(100, Math.round((state.xp / xpNeeded()) * 100))}%`;
  const canDaily = Date.now() - state.lastDaily >= DAY_MS;
  el.dailyBtn.classList.toggle("opacity-50", !canDaily);
  el.dailyBtn.textContent = canDaily ? "🎁 Daily" : "✅ Claimed";
}

function renderActions() {
  el.actionList.innerHTML = actions.map(action => {
    const locked = state.level < action.unlock;
    return `
      <button data-action="${action.id}" class="w-full rounded-[24px] border border-white/10 ${locked ? "bg-slate-900/55 opacity-60" : "glass"} p-4 text-left shadow-xl shadow-black/25 active:scale-[0.98]" ${locked ? "disabled" : ""}>
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 text-2xl">${action.icon}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <h3 class="truncate font-black text-white">${action.title}</h3>
              <span class="text-xs font-black ${action.risk > 0.4 ? "text-rose-300" : "text-emerald-300"}">${locked ? `LV ${action.unlock}` : `+${action.xp} XP`}</span>
            </div>
            <p class="mt-1 text-xs text-slate-400">${action.subtitle}</p>
            <p class="mt-2 text-sm font-black text-emerald-200">${locked ? "Locked" : `${money(action.reward[0])} - ${money(action.reward[1])}`}</p>
          </div>
        </div>
      </button>`;
  }).join("");
}

function renderShop() {
  document.querySelectorAll(".shop-tab").forEach(btn => {
    const active = btn.dataset.category === state.shopCategory;
    btn.className = `shop-tab rounded-2xl px-2 py-3 text-xs font-bold ${active ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-200"}`;
  });
  el.shopList.innerHTML = shopItems[state.shopCategory].map(item => {
    const owned = owns(state.shopCategory, item.id);
    const locked = state.level < item.level;
    const canBuy = !owned && !locked && state.money >= item.price;
    return `
      <article class="glass rounded-[24px] border border-white/10 p-4 shadow-xl shadow-black/25">
        <div class="flex items-start gap-3">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 text-3xl">${item.icon}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-black text-white">${item.name}</h3>
                <span class="mt-2 inline-flex rounded-full border px-2 py-1 text-[11px] font-black ${rarityStyles[item.rarity]}">${item.rarity}</span>
              </div>
              <p class="text-right text-sm font-black text-emerald-200">${money(item.price)}</p>
            </div>
            <p class="mt-3 text-xs text-slate-400">Idle income +${money(item.income)}/sec • Level ${item.level}</p>
            <button data-buy="${item.id}" class="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-black active:scale-95 ${owned ? "bg-slate-700 text-slate-300" : canBuy ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-500"}" ${owned || locked ? "disabled" : ""}>
              ${owned ? "Owned" : locked ? `Unlocks at Level ${item.level}` : "Buy Now"}
            </button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function renderMissions() {
  el.missionCount.textContent = `${state.completedMissions.length}/${missions.length}`;
  el.missionList.innerHTML = missions.map(mission => {
    const done = state.completedMissions.includes(mission.id);
    return `<div class="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/70 p-3">
      <div class="min-w-0">
        <p class="truncate text-sm font-bold ${done ? "text-emerald-200" : "text-white"}">${done ? "✅" : "🎯"} ${mission.text}</p>
        <p class="mt-1 text-xs text-slate-500">Reward ${money(mission.reward)} • +${mission.xp} XP</p>
      </div>
      <span class="text-xs font-black ${done ? "text-emerald-300" : "text-slate-500"}">${done ? "Done" : "Open"}</span>
    </div>`;
  }).join("");
}

function renderStats() {
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
    ? state.history.map(item => `<div class="rounded-2xl bg-slate-950/70 p-3 text-sm ${item.tone === "bad" ? "text-rose-200" : item.tone === "level" ? "text-amber-200" : "text-slate-300"}">${item.text}<p class="mt-1 text-[11px] text-slate-500">${item.time}</p></div>`).join("")
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
    btn.className = `nav-btn rounded-2xl px-3 py-3 text-sm font-black ${active ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-200"}`;
  });
}

function animateMoney() {
  const start = state.displayedMoney;
  const end = state.money;
  if (start === end) {
    el.moneyDisplay.textContent = money(end);
    return;
  }
  const duration = 420;
  const started = performance.now();
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
  el.moneyDisplay.classList.remove("gain-pop");
  void el.moneyDisplay.offsetWidth;
  el.moneyDisplay.classList.add("gain-pop");
  requestAnimationFrame(frame);
}

function tap(btn) {
  btn.classList.remove("pressed");
  void btn.offsetWidth;
  btn.classList.add("pressed");
}

function flashLoss() {
  document.body.classList.remove("flash-loss");
  el.gameRoot.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("flash-loss");
  el.gameRoot.classList.add("shake");
}

function spawnCoins(anchor, count) {
  const rect = anchor.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    const coin = document.createElement("div");
    coin.className = "coin text-2xl";
    coin.textContent = "💰";
    coin.style.left = `${rect.left + rect.width * Math.random()}px`;
    coin.style.top = `${rect.top + rect.height * 0.35}px`;
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 780);
  }
}

function toast(text, tone = "good") {
  const node = document.createElement("div");
  const color = tone === "bad" ? "border-rose-400/30 bg-rose-500/15 text-rose-100" : tone === "level" ? "border-amber-300/40 bg-amber-300/15 text-amber-100" : "border-emerald-400/30 bg-emerald-400/15 text-emerald-100";
  node.className = `toast rounded-2xl border px-4 py-3 text-sm font-black shadow-xl shadow-black/30 backdrop-blur-xl ${color}`;
  node.textContent = text;
  el.toastHost.appendChild(node);
  setTimeout(() => node.remove(), 2400);
}

function log(text, tone = "neutral") {
  state.history.unshift({ text, tone, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  state.history = state.history.slice(0, 18);
}

function owns(category, id) {
  return state.inventory[category].includes(id);
}

function money(value) {
  const absolute = Math.abs(value);
  if (absolute >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
  if (absolute >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (absolute >= 10000) return `$${Math.round(value).toLocaleString()}`;
  if (absolute < 10 && value % 1 !== 0) return `$${value.toFixed(2)}`;
  return `$${Math.round(value).toLocaleString()}`;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play(type) {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const notes = {
      coin: [660, 0.06],
      success: [880, 0.1],
      level: [523, 0.18],
      loss: [140, 0.16]
    };
    const [freq, seconds] = notes[type] || notes.coin;
    osc.frequency.value = freq;
    osc.type = type === "loss" ? "sawtooth" : "triangle";
    gain.gain.setValueAtTime(0.001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + seconds);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + seconds);
  } catch {
    // Sound is optional when browser audio is blocked.
  }
}
