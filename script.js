// Toggle button section

document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector(".toggle-switch input");

    toggleSwitch.addEventListener("change", function () {
        if (this.checked) {
            console.log("Display Goose");
            chrome.storage.sync.set({ displayGoose: true });
        } else {
            console.log("Don't Display Goose");
            chrome.storage.sync.set({ displayGoose: false });
        }
    });
});

chrome.storage.sync.get(["toggleState"], function (result) {
    const value1 = result.toggleState;
    // Do something with the retrieved values
    console.log("toggle state:", value1);
    const toggleSwitch = document.querySelector(".toggle-switch input");
    toggleSwitch.checked = value1;
});

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
