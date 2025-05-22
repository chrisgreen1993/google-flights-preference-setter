# Google Flights Preference Setter

A Chrome extension that lets you set your preferred currency, language, and location for Google Flights as setting them on the website doesn't save these preferences.

Built with TypeScript & [Lit](https://lit.dev/)

## Limitations

Currently this doesn't work with the Hotels and Holiday Rentals pages (`https://www.google.com/travel/search`) as they use a different mechanism to set the preferences.

## Setup & Development

```bash
git clone https://github.com/chrisgreen1993/google-flights-preference-setter.git
cd google-flights-preference-setter

npm install

npm run dev

# Linting and formatting
npm run lint
npm run format
```

- Go to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked" and select the project folder

## Release

Will walk you through the release process, inlcuding bumping versions, generating release notes etc.

```bash
npm run release
```

After this just upload the created .zip file to the Chrome Web Store.

## License

MIT
