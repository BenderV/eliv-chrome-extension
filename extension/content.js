const divURL = chrome.runtime.getURL('box.html');

fetch(divURL).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    // not using innerHTML as it would break js event listeners of the page
});

function getTopRightPosition() {
    // Get the current selection from the page
    const selection = document.getSelection();
  
    // Check if the selection is a range (i.e., if it is highlighted text)
    if (selection.rangeCount > 0) {
      // Get the range for the selection
      const range = selection.getRangeAt(0);
  
      // Get the position and size of the range
      const rect = range.getBoundingClientRect();
  
      // Calculate the position at the bottom right of the range
      const x = rect.left + rect.width;
      const y = rect.top + window.pageYOffset + (window.scrollTop ?? 0); // rect.height
  
      // Return the position as an x and y coordinate pair
      return { x, y };
    }
}
  
// Fetch request
function fetchRequest(inputs) {
    return fetch('https://explainer.universaldata.workers.dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(inputs)
    }) 
    .then(response => response.json())
    .then(response => {
      // Handle the response data here
      return response.choices[0].text.trim()
    })
}

function getSurroundingText(selection) {
    // Get the nodes that contain the start and end of the selection
    var startNode = selection.anchorNode;
    var endNode = selection.focusNode;
  
    // Get the text content of these nodes
    var startText = startNode.nodeValue;
    var endText = endNode.nodeValue;
  
    // Get the index of the start and end of the selection within the text
    var startIndex = startText.indexOf(selection);
    var endIndex = endText.indexOf(selection) + selection.toString().length;
  
    // Get the 100 characters before and after the selected text
    var before = startText.substr(Math.max(0, startIndex - 100), startIndex - Math.max(0, startIndex - 100));
    var after = endText.substr(endIndex, Math.min(endIndex + 100, endText.length));
  
    // Concatenate the text to get the surrounding text
    var surroundingText = before + '<SELECTED>' + selection + '</SELECTED>'+ after;
  
    return surroundingText;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ELIV_THIS") {
        const displayBox = document.getElementById("eliv")
        const displayBoxDescription = document.getElementById("eliv-description")

        const selectedContext = getSurroundingText(window.getSelection())
        console.debug("selectedContext", selectedContext)

        if (selectedContext.length === 0) {
            alert("Please select some text to explain.");
            return;
        }

        showLoadingCursor();
        // Call the OpenAPI endpoint with the highlighted text and API key
        fetchRequest({'input': selectedContext}).then((result) => {
            restoreCursor();

            if (result === 'NULL') {
                displayBox.style.display = "none";
                return
            }
            const resultElement = document.createElement("div");
            resultElement.style.color = 'black';
            resultElement.innerHTML = result;

            // Fill the box with the result
            displayBoxDescription.innerHTML = ""; // Clear the results from the previous search
            displayBoxDescription.appendChild(resultElement);

            // Position the results box near the mouse cursor
            const position = getTopRightPosition();
            displayBox.style.top = position.y + "px";
            displayBox.style.left = position.x + "px";
            displayBox.style.display = "block";
        });
    }
});

// Hide the results box when the user clicks anywhere on the page (except the results box)
document.addEventListener("click", (event) => {
    if (event.target.closest("#eliv") === null) {
        document.getElementById("eliv").style.display = "none";
    }
})

const showLoadingCursor = () => {
    const style = document.createElement("style");
    style.id = "corsor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
};
  
const restoreCursor = () => {
    document.getElementById("corsor_wait").remove();
};
