'use strict';

let deepLTab, preTab


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

const goBack = () => {

  return checkTab(preTab?.id)
    .then( () => {
      // go back to the preTab 
      chrome.tabs.update(preTab.id, { active: true } )
    })
}

const translatorOnDeepLSite = (text) => {
  const url = `https://www.deepl.com/translator#en/zh/${encodeURIComponent(text)}`

  return checkTab(deepLTab?.id)
    .then( () => {
      // if deepLTab existed, update the link.
      chrome.tabs.update(deepLTab.id, { url, active: true } )
    }, notExist => {
      chrome.tabs.create({ url }, tab => {
        deepLTab = tab
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

  }
})


// NOTE: default popup.html must be removed from manifest.json
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if ( tabs?.[0]?.id === deepLTab?.id ) { 
      return goBack()
    } else {
      preTab = tabs?.[0]
      return translatorOnDeepLSite('')
    }
  })
})

chrome.commands.getAll( commands => {

  console.log('get all commands : ', commands)
} )
// 
chrome.commands.onCommand.addListener(function(command, tab) {
  console.log('command: ', command)
  if ( command === 'toggle-feature-deeplt' ) {
    chrome.tabs.sendMessage(tab.id, {method: 'getSelection'}, (response) => {
      const originalText = response.data
      if (originalText) {

        preTab = tab
        // clear 
        setTimeout( () => {
          notify(tab.id, 'EV_DESELECT')
        }, 1000 )

        return translatorOnDeepLSite(originalText)
      } else {
        console.log('DeepLT requires selected text.')
      }
    });
  } else if ( command === 'toggle-go-back' ) {

    return checkTab(preTab?.id)
      .then( () => {
        chrome.tabs.active(preTab.id) 
      } )
  }

});

