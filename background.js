chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url?.startsWith('https://www.google.com/travel/flights')
  ) {
    const { preferredCurrency } = await chrome.storage.sync.get('preferredCurrency');
    const currency = preferredCurrency || 'USD'; 
    
    const url = new URL(tab.url);
    if (url.searchParams.get('curr') !== currency) {
      url.searchParams.set('curr', currency);
      await chrome.tabs.update(tabId, { url: url.toString() });
    }
  }
});