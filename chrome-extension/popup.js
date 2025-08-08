document.addEventListener('DOMContentLoaded', function () {
    const analyzeButton = document.getElementById('analyze-button');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
  
    // Initially disable the analyze button
    analyzeButton.disabled = true;
    console.log("Analyze button is initially disabled");
  
    // Function to enable the analyze button
    function enableAnalyzeButton() {
      if (analyzeButton.disabled) {
        analyzeButton.disabled = false;
        console.log("Analyze button has been enabled");
      }
    }
  
    // Function to disable the analyze button
    function disableAnalyzeButton() {
      if (!analyzeButton.disabled) {
        analyzeButton.disabled = true;
        console.log("Analyze button has been disabled");
      }
    }
  
    // Ensure that the content is available before enabling the button
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "extractContent" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
            resultDiv.innerText = "Error: Unable to communicate with the content script.";
            return;
          }
  
          if (response && response.content) {
            console.log("Content extracted successfully:", response.content.substring(0, 50) + "..."); // Log first 50 chars
            enableAnalyzeButton();
          } else {
            console.error("Error: Unable to extract content from the page.");
            resultDiv.innerText = "Error: Unable to extract content from the page.";
          }
        });
      } else {
        console.error("Error: No active tab found.");
      }
    });
  
    // Add click event listener to the analyze button
    if (analyzeButton) {
      analyzeButton.addEventListener('click', () => {
        console.log("Analyze button clicked, starting analysis...");
        disableAnalyzeButton(); // Disable the button during processing
  
        // Clear previous results and show the loading indicator
        resultDiv.innerText = "";
        loadingDiv.style.display = "block";
  
        // Extract content again and analyze
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "extractContent" }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                resultDiv.innerText = "Error: Unable to communicate with the content script.";
                loadingDiv.style.display = "none";
                enableAnalyzeButton(); // Re-enable the button on error
                return;
              }
  
              if (response && response.content) {
                fetch("http://localhost:3000/api/analyze", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ content: response.content })
                })
                .then(res => {
                  if (!res.ok) {
                    throw new Error("Server error: " + res.statusText);
                  }
                  return res.json();
                })
                .then(data => {
                  loadingDiv.style.display = "none";  // Hide loading
                  if (data.rating) {
                    resultDiv.innerText = "Political Bias Rating: " + data.rating;
                  } else {
                    resultDiv.innerText = "Error: Unable to determine rating";
                  }
                  console.log("Re-enabling analyze button after analysis is complete");
                  enableAnalyzeButton(); // Re-enable the button after analysis
                })
                .catch(error => {
                  console.error("Error during analysis:", error);
                  loadingDiv.style.display = "none";
                  resultDiv.innerText = "Error: " + error.message;
                  enableAnalyzeButton(); // Re-enable the button in case of an error
                });
              } else {
                console.error("Error: Content not extracted from the page.");
                resultDiv.innerText = "Error: Unable to extract content from the page.";
                loadingDiv.style.display = "none";
                enableAnalyzeButton(); // Enable the button even after error
              }
            });
          } else {
            console.error("Error: No active tab found.");
          }
        });
      });
    }
  });
  