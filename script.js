const detail = {
  image: document.querySelector('#detail-image'),
  name: document.querySelector('#detail-name'),
  type: document.querySelector('#detail-type'),
  size: document.querySelector('#detail-size'),
  boards: document.querySelector('#detail-boards'),
};
const modal = document.querySelector('.modal');

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
