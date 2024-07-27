function formatDate(epochTime) {
  const date = new Date(epochTime);
  const formattedDate = date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate;
}

// Function to convert milliseconds to hours, minutes, and seconds
function formatDuration(duration) {
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function getDocumentData(id, token, baseurl) {
  const url =
    baseurl +
    id +    "/revisions/tiles?id=" +

    id +
    "&start=1&showDetailedRevisions=false&token=" +
    token;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((result) => {
      const resultAsString = String(result).slice(")]}'".length);
      const jsonRes = JSON.parse(resultAsString);
      // console.log(jsonRes);
      // console.log(jsonRes['tileInfo'][jsonRes['tileInfo'].length-1].end)
      return jsonRes;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation");
    });
}

// Gets all the edits
async function fetchRevisionData(id, token, baseurl) {
  const loadingOverlay = document.getElementById("loading-overlay");
  // console.log("LOADING");
  loadingOverlay.style.display = "flex"; // Show loading overlay

  try {
    // Get total number of edits
    const docData = await getDocumentData(id, token, baseurl);
    const totalRevisions =
      docData["tileInfo"][docData["tileInfo"].length - 1].end;
    // console.log("Total Revisions:", totalRevisions);

    const url =
      baseurl +
      id +
      "/revisions/load?id=" +
      id +
      "&start=1&end=" +
      totalRevisions;
    // console.log("Fetch URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      // console.log(url);
      throw new Error("Network response was not ok");
    }

    // console.log("DONE LOADING");
    loadingOverlay.style.display = "none"; // Hide loading overlay in case of error

    const result = await response.text();
    const resultAsString = String(result).slice(")]}'".length);
    const jsonRes = JSON.parse(resultAsString);
    // console.log(jsonRes);
    return jsonRes;
  } catch (error) {
    const loadingMsg = document.getElementById("loading-message");
    loadingMsg.innerHTML = "An Error Occurred - Try refreshing this page";
    console.error("There was a problem with the fetch operation");
  }
}

// returns array with userId, userName, userPfp
async function getUsers() {
  // console.log("getUsers func");
  const docData = await getDocumentData(id, tok, baseurl);
  userArr = docData["userMap"];
  // console.log(userArr);
  Object.entries(userArr).forEach(([key, value]) => {
    // console.log(key);
    // console.log(edits.filter((item) => item.userId === key))

    // If there's no edits with that user
    if (edits.filter((item) => item.userId === key).length === 0) {
      // console.log("ajskdlfs");
      delete userArr[key];
      // userArr.Remove(key)
      // console.log(userArr);
    }
  });

  return userArr;
}

// If a copy of the doucment was made
function getFirstEdit(id, token, baseurl) {
  const url =
    baseurl + id + "/showrevision?start=1&end=1&id=" + id + "&token=" + token;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((result) => {
      const resultAsString = String(result).slice(")]}'".length);
      const jsonRes = JSON.parse(resultAsString);
      content = ""
      jsonRes.chunkedSnapshot.forEach(i => {
        // console.log(i);
        i.forEach(edit =>{
          if(edit.ty == "is"){
          content = applyInsert(content, edit.ibi, edit.s)
          }
        })
      })
      // console.log(content);

      return content; // first edit
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation");
    });
}

function checkBlank(edits) {
  if (edits.length == 0) {
    const loadingOverlay = document.getElementById("loading-overlay");
    // console.log("LOADING");
    loadingOverlay.style.display = "flex"; // Show loading overlay
    const loadingMsg = document.getElementById("loading-message");
    loadingMsg.innerHTML =
      "This is a blank document or a copy of a document (the edits were made on a different document and this is just a copy)";
  }
}

// Function to handel the mlti type
function handelMlti(data) {
  time = data[1];
  userId = data[2];
  mltiEdits = [];
  // console.log(data[0].mts);
  data[0].mts.forEach((item) => {
    type = item.ty;
    // console.log(type + " and " + item)
    if (type == "is" || type == "iss") {
      edit = {
        ty: "is",
        text: item.s,
        loc: item.ibi,
        time: time,
        userId: userId,
      };
      mltiEdits.push(edit);
    } else if (type == "ds" || type == "dss") {
      // si: start index    ei: end index
      edit = {
        ty: "ds",
        si: item.si,
        ei: item.ei,
        time: time,
        userId: userId,
      };
      mltiEdits.push(edit);
    }
  });
  return mltiEdits;
}

// Generate edits array from data
function generateEdits(data, editsArr) {
  // console.log(data);
  edits = editsArr;
  // console.log(data);
  data.forEach((item) => {
    try {
      type = item[0].ty;
    } catch {
      // console.log("ERROR");
      // console.log(item);
      // console.log(data);
    }
    if (type == "is" || type == "iss") {
      // is: Insert   ds: delete
      edit = {
        ty: "is",
        text: item[0].s,
        loc: item[0].ibi,
        time: item[1],
        userId: item[2],
      };
      edits.push(edit);
    } else if (type == "ds" || type == "dss") {//msfd
      // si: start index    ei: end index
      edit = {
        ty: "ds",
        si: item[0].si,
        ei: item[0].ei,
        time: item[1],
        userId: item[2],
      };
      edits.push(edit);
    } else if (type == "mlti") {
      // handelMlti(item).forEach((i) => {
      //   edits.push(i);
      // });
      updatedArr = [];
      item[0].mts.forEach((itemInner) => {
        updatedArrItem = [itemInner, item[1], item[2]];
        // console.log([itemInner, item[1], item[2]]);
        // console.log(updatedArr[0].ty);
        // console.log([itemInner, item[1], item[2]]);
        updatedArr.push(updatedArrItem);
      });
      generateEdits(updatedArr, edits);
    }
  });
  return edits;
}

function filterEditsByUser(edits, userId) {
  if (userId == "default") {
    return edits;
  }
  return edits.filter((item) => item.userId === userId);
}

function userDropdown(edits, id) {
  dropdown = document.getElementById(id);
  getUsers(edits).then((users) => {
    Object.entries(users).forEach(([key, value]) => {
      dropdown = document.getElementById(id);

      const newOption = document.createElement("option");
      if (value.name == "") {
        newOption.text = "Anonymous Users";
      } else {
        newOption.text = value.name;
      }
      newOption.value = key;
      dropdown.appendChild(newOption);
    });
  });
}

// Helper func for getCopied
function displayTexts(startIndex, endIndex, copiedTexts) {
  for (let i = startIndex; i < endIndex; i++) {
    const text = copiedTexts[i];
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<p class="bold copyTime">${text.date}</p>${text.text}`;
    cardContainer.appendChild(card);
  }
}

// Gets all the copy/pasted text
function getCopied(data) {
  let copyNum = 50; // Minimum number of chacters to be considered a substantial copy
  let copiedTexts = []; // list containing all the copied text
  // Clear copied pasted div
  var myDiv = document.getElementById("cardContainer");
  myDiv.innerHTML = "";

  // add copied pasts to copiedTexts array
  data.forEach((item, index) => {
    if (item.ty == "is") {
      let len = item.text.length;
      if (len >= copyNum) {
        // console.log(item.text);
        // console.log(checkExternalCopied(data, { text: item.text, date: formatDate(item.time), index: index}));
        if(checkExternalCopied(data, { text: item.text, date: formatDate(item.time), index: index})=== false){
          copiedTexts.push({ text: item.text, date: formatDate(item.time), index: index});
        }
      }
    }
  });

  // DISPLAY COPIED TEXT
  const initialDisplayCount = 3;

  document
    .getElementById("showAllButton")
    .addEventListener("click", function () {
      // Display all elements when "Show All" button is clicked
      document.getElementById("cardContainer").innerHTML = "";
      displayTexts(0, copiedTexts.length, copiedTexts);
      document.getElementById("showAllButton").style.display = "none";
      document.getElementById("hideAllButton").style.display = "block";
    });

  document
    .getElementById("hideAllButton")
    .addEventListener("click", function () {
      // Display initial three elements when "Hide" button is clicked
      document.getElementById("cardContainer").innerHTML = "";
      displayTexts(0, initialDisplayCount, copiedTexts);
      document.getElementById("showAllButton").style.display = "block";
      document.getElementById("hideAllButton").style.display = "none";
    });

  if (copiedTexts.length > initialDisplayCount) {
    // Display the first three elements initially
    displayTexts(0, initialDisplayCount, copiedTexts);
    document.getElementById("showAllButton").style.display = "block";
  } else {
    // Display all elements if the array length is 3 or less
    displayTexts(0, copiedTexts.length, copiedTexts);
    document.getElementById("showAllButton").style.display = "none";
  }
  document.getElementById("numCopy").innerHTML =
    " (" + copiedTexts.length + ")";
  // copiedTexts.forEach((text) => {
  //   const card = document.createElement("div");
  //   card.className = "card";
  //   card.textContent = text;
  //   cardContainer.appendChild(card);
  // });
}

function checkExternalCopied(edits, copied){
  content = ""
  index = copied.index -1
  for (let i = 0; i <= index; i++) {
    const edit = edits[i];
    // console.log(edit);
    if (edit.ty === "is") {
      content = applyInsert(content, edit.loc, edit.text);
    } else if (edit.ty === "ds") {
      content = applyDelete(content, edit.si, edit.ei);
    }
    if (content.includes(copied.text)){
      return true
    }
    // console.log(content);
  }
  return false
}

function highlightUser(paragraph, edits, user){

}

// Scrolls video playback to the desired index
function scrollToIndex(paragraph, edit, user) {
  const index = edit.loc;

  const textBeforeIndex = paragraph.slice(0, index - 1); // NOTE: look into this
  // console.log(textBeforeIndex);
  const textAfterIndex = paragraph.slice(index + edit.text.length);

  if (user == edit.userId) {
    newText =
      textBeforeIndex +
      "<span id='scrollSpan' class='insertHighlight'>" +
      edit.text +
      "</span>" +
      textAfterIndex;
  } else {
    newText =
      textBeforeIndex +
      "<span id='scrollSpan' class='insert'>" +
      edit.text +
      "</span>" +
      textAfterIndex;
  }
  console.log(paragraph);
  console.log(newText);
  document.getElementById("playback").innerHTML = newText;

  element = document.getElementById("scrollSpan");
  container = document.getElementById("playback");
  if (element && container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // Check if the element is not in the viewport
    if (
      elementRect.top < containerRect.top ||
      elementRect.bottom > containerRect.bottom - 10
    ) {
      // Scroll to the element
      const offsetTop =
        document.getElementById("scrollSpan").offsetTop -
        document.getElementById("playback").offsetTop;
      document.getElementById("playback").scrollTop = offsetTop;
    }
  }

  // const offsetTop =
  //   document.getElementById("scrollSpan").offsetTop -
  //   document.getElementById("playback").offsetTop;
  // document.getElementById("playback").scrollTop = offsetTop;
}
function removeAndCountHighlights(str) {
  const openTag = /<span class='insertHighlight'>/g;
  const closeTag = /<\/span>/g;

  const openTagCount = (str.match(openTag) || []).length;
  const closeTagCount = (str.match(closeTag) || []).length;

  const newStr = str.replace(openTag, '').replace(closeTag, '');

  return {
      newStr: newStr,
      removedCount: openTagCount + closeTagCount
  };
}



// Sets playback function to the document after index edits
function replayEdits(edits, index, user, originalDoc) {
  // getFirstEdit(id, tok, baseurl).then((data) =>{
  // content = ""

  let content = originalDoc;
  const slider = document.getElementById("playbackSlider");
  slider.value = index; // Default start value
  // Apply inserts and deletions up to the specified index
  for (let i = 0; i <= index; i++) {
    const edit = edits[i];
    // console.log(edit);
    if (edit.ty === "is") {
      content = applyInsert(content, edit.loc, edit.text);
      if (edit.userId==document.getElementById("userDropdownReplay").value){
        console.log(edit);
        // HIGHLIGHT THE EDIT HERE

        index = edit.loc;

        textBeforeIndex = removeAndCountHighlights(content).newStr.slice(0, index - 1); // NOTE: look into this
        // console.log(textBeforeIndex);
        textAfterIndex = removeAndCountHighlights(content).newStr.slice(index + edit.text.length);
        console.log("Text After Index: " + textAfterIndex);
        content =
        textBeforeIndex +
        "<span class='insertHighlight'>" +
        edit.text +
        "</span>" +
        textAfterIndex;
  
      
      }
    } else if (edit.ty === "ds") {
      content = applyDelete(content, edit.si, edit.ei);
    }
    // console.log(content);
  }

  document.getElementById("date").innerHTML =
    index < edits.length ? formatDate(edits[index].time) : "";

  // Update the playback content
  console.log(content);
  document.getElementById("playback").innerHTML = content;

  // Delay the scrolling to ensure the content is updated
  setTimeout(() => {
    if (index < edits.length && edits[index].ty == "is") {
      scrollToIndex(
        content,
        edits[index],
        document.getElementById("userDropdownReplay").value
      );
    }
  }, 10);
}

function applyInsert(original, loc, text) {
  return original.slice(0, loc - 1) + text + original.slice(loc - 1);
}

function applyDelete(original, start, end) {
  return original.slice(0, start - 1) + original.slice(end);
}

function videoReplay(edits, originalDoc) {
  const slider = document.getElementById("playbackSlider");
  const speedDropdown = document.getElementById("speedDropdown");

  speedDropdown.addEventListener("change", function () {
    if (isPlaying) {
      clearInterval(playInterval);
      speed = parseFloat(this.value);
      playInterval = setInterval(() => playNextEdit(speed), 50 / speed);
    } else {
      isPlaying = false;
      clearInterval(playInterval);
    }
  });
  slider.min = 0;
  slider.max = edits.length - 1;
  slider.value = 0; // Default start value

  let currentIndex = 0;
  let isPlaying = false; // Flag to track if edits are currently playing
  let playInterval; // Variable to store the interval for automatic replay

  // Function to handle the play button click event
  const handlePlayButtonClick = () => {
    if (!isPlaying) {
      // Start playing edits
      isPlaying = true;
      speed = parseFloat(speedDropdown.value); // Get the selected speed
      playInterval = setInterval(() => playNextEdit(speed), 50 / speed); // Adjust the delay as needed
      playButton.innerHTML = "Pause";
      // speedDropdown.addEventListener('change', function(event) {
      //   speed = parseFloat(speedDropdown.value); // Get the selected speed
      //   console.log(speed);
      //   playInterval = setInterval(() => playNextEdit(speed), 50 / speed); // Adjust the delay as needed

      // });
    } else {
      // Pause playing edits
      isPlaying = false;
      clearInterval(playInterval);
      playButton.innerHTML = "Play";
    }
  };

  // Add a click event listener to the play button
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", handlePlayButtonClick);

  // Function to play the next edit
  const playNextEdit = (speed) => {
    if (currentIndex < edits.length && isPlaying) {
      slider.value = currentIndex;
      replayEdits(edits, currentIndex, "none", originalDoc);

      const paragraph = document.getElementById("playback").innerHTML;
      if (edits[currentIndex].ty == "is") {
        scrollToIndex(
          paragraph,
          edits[currentIndex],
          document.getElementById("userDropdownReplay").value
        );
      }

      currentIndex++;
    } else {
      // Stop playing when all edits are played
      isPlaying = false;
      playButton.innerHTML = "Play";
      clearInterval(playInterval);
    }
  };

  // Add an input event listener to the slider for manual control
  slider.addEventListener("input", () => {
    // Pause automatic playback if slider is manually moved
    isPlaying = false;

    // Replay edits at the manual slider position
    currentIndex = parseInt(slider.value);
    replayEdits(edits, currentIndex, "none", originalDoc);
  });
}

// Graph the revisions by date
function createGraph(edits) {
  const xValues = []; // time
  const yValues = []; // revisions
  revisionCounter = 0;
  curTime = new Date(edits[0].time);

  edits.forEach((edit, index) => {
    date = new Date(edit.time);
    if (
      date.getFullYear() == curTime.getFullYear() &&
      date.getMonth() == curTime.getMonth() &&
      date.getDate() == curTime.getDate()
    ) {
      revisionCounter += 1;
      // console.log("day: " + date.getDate());
    } else {
      // console.log(curTime);
      let month = curTime.getMonth() + 1; //months from 1-12
      let day = curTime.getDate();
      let year = curTime.getFullYear();
      dateString = year + "/" + month + "/" + day;
      yValues.push(revisionCounter);
      xValues.push(dateString);
      // console.log("revision counter: " + revisionCounter);
      curTime = new Date(edit.time);
      revisionCounter = 1;
    }
    //If loop is on the last edit, save the edit to array
    if (index == edits.length - 1) {
      let month = curTime.getMonth() + 1; //months from 1-12
      let day = curTime.getDate();
      let year = curTime.getFullYear();
      dateString = year + "/" + month + "/" + day;
      yValues.push(revisionCounter);
      xValues.push(dateString);
    }
  });
  try {
    revisionChart.destroy();
    // console.log("destroyed");
  } catch (e) {
    // console.log("none");
  }
  revisionChart = new Chart(document.getElementById("dateChart"), {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: "rgba(61, 212, 212,1.0)",
          borderColor: "rgba(61, 212, 212,0.1)",
          data: yValues,
          maxBarThickness: 35, // Set the maximum bar thickness here
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Dates' // Label for the x-axis
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Edits' // Label for the y-axis
          },
          ticks: { min: 0, max: Math.max(...yValues) + 5 }
        }],
      },
      onClick: function (event, elements) {
        //   // Go to the replay date when a bar on the graph is clicked
        if (elements && elements.length > 0) {
          const clickedIndex = elements[0]._index;
          const datasetIndex = elements[0].datasetIndex;
          const value = this.chart.data; //.datasets[datasetIndex]//.data[clickedIndex];
  
          clickedDate = new Date(value.labels[clickedIndex]);
          // clickedDate = clickedDate.getTime();
          createTimeGraphs(edits, clickedDate);
        }
      },
    },
  });
  
}

// Graph of time of a day of edits
function createTimeGraphs(edits, date) {
  ogEdits = edits;
  // filter edits array
  try {
    // console.log("yay");
    document.getElementById("timeChartBtn").style.display = "block";

    edits = edits.filter((item) => {
      const itemDate = new Date(item.time);
      // date = new Date(date)
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because January is 0
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}/${month}/${day}`;
    document.getElementById("graphDateValue").innerHTML = formattedDate;
  } catch {
    // console.log("all dates");
    document.getElementById("graphDateValue").innerHTML = "All Dates";
    document.getElementById("timeChartBtn").style.display = "none";
  }
  document
    .getElementById("timeChartBtn")
    .addEventListener("click", function () {
      createTimeGraphs(ogEdits, "all dates");
    });

  hours = [];
  edits.forEach((edit, index) => {
    time = new Date(edit.time);

    hour = time.getHours();

    hours.push(hour);
  });
  hours.sort((a, b) => a - b);

  xValues = [...new Set(hours)]; // get all unique hours
  yValues = [];

  xValues.forEach((hr, index) => {
    count = 0;

    for (let i = 0; i < hours.length; i++) {
      if (hours[i] === hr) {
        count++;
      }
    }
    yValues.push(count);
    //Convert to am and pm
    const amPM = hr >= 12 ? "PM" : "AM";
    hour = hr % 12 || 12;
    hour = `${hour} ${amPM}`;
    xValues[index] = hour;
  });

  try {
    revisionChartTime.destroy();
    // console.log("destroyed");
  } catch (e) {
    // console.log("none");
  }
  revisionChartTime = new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: "rgba(61, 212, 212,1.0)",
          borderColor: "rgba(61, 212, 212,0.1)",
          data: yValues,
          maxBarThickness: 35, // Set the maximum bar thickness here
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time of Day' // Label for the x-axis
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Edits' // Label for the y-axis
          },
          ticks: { min: 0, max: Math.max(...yValues) + 5 }
        }],
      },
    },
  });
}

function createTimePerDayGraph(edits){
  let xValues = []
  let yValues = []
  curTime = new Date(edits[0].time);
  editsPerDay = []  // array containing all editsOnDay
  editsOnDay=[]   // all edits in one day

  edits.forEach((edit, index)=>{
    date = new Date(edit.time);
    // console.log(index);
    if(
      date.getFullYear() == curTime.getFullYear() &&
      date.getMonth() == curTime.getMonth() &&
      date.getDate() == curTime.getDate()
    ){
      editsOnDay.push(edit)
    }
    else{
      editsPerDay.push(editsOnDay)
      editsOnDay = []
      editsOnDay.push(edit)
      curTime = new Date(edit.time);
    }
    if (index == edits.length-1 && editsOnDay != []){
      editsPerDay.push(editsOnDay)
    }
  })

  // X Vaules
  editsPerDay.forEach(dayArr =>{
    dayEpoch = new Date(dayArr[0].time)
    let month = dayEpoch.getMonth() + 1; //months from 1-12
    let day = dayEpoch.getDate();
    let year = dayEpoch.getFullYear();
    dateString = year + "/" + month + "/" + day;
    xValues.push(dateString)


    // Y vules
    yValues.push(Math.round(getWritingSessions(dayArr)/60000))
  })
  // console.log(editsPerDay);
  // console.log(xValues);
  // console.log(yValues);

try {
  timePerDayChart.destroy();
    // console.log("destroyed");
  } catch (e) {
    // console.log("none");
  }
  timePerDayChart = new Chart(document.getElementById("timePerDayChart"), {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: "rgba(61, 212, 212,1.0)",
          borderColor: "rgba(61, 212, 212,0.1)",
          data: yValues,
          maxBarThickness: 35, // Set the maximum bar thickness here
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Dates' // Label for the x-axis
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time Spent (Mintues)' // Label for the y-axis
          },
          ticks: { min: 0, max: Math.max(...yValues) + 5 }
        }],
      },
    },
  });
  
}

function getStats(edits) {
  let content = "";
  let deletes = 0;
  // let writingSessions = 0;
  // let time1 = new Date(edits[0].time);
  // let time2 = new Date(edits[0].time);
  totalTimeMs = 0;
  edits.forEach((edit, index) => {
    if (edit.ty == "is") {
      content =
        content.slice(0, edit.loc - 1) +
        edit.text +
        content.slice(edit.loc - 1);
    }
    if (edit.ty == "ds") {
      content = content.slice(0, edit.si - 1) + content.slice(edit.ei);
      deletes += 1;
    }

    // time2 = new Date(edit.time);
    // if (time2 - time1 > 600000 || index == edits.length-1) {
    //   // 10 minutes is 600000 milliseconds
    //   totalTimeMs += new Date(edits[index - 1].time) - time1;
    //   // console.log(time1);
    //   // console.log(time2);
    //   // console.log(new Date(edits[index-1].time) - time1);
    //   // console.log("\n");
    //   time1 = time2;
    //   writingSessions += 1;
    // }
    // console.log("time im milleseconds: " + totalTimeMs);
  });
  totalTimeMs = getWritingSessions(edits);
  const wordCount = content.trim().split(/\s+/).length;
  let totalMinutes = Math.floor(totalTimeMs / (1000 * 60));

  document.getElementById("revisions").innerHTML =
    '<span class="tooltip revisions-tooltip"><p>Edits</p><span class="tooltiptext">Edits - the total number of changes made to the document, <br>e.g., characters typed, deletions.<br>Pasting text counts as one edit.</span></span>' +
    ": " +
    edits.length;
  document.getElementById("wordCount").innerHTML = "Word Count: " + wordCount;
  document.getElementById("timeSpent").innerHTML =
    '<span class="tooltip revisions-tooltip"><p>Time spent</p><span class="tooltiptext">The total time spent actively typing on the document with no more than a 10 minute break.</span></span>' +
    ": " +
    Math.floor(totalMinutes / 60) +
    " hr " +
    (totalMinutes % 60) +
    " min";
  document.getElementById("deletes").innerHTML = "Deletes: " + deletes;
  // document.getElementById("writingSessions").innerHTML =
  //   "Writing Sessions: " + writingSessions;
}

function getWritingSessions(edits) {
  document.getElementById("writingSessionsCards").innerHTML = "";
  totalTime = 0;
  revisions = 0;
  sessions = [];
  startTime = edits[0].time;
  for (let index = 0; index < edits.length - 1; index++) {
    diff = edits[index + 1].time - edits[index].time;
    // console.log(new Date(edits[index + 1].time)  + ", " + new Date(edits[index].time) + " || " + diff);
    if (diff > 600000 || index == edits.length - 2) {
      // console.log(index);
      session = {
        startTime: new Date(startTime),
        endTime: new Date(edits[index].time),
        duration: new Date(edits[index].time) - startTime,
        revisions: revisions,
      };
      totalTime += new Date(edits[index].time) - startTime;
      sessions.push(session);
      startTime = edits[index + 1].time;
      revisions = 0;
    }
    revisions += 1;
  }
  // If there's only 1 session
  if (sessions.length == 0 && edits.length > 0) {
    session = {
      startTime: new Date(edits[0].time),
      endTime: new Date(edits[edits.length - 1].time),
      duration: new Date(edits[edits.length - 1].time) - startTime,
      revisions: edits.length,
    };
    totalTime += new Date(edits[edits.length - 1].time) - startTime;
    sessions.push(session);
  }
  // console.log("WRITING SESSIONS");
  // console.log(sessions);
  // console.log(totalTime);

  // DISPLAY THE SESSIONS
  const initialDisplayCount = 3;
  if (sessions.length <= initialDisplayCount) {
    document.getElementById("seeAllButton").style.display = "none";
  }

  document
    .getElementById("seeAllButton")
    .addEventListener("click", function () {
      // Display all elements when "See All" button is clicked
      document.getElementById("writingSessionsCards").innerHTML = "";
      displaySessions(0, sessions.length);
      document.getElementById("seeAllButton").style.display = "none";
      document.getElementById("hideButton").style.display = "block";
    });

  document.getElementById("hideButton").addEventListener("click", function () {
    // Display initial three elements when "Hide" button is clicked
    document.getElementById("writingSessionsCards").innerHTML = "";
    displaySessions(0, initialDisplayCount);
    document.getElementById("seeAllButton").style.display = "block";
    document.getElementById("hideButton").style.display = "none";
  });

  if (sessions.length > initialDisplayCount) {
    // Display the first three elements initially
    displaySessions(0, initialDisplayCount);
    document.getElementById("seeAllButton").style.display = "block";
  } else {
    // Display all elements if the array length is 3 or less
    displaySessions(0, sessions.length);
    document.getElementById("seeAllButton").style.display = "none";
  }

  document.getElementById("numWritingSessions").innerHTML =
    " (" + sessions.length + ")";
  // sessions.forEach((card) => {
  //   const startTimeFormatted = formatDate(card.startTime);
  //   const durationFormatted = formatDuration(card.duration);

  //   const cardDiv = document.createElement("div");
  //   cardDiv.className = "card";
  //   cardDiv.innerHTML = `
  //       <div class="container">
  //           <p>Start Time: ${startTimeFormatted}</p>
  //           <p>Duration: ${durationFormatted}</p>
  //       </div>
  //   `;
  //   document.getElementById("writingSessionsCards").appendChild(cardDiv);
  // });

  return totalTime;
}

function displaySessions(startIndex, endIndex) {
  for (let i = startIndex; i < endIndex; i++) {
    const card = sessions[i];
    const startTimeFormatted = formatDate(card.startTime);
    const durationFormatted = formatDuration(card.duration);

    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.innerHTML = `
        <div class="container">
            <p class='stat'><span class='bold'>Start Time:</span> ${startTimeFormatted}</p>
            <p class='stat'><span class='bold'>Duration:</span> ${durationFormatted}</p>
            <p class='stat'><span class='bold'>Edits:</span> ${card.revisions}</p>
        </div>
    `;
    document.getElementById("writingSessionsCards").appendChild(cardDiv);
  }
}

function generateWritingReport(edits) {
  // console.log(edits);
  // getUsers()

  // COPY PASTE SECTION
  getCopied(edits);

  // VIDEO REPLAY SECTION
  // videoReplay(edits)
  // console.log(data);
  // console.log(edits);

  //GRAPH SECTION
  createGraph(edits);
  // TIME GRAPH SECTION
  createTimeGraphs(edits, "all dates");

  // Time per day graph section
  createTimePerDayGraph(edits)

  // STATS SECTION
  getStats(edits);

  // WRITING SESSIONS SECTION
  getWritingSessions(edits);
}

document.addEventListener("DOMContentLoaded", function () {
  var urlParams = new URLSearchParams(window.location.search);
  // Listen for a message from the extension
  // Get the title from the document
  var title = document.getElementById("title");
  title.textContent = urlParams.get("title");
  // console.log(urlParams.get("title"));
  window.id = urlParams.get("id");
  window.tok = urlParams.get("token");
  window.baseurl = urlParams.get("baseurl");

  dropdown = document.getElementById("userDropdownReport");

  fetchRevisionData(id, tok, baseurl).then((data) => {
    // console.log(data);
    edits = generateEdits(data.changelog, []);
    // console.log(edits);
    checkBlank(edits);

    userDropdown(edits, "userDropdownReplay");

    userDropdown(edits, "userDropdownReport");

    // Start automatic replay
    getFirstEdit(id, tok, baseurl).then((data) => {
      // console.log(data);
      videoReplay(edits, data);
    });

    // console.log(edits);
    // getUsers()

    // GENERATE WRITING REPORT
    generateWritingReport(edits);

    dropdown.addEventListener("change", function () {
      const selectedValue = dropdown.value;
      document.getElementById("reportUser").innerHTML =
        dropdown.options[dropdown.selectedIndex].text; //dropdown.selectedIndex

      // Change title text
      const elements = document.querySelectorAll(".reportUser");
      elements.forEach((element) => {
        element.textContent = dropdown.options[dropdown.selectedIndex].text;
      });

      // console.log("Selected value:", selectedValue);
      filteredEdits = filterEditsByUser(edits, selectedValue);
      generateWritingReport(filteredEdits);
    });
  });
});