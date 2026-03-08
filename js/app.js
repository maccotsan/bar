const STYLE_MAP = {
  short: { label: 'Short', icon: '🍸' },
  long:  { label: 'Long',  icon: '🥂' },
  rock:  { label: 'Rock',  icon: '🥃' },
};

const UI_LABELS = {
  ja: {
    all: 'All',
    backToMenu: 'Back to menu',
    ingredients: 'Ingredients',
    note: 'Note',
    notFound: 'カクテルが見つかりません。',
  },
  en: {
    all: 'All',
    backToMenu: 'Back to menu',
    ingredients: 'Ingredients',
    note: 'Note',
    notFound: 'Cocktail not found.',
  },
};

let allCocktails = [];
let currentFilter = 'all';
let currentLang = localStorage.getItem('lang') || 'ja';

function getLang() {
  return currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
}

function getLabel(key) {
  return UI_LABELS[getLang()][key] || key;
}

function getName(c) {
  return getLang() === 'en' ? c.nameEn : c.name;
}

function getSubName(c) {
  return getLang() === 'en' ? c.name : c.nameEn;
}

function getIngredients(c) {
  return getLang() === 'en' ? (c.ingredientsEn || c.ingredients) : c.ingredients;
}

function getDescription(c) {
  return getLang() === 'en' ? (c.descriptionEn || c.description) : c.description;
}

async function loadCocktails() {
  const res = await fetch('data/cocktails.json?v=3');
  return res.json();
}

function getStyleInfo(style) {
  return STYLE_MAP[style] || { label: style, icon: '🍹' };
}

// Language select
function initLangToggle() {
  const select = document.getElementById('lang-select');
  if (!select) return;

  // Set initial state
  select.value = currentLang;
  document.documentElement.lang = currentLang;

  select.addEventListener('change', () => {
    setLang(select.value);

    // Re-render current page
    renderList();
    renderDetail();
  });
}

// Filter bar
function renderFilterBar() {
  const container = document.getElementById('filter-bar');
  if (!container) return;

  const filters = [
    { key: 'all', label: getLabel('all') },
    { key: 'short', label: '🍸 Short' },
    { key: 'long', label: '🥂 Long' },
    { key: 'rock', label: '🥃 Rock' },
  ];

  container.innerHTML = filters.map(f =>
    `<button class="filter-btn${f.key === currentFilter ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>`
  ).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderFilterBar();
      renderCocktailItems();
    });
  });
}

// Render list items
function renderCocktailItems() {
  const container = document.getElementById('cocktail-list');
  if (!container) return;

  const filtered = currentFilter === 'all'
    ? allCocktails
    : allCocktails.filter(c => c.style === currentFilter);

  container.innerHTML = filtered.map(c => {
    const style = getStyleInfo(c.style);
    return `
      <a href="detail.html?id=${c.id}" class="cocktail-item">
        <span class="style-icon">${style.icon}</span>
        <div class="info">
          <div class="name">${getName(c)}</div>
          <div class="name-en">${getSubName(c)}</div>
          <div class="ingredients">${getIngredients(c).join(' / ')}</div>
        </div>
        <span class="style-badge">${style.label}</span>
      </a>
    `;
  }).join('');
}

// List page
async function renderList() {
  const container = document.getElementById('cocktail-list');
  if (!container) return;

  if (allCocktails.length === 0) {
    allCocktails = await loadCocktails();
  }
  renderFilterBar();
  renderCocktailItems();
}

// Detail page
async function renderDetail() {
  const container = document.getElementById('cocktail-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    container.innerHTML = `<p>${getLabel('notFound')}</p>`;
    return;
  }

  const cocktails = await loadCocktails();
  const c = cocktails.find(item => item.id === id);
  if (!c) {
    container.innerHTML = `<p>${getLabel('notFound')}</p>`;
    return;
  }

  const style = getStyleInfo(c.style);
  const backIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  container.innerHTML = `
    <a href="index.html" class="back-link">${backIcon} ${getLabel('backToMenu')}</a>
    <div class="detail-hero">${style.icon}</div>
    <div class="detail-meta">
      <h2 class="detail-name">${getName(c)}</h2>
      <div class="detail-name-en">${getSubName(c)}</div>
      <span class="detail-style">${style.icon} ${style.label}</span>
    </div>
    <div class="detail-section">
      <h3 class="detail-section-title">${getLabel('ingredients')}</h3>
      <ul class="detail-ingredients">
        ${getIngredients(c).map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
    <div class="detail-section">
      <h3 class="detail-section-title">${getLabel('note')}</h3>
      <p class="detail-description">${getDescription(c)}</p>
    </div>
  `;

  container.classList.add('fade-in');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initLangToggle();
  renderList();
  renderDetail();
});
