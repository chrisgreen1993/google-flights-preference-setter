function buildRedirectRule(preferences: {
  currency: string;
  language: string;
  location: string;
}) {
  const { currency = "USD", language = "en-US", location = "US" } = preferences;

  return {
    id: 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: {
        transform: {
          queryTransform: {
            addOrReplaceParams: [
              { key: "curr", value: currency },
              { key: "hl", value: language },
              { key: "gl", value: location },
            ],
          },
        },
      },
    },
    condition: {
      urlFilter: "://www.google.com/travel/*",
      resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
    },
  };
}

// Listen for preference changes and update the redirect rule
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== "sync" || !changes.preferences) return;
  const preferences = changes.preferences.newValue || {};

  const rule = buildRedirectRule(preferences);

  // Remove previous rule and add the new one
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [rule],
  });

  await chrome.tabs.reload();
});

// On extension startup, set the rule based on current preferences
chrome.runtime.onInstalled.addListener(async () => {
  const { preferences = {} } = await chrome.storage.sync.get("preferences");
  const rule = buildRedirectRule(preferences);

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [rule],
  });
});
