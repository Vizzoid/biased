function processSentence(sentence) {
    return true; // todo
}

// use content.js's TextSearch and TextElement classes for info on how to use the sent data
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "sentenceconnection");

    port.onMessage.addListener(function(msg) {
        // msg.search is a list of string texts for the original search
        list_of_biases = [];
        for (const text of msg.search) {
            list_of_biases.push(processSentence(text));
        }
        var xmlHttpRequest = (window.XMLHttpRequest) ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xmlHttpRequest.open("GET","http://localhost:8000/api/ai",true);
        xmlHttpRequest.send(sentence);
        xmlHttpRequest.onreadystatechange = function()
        {
            if(xmlHttpRequest.readyState == XMLHttpRequest.DONE)
            {
                if (xhr.status === 200)
                {
                    // posted message is list of booleans
                    port.postMessage({search: xhr.responseText});
                }
            }
        }
    });
});  