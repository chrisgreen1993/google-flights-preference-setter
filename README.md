# Google Flights Preference Setter

A Chrome extension that lets you set your preferred currency, language, and location for Google Flights as setting them on the website doesn't save these preferences.

## Setup & Development

```bash
git clone https://github.com/chrisgreen1993/google-flights-preference-setter.git
cd google-flights-preference-setter

npm install

npm run dev
```

- Go to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked" and select the project folder

## Release

Builds for production and creates a zip file for upload.

```bash
npm run release
```

## License

MIT
