document.addEventListener("DOMContentLoaded", () => {
  const statusMessage = document.getElementById("statusMessage");
  const contentDisplay = document.getElementById("contentDisplay");
  const analyzeButton = document.getElementById("analyzeButton");

  function setAnalyzeEnabled(isEnabled) {
    analyzeButton.disabled = !isEnabled;
  }

  function withActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        callback(tabs[0].id);
      } else {
        statusMessage.innerText = "No active tab found.";
      }
    });
  }

  function loadPageContent() {
    withActiveTab((tabId) => {
      chrome.tabs.sendMessage(tabId, { type: "extractContent" }, (response) => {
        if (chrome.runtime.lastError) {
          statusMessage.innerText = "Cannot communicate with page.";
          return;
        }
        if (response && response.content) {
          statusMessage.innerText = "Content loaded successfully.";
          setAnalyzeEnabled(true);
        } else {
          statusMessage.innerText = "Failed to load content.";
        }
      });
    });
  }

  function fetchAnalysis() {
    setAnalyzeEnabled(false);
    statusMessage.innerText = "Analyzing...";
    contentDisplay.innerText = "Please wait...";

    withActiveTab((tabId) => {
      chrome.tabs.sendMessage(tabId, { type: "extractContent" }, (response) => {
        if (chrome.runtime.lastError) {
          statusMessage.innerText = "Cannot communicate with page.";
          setAnalyzeEnabled(true);
          return;
        }
        if (!(response && response.content)) {
          statusMessage.innerText = "No content found.";
          setAnalyzeEnabled(true);
          return;
        }

        fetch("http://localhost:3000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: response.content })
        })
          .then((res) => {
            if (!res.ok) throw new Error("Server error: " + res.statusText);
            return res.json();
          })
          .then((data) => {
            statusMessage.innerText = "Analysis complete.";
            contentDisplay.innerText = data && data.rating
              ? `Political Bias Rating: ${data.rating}`
              : "No rating returned.";
            setAnalyzeEnabled(true);
          })
          .catch((err) => {
            statusMessage.innerText = "Analysis failed.";
            contentDisplay.innerText = "Error: " + err.message;
            setAnalyzeEnabled(true);
          });
      });
    });
  }

  loadPageContent();
  analyzeButton.addEventListener("click", fetchAnalysis);
});
  