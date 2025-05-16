chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'sync' || !changes.preferences) return;
  
  const { preferences } = changes;
  const { currency = 'USD', language = 'en-US', location = 'US' } = preferences.newValue;

  const queryParamMappings = {
    curr: currency,
    hl: language,
    gl: location
  }

  const tabs = await chrome.tabs.query({
    url: 'https://www.google.com/travel/flights*'
  });

  tabs.forEach(async (tab) => {
    const url = new URL(tab.url);

    const hasChanges = Object.entries(queryParamMappings).some(([param, value]) => url.searchParams.get(param) !== value);

    if (hasChanges) {
      Object.entries(queryParamMappings).forEach(([param, value]) => {
        url.searchParams.set(param, value);
      });

      await chrome.tabs.update(tab.id, { url: url.toString() });
    }
  });
});