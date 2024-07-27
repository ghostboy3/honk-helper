// Toggle button section

document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.querySelector(".toggle-switch input");

  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      console.log("Switch is ON");
      chrome.storage.sync.set({ toggleState: true });
      // Send message to content.js
      chrome.runtime.sendMessage({ action: "toggleUpdate", toggleValue: true });
    } else {
      console.log("Switch is OFF");
      chrome.storage.sync.set({ toggleState: false });
      // Send message to content.js
      chrome.runtime.sendMessage({
        action: "toggleUpdate",
        toggleValue: false,
      });
    }
  });
});

chrome.storage.sync.get(["toggleState"], function (result) {
  const value1 = result.toggleState;
  // Do something with the retrieved values
  console.log("toggel state:", value1);
  const toggleSwitch = document.querySelector(".toggle-switch input");
  toggleSwitch.checked = value1;
  // Send message to content.js
  // chrome.runtime.sendMessage({ action: "toggleUpdate", toggleValue: true});
});

// document.addEventListener('DOMContentLoaded', function() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var currentTab = tabs[0];
//     var urlDisplay = document.getElementById('url');
//     urlDisplay.textContent = currentTab.url;
//     console.log("tab:", currentTab);
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(null, (items) => {
    const websitesDiv = document.getElementById('websites');
    for (const [hostname, time] of Object.entries(items)) {
      const websiteDiv = document.createElement('div');
      websiteDiv.className = 'website';
      websiteDiv.textContent = `${hostname}: ${formatTime(time)}`;
      websitesDiv.appendChild(websiteDiv);
    }
  });
});

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours}h ${minutes}m ${seconds}s`;
}
