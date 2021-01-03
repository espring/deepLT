'use strict';
///////////////////////////////
// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // If the received message has the expected format...
  console.log('received: ', request);
})



let observer = new MutationObserver((mutations) => {
})

//observer.observe(document.body, {
    //childList: true
  //, subtree: true
  //, attributes: false
  //, characterData: false
//})


