const STYLE_MAP = {
  short: { label: 'Short', icon: '🍸' },
  long:  { label: 'Long',  icon: '🥂' },
  rock:  { label: 'Rock',  icon: '🥃' },
};

let allCocktails = [];
let currentFilter = 'all';

async function loadCocktails() {
  const res = await fetch('data/cocktails.json?v=5');
  return res.json();
}

function getStyleInfo(style) {
  return STYLE_MAP[style] || { label: style, icon: '🍹' };
}

// Filter bar
function renderFilterBar() {
  const container = document.getElementById('filter-bar');
  if (!container) return;

  const filters = [
    { key: 'all', label: 'All' },
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
    const ingredientsJa = c.ingredients.join(' / ');
    const ingredientsEn = c.ingredientsEn ? c.ingredientsEn.join(' / ') : '';
    return `
      <a href="detail.html?id=${c.id}" class="cocktail-item">
        <span class="style-icon">${style.icon}</span>
        <div class="info">
          <div class="name">${c.name}</div>
          <div class="name-en">${c.nameEn}</div>
          <div class="ingredients">${ingredientsJa}</div>
          ${ingredientsEn ? `<div class="ingredients-en">${ingredientsEn}</div>` : ''}
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

  allCocktails = await loadCocktails();
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
    container.innerHTML = '<p>カクテルが見つかりません。</p>';
    return;
  }

  const cocktails = await loadCocktails();
  const c = cocktails.find(item => item.id === id);
  if (!c) {
    container.innerHTML = '<p>カクテルが見つかりません。</p>';
    return;
  }

  const style = getStyleInfo(c.style);
  const backIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  container.innerHTML = `
    <a href="index.html" class="back-link">${backIcon} Back to menu</a>
    <div class="detail-hero">${style.icon}</div>
    <div class="detail-meta">
      <h2 class="detail-name">${c.name}</h2>
      <div class="detail-name-en">${c.nameEn}</div>
      <span class="detail-style">${style.icon} ${style.label}</span>
    </div>
    <div class="detail-section">
      <h3 class="detail-section-title">Ingredients</h3>
      <ul class="detail-ingredients">
        ${c.ingredients.map((ing, i) => {
          const en = c.ingredientsEn ? c.ingredientsEn[i] : '';
          return `<li><span class="ingredient-ja">${ing}</span>${en ? `<span class="ingredient-en">${en}</span>` : ''}</li>`;
        }).join('')}
      </ul>
    </div>
    <div class="detail-section">
      <h3 class="detail-section-title">Note</h3>
      <p class="detail-description">${c.description}</p>
      ${c.descriptionEn ? `<p class="detail-description-en">${c.descriptionEn}</p>` : ''}
    </div>
  `;

  container.classList.add('fade-in');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderList();
  renderDetail();
});
