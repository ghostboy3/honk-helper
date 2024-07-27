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
