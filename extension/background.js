// Create a context menu item
chrome.contextMenus.create({
    id: "eliv",
    title: "ELI5 This!",
    contexts: ["selection"]
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "eliv") {
        // Send a message to the content script
        chrome.tabs.sendMessage(tab.id, { type: "ELIV_THIS" });
    }
});
