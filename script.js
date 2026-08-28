const detail = {
  image: document.querySelector('#detail-image'),
  name: document.querySelector('#detail-name'),
  type: document.querySelector('#detail-type'),
  size: document.querySelector('#detail-size'),
  boards: document.querySelector('#detail-boards'),
};
const modal = document.querySelector('.modal');
const store = window.createDemoStore(window.localStorage);
const account = document.querySelector('#mine');
const ownedContent = document.querySelector('#owned-content');
let activeSection = 'A01';

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', () => {
    detail.image.src = card.dataset.image;
    detail.image.alt = card.dataset.name;
    detail.name.textContent = card.dataset.name;
    detail.type.innerHTML = `${card.dataset.type} <span>原创作品</span>`;
    detail.size.textContent = card.dataset.size;
    detail.boards.textContent = card.dataset.boards;
    document.querySelector('.detail').scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    document.querySelectorAll('.card').forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.type !== button.dataset.filter;
    });
  });
});

document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', () => { modal.hidden = false; }));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { modal.hidden = true; }));

function renderMine() {
  const owned = store.owned();
  if (!owned.includes('azure-dragon')) {
    ownedContent.innerHTML = '<div class="empty">还没有解锁图纸。先在“兑换”里输入演示兑换码，体验完整制作流程。</div>';
    return;
  }
  const sections = ['A01 龙首', 'A02 云层', 'A03 龙身'];
  const completed = store.getCompletedSections('azure-dragon');
  const percent = Math.round((completed.length / sections.length) * 100);
  const grid = store.getSectionGrid('azure-dragon', activeSection);
  ownedContent.innerHTML = `<article class="owned-card"><img src="assets/azure-dragon.png" alt="苍龙镇海"><div class="owned-copy"><p class="eyebrow">巨幅壁画 <span>${percent}% 完成</span></p><h3>苍龙镇海</h3><p>按分区逐块完成，进度会保留在当前浏览器。</p><div class="progress"><i style="width:${percent}%"></i></div><div class="sections">${sections.map((section) => { const id = section.slice(0, 3); return `<button class="${completed.includes(id) ? 'done' : ''}" data-section="${id}">${completed.includes(id) ? '✓ ' : ''}${section}</button>`; }).join('')}</div></div></article><section class="grid-paper"><div><p class="eyebrow">分区色块图 <span>${activeSection} · 10 × 10</span></p><h3>${sections.find((section) => section.startsWith(activeSection))}</h3><p>每个色块代表一颗拼豆；正式图纸会按真实拼板拆分并附色号。</p><div class="grid-tabs">${sections.map((section) => { const id = section.slice(0, 3); return `<button class="${id === activeSection ? 'active' : ''}" data-view-section="${id}">${section}</button>`; }).join('')}</div></div><div class="bead-grid" style="grid-template-columns:repeat(${grid.columns},1fr)">${grid.cells.map((color, index) => `<span style="background:${color}" title="${activeSection}-${String(index + 1).padStart(2, '0')}"></span>`).join('')}</div></section>`;
  ownedContent.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => { store.toggleSection('azure-dragon', button.dataset.section); renderMine(); }));
  ownedContent.querySelectorAll('[data-view-section]').forEach((button) => button.addEventListener('click', () => { activeSection = button.dataset.viewSection; renderMine(); }));
}

document.querySelectorAll('[data-open-mine]').forEach((button) => button.addEventListener('click', () => { renderMine(); account.hidden = false; account.scrollIntoView({ behavior: 'smooth' }); }));

document.querySelector('#redeem-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const result = store.redeem(document.querySelector('#redeem-code').value);
  const message = document.querySelector('#redeem-message');
  if (!result.ok) {
    message.className = 'error';
    message.textContent = result.reason === 'used' ? '这个演示码已在当前浏览器使用。' : '兑换码不正确，请输入 DOUZHEN-DEMO。';
    return;
  }
  message.className = 'success';
  message.textContent = '兑换成功，苍龙镇海已加入“我的图纸”。';
  renderMine();
});
