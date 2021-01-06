'use strict';


const translateDialog = (text) => {

  // document.body.append()
  window.open('popup.html')

}

///////////////////////////////
// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // If the received message has the expected format...
  console.log('received: ', request);

  if (request.type === 'EV_TRANSLATE_TEXT') {
    console.log('Begin translating ... ', request.text )
  }else if (request.method == 'getSelection'){
    sendResponse({data: window.getSelection().toString()});
  } else {
    // sendResponse({}); // snub them.

  }
})



let observer = new MutationObserver((mutations) => {
})

//observer.observe(document.body, {
    //childList: true
  //, subtree: true
  //, attributes: false
  //, characterData: false
//})


