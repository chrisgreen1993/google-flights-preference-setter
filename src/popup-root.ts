import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Task } from "@lit/task";
import currencies from "./currencies";
import languages from "./languages";
import locations from "./locations";

import "./item-picker";

@customElement("popup-root")
export class PopupRoot extends LitElement {
  static styles = css`
    h1 {
      color: var(--primary-color);
      font-size: var(--font-size-lg);
      font-weight: 500;
      margin-top: 0;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    button {
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius);
      padding: var(--spacing-md) var(--spacing-lg);
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    button:hover {
      background: color-mix(in srgb, var(--primary-color), black 10%);
    }

    button:active {
      background: color-mix(in srgb, var(--primary-color), black 20%);
    }
  `;

  private preferencesTask = new Task(this, {
    task: async () => {
      const { preferences = {} } = await chrome.storage.sync.get("preferences");
      return preferences;
    },
    args: () => [],
  });

  private async handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const preferences = {
      currency: formData.get("currency-code"),
      language: formData.get("language-code"),
      location: formData.get("location-code"),
    };
    await chrome.storage.sync.set({ preferences });

    window.close();
  }

  render() {
    return this.preferencesTask.render({
      pending: () => html`<p>Loading...</p>`,
      complete: (preferences) => html`
        <body>
          <h1>Google Flights Preference Setter</h1>
          <form @submit=${this.handleSubmit}>
            <item-picker
              name="currency-code"
              label="Currency:"
              .items=${currencies}
              .selectedCode=${preferences.currency || "USD"}
            ></item-picker>
            <item-picker
              name="language-code"
              label="Language:"
              .items=${languages}
              .selectedCode=${preferences.language || "en-US"}
            ></item-picker>
            <item-picker
              name="location-code"
              label="Location:"
              .items=${locations}
              .selectedCode=${preferences.location || "US"}
            ></item-picker>
            <button type="submit">Save</button>
          </form>
        </body>
      `,
      error: (error) => html`<p>Error: ${(error as Error).message}</p>`,
    });
  }
}
