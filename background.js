chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.startsWith('https://www.google.com/travel/flights')
  ) {
    const { preferences } = await chrome.storage.sync.get('preferences');
    const { currency = 'USD', language = 'en-US', location = 'US' } = preferences;

    const url = new URL(tab.url);
    let shouldUpdate = false;

    if (url.searchParams.get('curr') !== currency) {
      url.searchParams.set('curr', currency);
      shouldUpdate = true;
    }

    if (url.searchParams.get('hl') !== language) {
      url.searchParams.set('hl', language);
      shouldUpdate = true;
    }

    if (url.searchParams.get('gl') !== location) {
      url.searchParams.set('gl', location);
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      await chrome.tabs.update(tabId, { url: url.toString() });
    }
  }
});