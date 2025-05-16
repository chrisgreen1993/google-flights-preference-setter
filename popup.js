import { BaseComponent } from './base-component.js';
import currencies from './currencies.js';
import languages from './languages.js';


class Picker extends BaseComponent {
  constructor({ type, items, selectedCode, onSelect }) {
    super({
      search: '',
      isOpen: false,
    })

    this.items = items;
    this.onSelect = onSelect;
    this.selectedCode = selectedCode;

    this.elements = {
      search: document.getElementById(`${type}-search`),
      list: document.getElementById(`${type}-list`),
      template: document.getElementById('picker-item-template')
    };

    this.bindEvents();


    if (selectedCode) {
      const item = this.items.find(i => i.code === selectedCode);
      if (item) {
        this.select(item);
      }
    }
  }

  get filteredItems() {
    const filter = this.state.search.toLowerCase();
    return this.items.filter(c => 
      c.code.toLowerCase().includes(filter) ||
      c.name.toLowerCase().includes(filter)
    );
  }

  bindEvents() {
    this.elements.search.addEventListener('input', () => {
      this.state.search = this.elements.search.value;
    });

    this.elements.search.addEventListener('focus', () => {
      this.state.isOpen = true;
    });

    document.addEventListener('click', (e) => {
      if (!this.elements.list.contains(e.target) && 
          !this.elements.search.contains(e.target)) {
        this.state.isOpen = false;
      }
    });
   
  }

  createListItem(item) {
    const element = this.elements.template.content.cloneNode(true);
    const li = element.querySelector('li');
    
    li.dataset.code = item.code;
    li.textContent = `${item.name} (${item.code})`;
    
    if (item.code === this.selectedCode) {
      li.classList.add('selected');
    }

    li.addEventListener('click', () => {
      this.select(item);
    });

    return element;
  }

  select(item) {
    this.state.search = `${item.name} (${item.code})`;
    this.onSelect(item.code);
  }

  render() {
    console.log('render', this.state);
    this.elements.search.value = this.state.search;
    this.elements.list.innerHTML = '';
    if (!this.state.isOpen) {
      return;
    }
    const fragment = document.createDocumentFragment();
    
    this.filteredItems.forEach(item => {
      fragment.appendChild(this.createListItem(item));
    });
    
    this.elements.list.appendChild(fragment);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const { preferences = {} } = await chrome.storage.sync.get('preferences');
  let currentCurrency = preferences.currency || 'USD';
  let currentLanguage = preferences.language || 'en-US';

  new Picker({
    selectedCode: currentCurrency,
    type: 'currency',
    items: currencies,
    onSelect: (code) => {
      currentCurrency = code;
    }
  });

  new Picker({
    selectedCode: currentLanguage, 
    type: 'language',
    items: languages,
    onSelect: (code) => {
      currentLanguage = code;
    }
  })

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', async () => {

    const preferences = {
      currency: currentCurrency,
      language: currentLanguage
    };

    await chrome.storage.sync.set({ preferences });

    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      if (tab.url?.startsWith('https://www.google.com/travel/flights')) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
});