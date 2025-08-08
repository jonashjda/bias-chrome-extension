// content.js
function extractPageContent() {
  const main = document.querySelector("main, [role='main']");
  if (main && main.innerText && main.innerText.trim().length > 0) {
    return main.innerText.trim();
  }

  const paragraphs = Array.from(document.getElementsByTagName("p"));
  const text = paragraphs.map(p => p.innerText).join("\n");
  if (text && text.trim().length > 0) return text.trim();

  return document.body ? (document.body.innerText || "") : "";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "extractContent") {
    try {
      const content = extractPageContent();
      sendResponse({ content });
    } catch (err) {
      sendResponse({ error: err && err.message ? err.message : "Unknown content extraction error" });
    }
  }
});
