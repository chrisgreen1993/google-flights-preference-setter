const isDev = process.env.NODE_ENV === "development";
import packageJson from "./package.json";

export default {
  manifest_version: 3,
  name: `Google Flights Preference Setter${isDev ? " (dev)" : ""}`,
  version: packageJson.version,
  description:
    "Saves currency, language and location preferences for Google Flights.",
  permissions: ["storage", "tabs"],
  host_permissions: [
    "*://www.google.com/travel/*",
    // Needed for vite dev server
    ...(isDev ? ["http://localhost:5173/*"] : []),
  ],
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  action: {
    default_title: `Google Flights Preference Setter${isDev ? " (dev)" : ""}`,
    default_popup: "src/popup.html",
  },
  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
};
