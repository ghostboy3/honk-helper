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


// Adding Goose
document.head.appendChild(styleElement);

