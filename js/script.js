const WHATSAPP_NUMBER = '5511998737976';
const PICKUP_ADDRESS = 'R. João Ricardo, 169 - Jardim Peri';
const PICKUP_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(PICKUP_ADDRESS);

const centoTypes = [
  { id: 'panko', name: 'Empanados com farinha panko', description: 'Casquinha mais crocante', price: 65, unitsPerCento: 100 },
  { id: 'rosca', name: 'Empanados com farinha de rosca (pão)', description: 'O clássico da festa', price: 55, unitsPerCento: 100 },
  { id: 'assados', name: 'Salgados assados', description: 'Leves e douradinhos', price: 70, unitsPerCento: 100 }
];

const flavors = [
  { id: 'coxinha-frango', name: 'Coxinha de frango', description: 'Massa douradinha, recheio cremoso', image: 'img/produtos/coxinha-frango.jpg', category: 'Salgados' },
  { id: 'bolinha-queijo', name: 'Bolinha de queijo', description: 'Queijo derretido e massa leve', image: 'img/produtos/bolinha-queijo.jpg', category: 'Salgados' },
  { id: 'risole-presunto-queijo', name: 'Risole de presunto e queijo', description: 'Massa crocante, recheio cremoso', image: 'img/produtos/risole-presunto-queijo.jpg', category: 'Salgados' },
  { id: 'empada-frango', name: 'Empada de frango', description: 'Massa dourada e recheio cremoso', image: 'img/produtos/empada-frango.jpg', category: 'Salgados assados' },
  { id: 'empada-carne', name: 'Empada de carne', description: 'Massa dourada e carne bem temperada', image: 'img/produtos/empada-carne.jpg', category: 'Salgados assados' },
  { id: 'esfiha-carne', name: 'Esfiha fechada de carne', description: 'Massa macia e recheio caseiro', image: 'img/produtos/esfiha-carne.jpg', category: 'Salgados assados' }
];

const state = {
  centos: { panko: 0, rosca: 0, assados: 0 },
  quantities: Object.fromEntries(flavors.map((flavor) => [flavor.id, 0])),
  drafts: {},
  selectionNotice: '',
  sent: false
};

const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const totalCentos = () => Object.values(state.centos).reduce((sum, value) => sum + value, 0);
const targetForCentos = (centos) => centoTypes.reduce(
  (sum, type) => sum + (centos[type.id] ?? 0) * type.unitsPerCento,
  0
);
const targetTotal = () => targetForCentos(state.centos);
const totalUnits = () => Object.values(state.quantities).reduce((sum, value) => sum + value, 0);
const orderPrice = () => centoTypes.reduce((sum, type) => sum + state.centos[type.id] * type.price, 0);
const selectedFlavors = () => flavors.filter((flavor) => state.quantities[flavor.id] > 0);

function renderCentos() {
  document.querySelector('#cento-types').innerHTML = centoTypes.map((type) => `
    <div class="cento-option${state.centos[type.id] > 0 ? ' active' : ''}">
      <div>
        <h3>${type.name}</h3>
        <p>${type.description} · ${money(type.price)} por cento</p>
      </div>
      <div class="counter" aria-label="Quantidade de ${type.name}">
        <button type="button" data-action="cento" data-id="${type.id}" data-change="-1" ${state.centos[type.id] === 0 ? 'disabled' : ''} aria-label="Diminuir ${type.name}">−</button>
        <output>${state.centos[type.id]}</output>
        <button type="button" data-action="cento" data-id="${type.id}" data-change="1" aria-label="Aumentar ${type.name}">+</button>
      </div>
      <strong class="cento-price">${money(state.centos[type.id] * type.price)}</strong>
    </div>
  `).join('');

  document.querySelector('#cento-total').innerHTML = `
    <span>${totalCentos()} ${totalCentos() === 1 ? 'cento' : 'centos'} · ${totalUnits()} salgados</span>
    <strong>${money(orderPrice())}</strong>
  `;
}

function renderFlavors() {
  const target = targetTotal();
  const selectionEnabled = target > 0;
  const limitReached = selectionEnabled && totalUnits() >= target;
  const categories = [...new Set(flavors.map((flavor) => flavor.category))];
  document.querySelector('#flavor-groups').innerHTML = categories.map((category) => {
    const categoryFlavors = flavors.filter((flavor) => flavor.category === category);
    return `
      <section class="flavor-group" aria-labelledby="category-${category.replaceAll(' ', '-').toLowerCase()}">
        <h3 class="flavor-group-title" id="category-${category.replaceAll(' ', '-').toLowerCase()}">${category}</h3>
        <div class="flavor-grid">
          ${categoryFlavors.map((flavor) => {
            const quantity = state.quantities[flavor.id];
            const draft = state.drafts[flavor.id] ?? String(quantity);
            const available = Math.max(0, target - (totalUnits() - quantity));
            return `
              <article class="flavor-card">
                <button class="flavor-image-button" type="button" data-preview-image="${flavor.image}" data-preview-alt="${flavor.name}" aria-label="Ampliar foto: ${flavor.name}">
                  <img src="${flavor.image}" alt="${flavor.name}">
                  <span class="image-zoom-hint" aria-hidden="true">+</span>
                </button>
                <div>
                  <h4>${flavor.name}</h4>
                  <p>${flavor.description}</p>
                </div>
                <div class="counter" aria-label="Quantidade de ${flavor.name}">
                  <button type="button" data-action="flavor" data-id="${flavor.id}" data-change="-10" ${!selectionEnabled || quantity === 0 ? 'disabled' : ''} aria-label="Diminuir ${flavor.name}">−</button>
                  <input class="quantity-input" type="number" min="0" max="${available}" step="10" inputmode="numeric" value="${draft}" data-quantity-input="${flavor.id}" ${!selectionEnabled ? 'disabled' : ''} aria-label="Quantidade de ${flavor.name}">
                  <button type="button" data-action="flavor" data-id="${flavor.id}" data-change="10" ${!selectionEnabled || limitReached ? 'disabled' : ''} aria-label="Aumentar ${flavor.name}">+</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }).join('');

  const helper = document.querySelector('#flavor-helper');
  helper.textContent = state.selectionNotice || (
    !selectionEnabled
      ? 'Selecione o tipo de farinha/cento para liberar a escolha dos salgados.'
      : limitReached
        ? `Limite de ${target} salgados atingido. Remova unidades para adicionar outros sabores.`
        : `Agora distribua os ${target} salgados entre os sabores:`
  );
}

function renderProgress() {
  const target = targetTotal();
  const total = totalUnits();
  const complete = target > 0 && total === target;
  const difference = target - total;
  const progress = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;
  let hint = 'escolha um tipo de cento';
  if (totalCentos() > 0) hint = complete ? `${totalCentos()} ${totalCentos() === 1 ? 'cento' : 'centos'} completo${totalCentos() === 1 ? '' : 's'}` : difference > 0 ? `faltam ${difference}` : `reduza ${Math.abs(difference)}`;
  document.querySelector('#progress-panel').innerHTML = `
    <div class="progress-top">
      <div class="progress-count"><strong>${total}</strong> / ${target} unidades</div>
      <div class="progress-hint">${hint}</div>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width: ${progress}%"></div></div>
    ${complete ? '<div class="progress-ready">✓ Quantidade certa para o seu pedido</div>' : ''}
  `;
}

function renderSummary() {
  const selected = selectedFlavors();
  const target = targetTotal();
  document.querySelector('#order-summary').innerHTML = `
    <h2>Seu pedido</h2>
    <p class="summary-kicker">Confira tudo antes de enviar.</p>
    ${selected.length === 0 ? '<div class="summary-empty">Seu pedido começa<br>com uma escolha.</div>' : `
      <div class="summary-items">
        ${selected.map((flavor) => `<div class="summary-item"><span>${flavor.name}</span><span>${state.quantities[flavor.id]} un.</span></div>`).join('')}
      </div>
    `}
    <div class="summary-divider"></div>
    <div class="summary-total"><span>Total do pedido</span><strong>${totalUnits()} un.</strong></div>
    <div class="price-card">
      <div class="price-live"><span>Valor em tempo real</span><strong>${money(orderPrice())}</strong></div>
      <div class="price-live-caption">${totalCentos()} ${totalCentos() === 1 ? 'cento' : 'centos'} · ${target} unidades</div>
      <div class="price-examples">
        ${centoTypes.filter((type) => state.centos[type.id] > 0).map((type) => `<div><span>${state.centos[type.id]} × ${type.name}</span><strong>${money(state.centos[type.id] * type.price)}</strong></div>`).join('') || '<div><span>Escolha um tipo de cento</span><strong>R$ 0,00</strong></div>'}
      </div>
    </div>
    <div class="summary-meta">
      <div class="summary-meta-row">♙ <span id="summary-name">Seu nome aparecerá aqui</span></div>
      <div class="summary-meta-row">♧ <span id="summary-phone">Seu telefone aparecerá aqui</span></div>
      <div class="summary-meta-row">▣ <span id="summary-date">Escolha a data</span></div>
      <a class="summary-meta-row pickup-link" href="${PICKUP_MAP_URL}" target="_blank" rel="noreferrer">⌖ <span>${PICKUP_ADDRESS}</span></a>
    </div>
    <button class="whatsapp-button${state.sent ? ' sent' : ''}" type="button" id="send-whatsapp">${state.sent ? '✓ Pedido encaminhado' : '➤ Montar mensagem no WhatsApp'}</button>
    <p class="send-note">Ao clicar, você será direcionado para o WhatsApp da nossa equipe.</p>
  `;
  document.querySelector('#send-whatsapp').addEventListener('click', sendOrder);
  syncSummaryForm();
}

function render() {
  renderCentos();
  renderFlavors();
  renderProgress();
  renderSummary();
}

function trimQuantitiesToLimit(limit) {
  const next = { ...state.quantities };
  let excess = Math.max(0, totalUnits() - limit);

  for (const flavor of [...flavors].reverse()) {
    if (excess === 0) break;
    const quantity = next[flavor.id] ?? 0;
    const reduction = Math.min(quantity, Math.ceil(excess / 10) * 10);
    next[flavor.id] = quantity - reduction;
    excess -= reduction;
  }

  return next;
}

function updateCentos(id, requestedValue) {
  const safeValue = Number.isFinite(requestedValue) ? Math.max(0, Math.floor(requestedValue)) : 0;
  const nextCentos = { ...state.centos, [id]: safeValue };
  const nextTarget = targetForCentos(nextCentos);
  const excess = totalUnits() - nextTarget;

  if (excess > 0) {
    const confirmed = window.confirm(
      `Você selecionou ${totalUnits()} salgados. Reduzir os centos deixará ${excess} unidade(s) acima do novo limite. Deseja ajustar automaticamente os sabores para caber no novo total? A redução começa pelos últimos sabores da lista.`
    );

    if (!confirmed) {
      state.selectionNotice = 'Alteração cancelada; seus centos e sabores foram mantidos.';
      render();
      return;
    }

    state.quantities = trimQuantitiesToLimit(nextTarget);
    state.drafts = Object.fromEntries(flavors.map((flavor) => [flavor.id, String(state.quantities[flavor.id] ?? 0)]));
    state.selectionNotice = `${excess} unidade(s) foram removidas para ajustar o pedido aos centos escolhidos.`;
  } else {
    state.selectionNotice = '';
  }

  state.centos = nextCentos;
  state.sent = false;
  showError('');
  render();
}

function updateQuantity(id, requestedValue) {
  const target = targetTotal();
  if (target === 0) {
    state.selectionNotice = 'Selecione o tipo de farinha/cento antes de escolher seus salgados.';
    render();
    return;
  }

  const safeRequested = Number.isFinite(requestedValue) ? Math.max(0, Math.floor(requestedValue / 10) * 10) : 0;
  const otherTotal = flavors.reduce(
    (sum, flavor) => sum + (flavor.id === id ? 0 : state.quantities[flavor.id]),
    0
  );
  const available = Math.max(0, target - otherTotal);
  const quantity = Math.min(safeRequested, Math.floor(available / 10) * 10);

  state.quantities[id] = quantity;
  state.drafts[id] = String(quantity);
  state.selectionNotice = quantity < safeRequested
    ? `Limite de ${target} salgados atingido para os centos escolhidos.`
    : '';
  state.sent = false;
  showError('');
  render();
}

function normalizeQuantity(id) {
  const raw = Number.parseInt(state.drafts[id] ?? state.quantities[id] ?? 0, 10);
  updateQuantity(id, Number.isFinite(raw) ? raw : 0);
}

function syncSummaryForm() {
  const values = {
    name: document.querySelector('#customer-name')?.value.trim() || 'Seu nome aparecerá aqui',
    phone: document.querySelector('#customer-phone')?.value.trim() || 'Seu telefone aparecerá aqui',
    date: document.querySelector('#order-date')?.value ? formatDate(document.querySelector('#order-date').value) : 'Escolha a data'
  };
  document.querySelector('#summary-name').textContent = values.name;
  document.querySelector('#summary-phone').textContent = values.phone;
  document.querySelector('#summary-date').textContent = values.date;
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function showError(message) {
  const box = document.querySelector('#order-error');
  box.hidden = !message;
  box.textContent = message;
}

function validateForm() {
  const form = document.querySelector('#customer-form');
  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {};
  if (!String(values.name || '').trim()) errors.name = 'Informe seu nome.';
  if (String(values.phone || '').replace(/\D/g, '').length < 10) errors.phone = 'Informe um telefone válido.';
  if (!values.date) errors.date = 'Escolha a data do pedido.';
  if (!values.time) errors.time = 'Escolha o horário para retirada.';
  document.querySelectorAll('[data-error-for]').forEach((element) => {
    element.textContent = errors[element.dataset.errorFor] || '';
  });
  document.querySelectorAll('#customer-form input').forEach((input) => input.classList.toggle('invalid', Boolean(errors[input.name])));
  return { valid: Object.keys(errors).length === 0, values };
}

function sendOrder() {
  showError('');
  if (totalCentos() === 0) return showError('Selecione um tipo de farinha/cento antes de montar o pedido.');
  if (totalUnits() !== targetTotal()) return showError(`A quantidade dos sabores precisa somar exatamente ${targetTotal()} unidades.`);
  const { valid, values } = validateForm();
  if (!valid) return showError('Confira os dados do pedido antes de enviar.');

  const typeLines = centoTypes.filter((type) => state.centos[type.id] > 0).map((type) => `- ${state.centos[type.id]} cento(s) de ${type.name}: ${money(state.centos[type.id] * type.price)}`);
  const flavorLines = selectedFlavors().map((flavor) => `- ${flavor.name}: ${state.quantities[flavor.id]} unidades`);
  const message = [
    'Olá, SolSaboresss! Quero fazer uma encomenda.',
    '',
    `Cliente: ${values.name}`,
    `Telefone: ${values.phone}`,
    `Data: ${formatDate(values.date)}`,
    `Horário: ${values.time}`,
    '',
    'Centos escolhidos:',
    ...typeLines,
    '',
    'Sabores:',
    ...flavorLines,
    '',
    `Total: ${totalUnits()} unidades`,
    `Valor: ${money(orderPrice())}`,
    `Retirada: ${PICKUP_ADDRESS}`
  ].join('\n');
  state.sent = true;
  renderSummary();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

document.addEventListener('click', (event) => {
  const previewTrigger = event.target.closest('[data-preview-image]');
  if (previewTrigger) {
    document.querySelector('#lightbox-photo').src = previewTrigger.dataset.previewImage;
    document.querySelector('#lightbox-photo').alt = previewTrigger.dataset.previewAlt;
    document.querySelector('#lightbox-caption').textContent = previewTrigger.dataset.previewAlt;
    document.querySelector('#image-lightbox').showModal();
    return;
  }
  if (event.target.closest('#lightbox-close')) {
    document.querySelector('#image-lightbox').close();
    return;
  }

  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  const change = Number(button.dataset.change);
  if (button.dataset.action === 'cento') {
    updateCentos(id, state.centos[id] + change);
  } else {
    updateQuantity(id, state.quantities[id] + change);
  }
});

document.addEventListener('input', (event) => {
  const input = event.target.closest('[data-quantity-input]');
  if (input) {
    if (targetTotal() === 0) {
      state.selectionNotice = 'Selecione o tipo de farinha/cento antes de escolher seus salgados.';
      render();
      return;
    }
    state.drafts[input.dataset.quantityInput] = input.value.replace(/\D/g, '');
    return;
  }
  if (event.target.closest('#customer-form')) {
    syncSummaryForm();
    showError('');
  }
});

document.addEventListener('focusout', (event) => {
  const input = event.target.closest('[data-quantity-input]');
  if (input) normalizeQuantity(input.dataset.quantityInput);
});

document.querySelector('#customer-form').addEventListener('change', syncSummaryForm);
document.querySelector('#order-date').min = new Date().toISOString().slice(0, 10);
document.querySelector('#image-lightbox').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
document.querySelector('#experience-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = String(data.get('text') || '').trim();
  if (!text) return;

  const preview = document.querySelector('#submitted-comment');
  const stars = document.createElement('div');
  stars.className = 'comment-stars';
  stars.setAttribute('aria-label', '5 estrelas');
  stars.textContent = '★★★★★';

  const quote = document.createElement('blockquote');
  quote.textContent = `“${text}”`;

  const cite = document.createElement('cite');
  cite.textContent = `— ${String(data.get('name') || '').trim() || 'Cliente SolSaboresss'}`;

  preview.replaceChildren(stars, quote, cite);
  preview.hidden = false;
  event.currentTarget.reset();
});
render();