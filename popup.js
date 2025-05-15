import currencies from './currencies.js';

class CurrencyPicker {
  constructor() {
    this.state = {
      search: '',
      selectedCode: null,
    };

    this.elements = {
      search: document.getElementById('currency-search'),
      list: document.getElementById('currency-list'),
      saveButton: document.getElementById('save-button'),
      template: document.getElementById('currency-item-template')
    };

    this.bindEvents();
    this.loadSavedPreference();
  }

  get filteredCurrencies() {
    const filter = this.state.search.toLowerCase();
    return currencies.filter(c => 
      c.code.toLowerCase().includes(filter) ||
      c.name.toLowerCase().includes(filter)
    );
  }

  bindEvents() {
    this.elements.search.addEventListener('input', () => {
      this.state.search = this.elements.search.value;
      this.render();
    });

    this.elements.saveButton.addEventListener('click', () => this.saveCurrency());
  }

  createCurrencyItem(currency) {
    const item = this.elements.template.content.cloneNode(true);
    const li = item.querySelector('li');
    
    li.dataset.code = currency.code;
    li.querySelector('.currency-name').textContent = currency.name;
    li.querySelector('.currency-code').textContent = currency.code;
    
    if (currency.code === this.state.selectedCode) {
      li.classList.add('selected');
    }

    li.addEventListener('click', () => {
      this.selectCurrency(currency);
    });

    return item;
  }

  selectCurrency(currency) {
    this.state.selectedCode = currency.code;
    this.state.search = `${currency.name} (${currency.code})`;
    this.render();
  }

  render() {
    this.elements.search.value = this.state.search;
    this.elements.list.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    this.filteredCurrencies.forEach(currency => {
      fragment.appendChild(this.createCurrencyItem(currency));
    });
    
    this.elements.list.appendChild(fragment);
  }

  async loadSavedPreference() {
    const { preferredCurrency } = await chrome.storage.sync.get('preferredCurrency');
    if (preferredCurrency) {
      const currency = currencies.find(c => c.code === preferredCurrency);
      if (currency) {
        this.selectCurrency(currency);
      }
    }
  }

  async saveCurrency() {
    if (!this.state.selectedCode) return;
    
    await chrome.storage.sync.set({ 
      preferredCurrency: this.state.selectedCode 
    });

    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.url?.startsWith('https://www.google.com/travel/flights')) {
        chrome.tabs.reload(tab.id);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CurrencyPicker();
});