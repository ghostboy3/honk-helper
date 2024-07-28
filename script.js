document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["currentWebsite", "startTime"], (data) => {
        const { currentWebsite, startTime } = data;
        const now = new Date().getTime();
        const timeSpent = now - startTime;
        document.getElementById('time-info').innerHTML = `
            <p>Current Website: ${currentWebsite}</p>
            <p>Time Spent: ${Math.floor(timeSpent / 1000)} seconds</p>
        `;
    });
  });

// Goose display
chrome.storage.sync.get("toggleState", function (result) {
    let toggleStateValue = result.toggleState;
  
    // Check if the value is empty or undefined
    if (toggleStateValue === undefined || toggleStateValue === "") {
      // Set a default value if it's empty
  
      // Update the value in chrome.storage
      chrome.storage.sync.set({ toggleStateValue: false }, function () {
        console.log("Value set to default:"); //, yourValue);
      });
      // Send message to content.js
      chrome.runtime.sendMessage({ action: "toggleUpdate", toggleValue: false });
    } else {
      console.log("Value already exists:"); //, yourValue);
    }
  });
  
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