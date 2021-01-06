'use strict';

console.log('\'Allo \'Allo! Popup');

  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, 
  function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {method: 'getSelection'}, 
    function(response){
      var text = document.getElementById('text'); 
      text.innerHTML = response.data;
    });
  });
