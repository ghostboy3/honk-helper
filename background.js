// Geese image
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
    trackTime(tab.url);
  }
});

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

// // // Track time
// chrome.storage.local.set({"HIII": "huulooooopooooooooooo"})
// let currentWebsite = '';
// let startTime = 0;

// chrome.tabs.onActivated.addListener(activeInfo => {
//   chrome.tabs.get(activeInfo.tabId, tab => {
//     handleWebsiteChange(tab.url);
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     handleWebsiteChange(tab.url);
//   }
// });

// function handleWebsiteChange(url) {
//   const website = new URL(url).hostname;

//   if (website !== currentWebsite) {
//     if (currentWebsite) {
//       const timeSpent = (Date.now() - startTime) / 1000;
//       saveTimeSpent(currentWebsite, timeSpent);
//     }

//     currentWebsite = website;
//     startTime = Date.now();
//     chrome.storage.local.set({currentWebsite, startTime}).then((result) => {
//       console.log("Value is " + result.key);
//     });
//   }
// }

// function saveTimeSpent(website, timeSpent) {
//   chrome.storage.local.get([website], data => {
//     const totalTime = (data[website] || 0) + timeSpent;
//     chrome.storage.local.set({[website]: totalTime})({currentWebsite, startTime}).then((result) => {
//       console.log("Value is " + result.key);
//     });
//   });
// }

// chrome.runtime.onStartup.addListener(() => {
//   chrome.storage.local.get(['currentWebsite', 'startTime'], data => {
//     if (data.currentWebsite && data.startTime) {
//       currentWebsite = data.currentWebsite;
//       startTime = data.startTime;
//     }
//   });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.local.clear();
// });
