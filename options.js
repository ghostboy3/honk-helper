document.addEventListener("DOMContentLoaded", () => {
  const websiteInput = document.getElementById("website");
  const addBtn = document.getElementById("addBtn");
  const badWebsitesList = document.getElementById("badWebsitesList");

  function updateList() {
    chrome.storage.local.get(["badWebsites"], (data) => {
      const badWebsites = data.badWebsites || [];
      badWebsitesList.innerHTML = "";
      badWebsites.forEach((website, index) => {
        const li = document.createElement("li");
        li.textContent = website;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          badWebsites.splice(index, 1);
          chrome.storage.local.set({ badWebsites }, updateList);
        });
        li.appendChild(removeBtn);
        badWebsitesList.appendChild(li);
      });
    });
  }

  addBtn.addEventListener("click", () => {
    const website = websiteInput.value;
    if (website) {
      chrome.storage.local.get(["badWebsites"], (data) => {
        const badWebsites = data.badWebsites || [];
        badWebsites.push(website);
        chrome.storage.local.set({ badWebsites }, () => {
          websiteInput.value = "";
          updateList();
        });
      });
    }
  });

  updateList();
});
