// Run on docs.google.com

// document.addEventListener("DOMContentLoaded", function () {

var buttonDiv = document.createElement("div");
buttonDiv.innerHTML = '<button id="extensionButton" disabled>Aidify Report</button>';
document.querySelector(".docs-titlebar-buttons").appendChild(buttonDiv);
var button = document.getElementById("extensionButton");

var buttonStyle = `
#extensionButton {
  background-color: #10c367;
  color: #fff;
  padding: 8px 16px;
  border: 1px solid #10c367;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: none;
}

#extensionButton:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

#extensionButton:disabled {
  background-color: #f2f2f2;
  color: #999999;
  cursor: help;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip p {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0rem;
}

.tooltip .tooltiptext {
  visibility: hidden;
  font-size: 0.8rem;
  font-weight: light;
  width: 110px;
  color: black;
  background-color: #e9e6e6;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  position: absolute;
  z-index: 9999;
  top: 100%;
  left: 0;
  white-space: normal; /* Allow text to wrap to the next line */
  overflow: hidden; /* Prevent text from spilling over */
  text-overflow: ellipsis; /* Add ellipsis to indicate truncated text */
}

.tooltip.revisions-tooltip .tooltiptext {
  left: 0;
  margin-top: 10px;
  margin-left: 0;
  transform: translateX(0);
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}


`;

// Create a style element
var styleElement = document.createElement("style");
styleElement.innerHTML = buttonStyle;

chrome.storage.sync.get(["toggleState"], function (result) {
  const value1 = result.toggleState;
  // Do something with the retrieved values
  console.log("toggel state:", value1);
  if (value1) {
    button = document.getElementById("extensionButton");
    button.style.display = "block";
  } else {
    button = document.getElementById("extensionButton");
    button.style.display = "none";
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message from background:", message);
  //
  if (!message) {
    button = document.getElementById("extensionButton");
    button.style.display = "none";
  }
  if (message) {
    button = document.getElementById("extensionButton");
    button.style.display = "block";
  }
});

// Append the style to the head of the document
document.head.appendChild(styleElement);

// Get docuemtnt ID
const url = window.location.href;
let documentId = "id var";
console.log("url: " + url);
const matches = url.match(/\/document\/d\/([^/]+)/);
if (matches) {
  console.log("matches: " + matches);
  documentId = matches[1];
  // Send the document ID to the background script
  console.log(documentId);
  // chrome.runtime.sendMessage({ documentId });
}

// Get base url
const metaTag = document.querySelector('meta[property="og:url"]');
// Access the meta tag content
let content = metaTag.getAttribute("content");
let baseurl = content.substring(0, content.indexOf("/d/") + 3); // Adding 3 to include the '/d/' part
console.log(baseurl);

// Get document token - Searches through all the script tags to find '_docs_flag_initialData' (can't run inline js)
const scripts = document.getElementsByTagName("script");
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  if (script.textContent.includes("_docs_flag_initialData")) {
    const data = script.textContent.match(/_docs_flag_initialData=(.*?);/);
    if (data) {
      let dataString = data[1];
      // Get token
      let infoParamsIndex = dataString.indexOf('"info_params"');
      console.log(infoParamsIndex);
      if (infoParamsIndex !== -1) {
        // Find the substring starting from info_params to the next closing curly brace }
        let substring = dataString.substring(infoParamsIndex);
        let closingCurlyBraceIndex = substring.indexOf("}");
        if (closingCurlyBraceIndex !== -1) {
          // Extract the substring containing info_params value
          let infoParamsValue = substring.substring(
            0,
            closingCurlyBraceIndex + 1
          );
          let startIndex = infoParamsValue.indexOf('{"token"');
          infoParamsValue = infoParamsValue.substring(startIndex);
          infoParamsValue = JSON.parse(infoParamsValue);
          documentToken = infoParamsValue.token;
        }
      }
    }
    break;
  }
}

// Get document title
var documentTitle = document.title;
button.addEventListener("click", function () {
  console.log("clicked!");
  chrome.runtime.sendMessage({
    action: "openNewTab",
    id: documentId,
    token: documentToken,
    baseurl: baseurl,
    title: documentTitle,
  });
});


// Test to see if data is availble (it is only available to documents with edit access)
fetchUrl = baseurl + documentId + "/revisions/tiles?id=" + documentId + "&start=1&showDetailedRevisions=false&token=" + documentToken;
console.log("fetch  url: " + fetchUrl);
// Making a GET request using fetch
fetch(fetchUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    // Handle the data received from the API
    // const resultAsString = String(result).slice(")]}'".length);
    // const jsonRes = JSON.parse(resultAsString);
    // console.log('Data received');
    // console.log(jsonRes['tileInfo'][jsonRes['tileInfo'].length-1].end)
    button.disabled = false;
    return true;
  })
  .catch(error => {
    // Handle errors
    button = document.getElementById("extensionButton")
    button.innerHTML = '<span class="tooltip revisions-tooltip"><p>Report Not Available</p><span class="tooltiptext">You need to have edit access to this document. Try refreshing this page.</span></span>'
    button.disabled = true;
    console.error('There was a problem with the request:', error);
  });
