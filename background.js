let activeTabId = null;
let activeTabStartTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const previousTabId = activeTabId;
  activeTabId = activeInfo.tabId;

  if (previousTabId !== null) {
    const timeSpent = Date.now() - activeTabStartTime;
    await saveTime(previousTabId, timeSpent);
  }

  activeTabStartTime = Date.now();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === 'complete') {
    const timeSpent = Date.now() - activeTabStartTime;
    await saveTime(tabId, timeSpent);
    activeTabStartTime = Date.now();
  }
});

async function saveTime(tabId, timeSpent) {
  const tab = await chrome.tabs.get(tabId);
  const url = new URL(tab.url);
  const hostname = url.hostname;

  chrome.storage.local.get([hostname], (result) => {
    const totalTime = (result[hostname] || 0) + timeSpent;
    chrome.storage.local.set({ [hostname]: totalTime });
  });
}
