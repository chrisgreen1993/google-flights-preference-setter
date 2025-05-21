async function updateTabUrlWithPreferences(
  tabId: number,
  tabUrl: string,
  preferences: { currency?: string; language?: string; location?: string },
) {
  const { currency = "USD", language = "en-US", location = "US" } = preferences;

  const queryParamMappings = {
    curr: currency,
    hl: language,
    gl: location,
  };

  const url = new URL(tabUrl);

  const hasChanges = Object.entries(queryParamMappings).some(
    ([param, value]) => url.searchParams.get(param) !== value,
  );

  if (hasChanges) {
    Object.entries(queryParamMappings).forEach(([param, value]) => {
      url.searchParams.set(param, value);
    });
    await chrome.tabs.update(tabId, { url: url.toString() });
  }
}

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== "sync" || !changes.preferences) return;

  const preferences = changes.preferences.newValue;

  const tabs = await chrome.tabs.query({
    url: "https://www.google.com/travel/flights*",
  });

  tabs.forEach(async (tab) => {
    if (!tab.url || !tab.id) return;
    await updateTabUrlWithPreferences(tab.id, tab.url, preferences);
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "loading" &&
    tab.url?.startsWith("https://www.google.com/travel/flights")
  ) {
    const { preferences = {} } = await chrome.storage.sync.get("preferences");
    await updateTabUrlWithPreferences(tabId, tab.url, preferences);
  }
});
