import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface PickerItem {
  name: string;
  code: string;
}

@customElement("item-picker")
export class ItemPicker extends LitElement {
  // This element is form-associated, which means it can be used in a form
  // and can manage its own form value.
  static formAssociated = true;
  private internals: ElementInternals;

  static styles = css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    label {
      font-size: var(--font-size-md);
      color: var(--text-color);
      font-weight: 500;
    }

    li {
      padding: var(--spacing-md);
      cursor: pointer;
      border-radius: var(--radius);
      transition: background-color 0.2s;
    }

    li:hover {
      background: #f8f9fa;
    }

    li.selected {
      background: color-mix(in srgb, var(--primary-color), white 90%);
      color: var(--primary-color);
    }

    ul {
      max-height: 200px;
      overflow: auto;
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      margin: 0;
      padding: var(--spacing-md);
      list-style: none;
      background: white;
    }

    input[type="text"] {
      padding: var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      font-size: var(--font-size-md);
    }
  `;

  @property({ type: Array }) items: PickerItem[] = [];
  @property({ type: String }) label = "";
  @property({ type: String }) selectedCode = "";

  @state() private search = "";
  @state() private isOpen = false;

  constructor() {
    super();
    this.tabIndex = 0; // Make the element focusable
    // Setup form association
    this.internals = this.attachInternals();
    this.addEventListener("blur", () => {
      this.setSearchFromSelectedCode();
      this.isOpen = false;
    });
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("selectedCode")) {
      this.setSearchFromSelectedCode();
    }
  }

  private setSearchFromSelectedCode() {
    const item = this.items.find((i) => i.code === this.selectedCode);
    this.search = item ? `${item.name} (${item.code})` : "";
  }

  get filteredItems() {
    const filter = this.search.toLowerCase();
    return this.items.filter(
      (c) =>
        c.code.toLowerCase().includes(filter) ||
        c.name.toLowerCase().includes(filter),
    );
  }

  private onSelect(item: PickerItem) {
    this.selectedCode = item.code;
    this.search = `${item.name} (${item.code})`;
    this.isOpen = false;
  }

  updated() {
    // Update the form value when the selected code changes
    this.internals.setFormValue(this.selectedCode);
  }

  render() {
    return html`
      <label>${this.label}</label>
      <input
        type="text"
        .value=${this.search}
        placeholder="Search currency..."
        autocomplete="off"
        @input=${(e: Event) => {
          this.search = (e.target as HTMLInputElement).value;
          this.isOpen = true;
        }}
        @focus=${() => (this.isOpen = true)}
      />
      ${this.isOpen && this.filteredItems.length
        ? html`
            <ul>
              ${this.filteredItems.map(
                (item) => html`
                  <li
                    class="${item.code === this.selectedCode ? "selected" : ""}"
                    @click=${() => this.onSelect(item)}
                  >
                    ${item.name} (${item.code})
                  </li>
                `,
              )}
            </ul>
          `
        : ""}
    `;
  }
}
