// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: "extractContent" }, (response) => {
        if (response && response.content) {
            fetch("http://localhost:3000/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: response.content })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Political Bias Rating: " + data.rating);
                alert("Political Bias Rating: " + data.rating);
            })
            .catch(error => console.error("Error:", error));
        }
    });
});
