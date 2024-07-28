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

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    startTimer(tab);
    trackTime(tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer();
    startTimer(tab);
    trackTime(tab.url);
  }
});

chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer();
  }
});

chrome.windows.onRemoved.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    stopTimer();
  }
});

function startTimer(tab){
  if(blacklist.includes(new URL(tab.url).hostname)){
    loop = setInterval(honk,600000);
  }
}

function stopTimer(){
  try {
    clearInterval(loop);
  } catch (error) {
    
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