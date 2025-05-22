import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("primary-button")
export class PrimaryButton extends LitElement {
  // Allow our button to be used as a submit button in a form
  static formAssociated = true;
  private internals: ElementInternals;

  static styles = css`
    button {
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius);
      padding: var(--spacing-md) var(--spacing-lg);
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
      width: 100%;
    }

    button:hover {
      background: color-mix(in srgb, var(--primary-color), black 10%);
    }

    button:active {
      background: color-mix(in srgb, var(--primary-color), black 20%);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  `;

  private handleClick() {
    if (this.type === "submit") {
      // We need to do this manually as events can't cross the shadow DOM boundary
      this.internals.form?.requestSubmit();
    }
  }

  @property() type: "button" | "submit" = "button";

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  render() {
    return html`<button type=${this.type} @click=${this.handleClick}>
      <slot></slot>
    </button>`;
  }
}
