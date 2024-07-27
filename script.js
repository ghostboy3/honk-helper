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
