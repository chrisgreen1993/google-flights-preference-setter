import { BaseComponent } from "./base-component.js";
import currencies from "./currencies.js";
import languages from "./languages.js";
import locations from "./locations.js";

class Picker extends BaseComponent {
  constructor({ type, items, selectedCode }) {
    const item = items.find((i) => i.code === selectedCode) || items[0];
    super({
      search: `${item.name} (${item.code})`,
      isOpen: false,
      selectedCode: selectedCode,
    });

    this.items = items;

    this.elements = {
      search: document.getElementById(`${type}-search`),
      list: document.getElementById(`${type}-list`),
      template: document.getElementById("picker-item-template"),
      codeInput: document.getElementById(`${type}-code`),
    };

    this.bindEvents();
  }

  get filteredItems() {
    const filter = this.state.search.toLowerCase();
    return this.items.filter(
      (c) =>
        c.code.toLowerCase().includes(filter) ||
        c.name.toLowerCase().includes(filter),
    );
  }

  bindEvents() {
    this.elements.search.addEventListener("input", () => {
      this.state.search = this.elements.search.value;
    });

    this.elements.search.addEventListener("focus", () => {
      this.state.isOpen = true;
    });

    document.addEventListener("click", (e) => {
      if (
        !this.elements.list.contains(e.target) &&
        !this.elements.search.contains(e.target)
      ) {
        this.state.isOpen = false;
      }
    });
  }

  createListItem(item) {
    const element = this.elements.template.content.cloneNode(true);
    const li = element.querySelector("li");

    li.textContent = `${item.name} (${item.code})`;

    if (item.code === this.selectedCode) {
      li.classList.add("selected");
    }

    li.addEventListener("click", () => {
      this.select(item);
    });

    return element;
  }

  select(item) {
    this.state.search = `${item.name} (${item.code})`;
    this.state.selectedCode = item.code;
  }

  render() {
    this.elements.search.value = this.state.search;
    this.elements.codeInput.value = this.state.selectedCode;
    this.elements.list.innerHTML = "";
    if (!this.state.isOpen) {
      return;
    }
    const fragment = document.createDocumentFragment();

    this.filteredItems.forEach((item) => {
      fragment.appendChild(this.createListItem(item));
    });

    this.elements.list.appendChild(fragment);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { preferences = {} } = await chrome.storage.sync.get("preferences");

  new Picker({
    selectedCode: preferences.currency || "USD",
    type: "currency",
    items: currencies,
  }).render();

  new Picker({
    selectedCode: preferences.language || "en-US",
    type: "language",
    items: languages,
  }).render();

  new Picker({
    selectedCode: preferences.location || "US",
    type: "location",
    items: locations,
  }).render();

  const form = document.getElementById("preferences-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const preferences = {
      currency: formData.get("currency-code"),
      language: formData.get("language-code"),
      location: formData.get("location-code"),
    };

    await chrome.storage.sync.set({ preferences });

    window.close();
  });
});
