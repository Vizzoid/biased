// use content.js's TextSearch and TextElement classes for info on how to use the sent data

/* here's the data diagram:

For receiving JSON:
{
  "results": [
    true,
    false,
    false,
    true,
    true,
    false
  ]
}

Assuming what is sent is equivalent to (using POST):
{
  "sentences": [
    "biasedsentence1",
    "unbiasedsentence2",
    "unbiasedsentence3",
    "biasedsentence4",
    "biasedsentence5",
    "unbiasedsentence6"
  ]
}

*/
// POST method implementation:
// async function postSentences(url = "", search) {
//   // Default options are marked with *
//   return fetch(url, {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     // mode: "cors", // no-cors, *cors, same-origin
//     // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     // credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     // redirect: "follow", // manual, *follow, error
//     // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify({ sentences: search}), // body data type must match "Content-Type" header
//   });
// }

async function postSentences(port, url = "", search) {
  return fetch(url, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    body: JSON.stringify({ sentences: search})
  });

  // const result = await response.json();
  // Process the result as needed
  // posted message is list of booleans
  // return port.postMessage({search: result.results});
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "sentenceconnection");

  port.onMessage.addListener(function(msg) {
    try {
      // msg.search is a list of string texts for the original search
      postSentences(port, 'https://refactored-system-9xr55j6qwqph9r46-5000.app.github.dev/api', msg.search)
      //   .catch((error) => console.error(error));
      // postSentences('https://refactored-system-9xr55j6qwqph9r46-8000.app.github.dev/', msg.search)
        .then((response) => response.text())
        .then(t => console.log(t))
        // .then((data) => port.postMessage({search: data.results}))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error:", error);
    }
  });
});  