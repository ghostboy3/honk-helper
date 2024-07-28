// Geese image

const blacklist = ['instagram.com','discord.com','youtube.com','twitter.com','facebook.com','twitch.tv'];

const importfr = (path) => {
  return chrome.runtime.getURL('assets/' + path)
}
const Honk = new Audio(importfr('honk.mp3'));

function honk() {
  Honk.play();
}

var loop;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
});
// timer
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    checkAndTrackTime(tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndTrackTime(tab.url);
  }
});

function checkAndTrackTime(url) {
  trackTime(url);
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

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.badWebsites) {
    updateRules();
  }
});

function updateRules() {
  chrome.storage.local.get("badWebsites", (data) => {
    const badWebsites = data.badWebsites || [];
    const rules = badWebsites.map((badUrl, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: badUrl, resourceTypes: ["main_frame"] }
    }));
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(rule => rule.id),
      addRules: rules
    });
  });
}

updateRules();

setInterval(() => {
  honk();
  console.log('honk');
}, 10000);