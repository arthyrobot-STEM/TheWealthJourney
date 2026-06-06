const STORAGE_KEY = 'rise-to-riches-save';
const app = {
  money: 100,
  xp: 0,
  level: 1,
  income: 0,
  expenses: 0,
  status: 'Poor',
  assets: {
    cars: [],
    houses: [],
    fashion: [],
    businesses: []
  },
  history: [],
  event: null,
  opportunity: null,
  currentJob: null,
  shopCategory: 'cars',
  character: {
    name: 'Rico',
    skin: 'tan',
    style: 'casual'
  }
};

const shopItems = {
  cars: [
    { id: 'beat-up-car', name: 'Used Sedan', price: 120, bonus: 0, level: 1, type: 'Cars' },
    { id: 'leather-sedan', name: 'Leather Sedan', price: 450, bonus: 2, level: 3, type: 'Cars' },
    { id: 'sport-coupe', name: 'Sport Coupe', price: 1200, bonus: 6, level: 6, type: 'Cars' },
    { id: 'luxury-suv', name: 'Luxury SUV', price: 4500, bonus: 15, level: 9, type: 'Cars' },
    { id: 'supercar', name: 'Supercar', price: 12000, bonus: 35, level: 13, type: 'Cars' }
  ],
  houses: [
    { id: 'starter-apartment', name: 'Starter Apartment', price: 500, bonus: 1, level: 1, type: 'Houses' },
    { id: 'city-loft', name: 'City Loft', price: 1500, bonus: 4, level: 4, type: 'Houses' },
    { id: 'suburban-house', name: 'Suburban House', price: 4200, bonus: 10, level: 7, type: 'Houses' },
    { id: 'mansion', name: 'Mansion', price: 12000, bonus: 28, level: 11, type: 'Houses' }
  ],
  fashion: [
    { id: 'basic-tee', name: 'Basic Tee', price: 50, bonus: 0, level: 1, type: 'Fashion' },
    { id: 'designer-bag', name: 'Designer Bag', price: 750, bonus: 3, level: 5, type: 'Fashion' },
    { id: 'premium-suit', name: 'Premium Suit', price: 1800, bonus: 8, level: 8, type: 'Fashion' },
    { id: 'luxury-watch', name: 'Luxury Watch', price: 4200, bonus: 16, level: 12, type: 'Fashion' }
  ],
  businesses: [
    { id: 'food-cart', name: 'Food Cart', price: 900, bonus: 8, level: 2, type: 'Businesses' },
    { id: 'coffee-shop', name: 'Coffee Shop', price: 3200, bonus: 18, level: 7, type: 'Businesses' },
    { id: 'ecommerce-store', name: 'E-commerce Brand', price: 8800, bonus: 35, level: 12, type: 'Businesses' }
  ]
};

const statusRules = [
  { status: 'Elite', min: 50000 },
  { status: 'Rich', min: 15000 },
  { status: 'Middle Class', min: 5000 },
  { status: 'Poor', min: 0 }
];

const jobOffers = [
  { id: 'intern', name: 'Intern Assistant', salaryRange: [15, 25], reqLevel: 1, reqNetWorth: 0, xp: 12, description: 'Gain experience with consistent pay.' },
  { id: 'salesRep', name: 'Sales Representative', salaryRange: [45, 70], reqLevel: 3, reqNetWorth: 800, xp: 22, description: 'Use charm to earn commission.' },
  { id: 'realEstateAgent', name: 'Real Estate Agent', salaryRange: [90, 130], reqLevel: 6, reqNetWorth: 2400, xp: 35, description: 'Help clients buy homes and earn bigger checks.' },
  { id: 'investmentAnalyst', name: 'Investment Analyst', salaryRange: [150, 210], reqLevel: 10, reqNetWorth: 6400, xp: 50, description: 'Manage portfolios and find market gains.' },
  { id: 'luxuryManager', name: 'Luxury Brand Manager', salaryRange: [240, 320], reqLevel: 14, reqNetWorth: 14000, xp: 70, description: 'Oversee elite products and high-end deals.' }
];

const opportunityPool = [
  { title: 'Market Alert', text: 'A limited investment opportunity appears. Do you want to try it?', yes: () => applyEventOutcome(Math.random() < 0.65 ? 320 : -180, 30, 'You jumped into the market and got a strong result.'), no: () => addHistory('You skipped the market alert.', 0) },
  { title: 'Property Flip', text: 'A fixer-upper could be bought cheap. Take the risk?', yes: () => applyEventOutcome(Math.random() < 0.55 ? 700 : -250, 40, 'You bought the property and flipped it for a profit.'), no: () => addHistory('You let the property deal pass.', 0) },
  { title: 'Fashion Collab', text: 'A style brand wants you to model a new line. Accept?', yes: () => applyEventOutcome(180, 25, 'You earned a fashion collab payout.'), no: () => addHistory('You declined the fashion collab.', 0) },
  { title: 'Unexpected Gig', text: 'A freelance gig pays well but demands effort. Take it?', yes: () => applyEventOutcome(Math.random() < 0.8 ? 140 : -40, 20, 'You completed the gig and got paid.'), no: () => addHistory('You passed on the extra gig.', 0) },
  { title: 'Crypto Tip', text: 'A colleague whispers a crypto tip - risky but tempting. Follow it?', yes: () => applyEventOutcome(Math.random() < 0.5 ? 380 : -220, 45, 'You risked crypto and the result changed your balance.'), no: () => addHistory('You ignored the crypto tip.', 0) }
];

const eventPool = [
  {
    text: 'A surprise bonus arrives from extra freelance work. Do you accept the contract?',
    yes: () => applyEventOutcome(200, 100),
    no: () => addHistory('You kept your schedule free and missed $0 opportunity.', 0)
  },
  {
    text: 'A sudden car repair cost appears. Pay now to keep your car safe?',
    yes: () => applyEventOutcome(-120, 20),
    no: () => applyEventOutcome(-50, 10)
  },
  {
    text: 'A friend pitches a startup. Do you invest $300 for equity?',
    yes: () => applyEventOutcome(Math.random() < 0.6 ? 450 : -300, 60),
    no: () => addHistory('You stayed cautious and missed a startup chance.', 0)
  },
  {
    text: 'A luxury watch trend spikes. Buy one to boost social status?',
    yes: () => applyEventOutcome(-320, 40, 'You bought a watch and gained reputation.'),
    no: () => addHistory('You skipped the flashy luxury purchase.', 0)
  }
];

const selectors = {
  moneyDisplay: document.getElementById('moneyDisplay'),
  statusDisplay: document.getElementById('statusDisplay'),
  levelDisplay: document.getElementById('levelDisplay'),
  xpDisplay: document.getElementById('xpDisplay'),
  xpBar: document.getElementById('xpBar'),
  netWorthDisplay: document.getElementById('netWorthDisplay'),
  activityList: document.getElementById('activityList'),
  carsValue: document.getElementById('carsValue'),
  housesValue: document.getElementById('housesValue'),
  fashionValue: document.getElementById('fashionValue'),
  businessValue: document.getElementById('businessValue'),
  eventText: document.getElementById('eventText'),
  eventYes: document.getElementById('eventYes'),
  eventNo: document.getElementById('eventNo'),
  shopCategory: document.getElementById('shopCategory'),
  shopList: document.getElementById('shopList'),
  incomeTotal: document.getElementById('incomeTotal'),
  expenseTotal: document.getElementById('expenseTotal'),
  rankDisplay: document.getElementById('rankDisplay'),
  passiveIncome: document.getElementById('passiveIncome'),
  assetList: document.getElementById('assetList'),
  currentJobDisplay: document.getElementById('currentJobDisplay'),
  jobList: document.getElementById('jobList'),
  characterAvatar: document.getElementById('characterAvatar'),
  characterNameInput: document.getElementById('characterNameInput'),
  opportunityOverlay: document.getElementById('opportunityOverlay'),
  opportunityTitle: document.getElementById('opportunityTitle'),
  opportunityText: document.getElementById('opportunityText'),
  opportunityDesc: document.getElementById('opportunityDesc'),
  opportunityAccept: document.getElementById('opportunityAccept'),
  opportunityDecline: document.getElementById('opportunityDecline'),
  saveBtn: document.getElementById('saveBtn')
};

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(app, parsed);
  }
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(app));
}

function addHistory(message, xpGain = 0, silent = false) {
  const entry = { text: message, time: new Date().toLocaleTimeString(), xpGain };
  app.history.unshift(entry);
  if (app.history.length > 10) app.history.pop();
  if (!silent) updateUI();
}

function renderJobBoard() {
  selectors.currentJobDisplay.textContent = app.currentJob
    ? jobOffers.find(job => job.id === app.currentJob)?.name || 'Employed'
    : 'No job yet';
  selectors.jobList.innerHTML = jobOffers.map(job => {
    const netWorth = getNetWorth();
    const canApply = app.level >= job.reqLevel && netWorth >= job.reqNetWorth;
    const isCurrent = app.currentJob === job.id;
    return `<div class="rounded-3xl bg-slate-950/80 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-slate-400">${job.name}</p>
          <h3 class="mt-1 text-base font-semibold text-white">${job.description}</h3>
          <p class="mt-2 text-[13px] text-slate-400">Requires level ${job.reqLevel} and $${job.reqNetWorth.toLocaleString()} net worth.</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold text-emerald-300">$${job.salaryRange[0]}-${job.salaryRange[1]}</p>
          <p class="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">+${job.xp} XP</p>
        </div>
      </div>
      <button data-job="${job.id}" class="mt-4 w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${isCurrent ? 'bg-slate-700 text-slate-300 cursor-not-allowed' : canApply ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">${isCurrent ? 'Current Job' : canApply ? 'Apply' : 'Locked'}</button>
    </div>`;
  }).join('');
}

function applyJob(jobId) {
  const job = jobOffers.find(entry => entry.id === jobId);
  if (!job) return;
  const netWorth = getNetWorth();
  if (app.currentJob === job.id) {
    addHistory(`You already have the job as ${job.name}.`, 0);
    return;
  }
  if (app.level < job.reqLevel || netWorth < job.reqNetWorth) {
    addHistory(`You do not meet the requirements for ${job.name}.`, 0);
    return;
  }
  app.currentJob = job.id;
  addXP(job.xp);
  addHistory(`You landed the job: ${job.name}!`, job.xp);
  renderJobBoard();
  saveGame();
}

function getCurrentJobSalary() {
  if (!app.currentJob) return randomRange(25, 45);
  const job = jobOffers.find(entry => entry.id === app.currentJob);
  return job ? randomRange(job.salaryRange[0], job.salaryRange[1]) : randomRange(25, 45);
}

function showOpportunity(opportunity) {
  app.opportunity = opportunity;
  selectors.opportunityTitle.textContent = opportunity.title || 'Opportunity';
  selectors.opportunityText.textContent = opportunity.text || 'A new opportunity appears.';
  selectors.opportunityDesc.textContent = opportunity.description || 'Choose quickly or it may disappear.';
  selectors.opportunityOverlay.classList.remove('hidden');
}

function hideOpportunity() {
  selectors.opportunityOverlay.classList.add('hidden');
  app.opportunity = null;
}

function triggerOpportunity() {
  const chance = Math.random();
  if (chance < 0.45) {
    const opportunity = opportunityPool[Math.floor(Math.random() * opportunityPool.length)];
    showOpportunity(opportunity);
    selectors.eventText.textContent = 'A new opportunity is available above!';
  } else {
    randomizeEvent();
  }
}

function updateCharacterPreview() {
  const skinColors = {
    light: 'bg-amber-200',
    tan: 'bg-amber-500',
    dark: 'bg-slate-700'
  };
  const outlineColors = {
    casual: 'ring-emerald-400',
    premium: 'ring-cyan-400',
    luxury: 'ring-rose-400'
  };
  selectors.characterAvatar.className = `h-20 w-20 rounded-3xl ${skinColors[app.character.skin] || 'bg-amber-500'} ring-4 ${outlineColors[app.character.style] || 'ring-emerald-400'}`;
  selectors.characterNameInput.value = app.character.name;
}

function setCharacterAttribute(attribute, value) {
  app.character[attribute] = value;
  addHistory(`Character updated: ${attribute} set to ${value}.`, 0);
  updateCharacterPreview();
  saveGame();
}

function determineStatus() {
  const netWorth = getNetWorth();
  const match = statusRules.find(rule => netWorth >= rule.min);
  app.status = match ? match.status : 'Poor';
}

function addXP(amount) {
  app.xp += amount;
  while (app.xp >= xpToNextLevel()) {
    app.xp -= xpToNextLevel();
    app.level += 1;
    addHistory(`You leveled up to ${app.level}! New opportunities unlocked.`, 0);
  }
}

function xpToNextLevel() {
  return 100 + (app.level - 1) * 40;
}

function applyEventOutcome(delta, xpGain, text = null) {
  app.money += delta;
  if (delta > 0) app.income += delta;
  if (delta < 0) app.expenses += Math.abs(delta);
  if (xpGain) addXP(xpGain);
  addHistory(text || `Event resolved: ${delta >= 0 ? '+' : ''}${delta} dollars.`, xpGain);
  randomizeEvent();
  updateUI();
}

function randomizeEvent() {
  const event = eventPool[Math.floor(Math.random() * eventPool.length)];
  app.event = event;
  selectors.eventText.textContent = event.text;
}

function earn(amount, label, xpGain) {
  app.money += amount;
  if (amount >= 0) {
    app.income += amount;
  } else {
    app.expenses += Math.abs(amount);
  }
  addXP(xpGain);
  addHistory(`${label}: ${amount > 0 ? '+' : ''}${amount} dollars.`, xpGain);
  updateUI();
}

function spend(amount, label) {
  app.money -= amount;
  app.expenses += amount;
  addHistory(`${label}: -${amount} dollars.`, 0);
  updateUI();
}

function performAction(action) {
  switch (action) {
    case 'work': {
      const amount = getCurrentJobSalary();
      earn(amount, 'Job salary', 18);
      break;
    }
    case 'sideHustle': {
      const success = Math.random() < 0.75;
      const amount = success ? randomRange(50, 120) : -randomRange(10, 30);
      earn(amount, success ? 'Side hustle payout' : 'Side hustle setback', success ? 22 : 7);
      break;
    }
    case 'investStock': {
      const amount = randomRange(100, 320);
      if (app.money < amount) { addHistory('Not enough money to invest in stocks.', 0); return; }
      spend(amount, 'Stock investment');
      const gain = Math.random() < 0.8 ? Math.round(amount * randomRange(1.05, 1.35)) : Math.round(amount * randomRange(0.6, 0.9));
      const profit = gain - amount;
      earn(gain, 'Stock return', profit > 0 ? 30 : 10);
      break;
    }
    case 'investCrypto': {
      const amount = randomRange(60, 180);
      if (app.money < amount) { addHistory('Not enough money to trade crypto.', 0); return; }
      spend(amount, 'Crypto purchase');
      const isWin = Math.random() < 0.55;
      const gain = Math.round(amount * (isWin ? randomRange(1.4, 2.2) : randomRange(0.2, 0.8)));
      earn(gain, 'Crypto trade', isWin ? 40 : 12);
      break;
    }
    case 'investBusiness': {
      const amount = randomRange(250, 520);
      if (app.money < amount) { addHistory('Not enough capital for business investment.', 0); return; }
      spend(amount, 'Business seed money');
      const gain = Math.round(amount * randomRange(1.1, 1.5));
      earn(gain, 'Business income', 35);
      break;
    }
  }
  determineStatus();
  if (Math.random() < 0.4) {
    triggerOpportunity();
  } else {
    randomizeEvent();
  }
  saveGame();
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
  determineStatus();
  const netWorth = getNetWorth();
  selectors.moneyDisplay.textContent = `$${app.money.toLocaleString()}`;
  selectors.statusDisplay.textContent = app.status;
  selectors.levelDisplay.textContent = app.level;
  selectors.xpDisplay.textContent = `${app.xp} / ${xpToNextLevel()} XP`;
  selectors.netWorthDisplay.textContent = `$${netWorth.toLocaleString()}`;
  const progress = Math.min(100, Math.round((app.xp / xpToNextLevel()) * 100));
  selectors.xpBar.style.width = `${progress}%`;
  selectors.carsValue.textContent = `$${app.assets.cars.reduce((sum, item) => sum + item.price, 0)}`;
  selectors.housesValue.textContent = `$${app.assets.houses.reduce((sum, item) => sum + item.price, 0)}`;
  selectors.fashionValue.textContent = `$${app.assets.fashion.reduce((sum, item) => sum + item.price, 0)}`;
  selectors.businessValue.textContent = `$${app.assets.businesses.reduce((sum, item) => sum + item.price, 0)}`;
  selectors.incomeTotal.textContent = `$${app.income.toLocaleString()}`;
  selectors.expenseTotal.textContent = `$${app.expenses.toLocaleString()}`;
  selectors.rankDisplay.textContent = app.status;
  const passive = app.assets.businesses.reduce((sum, item) => sum + item.bonus, 0);
  selectors.passiveIncome.textContent = `$${passive} / mo`;
  selectors.activityList.innerHTML = app.history.map(h => `<div class="rounded-3xl bg-slate-950/80 p-3"><p class="text-sm">${h.text}</p><p class="mt-1 text-[11px] text-slate-500">${h.time}${h.xpGain ? ` - +${h.xpGain} XP` : ''}</p></div>`).join('') || '<p class="text-slate-500">No activity yet.</p>';
  selectors.assetList.innerHTML = buildAssetList();
  renderJobBoard();
  updateCharacterPreview();
  renderShop();
}

function buildAssetList() {
  const categories = ['cars', 'houses', 'fashion', 'businesses'];
  const lines = [];
  categories.forEach(cat => {
    if (app.assets[cat].length) {
      app.assets[cat].forEach(item => {
        lines.push(`<div class="rounded-3xl bg-slate-950/80 p-3"><div class="flex items-center justify-between"><span>${item.name}</span><span class="text-emerald-300">$${item.price}</span></div><p class="mt-1 text-[12px] text-slate-500">${item.type}</p></div>`);
      });
    }
  });
  return lines.join('') || '<p class="text-slate-500">No assets owned yet.</p>';
}

function renderShop() {
  selectors.shopCategory.textContent = capitalize(app.shopCategory);
  const items = shopItems[app.shopCategory];
  selectors.shopList.innerHTML = items.map(item => {
    const unlocked = app.level >= item.level;
    const owned = app.assets[app.shopCategory].some(asset => asset.id === item.id);
    const priceText = owned ? 'Owned' : `$${item.price.toLocaleString()}`;
    return `<div class="glass rounded-3xl border border-slate-800 p-4 shadow-xl shadow-slate-900/30">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-slate-400">${item.type}</p>
          <h3 class="mt-1 text-base font-semibold text-white">${item.name}</h3>
          <p class="mt-2 text-sm text-slate-300">Requires level ${item.level}</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold text-emerald-300">${priceText}</p>
          <p class="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Bonus +${item.bonus}</p>
        </div>
      </div>
      <button data-buy="${item.id}" class="mt-4 w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${owned ? 'bg-slate-700 text-slate-300 cursor-not-allowed' : unlocked ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}">${owned ? 'Owned' : unlocked ? 'Buy' : 'Locked'}</button>
    </div>`;
  }).join('');
}

function buyItem(itemId) {
  const category = app.shopCategory;
  const item = shopItems[category].find(entry => entry.id === itemId);
  if (!item || app.level < item.level || app.assets[category].some(asset => asset.id === item.id)) return;
  if (app.money < item.price) {
    addHistory('Not enough money to purchase that item.', 0);
    return;
  }
  spend(item.price, `Purchased ${item.name}`);
  app.assets[category].push(item);
  addXP(20);
  determineStatus();
  addHistory(`You bought ${item.name} and increased your status.`, 15);
  renderShop();
  updateUI();
  saveGame();
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function activatePage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === pageId));
}

function initEventButtons() {
  selectors.eventYes.addEventListener('click', () => {
    if (app.event) app.event.yes();
    randomizeEvent();
  });
  selectors.eventNo.addEventListener('click', () => {
    if (app.event) app.event.no();
    randomizeEvent();
  });
  selectors.opportunityAccept.addEventListener('click', () => {
    if (app.opportunity) {
      app.opportunity.yes();
      hideOpportunity();
    }
  });
  selectors.opportunityDecline.addEventListener('click', () => {
    if (app.opportunity) {
      app.opportunity.no();
      hideOpportunity();
    }
  });
  randomizeEvent();
}

function initActionButtons() {
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => performAction(button.getAttribute('data-action')));
  });
}

function initNav() {
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => activatePage(button.getAttribute('data-page')));
  });
}

function initShopTabs() {
  document.querySelectorAll('.shop-tab').forEach(button => {
    button.addEventListener('click', () => {
      app.shopCategory = button.getAttribute('data-category');
      renderShop();
    });
  });
}

function initJobBoardEvents() {
  selectors.jobList.addEventListener('click', event => {
    const button = event.target.closest('button[data-job]');
    if (!button) return;
    applyJob(button.getAttribute('data-job'));
  });
}

function initShopEvents() {
  selectors.shopList.addEventListener('click', event => {
    const button = event.target.closest('button[data-buy]');
    if (!button) return;
    buyItem(button.getAttribute('data-buy'));
  });
}

function initCharacterControls() {
  selectors.characterNameInput.addEventListener('input', event => {
    app.character.name = event.target.value || 'Rico';
    updateCharacterPreview();
    saveGame();
  });
  document.querySelectorAll('.character-skin').forEach(button => {
    button.addEventListener('click', () => setCharacterAttribute('skin', button.getAttribute('data-skin')));
  });
  document.querySelectorAll('.character-style').forEach(button => {
    button.addEventListener('click', () => setCharacterAttribute('style', button.getAttribute('data-style')));
  });
}

function initSaveButton() {
  selectors.saveBtn.addEventListener('click', () => {
    saveGame();
    addHistory('Game saved manually.', 0);
  });
}

function autoSaveLoop() {
  setInterval(saveGame, 8000);
}

function applyPassiveIncome() {
  const passive = app.assets.businesses.reduce((sum, item) => sum + item.bonus, 0);
  if (passive > 0) {
    earn(passive, 'Passive business income', 10);
  }
}

function startPassiveIncomeLoop() {
  setInterval(applyPassiveIncome, 18000);
}

loadGame();
initNav();
initActionButtons();
initShopTabs();
initJobBoardEvents();
initShopEvents();
initCharacterControls();
initEventButtons();
initSaveButton();
randomizeEvent();
updateUI();
autoSaveLoop();
startPassiveIncomeLoop();
saveGame();
