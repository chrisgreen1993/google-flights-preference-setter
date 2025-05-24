const GOOGLE_TRAVEL_URL = "https://www.google.com/travel/";

const validUrlForPreferences = (url: string) => {
  return (
    url.startsWith(GOOGLE_TRAVEL_URL) &&
    // This redirects to external pages and should not be modified otherwise the url returns 404
    !url.startsWith(GOOGLE_TRAVEL_URL + "clk")
  );
};

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
    url: `${GOOGLE_TRAVEL_URL}*`,
  });

  tabs.forEach(async (tab) => {
    if (!tab.url || !tab.id || !validUrlForPreferences(tab.url)) return;
    await updateTabUrlWithPreferences(tab.id, tab.url, preferences);
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "loading" &&
    tab.url &&
    validUrlForPreferences(tab.url)
  ) {
    const { preferences = {} } = await chrome.storage.sync.get("preferences");
    await updateTabUrlWithPreferences(tabId, tab.url, preferences);
  }
});
