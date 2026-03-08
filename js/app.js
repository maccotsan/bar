const STYLE_MAP = {
  short: { label: 'Short', icon: '🍸' },
  long:  { label: 'Long',  icon: '🥂' },
  rock:  { label: 'Rock',  icon: '🥃' },
};

async function loadCocktails() {
  const res = await fetch('data/cocktails.json');
  return res.json();
}

function getStyleInfo(style) {
  return STYLE_MAP[style] || { label: style, icon: '🍹' };
}

// List page
async function renderList() {
  const container = document.getElementById('cocktail-list');
  if (!container) return;

  const cocktails = await loadCocktails();

  container.innerHTML = cocktails.map(c => {
    const style = getStyleInfo(c.style);
    return `
      <a href="detail.html?id=${c.id}" class="cocktail-item">
        <span class="style-icon">${style.icon}</span>
        <div class="info">
          <div class="name">${c.name}</div>
          <div class="name-en">${c.nameEn}</div>
          <div class="ingredients">${c.ingredients.join(' / ')}</div>
        </div>
        <span class="style-badge">${style.label}</span>
      </a>
    `;
  }).join('');
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

  container.innerHTML = `
    <a href="index.html" class="back-link">&larr; メニューに戻る</a>
    <div class="detail-image-placeholder">${style.icon}</div>
    <h2 class="detail-name">${c.name}</h2>
    <div class="detail-name-en">${c.nameEn}</div>
    <span class="detail-style">${style.icon} ${style.label}</span>
    <div class="detail-section">
      <h2>INGREDIENTS</h2>
      <ul class="detail-ingredients">
        ${c.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
    <div class="detail-section">
      <h2>NOTE</h2>
      <p class="detail-description">${c.description}</p>
    </div>
  `;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderList();
  renderDetail();
});
