import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Task } from "@lit/task";
import currencies from "./currencies";
import languages from "./languages";
import locations from "./locations";

import "./item-picker";
import "./error-banner";
import "./primary-button";

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

    .large-text {
      font-size: var(--font-size-lg);
      font-weight: 500;
      text-align: center;
    }
  `;

  // State to track if any of the form inputs have been touched.
  @state() private formTouched = false;

  private loadPreferencesTask = new Task(this, {
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
    this.savePreferencesTask.run([formData]);
    // Reset form touched state to false after saving
    this.formTouched = false;
  }

  private handlePickerInput() {
    this.formTouched = true;
  }

  private savePreferencesTask = new Task(this, {
    task: async ([formData]: [FormData]) => {
      const preferences = {
        currency: formData.get("currency-code"),
        language: formData.get("language-code"),
        location: formData.get("location-code"),
      };

      await chrome.storage.sync.set({ preferences });
    },
    autoRun: false,
  });

  render() {
    return html`
      <h1>Google Flights Preference Setter</h1>
      ${this.loadPreferencesTask.render({
        pending: () => html`<p class="large-text">Loading...</p>`,
        complete: (preferences) => html`
          <form @submit=${this.handleSubmit}>
            ${this.savePreferencesTask.error &&
            html`<error-banner>
              ${(this.savePreferencesTask.error as Error).message}
            </error-banner>`}
            <item-picker
              name="currency-code"
              label="Currency:"
              .items=${currencies}
              .selectedCode=${preferences.currency || "USD"}
              @input=${this.handlePickerInput}
            ></item-picker>
            <item-picker
              name="language-code"
              label="Language:"
              .items=${languages}
              .selectedCode=${preferences.language || "en-US"}
              @input=${this.handlePickerInput}
            ></item-picker>
            <item-picker
              name="location-code"
              label="Location:"
              .items=${locations}
              .selectedCode=${preferences.location || "US"}
              @input=${this.handlePickerInput}
            ></item-picker>
            ${this.savePreferencesTask.render({
              initial: () =>
                html`<primary-button type="submit">Save</primary-button>`,
              pending: () =>
                html` <primary-button type="submit" disabled
                  >Saving...</primary-button
                >`,
              complete: () =>
                html`<primary-button type="submit">
                  ${this.formTouched ? "Save" : "Saved!"}
                </primary-button>`,
              error: () =>
                html`<primary-button type="submit">Retry</primary-button>`,
            })}
          </form>
        `,
        error: (error) =>
          html`<p class="large-text">Error: ${(error as Error).message}</p>`,
      })}
    `;
  }
}
