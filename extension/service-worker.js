function processSentence(sentence) {
    return true; // todo
}

// use content.js's TextSearch and TextElement classes for info on how to use the sent data
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "sentenceconnection");
    port.onMessage.addListener(function(msg) {
        for (const text of msg.search.getTexts()) {
            text.setBias(processSentence(text.getString()));
        }
        port.postMessage({search: msg.search});
    });
});  