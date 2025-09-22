// background service worker: listen for keyboard command and open popup (execute_action command opens popup automatically)
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-ideas-saver') {
        // In MV3, executing the action (popup) programmatically is not straightforward; Suggest using the default keyboard shortcut bound to the action.
        // You can open a new tab to a small UI as a fallback:
        chrome.windows.create({
            url: chrome.runtime.getURL('popup.html'),
            type: 'popup',
            width: 420,
            height: 700,
        })
    }
})
