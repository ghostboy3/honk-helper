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
