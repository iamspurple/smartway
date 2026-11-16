(() => {
  'use strict';

  const track = document.querySelector('#months');
  const viewport = document.querySelector('#calendar-view');
  const cards = [...track.querySelectorAll('.month')];
  const previousButtons = document.querySelectorAll('.month-arrow--prev');
  const nextButtons = document.querySelectorAll('.month-arrow--next');
  const sliderTitles = document.querySelectorAll('[data-slider-title]');
  let index = Math.max(0, cards.findIndex(card => card.classList.contains('is-selected')));
  let lastIndex = cards.length - 1;

  function updateSlider() {
    track.style.setProperty('--month-index', index);
    cards.forEach((card, position) => card.classList.toggle('is-in-view', position === index));
    sliderTitles.forEach(title => { title.hidden = Number(title.dataset.sliderTitle) !== index; });
    previousButtons.forEach(button => { button.disabled = index === 0; });
    nextButtons.forEach(button => { button.disabled = index >= lastIndex; });
  }

  function measureSlider() {
    // The right fade marks the end of the fully visible cards on desktop.
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap) || 0;
    const cardWidth = cards[0].offsetWidth;
    const fade = viewport.querySelector('.months-fade--right');
    const fadeWidth = getComputedStyle(fade).display === 'none' ? 0 : fade.offsetWidth;
    const visibleWidth = viewport.clientWidth - fadeWidth - parseFloat(trackStyle.left);
    const visibleCards = Math.max(1, Math.floor((visibleWidth + gap + 1) / (cardWidth + gap)));
    lastIndex = Math.max(0, cards.length - visibleCards);
    index = Math.min(index, lastIndex);
    updateSlider();
  }

  previousButtons.forEach(button => button.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    updateSlider();
  }));
  nextButtons.forEach(button => button.addEventListener('click', () => {
    index = Math.min(lastIndex, index + 1);
    updateSlider();
  }));
  new ResizeObserver(() => {
    if (!viewport.hidden) measureSlider();
  }).observe(viewport);

  document.querySelector('.view-switch').addEventListener('click', event => {
    const showTable = event.currentTarget.getAttribute('aria-pressed') !== 'true';
    event.currentTarget.setAttribute('aria-pressed', String(showTable));
    document.querySelector('#view-label').textContent = showTable ? 'Сделать календарем' : 'Сделать таблицей';
    viewport.hidden = showTable;
    document.querySelector('.mobile-month-nav').hidden = showTable;
    document.querySelector('#table-view').hidden = !showTable;
    document.querySelector('#event-details').hidden = showTable;
    document.querySelector('.filter--month').hidden = !showTable;
    document.querySelector('.view-switch__line--table').hidden = showTable;
    document.querySelector('.view-switch__line--calendar').hidden = !showTable;
    document.querySelector('.accountant-calendar').classList.toggle('is-table-view', showTable);
    if (!showTable) measureSlider();
  });

  // Keep the visible label in sync with the native select; no data filtering.
  document.querySelector('#table-month').addEventListener('change', event => {
    document.querySelector('#table-month-label').textContent = event.target.selectedOptions[0].textContent;
  });

  measureSlider();
})();
