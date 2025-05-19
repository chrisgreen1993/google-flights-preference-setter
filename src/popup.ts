import { BaseComponent } from "./base-component";
import currencies from "./currencies";
import languages from "./languages";
import locations from "./locations";

interface PickerState {
  search: string;
  isOpen: boolean;
  selectedCode: string;
}

interface PickerItem {
  name: string;
  code: string;
}

interface PickerOptions {
  type: string;
  items: PickerItem[];
  selectedCode: string;
}

interface PickerElements {
  search: HTMLInputElement;
  list: HTMLUListElement;
  template: HTMLTemplateElement;
  codeInput: HTMLInputElement;
}

class Picker extends BaseComponent<PickerState> {
  items: PickerItem[];
  elements: PickerElements;

  constructor({ type, items, selectedCode }: PickerOptions) {
    const item = items.find((i) => i.code === selectedCode) || items[0];
    super({
      search: `${item.name} (${item.code})`,
      isOpen: false,
      selectedCode: selectedCode,
    });

    this.items = items;

    this.elements = {
      search: document.getElementById(`${type}-search`) as HTMLInputElement,
      list: document.getElementById(`${type}-list`) as HTMLUListElement,
      template: document.getElementById(
        "picker-item-template",
      ) as HTMLTemplateElement,
      codeInput: document.getElementById(`${type}-code`) as HTMLInputElement,
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
      const target = e.target as Node;
      if (
        !this.elements.list.contains(target) &&
        !this.elements.search.contains(target)
      ) {
        this.state.isOpen = false;
      }
    });
  }

  createListItem(item: PickerItem) {
    const element = this.elements.template.content.cloneNode(
      true,
    ) as DocumentFragment;
    const li = element.querySelector("li") as HTMLLIElement;

    li.textContent = `${item.name} (${item.code})`;

    if (item.code === this.state.selectedCode) {
      li.classList.add("selected");
    }

    li.addEventListener("click", () => {
      this.state.search = `${item.name} (${item.code})`;
      this.state.selectedCode = item.code;
    });

    return element;
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

  const form = document.getElementById("preferences-form") as HTMLFormElement;
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
