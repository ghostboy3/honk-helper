chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.action === "openNewTab") {
      var url = chrome.runtime.getURL('data.html') + '?id=' + encodeURIComponent(message.id)+'&token='+encodeURIComponent(message.token)+'&title='+encodeURIComponent(message.title)+'&baseurl='+encodeURIComponent(message.baseurl);
      // var url = chrome.runtime.getURL('http://127.0.0.1:5500/index.html')
      // var url = 'localhost:3000' + '?id=' + encodeURIComponent(message.id)+'&token='+encodeURIComponent(message.token)+'&title='+encodeURIComponent(message.title)+'&baseurl='+encodeURIComponent(message.baseurl);

      chrome.tabs.create({ url: url });
    }

    if (message.action == "toggleUpdate"){
      // console.log(message.toggleValue);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Send a message to the content script of the active tab
        chrome.tabs.sendMessage(tabs[0].id, message.toggleValue);
      });
    }
  });

  