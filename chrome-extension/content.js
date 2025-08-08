// content.js
function extractPageContent() {
    let paragraphs = document.getElementsByTagName('p');
    let pageText = "";
    for (let p of paragraphs) {
        pageText += p.innerText + "\n";
    }
    return pageText;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "extractContent") {
        let content = extractPageContent();
        sendResponse({ content: content });
    }
});
