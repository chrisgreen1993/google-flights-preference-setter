# Google Flights Preference Setter

A Chrome extension that lets you set your preferred currency, language, and location for Google Flights as setting them on the website doesn't save these preferences.

## Setup & Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chrisgreen1993/google-flights-preference-setter.git
   cd google-flights-preference-setter
   ```

2. **Install dependencies (optional, only used for prettier):**

   ```bash
   npm install
   ```

3. **Build the extension zip:**

   ```bash
   ./build.sh
   ```

   This will create `extension.zip` containing everything needed for upload.

4. **Load the extension in Chrome:**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

## Development Tips

- Edit files in `src/` for main logic and UI.
- Run `npm run format` to auto-format code with Prettier.
- Use the build script to package your extension for the Chrome Web Store.

## License

MIT
