// Geese image
var loop;

const blacklist = ['instagram.com','discord.com','youtube.com','twitter.com','facebook.com','twitch.tv', 'reddit.com'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    trackTime(tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer(tab);
    trackTime(tab.url);
  }
});

chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer(tab);
  }
});

chrome.windows.onRemoved.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer(tab);
  }
});

function stopTimer(tab){
  if(!blacklist.includes(new URL(tab.url).hostname)){
    var currentRunningTime;

    chrome.storage.local.get('startTime', (data) => {
      currentRunningTime = new Date().getTime() - data.startTime;
    });

    chrome.storage.local.get('workingTime',(data) => {
      chrome.storage.local.set({ workingTime: data.workingTime + currentRunningTime});
    });
  }
}

function trackTime(url) {
  const now = new Date().getTime();
  chrome.storage.local.get(["currentWebsite", "startTime"], (data) => {
    const { currentWebsite, startTime } = data;
    if (currentWebsite && startTime) {
      const timeSpent = now - startTime;
      console.log(`Time spent on ${currentWebsite}: ${timeSpent} ms`);
    }
    chrome.storage.local.set({ currentWebsite: url, startTime: now });
  });
}