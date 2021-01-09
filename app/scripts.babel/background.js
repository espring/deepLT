'use strict';

const notify = (tabId, ev, payload, cb ) => {
  if (!tabId) {
    console.error( 'Cannot notify to the invalid tab id ' )
    return
  }

  payload = payload || {}

  chrome.tabs.sendMessage(tabId, { type: ev, ...payload }, undefined, (res) => {
    cb && cb(res)
  });
}

let tabDeepL
const checkTab = (tabId) => {

  if (!tabId) {
    return Promise.reject('Not found tab id ')
  }

  return new Promise( (resolve, reject) => {

    chrome.tabs.get( tabId, tab => {
      return tab && tab.id ? resolve() : reject('Not existed tab.')
    } )

  } )
}

const translatorOnDeepLSite = (text) => {
  const url = `https://www.deepl.com/translator#en/zh/${encodeURIComponent(text)}`

  return checkTab(tabDeepL?.id)
    .then( () => {
      // if tabDeepL existed, update the link.
      chrome.tabs.update(tabDeepL.id, { url, active: true } )
    }, notExist => {
      chrome.tabs.create({ url: url, index: tabDeepL?.index,  openerTabId: tabDeepL?.id }, tab => {
        tabDeepL = tab
      })
    } )

}


chrome.contextMenus.create({
  title: 'Translate with DeepL.(Command+Shift+6)',
  type: 'normal',
  contexts: ['selection'],
  onclick: (info) => {
    const originalText = info.selectionText
    
    return translatorOnDeepLSite(originalText)

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs) {
        const first = tabs[0].id
        notify(first, 'EV_TRANSLATE_TEXT', { text: originalText }, () => {})
      } else {
        console.log('No active tab found')
      }
    })
    return // notify()
  }
})


// NOTE: default popup.html must be removed from manifest.json
chrome.browserAction.onClicked.addListener(function(tab) {
})

chrome.commands.getAll( commands => {

  console.log('get all commands : ', commands)
} )
// 
chrome.commands.onCommand.addListener(function(command, tab) {
  console.log('command: ', command)
  if ( command === 'toggle-feature-deeplt' ) {
    chrome.tabs.sendMessage(tab.id, {method: 'getSelection'}, 
    function(response){
      const originalText = response.data
      if (originalText) {
        return translatorOnDeepLSite(originalText)
      } else {
        console.log('DeepLT requires selected text.')
      }
    });
  }

});

