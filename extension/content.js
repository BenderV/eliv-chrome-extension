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


function createBox() {
    // Create a div element and set its width and height
    const box = document.createElement('div');
    box.style.width = '300px';
    box.style.height = 'auto';
    
    // Set the box's id and background color
    box.id = 'explainer-box';
    box.style.backgroundColor = '#f5f5f5'
    box.style.borderRadius = '0.4rem'
    box.style.padding = '0.8rem'
    box.style.display = "none";
    box.style.zIndex = '99999999';
    box.style.backgroundColor = "rgb(255, 255, 255)";
    box.style.border = "1px solid rgb(233, 236, 247)";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "rgb(1 7 44 / 6%) 0px 36px 84px, rgb(1 7 44 / 4%) 0px 7.00133px 25.3235px, rgb(1 7 44 / 3%) 0px 0.581276px 10.5181px, rgb(1 7 44 / 2%) 0px -0.880959px 3.80419px;";
    box.style.boxSizing = "border-box";
    box.style.fontFamily = "monospace";


    // Set the box's transparency
    box.style.opacity = 1;
  
    // Add the box to the document
    document.body.appendChild(box);
    return box
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

const resultsBox = createBox()

let lastEvent = null;

document.addEventListener('mouseup', function(event) {
    lastEvent = event.timeStamp;
    var selectedText = window.getSelection().toString();

    if (selectedText) {
        // Call the OpenAPI endpoint with the highlighted text and API key
        fetchRequest({'input': selectedText}).then((result) => {
            if (lastEvent !== event.timeStamp) {
                return
            }
            if (result === 'NULL') {
                resultsBox.style.display = "none";
                return
            }
            const resultElement = document.createElement("div");
            resultElement.style.color = 'black';
            resultElement.innerHTML = result;

            // Fill the box with the result
            resultsBox.innerHTML = ""; // Clear the results from the previous search
            resultsBox.appendChild(resultElement);

            // Position the results box near the mouse cursor
            resultsBox.style.position = 'absolute';
            const position = getTopRightPosition();
            resultsBox.style.top = position.y + "px";
            resultsBox.style.left = position.x + "px";
            resultsBox.style.display = "block";
        });
    }
    else {
        resultsBox.style.display = "none";
    }
});


