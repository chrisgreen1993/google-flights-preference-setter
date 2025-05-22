import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("error-banner")
export class ErrorBanner extends LitElement {
  static styles = css`
    :host {
      background: color-mix(in srgb, var(--error-color), white 90%);
      color: var(--error-color);
      border: 1px solid var(--error-color);
      border-radius: var(--radius);
      padding: var(--spacing-md);
      text-align: center;
      font-weight: 500;
    }
  `;

  render() {
    return html`<slot></slot> `;
  }
}
