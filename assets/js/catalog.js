import './cart.js';
      const cards = [...document.querySelectorAll('.model-card')];
      const emptyMessage = document.querySelector('#search-empty');
      const searchFields = [document.querySelector('#model-search'), document.querySelector('#mobile-model-search')].filter(Boolean);
      searchFields.forEach((field) => field.addEventListener('input', () => {
        const query = field.value.trim().toLocaleLowerCase('uk');
        searchFields.forEach((other) => { if (other !== field) other.value = field.value; });
        let visibleCount = 0;
        cards.forEach((card) => {
          const visible = card.dataset.model.includes(query);
          card.classList.toggle('hidden', !visible);
          if (visible) visibleCount += 1;
        });
        emptyMessage.classList.toggle('hidden', visibleCount !== 0);
      }));

      const configForm = document.querySelector('#config-form');
      const formatPrice = (value) => `${new Intl.NumberFormat('uk-UA').format(value)} грн`;
      const updateConfig = () => {
        const model = configForm.querySelector('[name="model"]:checked');
        const color = configForm.querySelector('[name="color"]:checked');
        const storage = configForm.querySelector('[name="storage"]:checked');
        const modelLabel = model.value === 'iphone-pro' ? 'iPhone 18 Pro Max' : 'iPhone 18 Pro';
        const storageLabel = storage.value.endsWith('tb') ? `${storage.value[0]} ТБ` : `${storage.value} ГБ`;
        // Local prices are deliberately absent until independently confirmed.
        document.querySelector('#config-price').textContent = 'Ціна уточнюється';
        document.querySelector('#summary-model').textContent = modelLabel;
        document.querySelector('#summary-color').textContent = color.value;
        document.querySelector('#summary-storage').textContent = storageLabel;
      };
      configForm.addEventListener('change', updateConfig);
      updateConfig();

      document.querySelector('#trade-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const baseValue = Number(document.querySelector('#trade-model').value);
        const conditionValue = Number(document.querySelector('#trade-condition').value);
        if (!Number.isFinite(baseValue) || !Number.isFinite(conditionValue) || baseValue < 0 || conditionValue < 0 || conditionValue > 1) {
          document.querySelector('#trade-result').textContent = 'Перевірте модель і стан пристрою.'; return;
        }
        document.querySelector('#trade-result').textContent = `Орієнтовна демо-оцінка: ${formatPrice(Math.round(baseValue * conditionValue))}`;
      });


// Keep the initial cards usable when offline or when JSON is invalid.
import { loadCatalog } from './catalog-data.mjs';
loadCatalog().then(products => {
  for (const product of products) {
    const card = document.querySelector(`[data-product-id="${product.id}"]`);
    card.querySelector('h2').textContent = product.name;
    card.dataset.model = product.name.toLocaleLowerCase('uk');
    card.querySelectorAll('li').forEach((item, i) => { item.textContent = product.features[i]; });
  }
  document.querySelector('#catalog-status').textContent = 'Каталог оновлено.';
}).catch(() => {
  document.querySelector('#catalog-status').textContent = 'Не вдалося оновити каталог. Доступна збережена версія сторінки.';
});
